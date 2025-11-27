import { User } from '@/constants/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {PayloadAction, createSlice} from '@reduxjs/toolkit'

const initialState = {
    token: '',
    logOut: true,
    user: {
        firstName: '',
        lastName: '',
        notificationEnabled: false,
        email: '',
        accountID: '',
        phone: '',
        avatar: '',
        dob: '',
    },
    signUpToken: '',
    cardDetails: {}
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action:PayloadAction<string>) => {
            state.token = action.payload
        },
        setSignUpToken: (state, action:PayloadAction<string>) => {
            state.signUpToken = action.payload
        },
        logout: (state) => {
            //AsyncStorage.clear()
            state.token = initialState.token
            state.user = initialState.user
            state.logOut = true
            state.signUpToken = initialState.signUpToken
        },
        setUserDetails: (state, action:PayloadAction<User>) => {
            state.user = action.payload
        },
        setCardDetails: (state, action:PayloadAction<User>) => {
            state.cardDetails = action.payload
        }
    }
})

export const {
    setToken,
    setSignUpToken,
    setUserDetails,
    logout,
    setCardDetails
} = authSlice.actions

export const selectToken = (state: any) => state.auth.token
export const selectSignUpToken = (state: any) => state.auth.setSignUpToken
export const selectUser = (state: any) => state.auth.user
export const selectCardDetails = (state: any) => state.auth.cardDetails

export default authSlice.reducer