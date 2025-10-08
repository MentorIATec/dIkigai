import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { listStudentProfiles } from '@/lib/profile/server';
import { consumeRateLimit } from '@/lib/net/ratelimit';
import { writeAudit } from '@/lib/audit/log';

function getRateLimitKey(request: Request, uid: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : 'unknown';
  return `admin-students-export:${uid}:${ip}`;
}

function toCsvValue(value: unknown): string {
  const stringValue = value === null || value === undefined ? '' : String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const rateLimitKey = getRateLimitKey(request, session.sub);
  const rate = consumeRateLimit(rateLimitKey, 10, 5 * 60 * 1000);
  if (!rate.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter) },
    });
  }

  const url = new URL(request.url);
  const stageFilter = url.searchParams.get('stage');
  const careerFilter = url.searchParams.get('carrera');

  const profiles = await listStudentProfiles();
  const rows = profiles.filter((profile) => {
    if (stageFilter && profile.semesterStage !== stageFilter) {
      return false;
    }
    if (careerFilter && profile.carreraName !== careerFilter && profile.carreraId !== careerFilter) {
      return false;
    }
    return true;
  });

  const header = ['uid', 'email', 'carreraName', 'semesterNumber', 'semesterStage', 'matricula_last4'];
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`${header.join(',')}\n`));
      for (const row of rows) {
        const line = [
          toCsvValue(row.uid),
          toCsvValue(row.email ?? ''),
          toCsvValue(row.carreraName ?? ''),
          toCsvValue(row.semesterNumber ?? ''),
          toCsvValue(row.semesterStage ?? ''),
          toCsvValue(row.matriculaLast4 ?? ''),
        ].join(',');
        controller.enqueue(encoder.encode(`${line}\n`));
      }
      controller.close();
    },
  });

  let auditId: string | null = null;
  try {
    auditId = await writeAudit({
      action: 'student_profiles_export',
      resource: 'admin/students/export',
      who: { uid: session.sub, email: session.email },
      role: session.role,
      metadata: {
        count: rows.length,
        stageFilter: stageFilter ?? null,
        careerFilter: careerFilter ?? null,
      },
    });
  } catch (error) {
    console.error('Failed to persist audit log for student export', error);
  }

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="student-profiles.csv"',
      'Cache-Control': 'no-store',
      ...(auditId ? { 'X-Audit-Id': auditId } : {}),
    },
  });
}
