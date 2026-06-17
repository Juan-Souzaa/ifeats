import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { palette } from '../../theme/colors';
import type { MainTabParamList } from '../types';
import { ClienteRootNavigator } from './ClienteNavigator';
import { RestauranteStackNavigator } from './RestauranteNavigator';
import { AdminStackNavigator } from './AdminNavigator';
import { EntregadorStackNavigator } from './EntregadorNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

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

export function AuthenticatedRoot(): React.JSX.Element {
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
