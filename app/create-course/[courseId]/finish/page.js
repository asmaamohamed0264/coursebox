"use client"
import { useUser } from '@clerk/nextjs';

import React, { useEffect, useState } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { useRouter } from 'next/navigation';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

function FinishScreen({params}) {
    const { user } = useUser();
    const [course,setCourse]=useState([]);
    const router=useRouter();
    useEffect(() => {
      params && GetCourse();
    }, [params,user])
  
    const GetCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params?.courseId}?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const result = await response.json();
        setCourse(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    }
  return (
    <div className='px-10 md:px-20 lg:px-44 my-7'>
        <h2 className='text-center font-bold text-2xl my-3 text-primary'>Congrats! Your course is Ready</h2>
       
       
        <CourseBasicInfo course={course} refreshData={()=>console.log()} />
       <h2 className='mt-3'>Course URL:</h2>
       <h2 className='text-center text-gray-400 
       border p-2 round flex gap-5 items-center'>{process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/course/{course?.courseId} 
       <HiOutlineClipboardDocumentCheck
        className='h-5 w-5 cursor-pointer' 
        onClick={async()=>await navigator.clipboard.writeText((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)+"/course/"+course?.courseId)} /></h2>
        
    </div>
  )
}

export default FinishScreen