"use client"

import { Category } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FcMusic } from 'react-icons/fc'
import { FaMoneyBillWave } from 'react-icons/fa'
import { BsCodeSlash } from 'react-icons/bs'
import { PiCookingPot } from 'react-icons/pi'
import { GrLanguage, GrCamera } from 'react-icons/gr'
import { TbBusinessplan } from 'react-icons/tb'
import { AiOutlineVideoCamera } from 'react-icons/ai'
import { MdOutlineHealthAndSafety } from 'react-icons/md'
import CategoryItem from './CategoryItem'

interface Props {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Art and Music": FcMusic,
    "Finance and Investing": FaMoneyBillWave,
    "Programming and Development": BsCodeSlash,
    "Cooking and Culinary Arts": PiCookingPot,
    "Language Learning": GrLanguage,
    "Business and Entrepreneurship": TbBusinessplan,
    "Graphic Design and Video Editing": AiOutlineVideoCamera,
    "Health and Fitness": MdOutlineHealthAndSafety,
    "Photography and Videography": GrCamera,
}

const Categories = ({ items }: Props) => {
    const [categories, setCategories] = useState(items);

    useEffect(() => {
        setCategories(items)
    }, [items])
  
    return (
        <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
            {categories.map((category) => (
                <CategoryItem 
                    key={category.id}
                    value={category.id}
                    label={category.name}
                    icon={iconMap[category.name]}
                />
            ))}
        </div>
    )
}

export default Categories