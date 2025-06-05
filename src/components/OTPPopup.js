'use client';
import { resendOTPEmail, verifyOTP } from '@/api/auth';
import { LOGIN_ROUTE } from '@/routes/route';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const OTPPopup = ({ isOpen, onClose}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading,setLoading]=useState(false);
  const { handleSubmit } = useForm();
  const router = useRouter();
  const {email}=useSelector((state)=>state.auth)

  // Add effect to reset timer when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimer(60);
      setIsResendDisabled(true);
      setOtp(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  useEffect(() => {
    let countdown;
    if (isResendDisabled && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer, isResendDisabled]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input if a digit is entered
      if (value.length === 1 && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      
      const jsonOTP = { otp: otp.join('') };

      const response = await verifyOTP(jsonOTP);
      toast.success("Email verified Successfyll. now you can login.", {
        autoClose: 2000,
      })
      router.push(LOGIN_ROUTE)
    } catch (error) {
      toast.error(error.response?.data, {
        autoClose: 2000,
      })
    }finally{
      setLoading(false);
    }
  };

  const handleResentClick = async () => {
    try {
      const response = await resendOTPEmail();
      toast.success("OTP has been resent to your email", {
        autoClose: 2000,
      });
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Failed to resend OTP";
      toast.error(errorMessage, {
        autoClose: 2000,
      });
      // If token is not found, close the popup and redirect to login
      if (error.message === 'Authentication token not found') {
        onClose();
        router.push(LOGIN_ROUTE);
      }
    }
  };

  if (!isOpen) return null;


  return (
    <form onSubmit={handleSubmit(submitForm)} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-8 w-[400px] shadow-2xl transform transition-all duration-300 ease-out animate-fadeIn">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h2>
          <p className="text-gray-600 text-sm">We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {isResendDisabled ? (
              <span>
                Resend code in <span className="font-semibold text-blue-600">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                onClick={handleResentClick}
              >
                Resend Code
              </button>
            )}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full disabled:cursor-not-allowed disabled:bg-slate-100 flex gap-3 items-center justify-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? <Spinner/> : "Verify"}
        </button>
      </div>
    </form>
  );
};

export default OTPPopup;
