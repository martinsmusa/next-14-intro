'use client';

import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {ChangeEventHandler, useCallback, useMemo} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

const PARAM_NAME_SEARCH = 'query'

export default function Search({placeholder}: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const {replace} = useRouter()

    const params = useMemo(() => new URLSearchParams(searchParams), [searchParams])

    const updateSearchParams = useCallback((term: string) => {
        params.set(PARAM_NAME_SEARCH, term)

        if (!term) {
            params.delete(PARAM_NAME_SEARCH)
        }

    }, [params])

    const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = useDebouncedCallback(useCallback((event) => {
        const term = event.target.value || ''

        params.set('page', '1');
        updateSearchParams(term)

        replace(`${pathname}?${params.toString()}`);
    }, [params, pathname, replace, updateSearchParams]), 500)

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                defaultValue={params.get(PARAM_NAME_SEARCH)?.toString() || ''}
                onChange={inputChangeHandler}
            />
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
        </div>
    );
}
