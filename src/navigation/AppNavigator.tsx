import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, useColorScheme, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { palette } from '../theme/colors';
import type {
  AdminStackParamList,
  EntregadorStackParamList,
  GuestStackParamList,
  MainTabParamList,
} from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { RestauranteCadastroScreen } from '../screens/RestauranteCadastroScreen';
import { ClienteCadastroScreen } from '../screens/ClienteCadastroScreen';
import { EntregadorCadastroScreen } from '../screens/EntregadorCadastroScreen';
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
import { ClienteRootNavigator } from './navigators/ClienteNavigator';
import { RestauranteStackNavigator } from './navigators/RestauranteNavigator';

const GuestStack = createNativeStackNavigator<GuestStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const EntregadorStack = createNativeStackNavigator<EntregadorStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AdminStackNavigator(): React.JSX.Element {
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

function EntregadorStackNavigator(): React.JSX.Element {
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

function SemPapelScreen(): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const { setToken } = useAuth();
  return (
    <SafeAreaView style={[semStyles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <Text style={[semStyles.title, { color: text }]}>Perfil não reconhecido</Text>
      <Text style={[semStyles.sub, { color: text }]}>
        O token não contém um papel suportado neste aplicativo. Saia e entre com outro utilizador.
      </Text>
      <Pressable style={semStyles.btn} onPress={() => void setToken(null)}>
        <Text style={semStyles.btnText}>Sair</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const semStyles = StyleSheet.create({
  safe: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  btn: {
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
});

type TabPart = {
  name: keyof MainTabParamList;
  component: () => React.JSX.Element;
  title: string;
};

function AuthenticatedRoot(): React.JSX.Element {
  const { hasRole } = useAuth();

  const parts: TabPart[] = [];
  if (hasRole('ROLE_CLIENTE')) {
    parts.push({ name: 'TabCliente', component: ClienteRootNavigator, title: 'Cliente' });
  }
  if (hasRole('ROLE_RESTAURANTE')) {
    parts.push({ name: 'TabRestaurante', component: RestauranteStackNavigator, title: 'Meu negócio' });
  }
  if (hasRole('ROLE_ADMIN')) {
    parts.push({ name: 'TabAdmin', component: AdminStackNavigator, title: 'Admin' });
  }
  if (hasRole('ROLE_ENTREGADOR')) {
    parts.push({ name: 'TabEntregador', component: EntregadorStackNavigator, title: 'Entrega' });
  }

  if (parts.length === 0) {
    return <SemPapelScreen />;
  }

  const body =
    parts.length === 1 ? (
      (() => {
        const C = parts[0].component;
        return <C />;
      })()
    ) : (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.slate500,
      }}
    >
      {parts.map((p) => (
        <Tab.Screen key={p.name} name={p.name} component={p.component} options={{ title: p.title }} />
      ))}
    </Tab.Navigator>
    );

  return <CartProvider>{body}</CartProvider>;
}

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
      {!token ? (
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
      ) : (
        <AuthenticatedRoot key="auth" />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
