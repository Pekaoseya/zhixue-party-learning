export const checkPermission = (user: any, requiredPermission: string) => {
  if (!user) return false;
  // 根据用户角色和权限进行检查
  return user.role === 'admin' || (user.permissions && user.permissions.includes(requiredPermission));
};

export const checkRole = (user: any, requiredRole: string) => {
  if (!user) return false;
  return user.role === requiredRole;
};