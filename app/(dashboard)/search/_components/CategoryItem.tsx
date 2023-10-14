import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { IconType } from 'react-icons'
import qs from 'query-string'

interface ItemProps {
    value?: string
    label: string
    icon?: IconType
}

const CategoryItem = ({ value, label, icon: Icon }: ItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategoryId = searchParams.get("categoryId");
    const selectedTitle = searchParams.get("title");

    const isSelected = selectedCategoryId === value;

    const onSelect = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: selectedTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true})

        router.push(url)
    }

    return (
        <button onClick={onSelect} className={cn(`py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-green-700 transition`, 
            isSelected && "border-green-400 bg-green-400 text-neutral-100"
        )}>
            {Icon && <Icon size={20}/>}
            <div className='truncate'>
                {label}
            </div>
        </button>
    )
}

export default CategoryItem