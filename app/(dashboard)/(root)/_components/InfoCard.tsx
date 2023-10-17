import { IconBadge } from '@/components/Icon-Badge'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface InfoCardProps {
    label: string
    numberOfItems: number
    icon: LucideIcon
    variant?: "default" | "success" 
}

const InfoCard = ({ label, numberOfItems, icon: Icon, variant}: InfoCardProps) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
        <IconBadge 
            icon={Icon}
            variant={variant}
        />

        <div>
            <p className='font-medium'>
                {label}
            </p>
            <p className='text-gray-500 text-sm'>
              {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}  
            </p>
        </div>
    </div>
  )
}

export default InfoCard