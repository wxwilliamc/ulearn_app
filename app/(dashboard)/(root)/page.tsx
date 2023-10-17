import { retrieveDashboardCourses } from '@/actions/retrieve-dashboard-courses';
import CoursesList from '@/components/CoursesList';
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { CheckCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import InfoCard from './_components/InfoCard';

export default async function Dashboard() {

  const { userId } = auth();
  if(!userId) redirect('/')

  const { completedCourses, coursesInProgress } = await retrieveDashboardCourses(userId)
  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InfoCard 
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
          />
          <InfoCard 
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant='success'
          />
      </div>

      <CoursesList 
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}
