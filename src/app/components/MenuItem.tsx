import Link from 'next/link'
import React from 'react'

interface MenuItemProps {
    isOpen: boolean, texto: string, rota: string, Icon: React.ElementType
}

export default function MenuItem({ texto, rota, isOpen, Icon }: MenuItemProps) {
    return (
        <Link className='w-full' href={"/sistema/" + rota}>
            <li className={`hover:bg-white w-full  group font-bold p-2 hover:text-neutral-900 rounded-lg flex gap-2 items-center duration-200`}>

                <Icon className='text-white font-bold group-hover:text-neutral-900' size={18} />
                {isOpen == true ? texto : ""}
            </li>
        </Link>

    )
}
