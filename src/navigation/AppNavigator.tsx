import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { RestauranteCadastroScreen } from '../screens/RestauranteCadastroScreen';
import { palette } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

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
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RestauranteCadastro" component={RestauranteCadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}