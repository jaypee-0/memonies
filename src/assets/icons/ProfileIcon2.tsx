import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { memo } from 'react';
import { colors } from '@/theme/colors';

interface Props {
  focus?: boolean;
  width?: string;
  height?: string;
}
const SvgComponent = ({ focus, width, height }: Props) => (
  <Svg
    width={width?width:'25'}
    height={height?height:'24'}
    viewBox='0 0 25 24'
    fill='none'
    // @ts-ignore
    xmlns='http://www.w3.org/2000/svg'>
    <Path
      d='M15.5 6C15.5 7.65685 14.1569 9 12.5 9V11C15.2614 11 17.5 8.76142 17.5 6H15.5ZM12.5 9C10.8431 9 9.5 7.65685 9.5 6H7.5C7.5 8.76142 9.73858 11 12.5 11V9ZM9.5 6C9.5 4.34315 10.8431 3 12.5 3V1C9.73858 1 7.5 3.23858 7.5 6H9.5ZM12.5 3C14.1569 3 15.5 4.34315 15.5 6H17.5C17.5 3.23858 15.2614 1 12.5 1V3ZM9.5 14H15.5V12H9.5V14ZM15.5 20H9.5V22H15.5V20ZM9.5 20C7.84315 20 6.5 18.6569 6.5 17H4.5C4.5 19.7614 6.73858 22 9.5 22V20ZM18.5 17C18.5 18.6569 17.1569 20 15.5 20V22C18.2614 22 20.5 19.7614 20.5 17H18.5ZM15.5 14C17.1569 14 18.5 15.3431 18.5 17H20.5C20.5 14.2386 18.2614 12 15.5 12V14ZM9.5 12C6.73858 12 4.5 14.2386 4.5 17H6.5C6.5 15.3431 7.84315 14 9.5 14V12Z'
      fill={colors.black}
    />
  </Svg>
);

const ProfileIcon2 = memo(SvgComponent);
export default ProfileIcon2;
