import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// GET course by ID
export async function GET(request, { params }) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set' },
        { status: 500 }
      )
    }

    const { courseId } = params
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')

    let query = db.select().from(CourseList).where(eq(CourseList.courseId, courseId))

    if (createdBy) {
      query = query.where(and(eq(CourseList.courseId, courseId), eq(CourseList.createdBy, createdBy)))
    }

    const result = await query
    return NextResponse.json(result[0] || null)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - update course
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
    const body = await request.json()

    const result = await db
      .update(CourseList)
      .set(body)
      .where(eq(CourseList.courseId, courseId))
      .returning()

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course', details: error.message },
      { status: 500 }
    )
  }
}

