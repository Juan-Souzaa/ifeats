import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { EntregadorStackParamList } from '../types';
import { EntregadorHomeScreen } from '../../screens/EntregadorHomeScreen';
import { EntregadorAreaScreen } from '../../screens/EntregadorAreaScreen';
import { EntregadorPedidoDetalheScreen } from '../../screens/EntregadorPedidoDetalheScreen';
import { EntregadorPerfilScreen } from '../../screens/EntregadorPerfilScreen';
import { EntregadorGanhosScreen } from '../../screens/EntregadorGanhosScreen';

const EntregadorStack = createNativeStackNavigator<EntregadorStackParamList>();

export function EntregadorStackNavigator(): React.JSX.Element {
  return (
    <EntregadorStack.Navigator screenOptions={{ headerShown: false }}>
      <EntregadorStack.Screen name="EntregadorHome" component={EntregadorHomeScreen} />
      <EntregadorStack.Screen name="EntregadorArea" component={EntregadorAreaScreen} />
      <EntregadorStack.Screen name="EntregadorPedidoDetalhe" component={EntregadorPedidoDetalheScreen} />
      <EntregadorStack.Screen name="EntregadorPerfil" component={EntregadorPerfilScreen} />
      <EntregadorStack.Screen name="EntregadorGanhos" component={EntregadorGanhosScreen} />
    </EntregadorStack.Navigator>
  );
}
