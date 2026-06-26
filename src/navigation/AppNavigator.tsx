import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ActivityIndicator, useColorScheme, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';
import { GuestNavigator } from './navigators/GuestNavigator';
import { AuthenticatedRoot } from './navigators/AuthenticatedRoot';

export function AppNavigator(): React.JSX.Element {
  const scheme = useColorScheme();
  const { token, isReady } = useAuth();
  const dark = scheme === 'dark';

  if (!isReady) {
    return (
      <View style={[styles.boot, { backgroundColor: dark ? palette.backgroundDark : palette.backgroundLight }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  const navTheme = dark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: palette.primary,
          background: palette.backgroundDark,
          card: palette.slate800,
          text: palette.slate100,
          border: palette.slate700,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: palette.primary,
          background: palette.backgroundLight,
          card: palette.white,
          text: palette.slate900,
          border: palette.slate200,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      {!token ? <GuestNavigator /> : <AuthenticatedRoot key="auth" />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
