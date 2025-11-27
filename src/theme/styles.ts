import {Platform} from 'react-native'
import {scale, verticalScale, moderateScale, moderateVerticalScale} from 'react-native-size-matters'
import {
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveScreenFontSize
} from 'react-native-responsive-dimensions'

export const selectDropDownStyles = {
    dropdownBtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        paddingHorizontal: 0,
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: '#cccccc'
    },
    dropdownBtnStyleCurrency: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        paddingHorizontal: 0,
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: '#cccccc'
    },

    dropdownBtnChildStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },

    dropdownBtnTxt: {
        color: '#00000080',
        fontWeight: '500',
        fontSize: 18
    },

    dropdownBtnImage: {
        width: 35,
        height: 35,
        resizeMode: 'cover',
        borderRadius: 100
    },

    dropdownDropdownStyle: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 400,
        width: '100%',
        marginLeft: '-5%',
        position: 'absolute',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 50,
        bottom: 0,
        marginTop: Platform.OS === 'ios' ? 100 : 500
    },

    dropdownDropdownStyleWithdraw: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: responsiveScreenHeight(75),
        width: '100%',
        marginLeft: '-6%',
        position: 'absolute',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 50,
        bottom: 0,
        marginTop: Platform.OS === 'ios' ? 450 : 550
    },

    dropdownDropdownStyleCountry: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: responsiveScreenHeight(75),
        width: '100%',
        marginLeft: '-5%',
        position: 'absolute',
        right: 0,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 50,
        bottom: 0,
        marginTop: Platform.OS === 'ios' ? 450 : 550
    },

    dropdownDropdownStyleCurrency: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        position: 'relative',
        paddingTop: 1,
        paddingHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 8 : 10
    },

    dropdownRowStyle: {
        backgroundColor: '#fff',
        borderBottomColor: '#fff',
        height: 48
    },

    dropdownRowChildStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 5
    },

    dropdownRowImage: {
        width: 45,
        height: 45,
        resizeMode: 'cover',
        borderRadius: 100
    }
}

export const GoogleAddressStyles = {
    container: {
        width: '102%',
        left: -2,
        position: 'absolute',
        backgroundColor: '#ffffff00',
        borderRadius: 8,
        zIndex: 999,
        top: 0,
        flex: 1,
        color: '#000000'
        // minHeight: 400
    },
    textInputContainer: {
        zIndex: 999,
        flexDirection: 'row',
        backgroundColor: '#ffffff00',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#000000'
    },
    textInput: {
        backgroundColor: '#ffffff00',
        height: 52,
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingLeft: 17,
        fontSize: 15,
        color: '#000000'
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#cccccc',
        borderTopWidth: 0.5
    },
    powered: {},
    listView: {},
    row: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 13,
        height: 48,
        flexDirection: 'row'
    },
    separator: {
        height: 0.5,
        backgroundColor: '#c8c7cc'
    },
    description: {},
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20
    }
}
export const GoogleAddressStyles1 = {
    container: {
        width: '102%',
        left: -2,
        position: 'absolute',
        backgroundColor: '#ffffff00',
        borderRadius: 8,
        zIndex: 988,
        top: 0,
        flex: 1,
        color: '#000000'
    },
    textInputContainer: {
        zIndex: 999,
        flexDirection: 'row',
        backgroundColor: '#ffffff00',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#000000'
    },
    textInput: {
        backgroundColor: '#ffffff00',
        height: 52,
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingLeft: 17,
        fontSize: 15,
        color: '#000000'
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#cccccc',
        borderTopWidth: 0.5
    },
    powered: {},
    listView: {
        backgroundColor: '#000'
    },
    row: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 13,
        height: 48,
        flexDirection: 'row'
    },
    separator: {
        height: 0.5,
        backgroundColor: '#c8c7cc'
    },
    description: {},
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20
    }
}
