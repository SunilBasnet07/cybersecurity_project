'use client'
import Navbar from '@/components/Navbar'
import  { persistor, store } from '@/redux/store'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const MainLayout = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Navbar />

                {children}
                <Toaster />

            </PersistGate>

        </Provider>
    )
}

export default MainLayout