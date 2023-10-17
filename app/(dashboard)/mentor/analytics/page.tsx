import { retrieveAnalytics } from '@/actions/retrieve-analytics';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'
import DataCard from './_components/DataCard';
import Chart from './_components/Chart';

const Analytics = async () => {

  const { userId } = auth();
  if(!userId) redirect("/")

  const { data, totalRevenue, totalSales } = await retrieveAnalytics(userId)
  
  return (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <DataCard 
          label='Total Sales'
          value={totalSales}
        />

        <DataCard 
          label='Total Revenue'
          value={totalRevenue}
          formatRequire
        />
      </div>

      <Chart data={data}/>
    </div>
  )
}

export default Analytics