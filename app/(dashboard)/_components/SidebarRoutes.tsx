"use client"

import { Layout, Compass, List, BarChart } from 'lucide-react'
import React from 'react'
import SidebarItems from './Sidebar-Items';
import { usePathname } from 'next/navigation';

const learnerRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: '/'   
    },
    {
        icon: Compass,
        label: "Browse",
        href: '/search'   
    },
]

const mentorRoutes = [
    {
        icon: List,
        label: "Courses",
        href: '/mentor/courses'   
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: '/mentor/analytics'   
    },
]

const SidebarRoutes = () => {

    const pathname = usePathname();
    const isMentorPage = pathname.includes('/mentor');
    const routes = isMentorPage ? mentorRoutes : learnerRoutes;

  return (
    <div className='flex flex-col w-full'>
        {routes.map((route) => (
            <SidebarItems 
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
        ))}
    </div>
  )
}

export default SidebarRoutes