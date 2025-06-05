'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { login } from '@/redux/auth/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { getCaptchaNumber } from '@/api/auth';
import Link from 'next/link';
import { DASHBOARD_ROUTE, FORGOTPASSWORD_ROUTE } from '@/routes/route';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  // const [refreshCaptchaData, setRefreshCaptchaData] = useState(question);
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const dispatch = useDispatch()
  const router = useRouter();
  const { user, loading,  } = useSelector((state) => state.auth);

  function refreshCaptcha() {
    getCaptchaNumber().then((data) => {
      setQuestion(data.question);
      setCorrectAnswer(data.answer);
    }).catch(error => {
      console.log(error.message);
    })

  }

  useEffect(() => {

    refreshCaptcha();


  }, []);

  function submitForm(data) {
    
    const response = dispatch(login({ ...data, correctAnswer })).then((userData) => {
console.log(userData);
      if (userData.type.includes("auth/login/fulfilled")) {

        toast.success("Login Successfull", {
          autoClose: 1500,
        })
        router.push(DASHBOARD_ROUTE)


      }else{
        toast.error(userData.payload, {
          autoClose: 1500,
        })
      }
      

    }).catch((error) => {
      console.log(error.payload)
    })


  }


  // useEffect(() => {
  //   if (error) {
  //     toast.error(error, {
  //       autoClose: 1500,
  //     })
  //   }
  // }, [error])

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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br py-8 from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
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
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="mt-6 text-3xl font-Nunito-ExtraBold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm font-Poppins text-gray-600">
            Please sign in to your account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form onSubmit={handleSubmit(submitForm)} className="mt-8 space-y-6" variants={itemVariants}>
          {/* Email Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-Nunito text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                {...register("email", {
                  required: "Email is required.",

                })}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (<p className='text-red-500 text-[12px] flex  px-1 py-1'> <AlertCircle className="h-4 w-4 mr-1" />{errors.email.message}</p>)}
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required.",

                })}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out pr-10"
                placeholder="Enter your password"
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
            {errors.password && (<p className='text-red-500 flex text-[12px] px-1 py-1'>  <AlertCircle className="h-4 w-4 mr-1" />{errors.password.message}</p>)}
          </motion.div>

          {/* Captcha Section */}
          <motion.div
            className="bg-gray-50 p-4 rounded-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
                Text Captcha
              </label>
              <motion.button
                type="button"
                onClick={refreshCaptcha}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className='h-4 w-4' />
              </motion.button>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex-1 bg-white p-3 rounded border border-gray-200 text-center font-mono text-lg tracking-wider"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <p className='text-sm'>{question}</p>
              </motion.div>
              <input
                id="captcha"
                name="captcha"
                type="text"
                {...register("captchaAnswer", {
                  required: "Captcha is required."
                })}
                className="flex-1 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter captcha"
              />

            </div>
            {errors.captchaAnswer && (<p className='text-red-500 flex justify-center ml-10 text-[12px] px-1 py-1'>  <AlertCircle className="h-4 w-4 mr-1" />{errors.captchaAnswer.message}</p>)}
          </motion.div>


          {/* Remember Me & Forgot Password */}
          <motion.div
            className="flex items-center justify-between"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <motion.div
              className="text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={FORGOTPASSWORD_ROUTE} className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </Link>
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex disabled:cursor-not-allowed disabled:bg-slate-200 justify-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In  {loading && <Spinner />}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div
          className="text-center mt-4"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default Login;
