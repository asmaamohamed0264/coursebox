import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const EditChapters = ({course, index, refreshData}) => {
    const Chapters = course?.courseOutput?.course.chapters;
    const [name, setName] = useState()
    const [about, setAbout] = useState()

    useEffect(() => {
      setName(Chapters[index].name)
      setAbout(Chapters[index].about)
    }, [])
    
    const onUpdateHandler=async()=>{
        Chapters[index].name=name;
        Chapters[index].about=about;
        console.log(course);
        
        try {
            const response = await fetch(`/api/courses/${course?.courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseOutput: course?.courseOutput
                })
            })
            if (!response.ok) throw new Error('Failed to update course')
            if (refreshData) refreshData(true)
        } catch (error) {
            console.error('Error updating course:', error)
        }
    }

  return (
    <div>
      <Dialog>
        <DialogTrigger><HiPencilSquare /></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
            <div className='mt-3'>
                <label>Course Title</label>
                <Input defaultValue={Chapters[index].name}
                onChange={(event)=>setName(event?.target.value)}
                />
            </div>
            <div>
                <label>Description</label>
                <Textarea className="h-40" 
                defaultValue={Chapters[index].about}
                onChange={(event)=>setAbout(event?.target.value)}
                />
            </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
                <Button onClick={onUpdateHandler}>Update</Button>
            </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditChapters;
