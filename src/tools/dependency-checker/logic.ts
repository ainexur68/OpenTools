export type PackageManager = "npm" | "pnpm" | "yarn";

export interface PackageInfo {
  readonly name: string;
  readonly version?: string;
}

export interface DependencyDiffResult {
  readonly missing: PackageInfo[];
  readonly extra: PackageInfo[];
  readonly installCommand: string | null;
}

export interface DependencyAnalysis {
  readonly runtime: DependencyDiffResult;
  readonly dev: DependencyDiffResult;
}

export interface AnalyzeDependencyOptions {
  readonly runtimeExpected: string;
  readonly runtimeInstalled: string;
  readonly devExpected: string;
  readonly devInstalled: string;
  readonly manager: PackageManager;
}

const stripQuotes = (value: string): string => value.replace(/^['"`]/, "").replace(/['"`]$/, "");

const parseDependencyText = (text: string): Map<string, string | undefined> => {
  const trimmed = text.trim();

  if (!trimmed) {
    return new Map();
  }

  const parseObject = (value: unknown): Map<string, string | undefined> => {
    const entries = new Map<string, string | undefined>();

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          const spec = parseSpecLine(item);
          entries.set(spec.name, spec.version);
        }
      });
      return entries;
    }

    if (value && typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(([name, maybeVersion]) => {
        entries.set(name, typeof maybeVersion === "string" && maybeVersion.trim() ? maybeVersion.trim() : undefined);
      });
    }

    return entries;
  };

  const parseSpecLine = (line: string): PackageInfo => {
    const cleaned = line.trim().replace(/,$/, "");

    if (!cleaned) {
      return { name: "", version: undefined };
    }

    const colonIndex = cleaned.indexOf(":");
    if (colonIndex > -1) {
      const key = stripQuotes(cleaned.slice(0, colonIndex).trim());
      const value = stripQuotes(cleaned.slice(colonIndex + 1).trim());
      return { name: key, version: value || undefined };
    }

    const lastAtIndex = cleaned.lastIndexOf("@");

    if (lastAtIndex > 0) {
      const name = cleaned.slice(0, lastAtIndex);
      const version = cleaned.slice(lastAtIndex + 1);
      return { name: stripQuotes(name), version: stripQuotes(version) || undefined };
    }

    return { name: stripQuotes(cleaned), version: undefined };
  };

  try {
    const parsed = JSON.parse(trimmed);
    return parseObject(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // fall through to manual parsing
    } else {
      console.warn("解析依赖文本失败", error);
    }
  }

  const entries = new Map<string, string | undefined>();
  trimmed.split(/\r?\n/).forEach((line) => {
    const spec = parseSpecLine(line);
    if (spec.name) {
      entries.set(spec.name, spec.version);
    }
  });

  return entries;
};

const diffDependencies = (
  expected: Map<string, string | undefined>,
  installed: Map<string, string | undefined>
): { missing: PackageInfo[]; extra: PackageInfo[] } => {
  const missing: PackageInfo[] = [];
  const extra: PackageInfo[] = [];

  expected.forEach((version, name) => {
    if (!installed.has(name)) {
      missing.push({ name, version });
    }
  });

  installed.forEach((version, name) => {
    if (!expected.has(name)) {
      extra.push({ name, version });
    }
  });

  missing.sort((a, b) => a.name.localeCompare(b.name));
  extra.sort((a, b) => a.name.localeCompare(b.name));

  return { missing, extra };
};

const formatPackageSpec = (item: PackageInfo): string => {
  return item.version && item.version !== "*" ? `${item.name}@${item.version}` : item.name;
};

const commandTemplates: Record<PackageManager, { runtime: string; dev: string }> = {
  npm: {
    runtime: "npm install",
    dev: "npm install -D"
  },
  pnpm: {
    runtime: "pnpm add",
    dev: "pnpm add -D"
  },
  yarn: {
    runtime: "yarn add",
    dev: "yarn add -D"
  }
};

export const buildInstallCommand = (
  manager: PackageManager,
  packages: PackageInfo[],
  isDev: boolean
): string | null => {
  if (packages.length === 0) {
    return null;
  }

  const template = commandTemplates[manager][isDev ? "dev" : "runtime"];
  const specs = packages.map(formatPackageSpec).join(" ");
  return `${template} ${specs}`.trim();
};

const analyzeGroup = (
  expectedText: string,
  installedText: string,
  manager: PackageManager,
  isDev: boolean
): DependencyDiffResult => {
  const expected = parseDependencyText(expectedText);
  const installed = parseDependencyText(installedText);

  const { missing, extra } = diffDependencies(expected, installed);
  const installCommand = buildInstallCommand(manager, missing, isDev);

  return {
    missing,
    extra,
    installCommand
  };
};

export const analyzeDependencies = (options: AnalyzeDependencyOptions): DependencyAnalysis => {
  return {
    runtime: analyzeGroup(options.runtimeExpected, options.runtimeInstalled, options.manager, false),
    dev: analyzeGroup(options.devExpected, options.devInstalled, options.manager, true)
  };
};

export const getDisplayList = (items: PackageInfo[]): string[] =>
  items.map((item) => formatPackageSpec(item));
