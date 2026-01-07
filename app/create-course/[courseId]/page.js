"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from './_components/CourseBasicInfo'
import CourseDetails from './_components/CourseDetails'
import ChapterList from './_components/ChapterList'
import { Button } from '@/components/ui/button'
import { GenerateChapterContent_AI } from '@/configs/AiModel'
import LoadingDialog from '../_components/LoadingDialog'
import service from '@/configs/service'
import { useRouter } from 'next/navigation'

function CourseLayout({ params }) {
  const { user } = useUser();
  const [course,setCourse]=useState([]);
  const [loading,setLoading]=useState(false);
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

  const GenerateChapterContent=async()=>{
    setLoading(true);
    const chapters=course?.courseOutput?.course?.chapters;
    await chapters.forEach(async(chapter,index)=>{
    setLoading(true);

      const PROMPT='Explain the concept in Detail on Topic:'+course?.name+', Chapter:'+chapter?.name+', in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable';
      console.log(PROMPT)
      // if(index<3)
      // {
          try{
            let videoId='';

            //Generate Video URL
          await service.getVideos(course?.name+':'+chapter?.name).then(resp=>{
              videoId=resp[0]?.id?.videoId;
              console.log(resp);
            })
            //generate chapter content
              const result=await GenerateChapterContent_AI.sendMessage(PROMPT);
              // console.log(result?.response?.text());
              const content=JSON.parse(result?.response?.text())
              
              // Save Chapter Content + Video URL
              const resp = await fetch('/api/chapters/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chapterId: index,
                  courseId: course?.courseId,
                  content: content,
                  videoId: videoId
                })
              })
              if (!resp.ok) throw new Error('Failed to create chapter')
              const result = await resp.json()
              console.log(result)
              setLoading(false)
          }catch(e)
          {
            setLoading(false);
            console.log(e)
          }
          
          // Publish course on last chapter
          if(index==chapters?.length-1) {
            try {
              await fetch(`/api/courses/${course?.courseId}/publish`, {
                method: 'PUT'
              })
            } catch (error) {
              console.error('Error publishing course:', error)
            }
            router.replace('/create-course/'+course?.courseId+"/finish")
          }
      //  }

    })
  }
  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>

      <LoadingDialog loading={loading} />
      {/* Basic Info  */}
        <CourseBasicInfo course={course} refreshData={()=>GetCourse()} />
      {/* Course Detail  */}
        <CourseDetails course={course} />
      {/* List of Lesson  */}
        <ChapterList course={course} refreshData={()=>GetCourse()}/>

      <Button onClick={GenerateChapterContent} className="my-10">Generate Course Content</Button>
    </div>
  )
}

export default CourseLayout