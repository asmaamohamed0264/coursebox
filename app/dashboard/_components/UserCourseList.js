"use client";
import { useUser } from "@clerk/nextjs";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

const UserCourseList = () => {
  const [courseList, setCourseList] = useState([]);
  const {userCourseList, setUserCourseList} = useContext(UserCourseListContext)
  const { user } = useUser();
  useEffect(() => {
    user && getUserCourses();
  }, [user]);

  
  const getUserCourses=async()=>{
    try {
      const response = await fetch(`/api/courses?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const result = await response.json();
      setCourseList(result);
      setUserCourseList(result);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">My AI Courses</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courseList?.length>0? courseList?.map((course, index) => (
                <CourseCard course={course} key={index} refreshData={()=>getUserCourses()}/>
            )):
            [1,2,3,4,5].map((item, index)=>{
                <div key={index} className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]'>
                  <h1>{item}</h1>
                </div>
              })}
              
        </div>
    </div>
  );
};

export default UserCourseList;
