import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import Layout from '@/components/Layout';
import RNButton from '@/components/Button';
import { useAppDispatch } from '@/hooks';
import { logout } from '@/redux/slices/authSlice';
import { colors } from '@/theme/colors';
import tw from '@/lib/tailwind';
import { AntDesign } from '@expo/vector-icons';
import RNText from '@/components/Text';
import RNScrollView from '@/components/ScrollView';
import { useDeviceContext } from 'twrnc';

interface StateProps {
  address: string;
  toggleLocation: boolean;
  activePage: 'Cart' | 'Saved items';
  nonActivePage: 'Cart' | 'Saved items';
  noOfItems: number;
  activeTab: string;
}
const tabs = ['All', 'Completed', 'Pending', 'Processing', 'Cancelled'];
const Orders = () => {
  const dispatch = useAppDispatch();
  useDeviceContext(tw);
  const [state, setState] = React.useReducer(
    (prev: StateProps, next: StateProps) => ({
      ...prev,
      ...next,
    }),
    {
      address: 'Select location...',
      toggleLocation: false,
      activePage: 'Cart',
      nonActivePage: 'Saved items',
      noOfItems: 0,
      activeTab: tabs[0],
    }
  );
  return (
    <Layout bg={colors.white} noPad>
      <View></View>
    </Layout>
  );
};

export default Orders;
