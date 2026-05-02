import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App(): React.JSX.Element {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
