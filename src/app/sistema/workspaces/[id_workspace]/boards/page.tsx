'use client'
import React, { useEffect, useState } from 'react'
import { IBoard } from '@/app/interfaces/IBoard';
import Card from '@/app/components/Card';
import useAxios from '../../../../../../hooks/useAxios';

export default function Page() {

  const axios = useAxios();
  const [boards, setBoards] = useState<IBoard[]>([]);

  useEffect(() => {

    init();

  }, [])


  const init = async () => {

    axios.get("Board").then(res => {
      setBoards(res.data);
    })

  }


  return (
    <div className='h-full p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>

      {boards.map((q) => {
        return <Card key={q.id} board={q} />
      })}


    </div>
  )
}
