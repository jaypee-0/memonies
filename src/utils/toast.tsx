import {colors} from '@/theme/colors'
import {Image, TouchableOpacity, View} from 'react-native'
import tw from 'twrnc'
import Toast from 'react-native-toast-message'
import RNText from '@/components/Text'
import { AntDesign } from '@expo/vector-icons'; 

interface toastProps {
    text1: 'Success' | 'Error'
    text2?: string
    props?: any
}

export const toastConfig = {
    tomatoToast: ({text1, text2, props}: toastProps) => (
        <View
            style={{
                width: '88%',
                backgroundColor: 'white',
                borderWidth: 0.9,
                borderRadius: 10,
                borderColor: colors.primary,
                marginTop: 15,
                paddingHorizontal: 20,
                paddingVertical: 15,
                zIndex: 999999999
            }}
        >
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {text1?.toLowerCase() === 'success' ? (
                    <View style={tw`rounded-full bg-[#FB5E1330] p-3`}>
                    <AntDesign name="close" size={24} color="black" />
                </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            Toast.hide()
                        }}
                    >
                        <View style={tw`rounded-full bg-[#FB5E1330] p-3`}>
                            <AntDesign name="close" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={tw`ml-[18px] max-w-[80%]`}>
                    <RNText theme="grey" size="sm">
                        {text2}
                    </RNText>
                </View>
            </View>
        </View>
    )
}

export const errorHandler = (text: string | Array<string>) => {
    console.log(text, 'text on errorhandler')
    const handleError = (info: string | Array<string>) => {
        if (typeof info === 'string') {
            if (info.includes('server') || info.includes('insufficient'))
                return 'An error has occurred in performing this action. Please try again later'
            return info
        } else if (info?.length < 1) {
            return 'An error has occurred in performing this action. Please try again later'
        }

        // handle arrays
        const safeArray = info?.filter(
            (text) => !text.includes('server') && !text.includes('insufficient')
        )
        if (safeArray?.length < 1)
            return 'An error has occurred in performing this action. Please try again later'
        return safeArray.join(' and ')
    }

    return Toast.show({
        type: 'tomatoToast',
        text1: 'Error',
        text2: handleError(text),
        visibilityTime: 5500
    })
}
export const successHandler = (text: string) =>
    Toast.show({
        type: 'tomatoToast',
        text1: 'Success',
        text2: text,
        visibilityTime: 5500
    })
