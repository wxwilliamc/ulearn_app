import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
    const [debValue, setDebValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebValue(value)
        }, delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debValue
}