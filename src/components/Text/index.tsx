import { ColorKeys, colors } from '@/theme/colors';
import { Fontkeys, fonts } from '@/theme/fonts';
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';

interface Props {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  size?: 'sm' | 'md' | 'lg' | 'smB' | 'lgl';
  theme?: ColorKeys;
  noLines?: number;
  mB?: boolean;
  align?: 'center' | 'left' | 'right';
  font?: Fontkeys;
}

const RNText: React.FC<Props> = ({
  children,
  style,
  size,
  theme,
  noLines,
  mB,
  align,
  font,
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: responsiveScreenFontSize(1.95),
      color: '#000000',
      fontFamily: font ? fonts[font] : fonts.outfitlight,
      fontWeight: '600',
    },
    textGray: {
      fontSize: 16,
      color: '#637381',
    },
    bigText: {
      fontSize: responsiveScreenFontSize(3.3),
      color: '#000000',
      fontFamily: fonts.outfitmedium,
      lineHeight: 32,
    },
    smallText: {
      fontSize: responsiveScreenFontSize(1.65),
      fontWeight: '400',
      marginBottom: 4,
      lineHeight: 22,
    },
    smallTextB: {
      fontSize: responsiveScreenFontSize(1.7),
      fontWeight: '900',
      marginBottom: mB ? 0 : 4,
      lineHeight: 22,
    },
    mediumText: {
      fontSize: responsiveScreenFontSize(2.2),
      fontWeight: '700',
      lineHeight: 28,
    },
    bigLightText: {
      fontSize: 28,
      fontFamily: font ? fonts[font] : fonts.outfitbold,
      lineHeight: 32,
      marginTop: 5,
    },
  });
  return (
    <Text
      style={[
        styles.text,
        size == 'lg' && styles.bigText,
        size == 'sm' && styles.smallText,
        size == 'smB' && styles.smallTextB,
        size == 'md' && styles.mediumText,
        size == 'lgl' && styles.bigLightText,
        theme && {
          color: colors[theme]
        },
        { textAlign: align ? align : 'left' },
        style,
      ]}
      numberOfLines={noLines}>
      {children}
    </Text>
  );
};

export default RNText;
