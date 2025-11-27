import React from 'react';
import { colors } from '@/theme/colors';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import RNText from '../Text';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import { Fontkeys, fonts } from '@/theme/fonts';

interface CustomTextFieldProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  font?: Fontkeys;
  onFocus?: () => void;
  canEdit?: boolean;
  label?: string;
}

const RNTinput: React.FC<CustomTextFieldProps> = ({
  onFocus,
  style,
  font,
  canEdit,
  label,
  ...props
}) => {
  useDeviceContext(tw);
  const [focus, setFocus] = React.useState<boolean>(false);

  return (
    <View>
      {label && (
        <RNText theme='black' size='sm' font={'outfitregular'} style={tw`mb-1`}>
          {label}
        </RNText>
      )}
      <TextInput
        {...props}
        style={[
          styles.textInput,
          focus ? styles.inputOnFocus : styles.inputOnBlur,
          {
            fontFamily: font ? font : fonts.outfitregular,
            backgroundColor: canEdit ? '#F9FAFB' : '#ffffff',
            color: canEdit ? '#BDBDBD' : '#000000',
          },
          style,
        ]}
        editable={canEdit ? false : true}
        placeholderTextColor='#637381'
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => setFocus(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: '#000000',
    borderColor: '#D7DBE0',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    paddingVertical: 14,
    width: '100%',
    minHeight: Platform.OS === 'android' ? 45 : 50,
    maxHeight: Platform.OS === 'android' ? 50 : 60,
  },
  inputOnFocus: {
    borderColor: colors.primary,
    borderWidth: 2
  },
  inputOnBlur: { borderColor: '#D7DBE0' },
});
export default RNTinput;
