import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { getAdminStudentPrivate } from '@/lib/profile/server';
import { writeAudit } from '@/lib/audit/log';
import { consumeRateLimit } from '@/lib/net/ratelimit';

function getRateLimitKey(request: Request, adminUid: string, subjectUid: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : 'unknown';
  return `admin-matricula:${adminUid}:${subjectUid}:${ip}`;
}

export async function GET(
  request: Request,
  context: { params: { uid: string } },
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const rateLimitKey = getRateLimitKey(request, session.sub, context.params.uid);
  const result = consumeRateLimit(rateLimitKey, 30, 5 * 60 * 1000);
  if (!result.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfter) },
    });
  }

  const matricula = await getAdminStudentPrivate(context.params.uid);
  let auditId: string | null = null;
  try {
    auditId = await writeAudit({
      action: 'student_matricula_view',
      resource: 'admin/students/matricula',
      who: { uid: session.sub, email: session.email },
      role: session.role,
      subjectUid: context.params.uid,
      metadata: { result: matricula ? 'revealed' : 'missing' },
    });
  } catch (error) {
    console.error('Failed to persist audit log for matricula access', error);
  }

  return new NextResponse(JSON.stringify({ matricula, auditId, audited: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      ...(auditId ? { 'X-Audit-Id': auditId } : {}),
    },
  });
}
