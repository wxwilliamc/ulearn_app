"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { newCourseTitleSchemaType, newCourseTitleSchema } from '@/schema/form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'

const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<newCourseTitleSchemaType>({
    resolver: zodResolver(newCourseTitleSchema),
    defaultValues: {
      title: ""
    }
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: newCourseTitleSchemaType) => {
    try {
      const res = await axios.post(`/api/courses`, values)
      router.push(`/mentor/courses/${res.data.id}`)
      toast.success("Course Created.")
    } catch {
      toast.error("Something went wrong.")
    }
  }
  
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl capitalize'>Name your course</h1>
        <p className='text-sm text-green-400'>What would like to name the title? The title could be change after created.</p>

        <Form {...form}>
          <form
            className='space-y-8 mt-8'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField 
              control={form.control}
              name='title'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='e.g Next.js Course'
                      disabled={isSubmitting} {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course.</FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <div className='flex items-center gap-x-2'>
              <Button onClick={() => router.push('/')} type='button' variant='ghost'>Cancel</Button>
              <Button type='submit' disabled={isSubmitting || !isValid }>Create</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateCourse