const TINTS = [
  { bg: "#E1EEFB", fg: "#0B4F8F" },
  { bg: "#E3F6EC", fg: "#11643C" },
  { bg: "#E7E8FB", fg: "#3438A8" },
  { bg: "#FFF1DB", fg: "#8A4B00" },
  { bg: "#FBE6E8", fg: "#9A1528" },
  { bg: "#E2EBFC", fg: "#0B47B0" },
];

export type CompanyTint = (typeof TINTS)[number];

/** Stable soft colour pair for a company, derived from its name. */
export function getCompanyTint(name: string = ""): CompanyTint {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length];
}

/** Two-letter monogram used when a company has no logo. */
export function getCompanyMonogram(name: string = ""): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
