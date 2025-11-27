import { View, Alert } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import RNTinput from "@/components/TextField";
import RNButton from "@/components/Button";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { useMutation } from "react-query";
import { addSecondaryNumber } from "@/utils/api";
import axios from "axios";

interface RouteParams {
  params?: {
    reason?: string;
    bvn?: string;
  };
}

const SecondaryPhone = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const route = useRoute() as unknown as RouteParams;
  const [phone, setPhone] = React.useState<string>("");

  const addSecNo = useMutation(addSecondaryNumber, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        const message = JSON.stringify(error?.response?.data?.message).replace(
          /"/g,
          ""
        );
        console.log("Error", message);

        Alert.alert("Error", message);
      } else {
        Alert.alert("Error", "Error, please try again");
      }
    },
    onSuccess: async (data: any) => {
      Alert.alert("Success", "Phone number added");
      navigation.goBack();
    },
  });

  const handleSubmit = () => {
    if (!phone || phone.trim().length < 10) {
      return Alert.alert("Error", "Enter a valid phone number");
    }
    addSecNo.mutate({
      secondaryPhoneNumber: phone,
    });
  };

  //07010537144
  return (
    <Layout bg={"#fff"} header>
      <RNScrollView>
        <View style={tw`flex-1  pt-6`}>
          <RNText font="outfitmedium">
            Secondary phone number
          </RNText>
          <RNText theme="black" style={tw`mt-1`}>
            Please enter the phone number tied to your BVN so we can verify your
            identity.
          </RNText>

          <View style={tw`mt-6`}>
            <RNTinput
              label="Phone number"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={tw`mt-8`}>
            <RNButton onPress={handleSubmit} title="Continue" />
          </View>
        </View>
      </RNScrollView>
    </Layout>
  );
};

export default SecondaryPhone;
