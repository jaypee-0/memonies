import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {returnAPICall} from '@/services/networking'
import {
    AUTH_API,
    CREATE_USER,
    FETCH_STORE,
    GENERATE_OTP
} from '@/services/url'
import {
    CreateUser,
    Email,
} from './types'
import { GET, POST } from '@/services/constants'
import envs from '@/utils/envs'
import { RootState } from '@/redux/store'

const {EXPO_PUBLIC_API_BASE_URI, EXPO_PUBLIC_STAGING_API_BASE_URI} = envs as any

export const AuthApi: any = createApi({
    reducerPath: AUTH_API,
    baseQuery: fetchBaseQuery({
        baseUrl: __DEV__ ? EXPO_PUBLIC_STAGING_API_BASE_URI : EXPO_PUBLIC_API_BASE_URI,
        prepareHeaders: (headers, {getState}) => {
            headers.set('Content-Type', 'application/json')
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    endpoints: (build) => ({
        createUser: build.mutation<CreateUser, Partial<CreateUser> & Pick<CreateUser, 'email'>>(
            returnAPICall(CREATE_USER, POST)
        ),
        generateOTP: build.query<Email, Partial<Email> & Pick<Email, 'email'>>(
            returnAPICall(GENERATE_OTP, GET)
        ),
        getItems: build.query(returnAPICall(FETCH_STORE, GET))
    })
})


export const {
    useCreateUserMutation,
    useLazyGenerateOTPQuery,
    useGetItemsQuery
} = AuthApi
