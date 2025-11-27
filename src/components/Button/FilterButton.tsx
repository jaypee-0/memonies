import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import RNText from '../Text';
import FilterIcon from '@/assets/icons/FilterIcon';

interface CustomButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const FilterButton: React.FC<CustomButtonProps> = ({
  onPress,
  style,
  ...props
}) => {
  useDeviceContext(tw);

  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      style={tw`rounded-full border-[1px] border-graylighter px-3 py-1 flex flex-row items-center justify-between gap-x-2`}>
      <RNText theme='black' size='sm' style={tw`my-auto`}>
        Filter
      </RNText>
      <FilterIcon />
    </TouchableOpacity>
  );
};

export default FilterButton;
