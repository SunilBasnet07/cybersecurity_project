'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '@/constants/regex';
import Link from 'next/link';
import { LOGIN_ROUTE } from '@/routes/route';
import { forgotPassword } from '@/api/auth';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { clsx } from 'clsx';


const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

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
       await forgotPassword(data);
     toast.success("Rest password link has been sent successfull to your email address.",{
      autoClose:1500,
     })

      setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data)
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
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isEmailSent
              ? "Check your email for password reset instructions"
              : "Enter your email address and we'll send you a link to reset your password"
            }
          </p>
        </motion.div>

        {!isEmailSent ? (
          <motion.form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" variants={itemVariants}>
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Please enter a valid email address."
                    }
                  })}
                  className={clsx("appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out",
                    errors.email ?"border-red-500" : " focus:ring-indigo-500 focus:border-indigo-500"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[12px] flex px-1 py-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center gap-3 disabled:cursor-not-allowed disabled:bg-slate-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (<Spinner/>) :  "Send Reset Link"}
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
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Check Your Email
                </h3>
                <p className="text-sm text-green-600">
                  We have sent password reset instructions to your email address.
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setIsEmailSent(false)}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Did not receive the email? Try again
            </motion.button>
          </motion.div>
        )}

        {/* Additional Help Text */}
        <motion.div
          className="text-center mt-6"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Contact Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword; 