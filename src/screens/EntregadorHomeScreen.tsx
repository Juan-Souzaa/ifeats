import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { EntregadorStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useEntregadorHomeViewModel } from '../hooks/useEntregadorHomeViewModel';
import {
  Card,
  ErrorBanner,
  HubMenuRow,
  HubSectionTitle,
  ScreenShell,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorHome'>;

export function EntregadorHomeScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const { setToken } = useAuth();
  const vm = useEntregadorHomeViewModel();
  const disponivel = vm.perfil?.disponibilidade === 'AVAILABLE';

  return (
    <ScreenShell
      title="Minhas entregas"
      scroll
      rightAction={
        <Pressable onPress={() => void setToken(null)} hitSlop={10} accessibilityLabel="Sair">
          <MaterialIcons name="logout" size={22} color={palette.primary} />
        </Pressable>
      }
    >
      {vm.loading && !vm.perfil ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={palette.primary} size="large" />
      ) : vm.error ? (
        <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} />
      ) : vm.perfil ? (
        <>
          <Card style={styles.hero}>
            <View style={[styles.iconWrap, { backgroundColor: c.chipMutedBg }]}>
              <MaterialIcons name="delivery-dining" size={32} color={palette.primary} />
            </View>
            <Text style={[styles.nome, { color: c.text }]}>{vm.perfil.nome}</Text>
            <Text style={[styles.meta, { color: c.sub }]}>{vm.perfil.email}</Text>
            <View style={[styles.statusPill, { backgroundColor: disponivel ? '#16a34a22' : `${c.chipMutedBg}` }]}>
              <View style={[styles.statusDot, { backgroundColor: disponivel ? '#16a34a' : c.muted }]} />
              <Text style={[styles.statusText, { color: disponivel ? '#16a34a' : c.sub }]}>
                {disponivel ? 'Disponível' : 'Indisponível'}
              </Text>
            </View>
          </Card>

          <Card style={styles.availCard}>
            <View style={styles.availText}>
              <Text style={{ color: c.text, fontWeight: '700' }}>
                {disponivel ? 'Recebendo pedidos' : 'Pausado'}
              </Text>
              <Text style={{ color: c.sub, fontSize: 12 }}>
                {disponivel ? 'Você aparece para novas entregas' : 'Ative para aceitar entregas'}
              </Text>
            </View>
            <Switch
              value={disponivel}
              onValueChange={() => void vm.toggleDisponibilidade()}
              trackColor={{ false: c.border, true: palette.primary }}
              thumbColor={palette.white}
            />
          </Card>

          <HubSectionTitle>Entregas</HubSectionTitle>
          <View style={styles.menu}>
            <HubMenuRow
              icon="local-shipping"
              label="Gerenciar entregas"
              onPress={() => navigation.navigate('EntregadorArea')}
            />
          </View>

          <HubSectionTitle>Conta</HubSectionTitle>
          <View style={styles.menu}>
            <HubMenuRow icon="person" label="Meu perfil" onPress={() => navigation.navigate('EntregadorPerfil')} />
            <HubMenuRow icon="payments" label="Ganhos" onPress={() => navigation.navigate('EntregadorGanhos')} />
          </View>
        </>
      ) : null}
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
  nome: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  meta: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },
  availCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  availText: { flex: 1, marginRight: spacing.sm },
  menu: { gap: spacing.sm },
});
