import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { listStudentProfiles } from '@/lib/profile/server';
import { consumeRateLimit } from '@/lib/net/ratelimit';

function buildRateLimitKey(request: Request, uid: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : 'unknown';
  return `admin-students:${uid}:${ip}`;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const rateLimitKey = buildRateLimitKey(request, session.sub);
  const result = consumeRateLimit(rateLimitKey, 30, 5 * 60 * 1000);
  if (!result.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfter) },
    });
  }

  const url = new URL(request.url);
  const stageFilter = url.searchParams.get('stage');
  const careerFilter = url.searchParams.get('carrera');

  const profiles = await listStudentProfiles();
  const items = profiles
    .filter((profile) => {
      if (stageFilter && profile.semesterStage !== stageFilter) {
        return false;
      }
      if (careerFilter && profile.carreraName !== careerFilter && profile.carreraId !== careerFilter) {
        return false;
      }
      return true;
    })
    .map((profile) => ({
      uid: profile.uid,
      email: profile.email,
      carreraId: profile.carreraId,
      carreraName: profile.carreraName,
      semesterNumber: profile.semesterNumber,
      semesterStage: profile.semesterStage,
      matricula_last4: profile.matriculaLast4,
    }));

  return NextResponse.json({ items }, { headers: { 'cache-control': 'no-store' } });
}
