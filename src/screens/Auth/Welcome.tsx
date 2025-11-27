import React, { useRef, useEffect } from 'react';
import { View, ImageBackground, Animated, StyleSheet } from 'react-native';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import RNText from '@/components/Text';
import RNButton from '@/components/Button';
import { useAppDispatch } from '@/hooks';
import LogoIcon from '@/assets/icons/LogoIcon';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

interface Params {
  route: {
    params?: {
      organization?: string;
    };
  };
}

const Welcome = ({ route }: Params) => {
  useDeviceContext(tw);
  const bg = require('@/assets/images/onboarding.png');
  const scrollX = useRef(new Animated.Value(0)).current;
  const { organization } = route.params ?? {};
  const navigation: any = useNavigation();

  useEffect(() => {
    const scrollAnimation = Animated.timing(scrollX, {
      toValue: 1,
      duration: 9000,
      useNativeDriver: true,
      isInteraction: false,
    });

    const startAnimation = () => {
      Animated.loop(scrollAnimation).start();
    };

    startAnimation();
  }, [scrollX]);

  const words = [
    'Daily salary',
    '٭',
    'Clock in/out',
    '٭',
    'Attendance',
    '٭',
    'Wallet payouts',
    '٭',
    'Employer tools',
    '٭',
    'Daily salary',
    '٭',
    'Clock in/out',
    '٭',
    'Attendance',
    '٭',
    'Wallet payouts',
    '٭',
    'Employer tools',
  ];

  return (
    <View style={tw`flex-1 relative z-30 flex flex-col`}>
      <ImageBackground
        source={bg}
        style={tw`w-full h-full flex-1`}
        resizeMode='cover'>
        <View
          style={[
            tw`flex-1 mt-[${responsiveScreenHeight(18)}]`,
            {
              transform: [
                {
                  rotate: '-21deg',
                },
              ],
            },
          ]}>
          <Animated.View
            style={[
              tw`flex flex-row justify-center items-center px-6 gap-x-4`,
              {
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, -100],
                    }),
                  },
                ],
              },
            ]}>
            {words.map((word, index) => (
              <RNText key={index} theme='white' size='lg' font='outfitbold'>
                {word}
              </RNText>
            ))}
          </Animated.View>
        </View>
        <View style={tw`mt-auto px-6 mb-10 gap-y-8`}>
          <LogoIcon />
          {organization ? (
            <View>
              <RNText theme='white' size='lg' font='outfitbold'>
                Welcome to {organization}
              </RNText>
              <RNText theme='white' size='sm' style={tw`mt-1 opacity-80`}>
                Your all in one platform.
              </RNText>
            </View>
          ) : (
            <RNText theme='white' size='lg' font='outfitbold'>
              Your all in one platform.
            </RNText>
          )}
          <View style={tw`flex flex-row justify-between`}>
            <RNButton
              title='Log in'
              navigate='Login'
              style={tw`w-[48%] border border-white`}
              theme='transparent'
            />
            {/* <RNButton
              title='Sign up'
              onPress={() => navigation.navigate('Signup', { organization })}
              style={tw`w-[48%]`}
              theme='white'
              textStyle={tw`text-black`}
            /> */}
            <RNButton
              title='Sign up'
              onPress={() => navigation.navigate('OrganizationInput', { organization })}
              style={tw`w-[48%]`}
              theme='white'
              textStyle={tw`text-black`}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default Welcome;
