/** Conversões de cor usadas na página "Sobre o projeto" (blocos 1B e 1D). */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)) as [number, number, number];
}

export function toBinary8(value: number): string {
  return value.toString(2).padStart(8, "0");
}
