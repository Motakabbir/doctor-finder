import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = request.headers.get('Authorization');
    const response = await fetch(`${API_BASE_URL}/admin/chambers/${params.id}`, {
      headers: {
        'Authorization': adminToken || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chamber' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const adminToken = request.headers.get('Authorization');
    
    const response = await fetch(`${API_BASE_URL}/admin/chambers/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update chamber' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = request.headers.get('Authorization');
    
    const response = await fetch(`${API_BASE_URL}/admin/chambers/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': adminToken || '',
      },
    });

    if (response.ok) {
      return new NextResponse(null, { status: 204 });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete chamber' }, { status: 500 });
  }
}
