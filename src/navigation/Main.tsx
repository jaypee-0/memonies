import React from 'react';
import { Animated, Dimensions, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { moderateVerticalScale } from 'react-native-size-matters';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';
import { colors } from '@/theme/colors';
import {
  Home,
  Profile,
  Attendance,
} from '@/screens/Bottom';
import RNText from '@/components/Text';
import tw from '@/lib/tailwind';
import {
  HomeIcon,
  ProfileIcon,
} from '@/assets/icons';
import {
  Notification,
  SendMoney,
  ReceiveMoney,
  Account,
  TransactionHistory,
  LinkedCards,
  AddCard,
  SendToBankAccount,
  LoginPin,
  PaymentPin,
  PersonalDetails,
  TransactionDetails,
  LoginPassword,
  LoginForgot,
  Mandate,
  DeleteReason,
  PinForgot,
  DeletionRequest,
  SecondaryPhone
} from '@/screens/Main';
import { useDeviceContext } from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NoNetwork from '@/screens/NoNetwork';
import NetInfo from '@react-native-community/netinfo';
import AttendanceIcon from '@/assets/icons/BottomTabs/AttendanceIcon';

export default function Main() {
  
  const config = {
    screens: {
      Bottom: {
        screens: {
          Home: 'home',
        },
      },
    },
  };

  const linking: any = {
    prefixes: ['memonies://'],
    config,
  };
  
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  // Animated Tab Indicator...
  const tabOffsetValue = React.useRef(new Animated.Value(0)).current;

  function getWidth() {
    let width = Dimensions.get('window').width;
    width = width - 80;
    return width / 5;
  }
  const insets = useSafeAreaInsets();
  

  return (
    <Tab.Navigator
    safeAreaInsets={{
      bottom: Platform.OS === "android" ? 10 : insets.bottom
    }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'relative',
          minHeight: 90,
          borderWidth: 0,
          paddingVertical: Platform.OS === 'android' ? 5 : 10,
          paddingHorizontal: moderateVerticalScale(5),
          backgroundColor: colors.white,
        },
        tabBarItemStyle: {
          minHeight: 65,
          position: 'relative',
          marginHorizontal: moderateVerticalScale(2),
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          borderColor: 'transparent',
          borderWidth: 0,
          textAlign: 'center',
        },
      }}>
      {[
        { name: 'Home', component: Home, animatedPlex: 0.01, icon: HomeIcon },
        // {
        //   name: 'Cards',
        //   component: Cards,
        //   animatedPlex: 1.45,
        //   icon: CardIcon,
        // },
        {
          name: 'Attendance',
          component: Attendance,
          animatedPlex: 1.45,
          icon: AttendanceIcon,
        },
        // {
        //   name: 'LifeStyle',       
        //   component: Lifestyle,
        //   animatedPlex: 2.8,
        //   icon: LifestyleIcon,
        // },
        {
          name: 'Profile',
          component: Profile,
          animatedPlex: 2.8,
          icon: ProfileIcon,
        },
      ].map(({ component, name, animatedPlex, icon: Icon }) => {
        return (
          <Tab.Screen
            key={name}
            component={component}
            name={name}
            
            options={{
              tabBarLabel: ({ focused, color }) => (
                <RNText
                  font={focused ? 'outfitbold' : 'outfitregular'}
                  theme={focused ? 'danger' : 'secondary'}
                  style={[
                    tw`mb-3`,
                    {
                      fontSize: responsiveScreenFontSize(2),
                    },
                  ]}>
                  {name}
                </RNText>
              ),
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    position: 'absolute',
                  }}>
                  <Icon focus={focused} />
                </View>
              ),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth() * animatedPlex,
                  useNativeDriver: true,
                }).start();
              },
            })}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
function RootNavigator() {
  useDeviceContext(tw);
  const [visible, setVisible] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const unSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
    return () => {
      unSub();
    };
  }, []);
  const screens = [
    { name: 'Bottom', component: BottomNavigator },
    { name: 'Notification', component: Notification },
    {
      name: 'NoNetwork',
      component: NoNetwork,
    },
    {
      name: 'SendMoney',
      component: SendMoney,
    },
    {
      name: 'ReceiveMoney',
      component: ReceiveMoney,
    },
    {
      name: 'Account',
      component: Account,
    },
    {
      name: 'TransactionHistory',
      component: TransactionHistory,
    },
    {
      name: 'LinkedCards',
      component: LinkedCards,
    },
    {
      name: 'AddCard',
      component: AddCard,
    },
    {
      name: 'SendToBankAccount',
      component: SendToBankAccount,
    },
    {
      name: 'LoginPin',
      component: LoginPin,
    },
    {
      name: 'PaymentPin',
      component: PaymentPin,
    },
    {
      name: 'PersonalDetails',
      component: PersonalDetails,
    },
    {
      name: 'TransactionDetails',
      component: TransactionDetails,
    },
    {
      name: 'LoginPassword',
      component: LoginPassword,
    },
    {
      name: 'LoginForgot',
      component: LoginForgot,
    },
    {
      name: 'Mandate',
      component: Mandate,
    },
    {
      name: 'DeleteReason',
      component: DeleteReason,
    },
    {
      name: 'DeletionRequest',
      component: DeletionRequest,
    },
    {
      name: 'PinForgot',
      component: PinForgot,
    },
    {
      name: 'SecondaryPhone',
      component: SecondaryPhone,
    },
  ];

  if (visible !== null) {
    return (
      <Stack.Navigator initialRouteName={visible ? 'Bottom' : 'NoNetwork'}>
        {screens.map(({ name, component }) => (
          <Stack.Screen
            key={name}
            name={name}
            // @ts-ignore
            component={component}
            options={{ headerShown: false }}
          />
        ))}
      </Stack.Navigator>
    );
  }
}
