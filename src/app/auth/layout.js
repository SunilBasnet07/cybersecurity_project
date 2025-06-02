'use client'

import { useSelector } from 'react-redux'

const layout = ({children}) => {
    const {user}=useSelector((state)=>state.auth)
   


  return (
    <div>{!user && children}</div>
  )
}

export default layout