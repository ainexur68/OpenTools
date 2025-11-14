export type SupportedHashAlgorithm = "MD5" | "SHA-1" | "SHA-256";

const shiftAmounts = new Uint8Array([
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
]);

const kTable = new Uint32Array(64);

for (let index = 0; index < 64; index += 1) {
  kTable[index] = Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000);
}

const leftRotate = (value: number, amount: number): number =>
  ((value << amount) | (value >>> (32 - amount))) >>> 0;

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const md5Digest = (message: string): string => {
  const encoder = new TextEncoder();
  const input = encoder.encode(message);
  const bitLength = input.length * 8;

  const totalLength = input.length + 1;
  const modulo = totalLength % 64;
  const paddingLength = modulo <= 56 ? 56 - modulo : 56 + (64 - modulo);
  const paddedLength = totalLength + paddingLength + 8;

  const buffer = new ArrayBuffer(paddedLength);
  const padded = new Uint8Array(buffer);
  padded.set(input);
  padded[input.length] = 0x80;

  const view = new DataView(buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const chunkCount = paddedLength / 64;

  for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex += 1) {
    const offset = chunkIndex * 64;
    const m = new Uint32Array(16);

    for (let i = 0; i < 16; i += 1) {
      m[i] = view.getUint32(offset + i * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const sum = (a + f + kTable[i] + m[g]) >>> 0;
      b = (b + leftRotate(sum, shiftAmounts[i])) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new Uint8Array(16);
  const outputView = new DataView(output.buffer);
  outputView.setUint32(0, a0, true);
  outputView.setUint32(4, b0, true);
  outputView.setUint32(8, c0, true);
  outputView.setUint32(12, d0, true);

  return toHex(output);
};

const subtleDigest = async (algorithm: Exclude<SupportedHashAlgorithm, "MD5">, message: string): Promise<string> => {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("当前环境不支持 Web Crypto API");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return toHex(new Uint8Array(buffer));
};

export const computeHash = async (algorithm: SupportedHashAlgorithm, message: string): Promise<string> => {
  if (algorithm === "MD5") {
    return md5Digest(message);
  }

  return subtleDigest(algorithm, message);
};

export const initialHashResult = <T extends readonly SupportedHashAlgorithm[]>(algorithms: T) => {
  return algorithms.reduce<Record<T[number], string>>((acc, item) => {
    const key = item as T[number];
    acc[key] = "";
    return acc;
  }, {} as Record<T[number], string>);
};
