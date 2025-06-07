'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, AlertCircle, Check, X, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PASSWORD_REGEX } from '@/constants/regex';
import Link from 'next/link';
import { LOGIN_ROUTE } from '@/routes/route';
import toast from 'react-hot-toast';
import { resetPassword } from '@/api/auth';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import { clsx } from 'clsx';

const ResetPassword = ({ userId, otp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password", "");
  const router = useRouter();
  // Calculate password strength
  useEffect(() => {
    if (password) {
      setPasswordStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      });
    } else {
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [password]);

  const getStrengthLevel = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const strengthCount = [length, uppercase, lowercase, number, special].filter(Boolean).length;

    if (strengthCount <= 2) return { level: 'weak', color: 'red' };
    if (strengthCount <= 4) return { level: 'medium', color: 'yellow' };
    return { level: 'strong', color: 'green' };
  };

  const strengthLevel = getStrengthLevel();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(userId, otp, data);

      setIsReset(true);
      toast.success("Password reset successfully!", {
        autoClose: 1500,
      });
      router.push(LOGIN_ROUTE);
    } catch (error) {
      toast.error(error.response?.data, {
        autoclose: 1500
      })
    }finally{
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back to Login Link */}
        <motion.div
          className="flex items-center text-indigo-600 hover:text-indigo-500 cursor-pointer"
          variants={itemVariants}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={LOGIN_ROUTE} className="flex items-center text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isReset
              ? "Your password has been reset successfully"
              : "Enter your new password below"
            }
          </p>
        </motion.div>

        {!isReset ? (
          <motion.form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" variants={itemVariants}>
            {/* New Password */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters."
                    },
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: "Password must contain uppercase, lowercase, special character and number."
                    },
               
                  })}
                  className={clsx("appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  transition duration-150 ease-in-out",
                    errors.password ?"border-red-500" : " focus:ring-indigo-500 focus:border-indigo-500"
                  )}
                  placeholder="Enter new password"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors" />
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[12px] flex px-1 py-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-24 rounded-full bg-gray-200`}>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${strengthLevel.color === 'red' ? 'bg-red-500 w-1/3' :
                              strengthLevel.color === 'yellow' ? 'bg-yellow-500 w-2/3' :
                                'bg-green-500 w-full'
                            }`}
                        />
                      </div>
                      <span className={`text-sm font-medium ${strengthLevel.color === 'red' ? 'text-red-500' :
                          strengthLevel.color === 'yellow' ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                        {strengthLevel.level.charAt(0).toUpperCase() + strengthLevel.level.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      {passwordStrength.length ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={passwordStrength.length ? 'text-green-500' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {passwordStrength.uppercase ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={passwordStrength.uppercase ? 'text-green-500' : 'text-gray-500'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {passwordStrength.lowercase ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={passwordStrength.lowercase ? 'text-green-500' : 'text-gray-500'}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {passwordStrength.number ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={passwordStrength.number ? 'text-green-500' : 'text-gray-500'}>
                        One number
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {passwordStrength.special ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={passwordStrength.special ? 'text-green-500' : 'text-gray-500'}>
                        One special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password.",
                    validate: (value) => value === password || "Passwords do not match."
                  })}
                  className={clsx("appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  transition duration-150 ease-in-out",
                    errors.confirmPassword ?"border-red-500" : " focus:ring-indigo-500 focus:border-indigo-500"
                  )}
                  placeholder="Confirm new password"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors" />
                  )}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[12px] flex px-1 py-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center disabled:cursor-not-allowed gap-3 disabled:bg-slate-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
               {loading ? (<Spinner/>): "Reset Password"} 
              </motion.button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="mt-8 space-y-6 text-center"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Password Reset Successful
                </h3>
                <p className="text-sm text-green-600">
                  Your password has been reset successfully. You can now login with your new password.
                </p>
              </div>
            </div>
            <Link href={LOGIN_ROUTE}>
              <motion.button
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Login
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword; 