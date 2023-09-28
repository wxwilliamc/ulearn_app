"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ItemProps {
    label: string,
    href: string
    icon: LucideIcon
}

const SidebarItems = ({ label, href, icon: Icon }: ItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
  
    const isActiveRoute = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`)
    
    return (
      <button
        onClick={() => router.push(href)}
        type='button'
        className={cn(`flex pl-6 justify-start py-6 gap-x-2 text-white text-md font-[500] transition-all hover:bg-white hover:text-green-300 group`, isActiveRoute && "bg-white text-green-300")}
      >
        <div className='flex items-center gap-4'>
          <Icon 
            size={22}
            className={cn(`text-white group-hover:text-green-300`, isActiveRoute && 'text-green-300')}
          />
          {label}
        </div>
      </button>
  )
}

export default SidebarItems