// API 配置文件

// API 基础路径（相对路径，依赖 Next.js 代理）
export const API_URL = '/api';

// 所有 API 接口配置
export const ALL_PORT = {
  // 登录相关
  userLogin: {
    url: `${API_URL}/Page/userLogin`,
    data: {}
  },
  LoginShort: {
    url: `${API_URL}/Page/LoginShort`,
    data: {}
  },
  LoginOut: {
    url: `${API_URL}/Page/LoginOut`,
    data: {}
  },
  KickOut: {
    url: `${API_URL}/Page/KickOut`,
    data: {}
  },
  // 验证码相关
  GetLoginVC: {
    url: `${API_URL}/common/GetLoginVC`,
    data: {}
  },
  // 短信验证码
  SendMsg: {
    url: `${API_URL}/sms/sendVerificationCode`,
    data: {}
  },
  // 其他接口...
};
