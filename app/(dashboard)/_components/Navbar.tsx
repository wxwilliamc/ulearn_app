import React from 'react'
import MobileSidebar from './Mobile-Sidebar'
import NavbarRoutes from '@/components/Navbar-Routes'

const Navbar = () => {
  return (
    <div className='p-8 border-b h-full flex items-center bg-white shadow-md'>
        <MobileSidebar />
        <NavbarRoutes />
    </div>
  )
}

export default Navbar