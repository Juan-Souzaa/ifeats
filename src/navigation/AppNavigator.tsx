import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';
import { palette } from '../theme/colors';
import type {
  AdminStackParamList,
  ClienteCarrinhoStackParamList,
  ClienteHomeStackParamList,
  ClientePedidosStackParamList,
  ClienteTabParamList,
  EntregadorStackParamList,
  GuestStackParamList,
  MainTabParamList,
  RestauranteStackParamList,
} from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { RestauranteCadastroScreen } from '../screens/RestauranteCadastroScreen';
import { ClienteCadastroScreen } from '../screens/ClienteCadastroScreen';
import { EntregadorCadastroScreen } from '../screens/EntregadorCadastroScreen';
import { RestauranteHomeScreen } from '../screens/RestauranteHomeScreen';
import { PratosListScreen } from '../screens/PratosListScreen';
import { PratoCadastroScreen } from '../screens/PratoCadastroScreen';
import { PratoEditarScreen } from '../screens/PratoEditarScreen';
import { RestauranteCardapioScreen } from '../screens/RestauranteCardapioScreen';
import { RestauranteAvaliacoesScreen } from '../screens/RestauranteAvaliacoesScreen';
import { RestaurantePedidosScreen } from '../screens/RestaurantePedidosScreen';
import { RestaurantePedidoDetalheScreen } from '../screens/RestaurantePedidoDetalheScreen';
import { RestauranteEditarPerfilScreen } from '../screens/RestauranteEditarPerfilScreen';
import { RestauranteRaioEntregaScreen } from '../screens/RestauranteRaioEntregaScreen';
import { RestauranteGanhosScreen } from '../screens/RestauranteGanhosScreen';
import { ClienteRestaurantesScreen } from '../screens/ClienteRestaurantesScreen';
import { ClientePerfilScreen } from '../screens/ClientePerfilScreen';
import { ClienteMeusEnderecosScreen } from '../screens/ClienteMeusEnderecosScreen';
import { ClienteEnderecoFormScreen } from '../screens/ClienteEnderecoFormScreen';
import { ClienteEditarPerfilScreen } from '../screens/ClienteEditarPerfilScreen';
import { ClienteAlterarSenhaScreen } from '../screens/ClienteAlterarSenhaScreen';
import { ClienteTicketsScreen } from '../screens/ClienteTicketsScreen';
import { ClienteTicketCriarScreen } from '../screens/ClienteTicketCriarScreen';
import { ClienteTicketDetalheScreen } from '../screens/ClienteTicketDetalheScreen';
import { ClienteCarrinhoScreen } from '../screens/ClienteCarrinhoScreen';
import { ClienteCheckoutScreen } from '../screens/ClienteCheckoutScreen';
import { ClienteCheckoutConfirmacaoScreen } from '../screens/ClienteCheckoutConfirmacaoScreen';
import { ClientePedidosScreen } from '../screens/ClientePedidosScreen';
import { ClientePedidoDetalheScreen } from '../screens/ClientePedidoDetalheScreen';
import { ClienteRastreamentoScreen } from '../screens/ClienteRastreamentoScreen';
import { ClienteAvaliarPedidoScreen } from '../screens/ClienteAvaliarPedidoScreen';
import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { AdminCriarScreen } from '../screens/AdminCriarScreen';
import { AdminCuponsScreen } from '../screens/AdminCuponsScreen';
import { AdminRelatoriosScreen } from '../screens/AdminRelatoriosScreen';
import { AdminRestaurantesScreen } from '../screens/AdminRestaurantesScreen';
import { AdminEntregadoresScreen } from '../screens/AdminEntregadoresScreen';
import { AdminClientesScreen } from '../screens/AdminClientesScreen';
import { AdminRestaurantesPendentesScreen } from '../screens/AdminRestaurantesPendentesScreen';
import { AdminEntregadoresPendentesScreen } from '../screens/AdminEntregadoresPendentesScreen';
import { AdminPedidosAndamentoScreen } from '../screens/AdminPedidosAndamentoScreen';
import { AdminPedidoDetalheScreen } from '../screens/AdminPedidoDetalheScreen';
import { AdminReembolsoScreen } from '../screens/AdminReembolsoScreen';
import { AdminTaxasScreen } from '../screens/AdminTaxasScreen';
import { AdminTicketsScreen } from '../screens/AdminTicketsScreen';
import { AdminTicketDetalheScreen } from '../screens/AdminTicketDetalheScreen';
import { EntregadorHomeScreen } from '../screens/EntregadorHomeScreen';
import { EntregadorAreaScreen } from '../screens/EntregadorAreaScreen';
import { EntregadorPedidoDetalheScreen } from '../screens/EntregadorPedidoDetalheScreen';
import { EntregadorPerfilScreen } from '../screens/EntregadorPerfilScreen';
import { EntregadorGanhosScreen } from '../screens/EntregadorGanhosScreen';

