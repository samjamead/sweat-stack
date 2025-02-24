declare module "polyline-encoded" {
  const polyline: {
    decode(str: string): [number, number][];
    encode(coordinates: [number, number][]): string;
  };
  export = polyline;
}
