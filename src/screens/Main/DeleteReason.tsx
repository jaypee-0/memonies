import RNButton from "@/components/Button";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import { useAppSelector } from "@/hooks";
import tw from "@/lib/tailwind";
import { selectUser } from "@/redux/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useDeviceContext } from "twrnc";
import Checkbox from "expo-checkbox";
import { colors } from "@/theme/colors";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import RNBackdrop from "@/components/BackDrop";

const DeleteReason = () => {
  useDeviceContext(tw);
  const selectedUser = useAppSelector(selectUser);
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
      checked: "",
      isPassword: "",
      password: "",
    }
  );

  const details = [
    {
      name: "Safety or privacy concerns",
      button: false,
    },
    {
      name: "Trouble getting started",
      button: false,
    },
    {
      name: "I have multiple accounts",
      button: false,
    },
    {
      name: "I dont want to use this account anymore",
      button: false,
    },
    {
      name: "Other reasons",
      button: false,
    },
  ];

  const modalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["25%", "50%"], []);
  const handleClose = () => {
    modalRef.current?.close();
  };
  const handleSubmit = () => {
    navigation.navigate("DeletionRequest");
  };

  return (
    <Layout header headerCenterText="Why are you leaving us?">
      <BottomSheetModal
        backdropComponent={(backdropProps) => (
          <RNBackdrop {...backdropProps} close={handleClose} />
        )}
        backgroundStyle={{ borderRadius: 30, backgroundColor: "#fff" }}
        handleIndicatorStyle={{
          backgroundColor: "#ffff",
          width: 80,
          height: 5,
        }}
        index={1}
        ref={modalRef}
        snapPoints={snapPoints}
      >
        <View style={tw`pb-6 px-5 h-full flex-1`}>
          <View style={tw`flex flex-1 flex-col`}>
            <RNText
              style={tw``}
              size="md"
              font="outfitsemi"
              theme="black"
              align="center"
            >
              Are you sure you want to delete your account?
            </RNText>
            <View style={tw`flex flex-col mt-2`}>
              <RNText
                style={tw`text-sm mb-2 text-[#8D8D8D]`}
                font="outfitregular"
                align="center"
              >
                To confirm your delete request please type your password below.
              </RNText>

              <BottomSheetTextInput
                value={String(state.password)}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setState({ ...state, password: text })}
                style={tw`px-2 border border-[#8c8c8c50] focus:border-primary h-[50px] rounded-sm`}
              />
            </View>
            <TouchableOpacity
              disabled={Boolean(String(state.password).length === 0)}
              onPress={() => {
                handleClose();
                handleSubmit();
              }}
              style={tw`h-[50px] mb-5 ${
                Boolean(String(state.password).length > 0)
                  ? "bg-primary"
                  : "bg-[#CBD1D7]"
              } mt-auto flex flex-row items-center justify-center`}
            >
              <RNText style={tw`text-sm`} font="outfitbold" theme="white">
                Send delete request
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>

      <View style={tw`flex-1`}>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          <View style={tw`w-full flex flex-col rounded-sm mt-3`}>
            {details.map((detail, index) => (
              <View
                key={index}
                style={tw`flex flex-row items-center justify-between w-full border-b border-[#8c8c8c30] py-5`}
              >
                <RNText style={tw`mr-4`}>{detail.name}</RNText>
                <Checkbox
                  color={colors.primary}
                  style={tw`rounded-full h-5 w-5`}
                  value={Boolean(state.checked === detail.name)}
                  onValueChange={(text) => {
                    console.log(text, "text on change");
                    setState({ ...state, checked: detail.name });
                  }}
                />
              </View>
            ))}
          </View>
        </RNScrollView>
        <RNButton
          title="Delete Account"
          disable={state.checked == ""}
          onPress={() => {
            modalRef.current?.present();
          }}
        />
      </View>
    </Layout>
  );
};
export default DeleteReason;
