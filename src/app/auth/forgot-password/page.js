'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ForgotPassword from '@/components/ForgotPassword'
import forgotImage from '@/image/login.png'

const ForgotPasswordPage = () => {
  return (
    <div className='mt-4 flex justify-center bg-gradient-to-br items-center gap-8 w-full from-blue-50 to-indigo-100'>
      
      {/* Animated Image */}
      <motion.div
        className='w-[40%] mb-20 ml-8'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src={forgotImage} alt='loginImage' height={1200} width={1000} />
      </motion.div>

      {/* Animated Forgot Password Form */}
      <div
       
      >
        <ForgotPassword />
      </div>

    </div>
  )
}

export default ForgotPasswordPage
