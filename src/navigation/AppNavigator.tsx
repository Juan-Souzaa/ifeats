import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { RestauranteCadastroScreen } from '../screens/RestauranteCadastroScreen';
import { RestauranteHomeScreen } from '../screens/RestauranteHomeScreen';
import { PratosListScreen } from '../screens/PratosListScreen';
import { PratoCadastroScreen } from '../screens/PratoCadastroScreen';
import { PratoEditarScreen } from '../screens/PratoEditarScreen';
import { RestauranteCardapioScreen } from '../screens/RestauranteCardapioScreen';
import { palette } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const scheme = useColorScheme();
  const { token, isReady } = useAuth();
  const dark = scheme === 'dark';

  if (!isReady) {
    return <></>;
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
      <Stack.Navigator
        key={token ? 'auth' : 'guest'}
        initialRouteName={token ? 'RestauranteHome' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RestauranteCadastro" component={RestauranteCadastroScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="RestauranteHome" component={RestauranteHomeScreen} />
            <Stack.Screen name="PratosList" component={PratosListScreen} />
            <Stack.Screen name="PratoCadastro" component={PratoCadastroScreen} />
            <Stack.Screen name="PratoEditar" component={PratoEditarScreen} />
            <Stack.Screen name="RestauranteCardapio" component={RestauranteCardapioScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}