import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// PUT - publish course
export async function PUT(request, { params }) {
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

    const result = await db
      .update(CourseList)
      .set({ publish: true })
      .where(eq(CourseList.courseId, courseId))
      .returning()

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error publishing course:', error)
    return NextResponse.json(
      { error: 'Failed to publish course', details: error.message },
      { status: 500 }
    )
  }
}

