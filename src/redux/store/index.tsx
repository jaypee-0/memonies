import authReducer from '../slices/authSlice'
import edsReducer from '../slices/edsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {persistStore} from 'redux-persist'
import {persistReducer} from 'redux-persist'
import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { AuthApi } from '@/services/auth'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['auth', 'eds']
}

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    blacklist: ['token'],
}

const edsPersistConfig = {
    key: 'eds',
    storage: AsyncStorage,
}

const reducers = combineReducers({
    [AuthApi.reducerPath]: AuthApi.reducer,
    auth: persistReducer(authPersistConfig, authReducer),
    eds: persistReducer(edsPersistConfig, edsReducer)
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        }).concat([AuthApi.middleware])
})


export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
