import {
  ActivityIndicator,
  Image,
  Modal,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import RNText from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import RNButton from '../Button';
import { useAppSelector } from '@/hooks';
import { selectCardDetails } from '@/redux/slices/authSlice';
import { copyToClipboard } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RNBackdrop from '../BackDrop';
import RNScrollView from '../ScrollView';
import Checkbox from 'expo-checkbox';
//@ts-ignore
import OTPTextInput from 'react-native-otp-textinput';

const DebitCards = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [showLoading, setshowLoading] = React.useState(false);
  const [isChecked, setisChecked] = React.useState(false);
  const [pin, setpin] = React.useState('');
  const modalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ['25%', '60%'], []);
  const handleClose = () => {
    modalRef.current?.close();
  };
  const showSpinner = () => {
    setshowLoading(true);
  };
  React.useEffect(() => {
    if (showLoading === true) {
      setTimeout(() => {
        setshowLoading(false);
        navigation.navigate('Home');
      }, 8000);
    }
  }, [showLoading]);

  React.useEffect(() => {
    if (pin.length === 4) {
      handleClose();
      showSpinner();
    }
  }, [pin]);

  return (
    <View style={tw`mt-3`}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showLoading}
        onRequestClose={() => setshowLoading(false)}>
        <View style={tw`flex-1 items-center justify-center bg-[#8c8c8c80]`}>
          <LottieView
            source={require('../../assets/animations/loadingfly.json')}
            style={tw` h-60 w-60`}
            autoPlay
          />
        </View>
      </Modal>

      <BottomSheetModal
        backdropComponent={(backdropProps) => (
          <RNBackdrop {...backdropProps} close={handleClose} />
        )}
        backgroundStyle={{ borderRadius: 30, backgroundColor: '#fff' }}
        handleIndicatorStyle={{
          backgroundColor: '#ffff',
          width: 80,
          height: 5,
        }}
        ref={modalRef}
        index={1}
        snapPoints={snapPoints}>
        <View style={tw`pb-6 px-5 h-full flex-1`}>
          <View style={tw`flex flex-1 flex-col`}>
            <RNScrollView>
              <RNText
                style={tw`text-lg mb-6 mt-4`}
                font='outfitbold'
                theme='black'
                align='center'>
                Enter transaction pin
              </RNText>
              <OTPTextInput
                autoFocus
                handleTextChange={(text: string) => {
                  setpin(text);
                }}
                textInputStyle={tw`border border-b rounded-[8px] bg-white`}
                tintColor={colors.primary}
                containerStyle={tw``}
                inputCount={4}
                keyboardType='numeric'
              />
            </RNScrollView>
          </View>
        </View>
      </BottomSheetModal>
      <TouchableOpacity
        onPress={() => modalRef.current?.present()}
        style={tw`flex-row items-center justify-between py-3 border-[1px] rounded-md px-3 border-gray-200 w-full`}>
        <View style={tw`flex flex-row items-center`}>
          <Checkbox
            color={colors.primary}
            style={tw`h-4 w-4 rounded-full mr-2`}
            value={isChecked}
            onValueChange={() => setisChecked(!isChecked)}
          />
          <Image source={require('@/assets/images/fcmb.png')} />
          <View style={tw`px-4`}>
            <RNText style={tw``} size='sm' font='outfitsemi' theme='black'>
              5199**********11
            </RNText>
            <RNText style={tw``} size='sm' theme='secondary'>
              First City Monument Bank
            </RNText>
            <RNText style={tw``} size='sm' theme='secondary'>
              Salary account card
            </RNText>
          </View>
        </View>
        <View style={tw``}></View>
      </TouchableOpacity>
    </View>
  );
};

export default DebitCards;
