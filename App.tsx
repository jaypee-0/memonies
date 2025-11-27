import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
} from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { persistor, store } from '@/redux/store';
import { Navigation } from '@/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from 'react-query';

const { height } = Dimensions.get('window');
function App() {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  const [appIsReady, setAppIsReady] = React.useState(false);
  const [fontLoaded] = useFonts({
    'Outfit-Bold': require('./src/assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Medium': require('./src/assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold': require('./src/assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Black': require('./src/assets/fonts/Outfit-Black.ttf'),
    'Outfit-Regular': require('./src/assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Light': require('./src/assets/fonts/Outfit-Light.ttf'),
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve: any) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
        await SplashScreen.hideAsync();
      } finally {
        if (fontLoaded) {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [fontLoaded]);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 2 },
    },
  });

  if (appIsReady && fontLoaded) {
    return (
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <BottomSheetModalProvider>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      style={{ flex: 1 }}
                      keyboardVerticalOffset={
                        Platform.OS === 'ios' ? (height < 580 ? -10 : -5) : -22
                      }>
                      <StatusBar
                        barStyle={'dark-content'}
                        backgroundColor='white'
                        animated={true}
                      />
                      <Navigation />
                    </KeyboardAvoidingView>
                  </BottomSheetModalProvider>
                </PersistGate>
            </Provider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    );
  }
}

export default App;
