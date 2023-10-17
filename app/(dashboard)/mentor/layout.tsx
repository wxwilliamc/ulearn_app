import { isMentor } from '@/lib/mentor';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

const MentorLayout = ({ children }: { children: React.ReactNode }) => {

    const { userId } = auth();
    if(!isMentor(userId)){
        return redirect('/')
    }
    
  return (
    <div>
        {children}
    </div>
  )
}

export default MentorLayout