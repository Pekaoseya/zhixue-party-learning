import { useRouter } from 'next/navigation';

const api = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    // 登录失效，清除本地状态并跳转到登录页面
    localStorage.removeItem('admin_user');
    // 跳转到登录页面
    window.location.href = '/login';
    throw new Error('登录失效，请重新登录');
  }

  return response;
};

export default api;