'use client'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@/routes/route';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const {user} = useSelector((state)=>state.auth)
    const router = useRouter();
    useEffect(()=>{
      if(!user){
       router.push(LOGIN_ROUTE)
      }
      // if(user){
      //   router.push(DASHBOARD_ROUTE)
      // }
    },[user,router])
  return (
    <div className='mt-16 px-3 py-3'> <p>Hi ! <strong>{user?.name}</strong></p>
      Wellcome to DashboardPage</div>
  )
}

export default DashboardPage