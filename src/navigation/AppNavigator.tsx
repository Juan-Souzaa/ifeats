import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';
import type {
  AdminStackParamList,
  ClienteStackParamList,
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
import { ClienteRestaurantesScreen } from '../screens/ClienteRestaurantesScreen';
import { ClientePerfilScreen } from '../screens/ClientePerfilScreen';
import { ClienteMeusEnderecosScreen } from '../screens/ClienteMeusEnderecosScreen';
import { ClienteAlterarSenhaScreen } from '../screens/ClienteAlterarSenhaScreen';
import { ClienteTicketsScreen } from '../screens/ClienteTicketsScreen';
import { AdminCriarScreen } from '../screens/AdminCriarScreen';
import { EntregadorAreaScreen } from '../screens/EntregadorAreaScreen';

const GuestStack = createNativeStackNavigator<GuestStackParamList>();
const RestauranteStack = createNativeStackNavigator<RestauranteStackParamList>();
const ClienteStack = createNativeStackNavigator<ClienteStackParamList>();
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
    </RestauranteStack.Navigator>
  );
}

function ClienteStackNavigator(): React.JSX.Element {
  return (
    <ClienteStack.Navigator screenOptions={{ headerShown: false }}>
      <ClienteStack.Screen name="ClienteRestaurantes" component={ClienteRestaurantesScreen} />
      <ClienteStack.Screen name="ClientePerfil" component={ClientePerfilScreen} />
      <ClienteStack.Screen name="ClienteMeusEnderecos" component={ClienteMeusEnderecosScreen} />
      <ClienteStack.Screen name="ClienteAlterarSenha" component={ClienteAlterarSenhaScreen} />
      <ClienteStack.Screen name="ClienteTickets" component={ClienteTicketsScreen} />
      <ClienteStack.Screen name="RestauranteCardapio" component={RestauranteCardapioScreen} />
    </ClienteStack.Navigator>
  );
}

function AdminStackNavigator(): React.JSX.Element {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminCriar" component={AdminCriarScreen} />
    </AdminStack.Navigator>
  );
}

function EntregadorStackNavigator(): React.JSX.Element {
  return (
    <EntregadorStack.Navigator screenOptions={{ headerShown: false }}>
      <EntregadorStack.Screen name="EntregadorArea" component={EntregadorAreaScreen} />
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
    parts.push({ name: 'TabCliente', component: ClienteStackNavigator, title: 'Restaurantes' });
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

  if (parts.length === 1) {
    const C = parts[0].component;
    return <C />;
  }

  return (
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
}

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
