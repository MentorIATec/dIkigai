#!/usr/bin/env ts-node
/*
 * Export anonymized student profiles to CSV.
 * Usage: npx ts-node scripts/export-students.ts > students.csv
 */
import { writeFileSync } from 'node:fs';
import { listStudentProfiles } from '../src/lib/profile/server';

async function main() {
  const profiles = await listStudentProfiles();
  const header = ['uid', 'email', 'carreraName', 'semesterNumber', 'semesterStage', 'matricula_last4'];
  const lines = [header.join(',')];
  for (const profile of profiles) {
    lines.push(
      [
        profile.uid,
        profile.email ?? '',
        profile.carreraName ?? '',
        profile.semesterNumber ?? '',
        profile.semesterStage ?? '',
        profile.matriculaLast4 ?? '',
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    );
  }
  writeFileSync('students-export.csv', `${lines.join('\n')}\n`, 'utf8');
}

void main().catch((error) => {
  console.error('Failed to export profiles', error);
  process.exitCode = 1;
});
