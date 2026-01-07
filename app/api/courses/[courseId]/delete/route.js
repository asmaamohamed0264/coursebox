import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// DELETE course
export async function DELETE(request, { params }) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set' },
        { status: 500 }
      )
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') // database id, not courseId

    if (id) {
      const result = await db
        .delete(CourseList)
        .where(eq(CourseList.id, parseInt(id)))
        .returning()
      return NextResponse.json({ success: true, deleted: result[0] })
    }

    // If no id provided, delete by courseId
    const result = await db
      .delete(CourseList)
      .where(eq(CourseList.courseId, courseId))
      .returning()

    return NextResponse.json({ success: true, deleted: result[0] })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course', details: error.message },
      { status: 500 }
    )
  }
}

