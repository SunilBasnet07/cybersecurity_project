'use client'
// export const userToken = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("authToken", token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("authToken");
  }
};