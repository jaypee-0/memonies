import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { StatusBar, StyleSheet, View } from "react-native";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import AppIntroSlider from "react-native-app-intro-slider";
import LogoIcon from "@/assets/icons/LogoIcon";
import RNText from "@/components/Text";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { moderateVerticalScale } from "react-native-size-matters";
import { responsiveScreenFontSize } from "react-native-responsive-dimensions";
import CC from "@/assets/icons/Onboarding/CC";

const Onboarding = () => {
  useDeviceContext(tw);
  const { width, height } = Dimensions.get("window");
  const slider: any = React.useRef<any>(null);
  const data = [
    {
      title: `Earn daily salary`,
      sub: `Clock out and receive money at 6 PM`,
      image: (
        <Image
          source={require("@/assets/images/onboarding211.png")}
          style={tw`h-60 w-70`}
          resizeMode="contain"
        />
      ),
      bg: "black",
    },
    {
      title: `Wallet-powered payroll`,
      sub: `Employers fund once, Memonies handles payouts`,
      image: (
        <Image
          source={require("@/assets/images/onboarding20.png")}
          style={tw`h-60 w-70`}
          resizeMode="contain"
        />
      ),
      bg: "black",
    },
    // {
    //   title: 'Cards that work',
    //   text: 'Secure a virtual card that works seamlessly for all online transactions',
    //   image: <CC />,
    //   bg: 'black',
    // },
  ];
  const navigation: any = useNavigation();
  const renderItem = ({ item }: Record<string, string | number | any>) => {
    const { image: IMG } = item;
    return (
      <>
        <View style={tw`mt-20 mx-6 mb-4`}>
          <LogoIcon />
          <View style={tw`mx-auto mt-20 max-h-70`}>{IMG}</View>
        </View>
      </>
    );
  };

  const keyExtractor = (item: Record<string, string>) => item.title;
  const RenderNextButton = ({ activeIndex }: { activeIndex: number }) => {
    return (
      <View
        style={tw`rounded-full items-center justify-center ${
          activeIndex === 0
            ? "border-r-2 border-white" 
            : "border-r-2 border-b-2 border-l-2 border-white"
        }`}
      >
        <TouchableOpacity
          style={tw`justify-center items-center m-1 bg-white h-[42px] w-[42px] rounded-full`}
          onPress={() => {
            if (activeIndex < 1) {
              slider?.current.goToSlide(activeIndex + 1);
            } else {
              navigation.navigate("OrganizationInput");
            }
          }}
        >
          <AntDesign name="arrowright" color={"black"} size={24} />
        </TouchableOpacity>
      </View>
    );
  };
  const RenderSkipButton = () => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("OrganizationInput")}>
        <RNText style={tw``} theme="white" font="outfitbold">
          Skip
        </RNText>
      </TouchableOpacity>
    );
  };

  const renderPagination = (activeIndex: number) => {
    return (
      <SafeAreaView style={[tw`mt-3`, { zIndex: 10 }]}>
        <View style={styles.paginationDots}>
          {data.length > 1 &&
            data.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 800,
                    borderRadius: 100,
                  },
                  i === activeIndex ? styles.activeDotStyle : styles.dotStyle,
                ]}
                onPress={() => slider?.current.goToSlide(i, true)}
              >
                <RNText style={tw``}>{""}</RNText>
              </TouchableOpacity>
            ))}
        </View>
        <View style={{ marginTop: moderateVerticalScale(15) }}>
          {data.map((_, i) => (
            <View key={i} style={{}}>
              {i === activeIndex && (
                <View style={tw`px-6 `}>
                  <View style={tw``}>
                    <RNText
                      size="lg"
                      theme="white"
                      font="outfitbold"
                      style={[
                        styles.title,
                        { fontSize: responsiveScreenFontSize(5) },
                        tw`pt-2 leading-[40px]`,
                      ]}
                    >
                      {_.title}
                    </RNText>
                  </View>
                    <RNText
                    style={tw`text-[1.5rem]`}
                    theme="white"
                    font="outfitregular"
                    align="center"
                    >
                      {_.sub}
                    </RNText>
                


                 
                </View>
              )}
            </View>
          ))}
        </View>
        <View
          style={tw`flex mt-10 flex-row z-50 justify-between px-8 items-center relative w-full h-14`}
        >
          <RenderSkipButton />
          <RenderNextButton activeIndex={activeIndex} />
        </View>
      </SafeAreaView>
    );
  };
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor="transparent"
        animated={true}
      />
      <ImageBackground
        source={require("@/assets/images/onboardingbg.png")}
        style={tw`flex-1 relative`}
      >
        <AppIntroSlider
          ref={(ref) => (slider.current = ref)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderPagination={renderPagination}
          data={data}
        />
      </ImageBackground>
    </>
  );
};
export default Onboarding;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  paginationDots: {
    height: 16,
    margin: 16,
    marginTop: 5,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dotStyle: {
    backgroundColor: colors.secondary100,
    height: 7,
    width: 7,
  },
  activeDotStyle: {
    color: colors.white,
    width: 30,
    height: 6,
    backgroundColor: "#ffffff",
  },
});
