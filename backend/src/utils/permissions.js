export const DEFAULT_PERMISSIONS = {
  view: true,
  add: false,
  edit: false,
  delete: false
};

export const buildPermissionState = (permissions = {}) => ({
  view: Boolean(permissions?.view),
  add: Boolean(permissions?.add),
  edit: Boolean(permissions?.edit),
  delete: Boolean(permissions?.delete)
});

export const hasPermission = (user, action) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const permissions = buildPermissionState(user.permissions);
  return Boolean(permissions[action]);
};
