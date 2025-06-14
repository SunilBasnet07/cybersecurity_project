'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Register from '@/components/register'
import loginImage from '@/image/login.png'

const RegisterPage = () => {
  return (
    <div className='mt-16 flex justify-center bg-gradient-to-br items-center gap-8 w-full from-blue-50 to-indigo-100'>
      
      {/* Animated Image */}
      <motion.div
        className='w-[40%] mb-9 '
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src={loginImage} alt='loginImage' height={1200} width={1200} />
      </motion.div>

      {/* Animated Register Form */}
      <div>
        <Register />
      </div>

    </div>
  )
}

export default RegisterPage
