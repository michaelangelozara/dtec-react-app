export const getAccessToken = () => localStorage.getItem('accessToken');

export const setAccessToken = (token) => localStorage.setItem('accessToken', token);

export const removeAccessToken = () => localStorage.removeItem('accessToken');

export const setLoginStatus = (status) => localStorage.setItem("isLoggedIn", status);

export const getLoginStatus = () => localStorage.getItem("isLoggedIn");

export const handleLogout = () => {
  removeAccessToken();
  setLoginStatus(false);
  window.location.href = "/login-user"
};