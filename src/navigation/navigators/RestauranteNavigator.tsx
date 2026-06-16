import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RestauranteStackParamList } from '../types';
import { RestauranteHomeScreen } from '../../screens/RestauranteHomeScreen';
import { PratosListScreen } from '../../screens/PratosListScreen';
import { PratoCadastroScreen } from '../../screens/PratoCadastroScreen';
import { PratoEditarScreen } from '../../screens/PratoEditarScreen';
import { RestauranteCardapioScreen } from '../../screens/RestauranteCardapioScreen';
import { RestauranteAvaliacoesScreen } from '../../screens/RestauranteAvaliacoesScreen';
import { RestaurantePedidosScreen } from '../../screens/RestaurantePedidosScreen';
import { RestaurantePedidoDetalheScreen } from '../../screens/RestaurantePedidoDetalheScreen';
import { RestauranteEditarPerfilScreen } from '../../screens/RestauranteEditarPerfilScreen';
import { RestauranteRaioEntregaScreen } from '../../screens/RestauranteRaioEntregaScreen';
import { RestauranteGanhosScreen } from '../../screens/RestauranteGanhosScreen';

const RestauranteStack = createNativeStackNavigator<RestauranteStackParamList>();

export function RestauranteStackNavigator(): React.JSX.Element {
  return (
    <RestauranteStack.Navigator screenOptions={{ headerShown: false }}>
      <RestauranteStack.Screen name="RestauranteHome" component={RestauranteHomeScreen} />
      <RestauranteStack.Screen name="PratosList" component={PratosListScreen} />
      <RestauranteStack.Screen name="PratoCadastro" component={PratoCadastroScreen} />
      <RestauranteStack.Screen name="PratoEditar" component={PratoEditarScreen} />
      <RestauranteStack.Screen name="RestauranteCardapio" component={RestauranteCardapioScreen} />
      <RestauranteStack.Screen name="RestauranteAvaliacoes" component={RestauranteAvaliacoesScreen} />
      <RestauranteStack.Screen name="RestaurantePedidos" component={RestaurantePedidosScreen} />
      <RestauranteStack.Screen name="RestaurantePedidoDetalhe" component={RestaurantePedidoDetalheScreen} />
      <RestauranteStack.Screen name="RestauranteEditarPerfil" component={RestauranteEditarPerfilScreen} />
      <RestauranteStack.Screen name="RestauranteRaioEntrega" component={RestauranteRaioEntregaScreen} />
      <RestauranteStack.Screen name="RestauranteGanhos" component={RestauranteGanhosScreen} />
    </RestauranteStack.Navigator>
  );
}
