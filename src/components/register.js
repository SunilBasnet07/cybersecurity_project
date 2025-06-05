'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import OTPPopup from './OTPPopup';
import { signUp, getCaptchaByString } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { getEmail } from '@/redux/auth/authSlice';



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const dispatch = useDispatch();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch("password", "");



  function refreshCaptcha() {
    getCaptchaByString().then((data) => {
      setQuestion(data.question);
      setCorrectAnswer(data.answer);
    }).catch(error => {
      console.log(error.message);
    });
  }

  useEffect(() => {
    refreshCaptcha();
  }, []);

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

  async function submitForm(data) {
    dispatch(getEmail(data.email))
    setLoading(true);
    try {
      const response = await signUp({ ...data, correctAnswer });

      localStorage.setItem("authToken", response?.token);
      toast.success("User created successfully, please check your email form OTP verification.", {
        autoClose: 1500,
      });
      if(response){
        setIsOTPOpen(true);
      }
     

    } catch (error) {
      // Extract error message from error object
      const errorMessage = error?.response?.data || error?.message || "An error occurred during registration";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }


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
      className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start your journey
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.form onSubmit={handleSubmit(submitForm)} className="mt-8" variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* User Name*/}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  User Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    {...register("name", {
                      required: "Username is required."
                    })}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="username"
                  />
                </div>
                {errors.name && (<p className='text-red-500 text-[12px] flex px-1 py-1'><AlertCircle className="h-4 w-4 mr-1" />{errors.name.message}</p>)}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
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
                        message: "Password must be getter than 8."
                      },
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: "Password must be contain uppercase lower case spical charater and number."
                      },
                      validate: (password) => {
                        const username = watch("name")?.toLowerCase() || "";
                        const email = watch("email")?.toLowerCase() || "";
                        const pass = password.toLowerCase();

                        const usernamePart = username.slice(0, 5);
                        const emailPart = email.slice(0, 5);

                        if (pass.includes(usernamePart)) {
                          return "Password should not include the first 5 characters of the username.";
                        }
                        if (pass.includes(emailPart)) {
                          return "Password should not include the first 5 characters of the email.";
                        }

                        return true;
                      }
                    })}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Create a password"
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
                {errors.password && (<p className='text-red-500 text-[12px] flex px-1 py-1'><AlertCircle className="h-4 w-4 mr-1" />{errors.password.message}</p>)}

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
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Email */}
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
                        message: "Provide a valid email address."
                      }
                    })}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (<p className='text-red-500 text-[12px] flex px-1 py-1'><AlertCircle className="h-4 w-4 mr-1" />{errors.email.message}</p>)}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
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
                      required: "Confirm Password is required.",
                      validate: (value) => value === password || "Password do not matched."
                    })}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Confirm your password"
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
                {errors.confirmPassword && (<p className='text-red-500 text-[12px] flex px-1 py-1'><AlertCircle className="h-4 w-4 mr-1" />{errors.confirmPassword.message}</p>)}
              </motion.div>
            </div>
          </div>

          {/* Captcha Section */}
          <motion.div
            className="mt-6 bg-gray-50 p-4 rounded-lg"
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

                <p className='text-md italic'>{question}</p>
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
            {errors?.captchaAnswer && (
              <p className='text-red-500 flex justify-center ml-32 text-[12px] px-1 py-1'>
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.captchaAnswer?.message}
              </p>
            )}
          </motion.div>

          {/* Terms and Conditions - Full Width */}
          <motion.div className="flex items-center mt-6" variants={itemVariants}>
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </label>
          </motion.div>

          {/* Submit Button - Full Width */}
          <motion.div className="mt-6" variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full disabled:cursor-not-allowed gap-2 disabled:bg-slate-200 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account {loading && <Spinner />}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Sign In Link */}
        <motion.div
          className="text-center mt-4"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </motion.div>
      </motion.div>
      <OTPPopup
        isOpen={isOTPOpen}
        onClose={() => setIsOTPOpen(false)}


      />
    </motion.div>
  );
};

export default Register; 