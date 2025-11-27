import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { memo } from 'react';
import { colors } from '@/theme/colors';

interface Props {
  focus?: boolean;
  color?: string;
}
const SvgComponent = ({ focus, color }: Props) => (
  <Svg
    width='25'
    height='24'
    viewBox='0 0 25 24'
    fill='none'
    // @ts-ignore
    xmlns='http://www.w3.org/2000/svg'>
    <Path
      d='M17.5003 6H7.50027M17.5003 6H18.809C20.8947 6 21.9375 6 22.5338 6.66616C23.13 7.33231 23.0148 8.36879 22.7845 10.4417L22.4887 13.1043C22.0185 17.3356 21.7835 19.4513 20.3597 20.7256C18.9359 22 16.7907 22 12.5003 22C8.20987 22 6.06467 22 4.64087 20.7256C3.21707 19.4513 2.982 17.3356 2.51186 13.1043L2.21601 10.4417C1.98569 8.36879 1.87052 7.33231 2.46676 6.66616C3.063 6 4.10585 6 6.19155 6H7.50027M17.5003 6C17.5003 3.23858 15.2617 1 12.5003 1C9.80703 1 7.61114 3.12938 7.50433 5.79641C7.50163 5.86394 7.50027 5.93181 7.50027 6'
      stroke={color?color:(focus ? colors.primary : colors.secondary)}
      strokeWidth='2'
    />
    <Path
      d='M18.5 10C18.5 10.5523 18.0523 11 17.5 11C16.9477 11 16.5 10.5523 16.5 10C16.5 9.44772 16.9477 9 17.5 9C18.0523 9 18.5 9.44772 18.5 10Z'
      fill={color?color:(focus ? colors.primary : colors.secondary)}
    />
    <Path
      d='M8.5 10C8.5 10.5523 8.05228 11 7.5 11C6.94772 11 6.5 10.5523 6.5 10C6.5 9.44772 6.94772 9 7.5 9C8.05228 9 8.5 9.44772 8.5 10Z'
      fill={color?color:(focus ? colors.primary : colors.secondary)}
    />
  </Svg>
);

const CartIcon = memo(SvgComponent);
export default CartIcon;
