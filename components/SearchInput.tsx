"use client"

import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

const SearchInput = () => {

    const [value, setValue] = useState("");
    const debValue = useDebounce(value);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId")

    useEffect(() => {
        const url = qs.stringifyUrl({
            // /search?categoryId=xxx&title=xxx
            url: pathname, 
            query: {
                categoryId: currentCategoryId,
                title: debValue // after 5 secs, the search value will be shows on the url
            }
        },  { skipEmptyString: true, skipNull: true})

        router.push(url)

    }, [currentCategoryId, pathname, debValue, router])

    return (
        <div className='relative'>
            <Search className='h-4 w-4 absolute top-[0.65rem] left-3 text-green-400'/>
            <Input 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Search Course'
                className='w-full md:w-[300px] pl-9 rounded-full bg-white focus-visible:ring-green-300'
            />
        </div>
    )
}

export default SearchInput