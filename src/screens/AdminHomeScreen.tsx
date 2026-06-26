import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { AdminStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { Card, HubMenuRow, HubSectionTitle, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { StyleSheet, Text, View } from 'react-native';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminHome'>;

export function AdminHomeScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const { setToken } = useAuth();

  return (
    <ScreenShell
      title="Painel admin"
      scroll
      rightAction={
        <Pressable onPress={() => void setToken(null)} hitSlop={10} accessibilityLabel="Sair">
          <MaterialIcons name="logout" size={22} color={palette.primary} />
        </Pressable>
      }
    >
      <Card style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: c.chipMutedBg }]}>
          <MaterialIcons name="admin-panel-settings" size={32} color={palette.primary} />
        </View>
        <Text style={[styles.title, { color: c.text }]}>Gestão IFeats</Text>
        <Text style={[styles.sub, { color: c.sub }]}>
          Moderação, operação e configurações da plataforma.
        </Text>
      </Card>

      <HubSectionTitle>Cadastros</HubSectionTitle>
      <View style={styles.menu}>
        <HubMenuRow
          icon="restaurant"
          label="Todos os restaurantes"
          onPress={() => navigation.navigate('AdminRestaurantes')}
        />
        <HubMenuRow
          icon="delivery-dining"
          label="Todos os entregadores"
          onPress={() => navigation.navigate('AdminEntregadores')}
        />
        <HubMenuRow icon="people" label="Clientes" onPress={() => navigation.navigate('AdminClientes')} />
      </View>

      <HubSectionTitle>Moderação</HubSectionTitle>
      <View style={styles.menu}>
        <HubMenuRow
          icon="store"
          label="Restaurantes pendentes"
          onPress={() => navigation.navigate('AdminRestaurantesPendentes')}
        />
        <HubMenuRow
          icon="two-wheeler"
          label="Entregadores pendentes"
          onPress={() => navigation.navigate('AdminEntregadoresPendentes')}
        />
      </View>

      <HubSectionTitle>Operação</HubSectionTitle>
      <View style={styles.menu}>
        <HubMenuRow
          icon="receipt-long"
          label="Pedidos em preparo"
          onPress={() => navigation.navigate('AdminPedidosAndamento')}
        />
        <HubMenuRow
          icon="support-agent"
          label="Tickets de suporte"
          onPress={() => navigation.navigate('AdminTickets')}
        />
      </View>

      <HubSectionTitle>Financeiro</HubSectionTitle>
      <View style={styles.menu}>
        <HubMenuRow icon="local-offer" label="Cupons de desconto" onPress={() => navigation.navigate('AdminCupons')} />
        <HubMenuRow icon="insights" label="Relatórios" onPress={() => navigation.navigate('AdminRelatorios')} />
        <HubMenuRow icon="percent" label="Taxas da plataforma" onPress={() => navigation.navigate('AdminTaxas')} />
        <HubMenuRow icon="currency-exchange" label="Reembolsos" onPress={() => navigation.navigate('AdminReembolso')} />
      </View>

      <HubSectionTitle>Equipe</HubSectionTitle>
      <View style={styles.menu}>
        <HubMenuRow
          icon="group"
          label="Gerenciar administradores"
          onPress={() => navigation.navigate('AdminCriar')}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: spacing.sm },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20, paddingHorizontal: spacing.sm },
  menu: { gap: spacing.sm },
});
