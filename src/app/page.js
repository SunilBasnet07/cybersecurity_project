'use client'
import { LOGIN_ROUTE } from "@/routes/route";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";





export default function Home() {
 const {user} = useSelector((state)=>state.auth)
 const router = useRouter();
 useEffect(()=>{
   if(!user){
    router.push(LOGIN_ROUTE)
   }
 },[user])
  return (
   <>
   <h1 className="mt-16">Welcome to Dashboard Page</h1>
   </>
  );
}
