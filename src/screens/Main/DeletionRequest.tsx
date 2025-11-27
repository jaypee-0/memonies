import { View, Image, Alert, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Layout from "@/components/Layout";
import RNText from "@/components/Text";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import RNScrollView from "@/components/ScrollView";
import { copyToClipboard } from "@/utils";
import RNButton from "@/components/Button";
import { colors } from "@/theme/colors";

const DeletionRequest = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [state, setState] = React.useReducer(
    (
      prev: Record<
        string,
        string | number | boolean | Record<string, string | number>
      >,
      next: Record<
        string,
        string | number | boolean | Record<string, string | number>
      >
    ) => ({
      ...prev,
      ...next,
    }),
    {
      toogleMethod: 1,
      activeMethod: "",
    }
  );

  return (
    <Layout>
      <View
        style={tw` w-full flex-1 flex-col justify-center items-center -mt-20`}
      >
        <AntDesign name="checkcircle" size={100} color={colors.success} />
        <RNText style={tw`mt-2`} font="outfitsemi" size="lg" align="center">
          Account deletion request has been sent!
        </RNText>
        <RNText theme="secondary" style={tw`my-2`} align="center">
          The HR will confirm you don’t have any pending payouts or company
          compliance holds before confirming your deletion request.
        </RNText>

        <RNButton
          title="Proceed to dashboard"
          navigate="Home"
          naked
          style={tw``}
          textStyle={tw`text-primary`}
        />
      </View>
    </Layout>
  );
};

export default DeletionRequest;
