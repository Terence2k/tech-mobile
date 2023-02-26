export interface DimensionObject {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
}

export type UseDimensionsHook = [
  (node: HTMLDivElement) => void,
  {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
  } | DimensionObject,
  HTMLDivElement | undefined
];

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}