import { View, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import RNText from "@/components/Text";
import { describeTransactionPurpose, formatAmount } from "@/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import RNButton from "@/components/Button";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { copyToClipboard } from "@/utils";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const statusVisuals: Record<
  string,
  { bg: string; ring: string; mid: string; icon: "check" | "clockcircleo" | "close"; text: string }
> = {
  successful: {
    bg: "bg-[#04CA5830]",
    ring: "bg-[#04CA5850]",
    mid: "bg-[#04CA58]",
    icon: "check",
    text: "Completed",
  },
  paid: {
    bg: "bg-[#04CA5830]",
    ring: "bg-[#04CA5850]",
    mid: "bg-[#04CA58]",
    icon: "check",
    text: "Completed",
  },
  pending: {
    bg: "bg-[#FFA50030]",
    ring: "bg-[#FFA50050]",
    mid: "bg-[#FFA500]",
    icon: "clockcircleo",
    text: "Pending",
  },
  processing: {
    bg: "bg-[#FFA50030]",
    ring: "bg-[#FFA50050]",
    mid: "bg-[#FFA500]",
    icon: "clockcircleo",
    text: "Processing",
  },
  failed: {
    bg: "bg-[#FF3A4430]",
    ring: "bg-[#FF3A4450]",
    mid: "bg-[#FF3A44]",
    icon: "close",
    text: "Failed",
  },
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return "--";
  }
  try {
    return new Date(value).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return value;
  }
};

const TransactionDetails = ({ route }: any) => {
  const { transaction, from } = route.params;
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [hideButtons, setHideButtons] = useState(false);
  const viewShotRef = useRef<ViewShot | null>(null);

  const status = (transaction?.status ?? "pending").toString().toLowerCase();
  const hero = statusVisuals[status] ?? statusVisuals.pending;

  const detailRows = useMemo(
    () => [
      { label: "Reference", value: transaction?.id ?? "—" },
      { label: "Date & time", value: formatDateTime(transaction?.createdAt) },
      { label: "Amount", value: `₦${formatAmount(transaction?.amount || 0)}` },
      {
        label: "Category",
        value: transaction?.category ?? transaction?.meta?.transactionType ?? "General",
      },
      {
        label: "Channel",
        value: transaction?.meta?.channel ?? transaction?.channel ?? "Wallet",
      },
      {
        label: "Destination",
        value: transaction?.meta?.bankName ?? transaction?.meta?.payerName ?? "Memonies wallet",
      },
    ],
    [transaction]
  );

  const captureAndShareScreenshotPNG = async () => {
    try {
      const uri = await viewShotRef?.current?.capture?.();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert("Unable to share receipt", "Please try again in a moment.");
    } finally {
      setHideButtons(false);
    }
  };

  useEffect(() => {
    if (hideButtons) {
      setTimeout(() => {
        captureAndShareScreenshotPNG();
      }, 500);
    }
  }, [hideButtons]);

  return (
    <View style={tw`bg-[#F5F5F5] w-full flex-1`}>
      <TouchableOpacity
        onPress={() => (from === "withdrawal" ? navigation.navigate("Home") : navigation.goBack())}
        style={tw`mt-12 absolute z-50 ml-5`}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 0.9 }}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
      >
        <View style={tw`pt-20 pb-10 items-center bg-primary rounded-b-[100]`}>
          <View style={tw`rounded-full h-20 w-20 items-center justify-center ${hero.bg}`}>
            <View style={tw`rounded-full h-17 w-17 items-center justify-center ${hero.ring}`}>
              <View style={tw`rounded-full h-14 w-14 items-center justify-center ${hero.mid}`}>
                <AntDesign name={hero.icon} color="white" size={28} />
              </View>
            </View>
          </View>
          <RNText theme="white" align="center" font="outfitlight" style={tw`mt-3`}>
            {hero.text}
          </RNText>
          <RNText theme="white" size="lg" font="outfitsemi" align="center">
            ₦{formatAmount(transaction?.amount || 0)}
          </RNText>
        </View>

        <View style={tw`flex-1 w-[90%] mx-auto -mt-14 bg-white px-4 py-6 rounded-3xl shadow-lg`}>
          <RNText theme="black" font="outfitmedium" align="center" style={tw`text-lg`}>
            {describeTransactionPurpose(transaction)}
          </RNText>
          <TouchableOpacity
            onPress={() => copyToClipboard(transaction?.id ?? "")}
            style={tw`flex-row items-center justify-center mt-1`}
          >
            <RNText theme="secondary" size="sm">
              Transaction ID: {transaction?.id?.slice(0, 18) ?? "—"}
            </RNText>
            <Ionicons name="copy" size={14} color={"#4A5568"} style={tw`ml-1`} />
          </TouchableOpacity>

          {transaction?.meta?.message && (
            <RNText theme="secondary" size="sm" style={tw`text-center mt-2`}>
              {transaction.meta.message}
            </RNText>
          )}

          <View style={tw`mt-5`}>
            {detailRows.map(({ label, value }) => (
              <View
                key={label}
                style={tw`flex-row justify-between py-3 border-b border-[#EEF1F4]`}
              >
                <RNText theme="secondary" size="sm">
                  {label}
                </RNText>
                <RNText font="outfitmedium" size="sm" style={tw`max-w-[60%] text-right`}>
                  {value}
                </RNText>
              </View>
            ))}
          </View>

          {!hideButtons && (
            <View style={tw`flex-row items-center justify-between mt-6`}>
              <RNButton
                title="Share receipt"
                onPress={() => setHideButtons(true)}
                style={tw`w-[48%]`}
              />
              <RNButton
                title="Close"
                onPress={() => navigation.navigate("Home")}
                style={tw`w-[48%] bg-[#DEE2ED]`}
                textStyle={tw`text-black`}
              />
            </View>
          )}
        </View>
      </ViewShot>
    </View>
  );
};

export default TransactionDetails;
