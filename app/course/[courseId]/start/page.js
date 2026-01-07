"use client"
import React, { useEffect, useState } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'

function CourseStart({params}) {

    const [course,setCourse]=useState();
    const [selectedChapter,setSelectedChapter]=useState(0);
    const [chapterContent,setChapterContent]=useState();
    useEffect(()=>{
        GetCourse();
    },[])

    /**
     * Used to get Course Info by Course Id
     */
    const GetCourse=async()=>{
        try {
            const response = await fetch(`/api/courses/${params?.courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const result = await response.json();
            setCourse(result);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    }

    const GetSelectedChapterContent=async(chapterId)=>{
        try {
            const response = await fetch(`/api/chapters?courseId=${encodeURIComponent(course?.courseId || '')}&chapterId=${chapterId}`);
            if (!response.ok) throw new Error('Failed to fetch chapter');
            const result = await response.json();
            setChapterContent(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching chapter:', error);
        }
    }

  return (
    <div>
        {/* Chapter list Side Bar  */}
        <div className=' fixed md:w-72 hidden md:block h-screen border-r shadow-sm'>
            <h2 className='font-medium text-lg bg-primary p-4
            text-white'>{course?.courseOutput?.course?.name}</h2>

            <div>
                {course?.courseOutput?.course?.chapters.map((chapter,index)=>(
                    <div key={index} 
                    className={`cursor-pointer
                    hover:bg-purple-50
                    ${selectedChapter?.name==chapter?.name&&'bg-purple-100'}
                    `}
                    onClick={()=>{setSelectedChapter(chapter);
                    GetSelectedChapterContent(index)
                    }}
                    >
                        <ChapterListCard chapter={chapter} index={index} />
                    </div>
                ))}
            </div>
        </div>
        {/* Content Div  */}
        <div className='md:ml-72'>
            <ChapterContent chapter={selectedChapter}
                content={chapterContent}
            />
        </div>
    </div>
  )
}

export default CourseStart