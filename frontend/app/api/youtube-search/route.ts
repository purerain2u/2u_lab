import { NextResponse } from 'next/server';

const API_KEY = process.env.YOUTUBE_API_KEY;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ error: '검색어가 필요합니다' }, { status: 400 });
    }

    if (!API_KEY) {
      console.error('YouTube API 키가 설정되지 않았습니다');
      return NextResponse.json({ error: '서버 구성 오류' }, { status: 500 });
    }

    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(q)}&key=${API_KEY}&maxResults=2`;

    const response = await fetch(API_URL);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube 데이터 가져오기 오류:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'YouTube 데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
  }
}
