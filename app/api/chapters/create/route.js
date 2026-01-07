import { db } from '@/configs/db'
import { Chapters } from '@/configs/schema'
import { NextResponse } from 'next/server'

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

