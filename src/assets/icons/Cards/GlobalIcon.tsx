import * as React from 'react';
import Svg, { Path, Circle, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { memo } from 'react';

interface Props {
  focus?: boolean;
  width?: string;
  height?: string;
}
const SvgComponent = ({ focus, width, height }: Props) => (
  <Svg
    width='30'
    height='30'
    viewBox='0 0 30 30'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
    <Circle cx='15' cy='15' r='15' fill='#DB1716' fill-opacity='0.1' />
    <G clip-path='url(#clip0_890_2493)'>
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M12.063 7.95C12.1845 7.67625 12.4553 7.5 12.7553 7.5H18.738C19.3005 7.5 19.6673 8.0925 19.4153 8.5965L17.7135 12H20.232C20.907 12 21.2445 12.816 20.7675 13.293L11.8028 22.2577C11.2373 22.8232 10.2953 22.2412 10.5488 21.483L12.4598 15.75H9.76126C9.63506 15.75 9.51087 15.7185 9.39996 15.6583C9.28905 15.5981 9.19494 15.5111 9.12616 15.4053C9.05739 15.2995 9.01614 15.1782 9.00616 15.0524C8.99618 14.9266 9.01778 14.8003 9.06901 14.685L12.063 7.95Z'
        fill='#DB1716'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_890_2493'>
        <Rect width='18' height='18' fill='white' transform='translate(6 6)' />
      </ClipPath>
    </Defs>
  </Svg>
);

const GlobalIcon = memo(SvgComponent);
export default GlobalIcon;
