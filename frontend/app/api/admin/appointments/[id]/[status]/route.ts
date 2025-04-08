import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, status: 'confirm' | 'cancel' } }
) {
  try {
    const adminToken = request.headers.get('Authorization');
    const endpoint = params.status === 'confirm' ? 'confirm' : 'cancel';
    
    const response = await fetch(`${API_BASE_URL}/admin/appointments/${params.id}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': adminToken || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to ${params.status} appointment` }, 
      { status: 500 }
    );
  }
}
