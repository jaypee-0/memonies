import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { memo } from 'react';
import { colors } from '@/theme/colors';

interface Props {
  focus?: boolean;
  color?: string;
}
const SvgComponent = ({focus, color}: Props) => (
  <Svg
    width='23'
    height='23'
    viewBox='0 0 23 23'
    fill='none'
    // @ts-ignore
    xmlns='http://www.w3.org/2000/svg'>
    <Path
      d='M18.7072 17.293C18.3167 16.9025 17.6835 16.9025 17.293 17.293C16.9024 17.6835 16.9024 18.3167 17.293 18.7072L18.7072 17.293ZM21.2928 22.7071C21.6834 23.0977 22.3165 23.0977 22.7071 22.7072C23.0976 22.3166 23.0976 21.6835 22.7071 21.2929L21.2928 22.7071ZM17.293 18.7072L21.2928 22.7071L22.7071 21.2929L18.7072 17.293L17.293 18.7072ZM10 18C5.58172 18 2 14.4183 2 10H0C0 15.5228 4.47715 20 10 20V18ZM18 10C18 14.4183 14.4183 18 10 18V20C15.5228 20 20 15.5228 20 10H18ZM10 2C14.4183 2 18 5.58172 18 10H20C20 4.47715 15.5228 0 10 0V2ZM10 0C4.47715 0 0 4.47715 0 10H2C2 5.58172 5.58172 2 10 2V0Z'
      fill={color?color:(focus ? colors.primary : colors.secondary)}
    />
  </Svg>
);

const SearchIcon = memo(SvgComponent);
export default SearchIcon;
