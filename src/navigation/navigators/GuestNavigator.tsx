import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GuestStackParamList } from '../types';
import { LoginScreen } from '../../screens/LoginScreen';
import { RestauranteCadastroScreen } from '../../screens/RestauranteCadastroScreen';
import { ClienteCadastroScreen } from '../../screens/ClienteCadastroScreen';
import { EntregadorCadastroScreen } from '../../screens/EntregadorCadastroScreen';

const GuestStack = createNativeStackNavigator<GuestStackParamList>();

export function GuestNavigator(): React.JSX.Element {
  return (
    <GuestStack.Navigator
      key="guest"
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <GuestStack.Screen name="Login" component={LoginScreen} />
      <GuestStack.Screen name="RestauranteCadastro" component={RestauranteCadastroScreen} />
      <GuestStack.Screen name="ClienteCadastro" component={ClienteCadastroScreen} />
      <GuestStack.Screen name="EntregadorCadastro" component={EntregadorCadastroScreen} />
    </GuestStack.Navigator>
  );
}
