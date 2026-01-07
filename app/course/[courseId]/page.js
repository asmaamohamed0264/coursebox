"use client"
import Header from '@/app/_components/Header'
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList'
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo'
import CourseDetails from '@/app/create-course/[courseId]/_components/CourseDetails'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Course({params}) {
    const [course,setCourse]=useState();
    useEffect(()=>{
        params&&GetCourse();
    },[params])

    const GetCourse=async()=>{
        try {
            const response = await fetch(`/api/courses/${params?.courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const result = await response.json();
            setCourse(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    }

  return (
    <div>
        <Header/>
        <div className='px-10 p-10 md:px-20 lg:px-44'>
        <CourseBasicInfo course={course} edit={false} />

        <CourseDetails course={course} />

        <ChapterList course={course}  edit={false}/>
        </div>
    </div>
  )
}

export default Course