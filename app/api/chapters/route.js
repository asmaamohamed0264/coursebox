import { db } from '@/configs/db'
import { Chapters } from '@/configs/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// GET chapters by courseId
export async function GET(request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const chapterId = searchParams.get('chapterId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    let query = db.select().from(Chapters).where(eq(Chapters.courseId, courseId))

    if (chapterId) {
      query = query.where(and(
        eq(Chapters.courseId, courseId),
        eq(Chapters.chapterId, parseInt(chapterId))
      ))
    }

    const result = await query
    return NextResponse.json(chapterId ? result[0] || null : result)
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapters', details: error.message },
      { status: 500 }
    )
  }
}

// POST - create new chapter
export async function POST(request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. DATABASE_URL or NEXT_PUBLIC_DB_CONNECTION_STRING is not set' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const result = await db.insert(Chapters).values(body).returning()
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter', details: error.message },
      { status: 500 }
    )
  }
}

