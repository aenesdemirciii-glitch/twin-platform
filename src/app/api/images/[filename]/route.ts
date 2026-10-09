import { NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;
    if (!filename) {
      return new NextResponse('File not found', { status: 404 });
    }

    const uploadDir = process.env.STORAGE_PATH 
      ? process.env.STORAGE_PATH 
      : join(process.cwd(), 'public', 'uploads');
      
    const filepath = join(uploadDir, filename);

    if (!existsSync(filepath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const buffer = await readFile(filepath);
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.webp')) contentType = 'image/webp';
    else if (filename.endsWith('.gif')) contentType = 'image/gif';
    else if (filename.endsWith('.svg')) contentType = 'image/svg+xml';
    
    // Check real bytes if possible to be absolutely sure
    if (buffer.length > 12) {
       const isWebP = buffer.toString('utf8', 8, 12) === 'WEBP';
       if (isWebP) contentType = 'image/webp';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
