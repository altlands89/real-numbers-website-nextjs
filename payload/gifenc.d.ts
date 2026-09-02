declare module "gifenc" {
  export type Palette = number[][];

  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: { palette?: Palette; first?: boolean; transparent?: boolean; transparentIndex?: number; delay?: number; repeat?: number },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }

  // gifenc ships an esbuild CJS bundle with no `exports` map, so under
  // this project's ESM ("type": "module") it resolves as a single
  // `default` export bag rather than real named exports — destructure
  // from the default instead of importing these names directly.
  const gifenc: {
    quantize(
      rgba: Uint8Array | Uint8ClampedArray,
      maxColors: number,
      options?: { format?: "rgb565" | "rgb444" | "rgba4444"; oneBitAlpha?: boolean | number; clearAlpha?: boolean; clearAlphaThreshold?: number; clearAlphaColor?: number },
    ): Palette;
    applyPalette(rgba: Uint8Array | Uint8ClampedArray, palette: Palette, format?: "rgb565" | "rgb444" | "rgba4444"): Uint8Array;
    GIFEncoder(opts?: { auto?: boolean; initialCapacity?: number }): GIFEncoderInstance;
  };
  export default gifenc;
}
