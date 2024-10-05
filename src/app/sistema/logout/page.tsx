'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { BeatLoader } from 'react-spinners';

export default function Page() {

    const navigate = useRouter();

    useEffect(() => {
        localStorage.removeItem("token");
        navigate.push("/");
    }, [])
    

  return (
    <div className='flex flex-col justify-center h-screen items-center'>
        <BeatLoader className='text-neutral-900' ></BeatLoader>
    </div>
  )
}
