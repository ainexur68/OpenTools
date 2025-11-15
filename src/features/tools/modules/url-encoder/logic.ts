export type UrlEncodeMode = "component" | "uri";

export interface UrlEncodeOptions {
  readonly mode: UrlEncodeMode;
  readonly encodeSpaceAsPlus: boolean;
}

export interface UrlDecodeOptions {
  readonly treatPlusAsSpace: boolean;
}

export const sampleUrlData = {
  plain: "keyword=OpenTools: URL & Base64!",
  encoded: "keyword=OpenTools%3A+URL+%26+Base64%21"
} as const;

export const encodeUrlText = (value: string, options: UrlEncodeOptions): string => {
  if (!value) {
    return "";
  }

  const { mode, encodeSpaceAsPlus } = options;
  const encoded = mode === "uri" ? encodeURI(value) : encodeURIComponent(value);

  if (!encodeSpaceAsPlus) {
    return encoded;
  }

  return encoded.replace(/%20/g, "+");
};

export const decodeUrlText = (value: string, options: UrlDecodeOptions): string => {
  if (!value) {
    return "";
  }

  const normalized = options.treatPlusAsSpace ? value.replace(/\+/g, " ") : value;

  try {
    return decodeURIComponent(normalized);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || "无法解码 URL 字符串。");
  }
};
