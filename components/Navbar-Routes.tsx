"use client"

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import SearchInput from './SearchInput'
import { isMentor } from '@/lib/mentor'

const NavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isMentorPage = pathname?.startsWith("/mentor");
    const isLearnerPage = pathname?.includes('/courses');
    const isSearchPage = pathname === '/search'
    const { userId } = useAuth();


  return (
    <>
        {isSearchPage && (
            <div className='hidden md:block'>
                <SearchInput />
            </div>
        )}

        <div className='flex gap-x-2 ml-auto'>
            {isMentorPage || isLearnerPage ? (
                <Button onClick={() => router.push('/')}>
                    Exit
                    <LogOut className='h-4 w-4 ml-2'/>
                </Button>
            ): isMentor(userId) ? (
                <Button onClick={() => router.push('/mentor/courses')}>
                    Mentor Mode
                </Button>
            ): null}
            <UserButton afterSignOutUrl='/'/>
        </div>
    </>
  )
}

export default NavbarRoutes