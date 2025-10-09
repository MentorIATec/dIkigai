import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { createCipheriv, randomBytes, createHash } from 'crypto';
import type { StudentProfile } from '@/lib/types';
import { normalizeSemester, computeStage } from '@/lib/profile/mapping';

// Usar mock store para desarrollo (evitar problemas de Firebase)
const useMockStore = true;

type MockPrivateStoreEntry = {
  matricula_enc?: string;
  updatedAt: string;
};

const globalStores = globalThis as typeof globalThis & {
  __mockProfiles?: Record<string, StudentProfile>;
  __mockPrivateProfiles?: Record<string, MockPrivateStoreEntry>;
};

if (useMockStore) {
  globalStores.__mockProfiles = globalStores.__mockProfiles || {};
  globalStores.__mockPrivateProfiles = globalStores.__mockPrivateProfiles || {};
}

// Usar el sistema de autenticación consistente

// Función utilitaria para obtener clave de cifrado consistente
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || 'default-key-32-chars-long-12345';
  // Derivar siempre 32 bytes usando SHA-256 para evitar errores de longitud
  return createHash('sha256').update(secret).digest();
}

// Función para cifrar matrícula
function encryptMatricula(matricula: string): { encrypted: string; last4: string; hash: string } {
  const key = getEncryptionKey();
  const iv = randomBytes(12); // Tamaño recomendado para GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(matricula, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, encryptedBuffer]).toString('base64');

  const last4 = matricula.slice(-4);
  const salt = process.env.HASH_SALT || 'default-salt';
  const hash = createHash('sha256').update(matricula + salt).digest('hex');
  
  return {
    encrypted: payload,
    last4,
    hash
  };
}

// Función para validar sesión usando el sistema consistente
async function validateSession(): Promise<string | null> {
  console.log('validateSession called, useMockStore:', useMockStore);
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'defined' : 'undefined');
  
  try {
    const session = await getSession();
    if (!session) {
      console.log('No session found');
      return null;
    }
    
    console.log('Session found, uid:', session.sub);
    return session.sub;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

export async function GET() {
  try {
    console.log('GET /api/profile called');
    const uid = await validateSession();
    console.log('validateSession returned uid:', uid);
    
    if (!uid) {
      console.log('No uid, returning 401');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Usar mock store para desarrollo
    console.log('Using mock store for GET');
    const profile = globalStores.__mockProfiles?.[uid] ?? null;
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/profile called');
    const uid = await validateSession();
    console.log('validateSession returned uid:', uid);
    
    if (!uid) {
      console.log('No uid, returning 401');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', { semesterNumber: body.semesterNumber, carreraId: body.carreraId, matricula: body.matricula ? 'provided' : 'not provided' });
    const { semesterNumber, carreraId, carreraName, matricula } = body;

    // Validar datos requeridos
    if (!semesterNumber) {
      return NextResponse.json({ error: 'Número de semestre requerido' }, { status: 400 });
    }

    // Validar matrícula si se proporciona
    if (matricula) {
      const matriculaRegex = /^[A-Z]\d{8}$/;
      if (!matriculaRegex.test(matricula)) {
        return NextResponse.json({ 
          error: 'Formato de matrícula inválido. Debe ser una letra seguida de 8 dígitos (ej: A00803848)' 
        }, { status: 400 });
      }
      
      // Permitir matrícula de prueba específica
      const allowedTestMatriculas = ['A00803848'];
      if (!allowedTestMatriculas.includes(matricula)) {
        return NextResponse.json({ 
          error: 'Matrícula no autorizada para pruebas. Use A00803848' 
        }, { status: 403 });
      }
    }

    // Normalizar y calcular etapa
    const normalizedSemester = normalizeSemester(semesterNumber);
    const semesterStage = computeStage(normalizedSemester);

    // Preparar perfil
    const profile: StudentProfile = {
      semesterNumber: normalizedSemester,
      semesterStage,
      carreraId,
      carreraName,
      consent: {
        profile: true,
        version: '1.0',
        acceptedAt: new Date().toISOString()
      }
    };

    // Procesar matrícula si se proporciona
    if (matricula) {
      const { encrypted, last4, hash } = encryptMatricula(matricula);
      
      // Guardar datos públicos en student_profiles
      profile.matricula_last4 = last4;
      profile.matricula_hash = hash;
      
      // Guardar matrícula cifrada en mock store
      if (globalStores.__mockPrivateProfiles) {
        globalStores.__mockPrivateProfiles[uid] = {
          matricula_enc: encrypted,
          updatedAt: new Date().toISOString()
        };
      }
    }

    // Guardar perfil en mock store
    console.log('Using mock store for POST');
    if (globalStores.__mockProfiles) {
      globalStores.__mockProfiles[uid] = {
        ...profile,
      };
    }

    console.log('Returning success response');
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Reutilizar lógica de POST para actualizaciones
  return POST(request);
}
