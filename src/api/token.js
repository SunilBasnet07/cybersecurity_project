'use client'
export const userToken = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
// export const token = localStorage.getItem("authToken");