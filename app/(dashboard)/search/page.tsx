import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/Categories'
import { retrieveCourses } from '@/actions/retrieve-courses'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import SearchInput from '@/components/SearchInput'
import CoursesList from '@/components/CoursesList'

interface SearchProps {
  searchParams: {
    title: string,
    categoryId: string
  }
}

const SearchPage = async ({
  searchParams,
}: SearchProps) => {
  const { userId } = auth();
  if(!userId) redirect('/')

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  const courses = await retrieveCourses({
    userId,
    ...searchParams,
  })

  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb-0 block'>
        <SearchInput />
      </div>

      <div className='p-6 space-y-4'>
        <Categories 
          items={categories}
        />

        <CoursesList 
          items={courses}
        />
      </div>
    </>
  )
}

export default SearchPage