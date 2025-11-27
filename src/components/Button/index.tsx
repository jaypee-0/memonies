import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ColorKeys, colors } from '@/theme/colors';
import { ParamListBase } from '@/navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
//@ts-ignore
import _ from 'lodash';

interface CustomButtonProps {
  key?: number;
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: 'primary' | 'black' | 'white' | 'transparent';
  navigate?: string;
  linearborder?: boolean;
  naked?: boolean;
  nakedTextColor?: ColorKeys;
  orientation?: 'center' | 'right';
  font?: string;
  throttleTime?: number;
  debounceTime?: number;
  disable?: boolean;
  icon?: any;
}

const RNButton: React.FC<CustomButtonProps> = ({
  key,
  title,
  onPress,
  style,
  textStyle,
  theme,
  navigate,
  linearborder,
  naked,
  nakedTextColor,
  orientation,
  font,
  throttleTime,
  debounceTime,
  disable,
  icon,
  ...props
}) => {
  useDeviceContext(tw);
  const navigation: NavigationProp<ParamListBase> | any = useNavigation();

  const [isThrottled, setIsThrottled] = useState(false);
  const [isDebounced, setIsDebounced] = useState(false);
  const [isDisabled, setisDisabled] = useState(isDebounced);
  const handlePressThrottled = _.throttle(() => {
    if (!isThrottled) {
      setIsThrottled(true);
      setisDisabled(true);
      onPress?.();
      setTimeout(() => {
        setIsThrottled(false);
        setisDisabled(false);
      }, throttleTime || 1000);
    }
  }, throttleTime || 1000);

  const handlePressDebounced = _.debounce(() => {
    setIsDebounced(true);
    setisDisabled(true);
    onPress?.();
    setTimeout(() => {
      setIsDebounced(false);
      setisDisabled(false);
    }, debounceTime || 1000);
  }, 1);

  React.useEffect(() => {
    if (disable) {
      setisDisabled(true);
    } else {
      setisDisabled(false);
    }
  }, [disable]);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme ? colors[theme] : colors.primary,
      borderRadius: 4,
      height: 52,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '800',
      fontFamily: 'Outfit-Medium',
    },
    innerContainer: {
      borderRadius: 50,
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      margin: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      width: '99.5%',
    },
    nakedbuttonText: {
      color: nakedTextColor ? colors[nakedTextColor] : colors.deepgreen,
      textDecorationLine: !orientation ? 'underline' : 'none',
      fontSize: 18,
    },
  });

  return (
    <TouchableOpacity
      key={key}
      style={[
        naked
          ? style
          : [
              styles.button,
              {
                backgroundColor: isDisabled
                  ? '#CBD1D7'
                  : theme
                  ? colors[theme]
                  : colors.primary,
              },
            ],
        style,
      ]}
      disabled={isDisabled}
      onPress={
        navigate
          ? () => navigation.navigate(navigate)
          : () => {
              if (throttleTime) {
                handlePressThrottled();
              }
              handlePressDebounced();
            }
      }
      {...props}>
      {isDebounced ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={tw`flex flex-row items-center gap-x-2`}>
          {icon && icon}
          <Text
            style={[
              naked ? styles.nakedbuttonText : styles.buttonText,
              textStyle,
              {
                textAlign: orientation ? orientation : 'left',
              },
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RNButton;
