'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/routes/route';

const Layout = ({ children }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      router.push(DASHBOARD_ROUTE);
    } 
  }, [user, router]);

  return <div>{!user && children}</div>;
};

export default Layout;
