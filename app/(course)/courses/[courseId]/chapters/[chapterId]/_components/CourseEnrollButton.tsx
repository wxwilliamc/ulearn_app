"use client"

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface CourseEnrollButtonProps {
    courseId: string
    price: number
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleEnroll = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post(`/api/courses/${courseId}/checkout`)

      window.location.assign(res.data.url)
      
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className='w-full md:w-auto' size='sm' onClick={toggleEnroll} disabled={isLoading}>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton