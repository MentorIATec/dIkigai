const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type BufferModule = {
  from(data: Uint8Array | string, encoding?: string): any;
};

function getBuffer(): BufferModule | undefined {
  return (globalThis as { Buffer?: BufferModule }).Buffer;
}

function toUint8Array(source: ArrayBuffer | Uint8Array): Uint8Array {
  if (source instanceof Uint8Array) {
    return source;
  }
  return new Uint8Array(source);
}

export function encodeBase64(bytes: Uint8Array): string {
  const bufferModule = getBuffer();
  if (typeof btoa === 'function') {
    let binary = '';
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return btoa(binary);
  }

  if (bufferModule) {
    return bufferModule.from(bytes).toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this environment.');
}

export function decodeBase64(value: string): Uint8Array {
  const bufferModule = getBuffer();
  if (typeof atob === 'function') {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  if (bufferModule) {
    const buffer = bufferModule.from(value, 'base64');
    return new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  }

  throw new Error('Base64 decoding is not supported in this environment.');
}

export function base64UrlEncode(
  input: string | Uint8Array | ArrayBuffer,
): string {
  const bytes = typeof input === 'string' ? textEncoder.encode(input) : toUint8Array(input);
  return encodeBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return decodeBase64(padded);
}

export function utf8Encode(value: string): Uint8Array {
  return textEncoder.encode(value);
}

export function utf8Decode(bytes: Uint8Array): string {
  return textDecoder.decode(bytes);
}

