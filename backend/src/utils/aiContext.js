import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ignoreNames = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.venv']);

const toPosix = (value) => value.split(path.sep).join('/');

const resolveProjectRoot = () => {
  const candidates = [
    process.env.PROJECT_ROOT,
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd()),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }
  }

  return process.cwd();
};

const safeReadJson = (filePath) => {
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
};

const listEntries = (directory) => {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !ignoreNames.has(entry.name) && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => entry.isDirectory() ? `${entry.name}/` : entry.name);
};

export const collectProjectContext = () => {
  const root = resolveProjectRoot();
  const rootName = path.basename(root);
  const structure = listEntries(root).slice(0, 20);

  const backendPackage = safeReadJson(path.join(root, 'backend', 'package.json'));
  const frontendPackage = safeReadJson(path.join(root, 'frontend', 'package.json'));

  const backendRoutes = listEntries(path.join(root, 'backend', 'src', 'routes'));
  const frontendPages = listEntries(path.join(root, 'frontend', 'src', 'pages'));
  const backendModels = listEntries(path.join(root, 'backend', 'src', 'models'));

  const summaryLines = [
    `Project root: ${rootName}`,
    `Top-level structure: ${structure.join(', ') || 'No entries found'}`,
    `Backend: ${backendPackage?.name || 'unknown'}${backendPackage?.scripts?.dev ? ' (dev server configured)' : ''}`,
    `Frontend: ${frontendPackage?.name || 'unknown'}${frontendPackage?.scripts?.dev ? ' (Vite app)' : ''}`,
    `Backend routes: ${backendRoutes.join(', ') || 'none'}`,
    `Frontend pages: ${frontendPages.join(', ') || 'none'}`,
    `Data models: ${backendModels.join(', ') || 'none'}`,
    `Container config: ${fs.existsSync(path.join(root, 'docker-compose.yml')) ? 'present' : 'not found'}`
  ];

  return {
    root,
    rootName,
    structure,
    summaryText: summaryLines.join('\n'),
    backendPackageName: backendPackage?.name || null,
    frontendPackageName: frontendPackage?.name || null,
    backendRoutes,
    frontendPages,
    backendModels
  };
};

export const buildInventoryContext = (products = [], transactions = []) => {
  const inventoryData = products.map((product) => ({
    name: product.name,
    sku: product.sku,
    quantity: product.quantity,
    minStock: product.minStock,
    price: product.price,
    category: product.category,
    value: Number(product.quantity || 0) * Number(product.price || 0)
  }));

  const lowStockItems = inventoryData.filter((product) => product.quantity <= product.minStock);
  const overStockedItems = inventoryData.filter((product) => product.quantity > product.minStock * 2);
  const outOfStockItems = inventoryData.filter((product) => product.quantity === 0);
  const totalValue = inventoryData.reduce((sum, product) => sum + product.value, 0);

  const recentTransactions = transactions
    .slice(0, 8)
    .map((transaction) => ({
      type: transaction.type,
      quantity: transaction.quantity,
      reason: transaction.reason || 'No reason provided',
      createdAt: transaction.createdAt
    }));

  const summaryText = [
    `Inventory has ${inventoryData.length} products with a total value of ₹${totalValue.toFixed(2)}.`,
    `Low stock items: ${lowStockItems.length}. Out of stock: ${outOfStockItems.length}. Overstocked: ${overStockedItems.length}.`,
    `Recent transactions: ${recentTransactions.length > 0 ? recentTransactions.map((item) => `${item.type} ${item.quantity}`).join(', ') : 'none'}`
  ].join(' ');

  return {
    inventoryData,
    lowStockItems,
    overStockedItems,
    outOfStockItems,
    totalValue,
    totalProducts: inventoryData.length,
    recentTransactions,
    summaryText
  };
};

export const buildPromptContext = ({ question, inventoryContext, projectContext }) => {
  return `You are Inventra AI, a smart assistant that monitors both the inventory database and the project itself.

User question: ${question}

Database snapshot:
- ${inventoryContext.summaryText}

Project snapshot:
- ${projectContext.summaryText}

Rules:
- Answer using the database snapshot for inventory and sales questions.
- For questions about available products or inventory, explicitly list the product names and current quantities from the database.
- Answer using the project snapshot for app, architecture, frontend, backend, or feature questions.
- Keep the answer concise, practical, and action-oriented.
- If you are uncertain, state that you are basing the answer on the latest available snapshot.`;
};

export const buildFallbackResponse = ({ question, inventoryContext, projectContext }) => {
  const normalizedQuestion = question.toLowerCase();

  const formatProductList = (products) => {
    if (!products.length) return 'No matching items currently.';
    return products.slice(0, 5).map((product) => `${product.name} (${product.quantity} units, min ${product.minStock})`).join('; ');
  };

  const formatInventoryNames = (products) => {
    if (!products.length) return 'No products are currently stored in the inventory.';
    return products.slice(0, 10).map((product) => `${product.name} (${product.quantity} units)`).join(', ');
  };

  if (normalizedQuestion.includes('project') || normalizedQuestion.includes('architecture') || normalizedQuestion.includes('frontend') || normalizedQuestion.includes('backend') || normalizedQuestion.includes('route') || normalizedQuestion.includes('feature') || normalizedQuestion.includes('docker')) {
    const routeList = projectContext.backendRoutes.length ? projectContext.backendRoutes.join(', ') : 'none';
    const pageList = projectContext.frontendPages.length ? projectContext.frontendPages.join(', ') : 'none';
    return `The current project snapshot shows ${projectContext.rootName} with backend routes ${routeList} and frontend pages ${pageList}. I’m basing this on the latest files on disk, not a static template.`;
  }

  if (normalizedQuestion.includes('stock') || normalizedQuestion.includes('inventory') || normalizedQuestion.includes('product') || normalizedQuestion.includes('low') || normalizedQuestion.includes('reorder') || normalizedQuestion.includes('out of stock') || normalizedQuestion.includes('transaction')) {
    const lowStockSummary = formatProductList(inventoryContext.lowStockItems);
    const outOfStockSummary = formatProductList(inventoryContext.outOfStockItems);
    const availableProducts = formatInventoryNames(inventoryContext.inventoryData);

    if (normalizedQuestion.includes('available') || normalizedQuestion.includes('list') || normalizedQuestion.includes('show')) {
      return `Available products in the current inventory: ${availableProducts}`;
    }

    return `The live inventory snapshot currently shows ${inventoryContext.totalProducts} products worth ₹${inventoryContext.totalValue.toFixed(2)}. Product names and quantities: ${availableProducts}. Low stock items: ${lowStockSummary}. Out of stock items: ${outOfStockSummary}. Recent transactions: ${inventoryContext.recentTransactions.length ? inventoryContext.recentTransactions.map((item) => `${item.type} ${item.quantity}`).join(', ') : 'none'}.`;
  }

  if (normalizedQuestion.includes('database') || normalizedQuestion.includes('mongo') || normalizedQuestion.includes('collection') || normalizedQuestion.includes('user')) {
    return `The live database snapshot currently includes ${inventoryContext.totalProducts} tracked products and ${inventoryContext.recentTransactions.length} recent transaction entries. I’m reading from the database records for this response.`;
  }

  return `I’m using the latest inventory and project data to answer. Right now I can see ${inventoryContext.totalProducts} products in the database and the current app structure from the workspace files.`;
};

export const toProjectSummaryForDisplay = (projectContext) => {
  return toPosix(projectContext.summaryText);
};
