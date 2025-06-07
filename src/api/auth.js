'use client'
import baseApiUrl from "@/config/apiUrl";

import { userToken } from "./token";
import axios from "axios";
// import { userToken } from "./token";





const signIn = async (data) => {


    const response = await axios.post(`${baseApiUrl}/api/auth/login`, data);
    return response;
}
const signUp = async (data) => {

    const response = await axios.post(`${baseApiUrl}/api/auth/register`, data);
    return response.data;
}
const getCaptchaNumber = async () => {
    const response = await axios.get(`${baseApiUrl}/api/captcha/number`);
    return response.data;
}
const getCaptchaByString = async () => {
    const response = await axios.get(`${baseApiUrl}/api/captcha/string`);
    return response.data;
}
const verifyOTP = async (otp) => {
    const userToken = localStorage.getItem('authToken');
    if (!userToken) {
        throw new Error('Authentication token not found');
    }

console.log(userToken);
    const response = await axios.put(`${baseApiUrl}/api/auth/verify-otp`, { otp }, {

        headers: {
            Authorization: `Bearer ${userToken}`
        },
    });

    return response.data;
}
const resendOTPEmail = async () => {
    const userToken = localStorage.getItem('authToken');
    if (!userToken) {
        throw new Error('Authentication token not found');
    }
    
    const response = await axios.put(`${baseApiUrl}/api/auth/resend-email/update`, {}, {
        headers: {
            Authorization: `Bearer ${userToken}`
        },
    });

    return response.data;
}
const forgotPassword = async (data) => {
    const response = await axios.post(`${baseApiUrl}/api/auth/forgot-password`, data);
    return response.data;
}
const resetPassword = async (userId, token, data) => {

    const response = await axios.put(`${baseApiUrl}/api/auth/reset-password/${userId}?otp=${token}`, data);
    return response.data;
}

export { signIn, signUp, getCaptchaNumber, getCaptchaByString, verifyOTP, forgotPassword, resetPassword, resendOTPEmail }