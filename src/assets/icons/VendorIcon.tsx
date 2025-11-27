import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { memo } from 'react';

interface Props {
  focus?: boolean;
  width?: string;
  height?: string;
}
const SvgComponent = ({ focus, width, height }: Props) => (
  <Svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    // @ts-ignore
    xmlns='http://www.w3.org/2000/svg'>
    <Path
      d='M18 22.4999V19.4999H15V17.9999H18V14.9999H19.5V17.9999H22.5V19.4999H19.5V22.4999H18V22.4999ZM2.6154 19.7499V13.7499H1.5V12.25L2.57695 7.25H16.9231L18 12.25V13.7499H16.8846V16.8846H15.3846V13.7499H11.1154V19.7499H2.6154ZM4.11538 18.25H9.6154V13.7499H4.11538V18.25ZM2.57695 5.74995V4.25H16.9231V5.74995H2.57695ZM3.03075 12.25H16.4693L15.7058 8.74995H3.79423L3.03075 12.25Z'
      fill='#05091C'
    />
  </Svg>
);

const VendorIcon = memo(SvgComponent);
export default VendorIcon;
