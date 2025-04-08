import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const adminToken = request.headers.get('Authorization');
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${params.doctorId}/chambers`, {
      headers: {
        'Authorization': adminToken || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctor chambers' }, { status: 500 });
  }
}
