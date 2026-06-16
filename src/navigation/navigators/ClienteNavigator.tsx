import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { palette } from '../../theme/colors';
import type {
  ClienteCarrinhoStackParamList,
  ClienteHomeStackParamList,
  ClientePedidosStackParamList,
  ClienteTabParamList,
} from '../types';
import { ClienteRestaurantesScreen } from '../../screens/ClienteRestaurantesScreen';
import { ClientePerfilScreen } from '../../screens/ClientePerfilScreen';
import { ClienteMeusEnderecosScreen } from '../../screens/ClienteMeusEnderecosScreen';
import { ClienteEnderecoFormScreen } from '../../screens/ClienteEnderecoFormScreen';
import { ClienteEditarPerfilScreen } from '../../screens/ClienteEditarPerfilScreen';
import { ClienteAlterarSenhaScreen } from '../../screens/ClienteAlterarSenhaScreen';
import { ClienteTicketsScreen } from '../../screens/ClienteTicketsScreen';
import { ClienteTicketCriarScreen } from '../../screens/ClienteTicketCriarScreen';
import { ClienteTicketDetalheScreen } from '../../screens/ClienteTicketDetalheScreen';
import { RestauranteCardapioScreen } from '../../screens/RestauranteCardapioScreen';
import { RestauranteAvaliacoesScreen } from '../../screens/RestauranteAvaliacoesScreen';
import { ClienteCarrinhoScreen } from '../../screens/ClienteCarrinhoScreen';
import { ClienteCheckoutScreen } from '../../screens/ClienteCheckoutScreen';
import { ClienteCheckoutConfirmacaoScreen } from '../../screens/ClienteCheckoutConfirmacaoScreen';
import { ClientePedidosScreen } from '../../screens/ClientePedidosScreen';
import { ClientePedidoDetalheScreen } from '../../screens/ClientePedidoDetalheScreen';
import { ClienteRastreamentoScreen } from '../../screens/ClienteRastreamentoScreen';
import { ClienteAvaliarPedidoScreen } from '../../screens/ClienteAvaliarPedidoScreen';

const ClienteHomeStack = createNativeStackNavigator<ClienteHomeStackParamList>();
const ClienteCarrinhoStack = createNativeStackNavigator<ClienteCarrinhoStackParamList>();
const ClientePedidosStack = createNativeStackNavigator<ClientePedidosStackParamList>();
const ClienteTab = createBottomTabNavigator<ClienteTabParamList>();

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

const tabIconStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: palette.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: palette.white, fontSize: 10, fontWeight: '800' },
});

export function ClienteTabNavigator(): React.JSX.Element {
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

export function ClienteRootNavigator(): React.JSX.Element {
  return <ClienteTabNavigator />;
}
