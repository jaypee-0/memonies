import Layout from '@/components/Layout';
import { useDeviceContext } from 'twrnc';
import { useAppSelector } from '@/hooks';
import { selectToken } from '@/redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import tw from '@/lib/tailwind';
import RNText from '@/components/Text';
import { Text, View } from 'react-native';
import RNButton from '@/components/Button';
import NetInfo from '@react-native-community/netinfo';

const NoNetwork = () => {
  useDeviceContext(tw);
  let isTokenPresent = useAppSelector(selectToken);
  const navigation:any = useNavigation();
  const [visible, setVisible] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const unSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
    unSub();
  }, []);

  console.log(visible, 'visible')
  React.useEffect(() => {
    if (visible) {
      isTokenPresent
        ? navigation.navigate('Bottom')
        : navigation.navigate('Welcome');
    }
  }, [visible]);

  return (
    <Layout>
      <View style={tw`flex-1 flex flex-col items-center justify-center`}>
        <Feather name='wifi-off' size={100} color='#D8D8D8' />
        <RNText size='lg' theme='black' font='outfitbold' style={tw`my-4`}>
          You're offline
        </RNText>
        <RNText style={tw`max-w-[60%]`} align='center'>
          Please check your connection and try again
        </RNText>
        <RNButton
          title='Retry'
          style={tw`mt-4 rounded-full h-[40px]`}
          onPress={() =>
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                isTokenPresent
                  ? navigation.navigate('Bottom')
                  : navigation.navigate('Welcome');
              }
            })
          }
        />
      </View>
    </Layout>
  );
};

export default NoNetwork;
