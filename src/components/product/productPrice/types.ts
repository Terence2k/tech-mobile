import { CSSProperties } from 'react';

export interface IProps {
  style?: CSSProperties,
  // 价格
  price: number,
  // 划线格
  originalPrice: number,
  // 免费
  free: boolean,
}
