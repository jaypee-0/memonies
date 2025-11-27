import tw from '@/lib/tailwind';
import { View, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { setToken, setUserDetails } from '@/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/hooks';
import Layout from '@/components/Layout';
import RNText from '@/components/Text';
import RNTinput from '@/components/TextField';
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import RNButton from '@/components/Button';
import { useDeviceContext } from 'twrnc';
import { areAllValuesPresent } from '@/utils';
import { loginApi } from '@/utils/api';
import { useMutation } from 'react-query';
import axios from 'axios';
import ToggleSwitch from "toggle-switch-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { colors } from '@/theme/colors';

interface User {
  phone: string;
  password: string;
}

const Login = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState(true);
  const [user, setUser] = React.useState<User>({
    phone: '',
    password: '',
  });
  const [forma, setForma] = React.useState({
    phone: "",
    password: "",
  });
  const [checked, setchecked] = React.useState(false);

  const loginMutation = useMutation(loginApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        Alert.alert('Error', JSON.stringify(error.response?.data?.message || "Server error").replace(/"/g, ''))
      } else {
        Alert.alert('Error', 'Error signing in, please try again');
      }
    },
    onSuccess: async (data: any) => {
      if (data?.user?.kyc?.bvn?.status === 'PENDING' ) {
        // move to kyc page
        navigation.navigate('Signup', { stage: 3});
      }
      else if (data?.user?.pinStatus === 'PENDING') {
        // move to pin page
        navigation.navigate('Signup', { stage: 4});
      } else {
        dispatch(setToken(data?.token?.accessToken));
        await AsyncStorage.setItem('token', data?.token?.accessToken);
        dispatch(
          setUserDetails(data?.user)
        );
      }
    },
  });

  const handleSubmit = async () => {
    if (checked) {
      handleStoreDetails();
    }
    loginMutation.mutate({
      identifier: String(user.phone),
      password: String(user.password),
    });
  };

  const handleChange = (name: any, value: any) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [isBiometricSupported, setisBiometricSupported] = React.useState(false);

  React.useLayoutEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setisBiometricSupported(compatible);
    })();
  }, []);
  React.useEffect(() => {
    (async () => {
      let persisted_phone: string = (await AsyncStorage.getItem("phone")) ?? "";
      let persisted_pass: string =
        (await AsyncStorage.getItem("password")) ?? "";
      setForma({
        phone: persisted_phone,
        password: persisted_pass,
      });
    })();
  }, []);

  async function handleStoreDetails() {
    await AsyncStorage.setItem("phone", user.phone);
    await AsyncStorage.setItem("password", user.password);
    await AsyncStorage.setItem("biometric_enabled", "true");

  }
  const handleLogin = async (phone: string, password: string) => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill all fields")
    } else {
      if (checked) {
        handleStoreDetails();
      }
      loginMutation.mutate({
        identifier: String(phone),
        password: String(password),
      });
    }
  };
  async function clickBiometric() {
    if (isBiometricSupported) {
      await LocalAuthentication.authenticateAsync({
        promptMessage: "Login to Memonies with your biometrics",
      }).then(async (response) => {
        if (response.success) {
          const persisted_phone: string =
            (await AsyncStorage.getItem("phone")) ?? "";
          const persisted_password: string =
            (await AsyncStorage.getItem("password")) ?? "";
          setUser({phone: persisted_phone, password: persisted_password});
          await handleLogin(persisted_phone, persisted_password);
        } else {
          //setisBiometricSupported(false);
        }
      });
    }
  }

  console.log(isBiometricSupported, forma, checked)
  return (
    <View style={tw`flex-1 bg-white`}>
      <Layout header headerBackFunc={() => navigation.navigate('Welcome')}>
        <View style={tw`flex-1 `}>
          <View style={tw`flex flex-row items-center gap-x-2`}>
            <RNText size='lg' font='outfitmedium'>
              Welcome to Memonies
            </RNText>
          </View>
          <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
            <RNText theme='black' style={tw``} size='sm'>
              Enter your details below to continue
            </RNText>
          </View>

          <View style={tw`w-full flex flex-col relative mt-8`}>
            <>
              <RNTinput
                label='Phone number'
                placeholder='070 0000 3490'
                keyboardType='phone-pad'
                maxLength={11}
                onChangeText={(text: string) => handleChange('phone', text)}
                value={user.phone}
              />

              <View style={tw`relative mt-2`}>
                <RNTinput
                  label='Password'
                  onChangeText={(text: string) =>
                    handleChange('password', text)
                  }
                  value={user.password}
                  placeholder='Hello!@23456'
                  secureTextEntry={showPassword}
                />
                <FontAwesome
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={24}
                  color={'#CBD1D7'}
                  onPress={() => setShowPassword(!showPassword)}
                  style={tw`absolute right-0 bottom-[30%] flex flex-row items-center justify-center w-10`}
                />
              </View>
              <RNButton
                naked
                nakedTextColor='primary'
                title='Forgot password?'
                navigate='ForgotPassword'
                style={tw`mt-0 mb-5`}
                textStyle={tw`text-sm`}
              />
                {isBiometricSupported && !forma.phone && !forma.password && (
              <View style={tw`flex flex-row items-center gap-x-2 mb-5`}>
                <ToggleSwitch
                  isOn={Boolean(checked)}
                  onColor={colors.primary}
                  offColor="#B4B7BD"
                  size="medium"
                  onToggle={() => {
                    setchecked(!checked);
                  }}
                />
                <RNText size='md'>Remember me</RNText>
              </View>
            )}
            {isBiometricSupported && forma.phone && forma.password && (
              <TouchableOpacity style={tw`flex flex-row items-center -mt-4 gap-x-2 mb-6 mt-2`} onPress={clickBiometric}>
          
               <Entypo name="fingerprint" size={35} color={colors.primary} />
                <RNText size='md'>Use biometric </RNText>
              </TouchableOpacity>
            )}

              <RNButton
                disable={!areAllValuesPresent(user) || loginMutation.isLoading}
                title='Continue'
                debounceTime={4000}
                onPress={handleSubmit}
              />

              {/* <View
                style={tw`flex flex-row items-center gap-x-1 mt-4 justify-center`}>
                <RNText theme='secondary' style={tw``} size='sm'>
                  Don't have a Memonies account?
                </RNText>
                <RNButton
                  title='Sign up'
                  navigate='Signup'
                  naked
                  nakedTextColor='primary'
                  textStyle={tw`text-md mb-2`}
                />
              </View> */}
            </>
          </View>
        </View>
      </Layout>
    </View>
  );
};

export default Login;