const GuestStack = createNativeStackNavigator<GuestStackParamList>();
const RestauranteStack = createNativeStackNavigator<RestauranteStackParamList>();
const ClienteHomeStack = createNativeStackNavigator<ClienteHomeStackParamList>();
const ClienteCarrinhoStack = createNativeStackNavigator<ClienteCarrinhoStackParamList>();
const ClientePedidosStack = createNativeStackNavigator<ClientePedidosStackParamList>();
const ClienteTab = createBottomTabNavigator<ClienteTabParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const EntregadorStack = createNativeStackNavigator<EntregadorStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function RestauranteStackNavigator(): React.JSX.Element {
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

function ClienteHomeStackNavigator(): React.JSX.Element {
  return (
    <ClienteHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <ClienteHomeStack.Screen name="ClienteRestaurantes" component={ClienteRestaurantesScreen} />
      <ClienteHomeStack.Screen name="ClientePerfil" component={ClientePerfilScreen} />
      <ClienteHomeStack.Screen name="ClienteMeusEnderecos" component={ClienteMeusEnderecosScreen} />
      <ClienteHomeStack.Screen name="ClienteEnderecoForm" component={ClienteEnderecoFormScreen} />
      <ClienteHomeStack.Screen name="ClienteEditarPerfil" component={ClienteEditarPerfilScreen} />
      <ClienteHomeStack.Screen name="ClienteAlterarSenha" component={ClienteAlterarSenhaScreen} />
      <ClienteHomeStack.Screen name="ClienteTickets" component={ClienteTicketsScreen} />
      <ClienteHomeStack.Screen name="ClienteTicketCriar" component={ClienteTicketCriarScreen} />
      <ClienteHomeStack.Screen name="ClienteTicketDetalhe" component={ClienteTicketDetalheScreen} />
      <ClienteHomeStack.Screen name="RestauranteCardapio" component={RestauranteCardapioScreen} />
      <ClienteHomeStack.Screen name="RestauranteAvaliacoes" component={RestauranteAvaliacoesScreen} />
    </ClienteHomeStack.Navigator>
  );
}

function ClienteCarrinhoStackNavigator(): React.JSX.Element {
  return (
    <ClienteCarrinhoStack.Navigator screenOptions={{ headerShown: false }}>
      <ClienteCarrinhoStack.Screen name="ClienteCarrinho" component={ClienteCarrinhoScreen} />
      <ClienteCarrinhoStack.Screen name="ClienteCheckout" component={ClienteCheckoutScreen} />
      <ClienteCarrinhoStack.Screen
        name="ClienteCheckoutConfirmacao"
        component={ClienteCheckoutConfirmacaoScreen}
      />
    </ClienteCarrinhoStack.Navigator>
  );
}

function ClientePedidosStackNavigator(): React.JSX.Element {
  return (
    <ClientePedidosStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientePedidosStack.Screen name="ClientePedidos" component={ClientePedidosScreen} />
      <ClientePedidosStack.Screen name="ClientePedidoDetalhe" component={ClientePedidoDetalheScreen} />
      <ClientePedidosStack.Screen name="ClienteRastreamento" component={ClienteRastreamentoScreen} />
      <ClientePedidosStack.Screen name="ClienteAvaliarPedido" component={ClienteAvaliarPedidoScreen} />
    </ClientePedidosStack.Navigator>
  );
}

function CarrinhoTabIcon({ color, size }: { color: string; size: number }): React.JSX.Element {
  const { itemCount } = useCart();
  return (
    <View>
      <MaterialIcons name="shopping-cart" size={size} color={color} />
      {itemCount > 0 ? (
        <View style={tabIconStyles.badge}>
          <Text style={tabIconStyles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ClienteTabNavigator(): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  return (
    <ClienteTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.slate500,
        tabBarStyle: {
          backgroundColor: dark ? '#0f172a' : palette.white,
          borderTopColor: dark ? palette.slate800 : palette.slate200,
        },
      }}
    >
      <ClienteTab.Screen
        name="TabClienteInicio"
        component={ClienteHomeStackNavigator}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <ClienteTab.Screen
        name="TabClienteCarrinho"
        component={ClienteCarrinhoStackNavigator}
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color, size }) => <CarrinhoTabIcon color={color} size={size} />,
        }}
      />
      <ClienteTab.Screen
        name="TabClientePedidos"
        component={ClientePedidosStackNavigator}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} />,
        }}
      />
    </ClienteTab.Navigator>
  );
}

function ClienteRootNavigator(): React.JSX.Element {
  return <ClienteTabNavigator />;
}
