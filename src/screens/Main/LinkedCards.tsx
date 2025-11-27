import RNButton from "@/components/Button";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import tw from "@/lib/tailwind";
import { colors } from "@/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useDeviceContext } from "twrnc";

const LinkedCards = () => {
  useDeviceContext(tw);
  const cards = [];
  return (
    <Layout header headerCenterText="Linked cards">
      <View style={tw`flex-1`}>
        {cards.length <= 0 ? (
          <View style={tw`flex-1`}>
            <RNText
              style={tw`text-center mt-10`}
              font="outfitbold"
              theme="secondary"
            >
              You have no linked cards
            </RNText>
          </View>
        ) : (
          <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
            <TouchableOpacity
              style={tw`flex-row items-center justify-between py-4 border-[1px] rounded-md px-3 border-gray-200 w-full`}
            >
              <View style={tw`flex flex-row items-center`}>
                <Image source={require("@/assets/images/fcmb.png")} />
                <View style={tw`px-4`}>
                  <RNText
                    style={tw``}
                    size="sm"
                    font="outfitsemi"
                    theme="black"
                  >
                    5199**********11
                  </RNText>
                  <RNText style={tw``} size="sm" theme="secondary">
                    First City Monument Bank
                  </RNText>
                  <RNText style={tw``} size="sm" theme="secondary">
                    Mastercard
                  </RNText>
                </View>
              </View>
              <View style={tw``}>
                <AntDesign
                  name="delete"
                  size={24}
                  color={colors.danger}
                  style={tw``}
                />
              </View>
            </TouchableOpacity>
          </RNScrollView>
        )}
        <RNButton title="Add new card" navigate="AddCard" />
      </View>
    </Layout>
  );
};

export default LinkedCards;
