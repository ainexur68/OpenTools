const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const charToIndex = base64Alphabet.split("").reduce<Record<string, number>>((acc, char, index) => {
  acc[char] = index;
  return acc;
}, {});

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const sampleBase64Data = {
  plain: "OpenTools rocks!",
  encoded: "T3BlblRvb2xzIHJvY2tzIQ=="
} as const;

export const encodeTextToBase64 = (text: string): string => {
  const bytes = textEncoder.encode(text);
  if (bytes.length === 0) {
    return "";
  }

  let result = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const byte1 = bytes[index];
    const byte2 = index + 1 < bytes.length ? bytes[index + 1] : 0;
    const byte3 = index + 2 < bytes.length ? bytes[index + 2] : 0;

    const buffer = (byte1 << 16) | (byte2 << 8) | byte3;

    const first = (buffer >> 18) & 0x3f;
    const second = (buffer >> 12) & 0x3f;
    const third = (buffer >> 6) & 0x3f;
    const fourth = buffer & 0x3f;

    result += base64Alphabet[first];
    result += base64Alphabet[second];
    result += index + 1 < bytes.length ? base64Alphabet[third] : "=";
    result += index + 2 < bytes.length ? base64Alphabet[fourth] : "=";
  }

  return result;
};

const sanitizeBase64 = (value: string): string => value.replace(/\s+/g, "");

const getPaddingLength = (value: string): number => {
  if (value.endsWith("==")) {
    return 2;
  }
  if (value.endsWith("=")) {
    return 1;
  }
  return 0;
};

export const decodeBase64ToText = (value: string): string => {
  const normalized = sanitizeBase64(value);
  if (!normalized) {
    return "";
  }

  if (normalized.length % 4 !== 0) {
    throw new Error("Base64 长度必须是 4 的倍数。");
  }

  const firstPaddingIndex = normalized.indexOf("=");
  if (firstPaddingIndex !== -1 && firstPaddingIndex < normalized.length - 2) {
    throw new Error("无效的 Base64 字符串：填充符号位置错误。");
  }

  for (const char of normalized) {
    if (char === "=") {
      continue;
    }
    if (!(char in charToIndex)) {
      throw new Error(`包含非法字符：${char}`);
    }
  }

  const paddingLength = getPaddingLength(normalized);
  const outputLength = (normalized.length / 4) * 3 - paddingLength;
  const output = new Uint8Array(outputLength);

  let outputIndex = 0;

  for (let index = 0; index < normalized.length; index += 4) {
    const char1 = normalized[index];
    const char2 = normalized[index + 1];
    const char3 = normalized[index + 2];
    const char4 = normalized[index + 3];

    const value1 = charToIndex[char1] ?? 0;
    const value2 = charToIndex[char2] ?? 0;
    const value3 = char3 === "=" ? 0 : charToIndex[char3] ?? -1;
    const value4 = char4 === "=" ? 0 : charToIndex[char4] ?? -1;

    if (value3 === -1 || value4 === -1) {
      throw new Error("包含非法字符或填充错误。");
    }

    const buffer = (value1 << 18) | (value2 << 12) | (value3 << 6) | value4;

    if (outputIndex < outputLength) {
      output[outputIndex++] = (buffer >> 16) & 0xff;
    }
    if (outputIndex < outputLength) {
      output[outputIndex++] = (buffer >> 8) & 0xff;
    }
    if (outputIndex < outputLength) {
      output[outputIndex++] = buffer & 0xff;
    }
  }

  return textDecoder.decode(output);
};
