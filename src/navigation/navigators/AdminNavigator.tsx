import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AdminStackParamList } from '../types';
import { AdminHomeScreen } from '../../screens/AdminHomeScreen';
import { AdminCriarScreen } from '../../screens/AdminCriarScreen';
import { AdminCuponsScreen } from '../../screens/AdminCuponsScreen';
import { AdminRelatoriosScreen } from '../../screens/AdminRelatoriosScreen';
import { AdminRestaurantesScreen } from '../../screens/AdminRestaurantesScreen';
import { AdminEntregadoresScreen } from '../../screens/AdminEntregadoresScreen';
import { AdminClientesScreen } from '../../screens/AdminClientesScreen';
import { AdminRestaurantesPendentesScreen } from '../../screens/AdminRestaurantesPendentesScreen';
import { AdminEntregadoresPendentesScreen } from '../../screens/AdminEntregadoresPendentesScreen';
import { AdminPedidosAndamentoScreen } from '../../screens/AdminPedidosAndamentoScreen';
import { AdminPedidoDetalheScreen } from '../../screens/AdminPedidoDetalheScreen';
import { AdminReembolsoScreen } from '../../screens/AdminReembolsoScreen';
import { AdminTaxasScreen } from '../../screens/AdminTaxasScreen';
import { AdminTicketsScreen } from '../../screens/AdminTicketsScreen';
import { AdminTicketDetalheScreen } from '../../screens/AdminTicketDetalheScreen';

const AdminStack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStackNavigator(): React.JSX.Element {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} />
      <AdminStack.Screen name="AdminCriar" component={AdminCriarScreen} />
      <AdminStack.Screen name="AdminCupons" component={AdminCuponsScreen} />
      <AdminStack.Screen name="AdminRelatorios" component={AdminRelatoriosScreen} />
      <AdminStack.Screen name="AdminRestaurantes" component={AdminRestaurantesScreen} />
      <AdminStack.Screen name="AdminEntregadores" component={AdminEntregadoresScreen} />
      <AdminStack.Screen name="AdminClientes" component={AdminClientesScreen} />
      <AdminStack.Screen name="AdminRestaurantesPendentes" component={AdminRestaurantesPendentesScreen} />
      <AdminStack.Screen name="AdminEntregadoresPendentes" component={AdminEntregadoresPendentesScreen} />
      <AdminStack.Screen name="AdminPedidosAndamento" component={AdminPedidosAndamentoScreen} />
      <AdminStack.Screen name="AdminPedidoDetalhe" component={AdminPedidoDetalheScreen} />
      <AdminStack.Screen name="AdminReembolso" component={AdminReembolsoScreen} />
      <AdminStack.Screen name="AdminTaxas" component={AdminTaxasScreen} />
      <AdminStack.Screen name="AdminTickets" component={AdminTicketsScreen} />
      <AdminStack.Screen name="AdminTicketDetalhe" component={AdminTicketDetalheScreen} />
    </AdminStack.Navigator>
  );
}
