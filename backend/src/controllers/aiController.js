import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { buildInventoryContext, buildPromptContext, buildFallbackResponse, collectProjectContext } from '../utils/aiContext.js';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const getInventoryInsights = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Please provide a question' });
    }

    const [products, transactions] = await Promise.all([
      Product.find({ createdBy: req.userId }),
      Transaction.find({ createdBy: req.userId }).sort({ createdAt: -1 }).limit(20)
    ]);

    const inventoryContext = buildInventoryContext(products, transactions);
    const projectContext = collectProjectContext();
    const promptContext = buildPromptContext({ question, inventoryContext, projectContext });

    let response = buildFallbackResponse({ question, inventoryContext, projectContext });

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage([
          {
            role: 'user',
            parts: [{ text: promptContext }]
          }
        ]);
        const aiResponse = result.response.text();
        if (aiResponse && aiResponse.trim()) {
          response = aiResponse;
        }
      } catch (geminiError) {
        console.warn('Gemini fallback triggered:', geminiError.message);
      }
    }

    res.status(200).json({
      success: true,
      response,
      inventorySummary: {
        totalProducts: inventoryContext.totalProducts,
        totalValue: inventoryContext.totalValue.toFixed(2),
        lowStockCount: inventoryContext.lowStockItems.length,
        overStockCount: inventoryContext.overStockedItems.length,
        outOfStockCount: inventoryContext.outOfStockItems.length
      },
      projectSummary: {
        rootName: projectContext.rootName,
        backendRoutes: projectContext.backendRoutes,
        frontendPages: projectContext.frontendPages
      }
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({
      message: error.message || 'Failed to get inventory insights',
      response: 'Sorry, I encountered an error while analyzing your inventory and project. Please try again.'
    });
  }
};

export const getHealthScore = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.userId });

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        healthScore: 50,
        status: 'No Data'
      });
    }

    // Calculate health score (0-100)
    let score = 100;
    
    // Factor 1: Low stock items (reduce by 5 per low stock item, max -30)
    const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;
    score -= Math.min(lowStockCount * 5, 30);

    // Factor 2: Overstocked items (reduce by 3 per overstocked item, max -20)
    const overStockCount = products.filter(p => p.quantity > p.minStock * 2).length;
    score -= Math.min(overStockCount * 3, 20);

    // Factor 3: Stock availability (reduce based on percentage of out-of-stock items)
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    const outOfStockPercentage = (outOfStockCount / products.length) * 100;
    score -= (outOfStockPercentage / 2);

    // Factor 4: Average stock level vs minimum (bonus if well stocked)
    const avgStockLevel = products.reduce((sum, p) => sum + (p.quantity / p.minStock), 0) / products.length;
    if (avgStockLevel > 1.5) {
      score = Math.min(score + 10, 100);
    }

    score = Math.max(Math.round(score), 0);

    let status = 'Good';
    if (score < 40) status = 'Critical';
    else if (score < 60) status = 'Warning';
    else if (score < 80) status = 'Fair';

    res.status(200).json({
      success: true,
      healthScore: score,
      status,
      details: {
        lowStockItems: lowStockCount,
        overStockedItems: overStockCount,
        outOfStockItems: outOfStockCount,
        totalProducts: products.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
