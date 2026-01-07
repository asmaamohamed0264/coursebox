import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq, desc, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// GET all courses with pagination
export async function GET(request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0')
    const limit = parseInt(searchParams.get('limit') || '9')
    const courseId = searchParams.get('courseId')
    const createdBy = searchParams.get('createdBy')

    let query = db.select().from(CourseList)

    if (courseId && createdBy) {
      query = query.where(and(
        eq(CourseList.courseId, courseId),
        eq(CourseList.createdBy, createdBy)
      ))
    } else if (courseId) {
      query = query.where(eq(CourseList.courseId, courseId))
    } else if (createdBy) {
      query = query.where(eq(CourseList.createdBy, createdBy))
    }

    query = query
      .orderBy(desc(CourseList.id))
      .limit(limit)
      .offset(pageIndex * limit)

    const result = await query
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error.message },
      { status: 500 }
    )
  }
}

// POST - create new course
export async function POST(request) {
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

    const body = await request.json()
    const result = await db.insert(CourseList).values(body).returning()
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    )
  }
}

