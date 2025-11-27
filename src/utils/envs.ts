import {EXPO_PUBLIC_API_BASE_URI, EXPO_PUBLIC_STAGING_API_BASE_URI} from '@env'

const devEnvironsVar = {
    EXPO_PUBLIC_STAGING_API_BASE_URI
}

const prodEnvironsVar = {
    EXPO_PUBLIC_API_BASE_URI
}

export default __DEV__ ? devEnvironsVar : prodEnvironsVar
