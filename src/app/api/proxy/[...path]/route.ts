import { NextRequest, NextResponse } from 'next/server';

/**
 * API Proxy Route
 * Handles all API requests in production to avoid CORS issues.
 * Forwards requests to the backend API and returns the responses.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Handle GET requests through the proxy
 * Forwards GET requests to the backend API with query parameters
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract path segments and reconstruct the API path
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    // Preserve query parameters from the original request
    const url = new URL(request.url);
    const queryString = url.search;
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/${path}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests through the proxy
 * Forwards POST requests to the backend API with request body
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract path segments and reconstruct the API path
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle PATCH requests through the proxy
 * Forwards PATCH requests to the backend API with request body (for updates)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract path segments and reconstruct the API path
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle DELETE requests through the proxy
 * Forwards DELETE requests to the backend API
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract path segments and reconstruct the API path
    const { path: pathSegments } = await params;
    const path = pathSegments.join('/');
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle 204 No Content responses (common for DELETE operations)
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Check if response has content before parsing as JSON
    const text = await response.text();
    if (!text) {
      // No content, just return status
      return new NextResponse(null, { status: response.status });
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Not JSON, return as plain text
      return new NextResponse(text, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 