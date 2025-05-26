'use client'
import Navbar from '@/components/Navbar'
import store from '@/redux/store'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'

const MainLayout = ({children}) => {
    return (
        <Provider store={store}>
            <Navbar />

            {children}
            <Toaster/>
        </Provider>
    )
}

export default MainLayout