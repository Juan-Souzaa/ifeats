import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteTicketsViewModel } from '../hooks/useClienteTicketsViewModel';
import {
  Card,
  EmptyState,
  ErrorBanner,
  ScreenShell,
  SkeletonList,
  TicketStatusChip,
  useThemeColors,
} from '../components/ui';
import { formatTipoTicket } from '../utils/ticketStatus';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteTickets'>;

export function ClienteTicketsScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useClienteTicketsViewModel();

  return (
    <ScreenShell
      title="Tickets de suporte"
      onBack={() => navigation.goBack()}
      scroll={false}
      rightAction={
        <Pressable onPress={() => navigation.navigate('ClienteTicketCriar')} hitSlop={12}>
          <MaterialIcons name="add" size={26} color={palette.primary} />
        </Pressable>
      }
    >
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.tickets}
          keyExtractor={(t) => String(t.id)}
          contentContainerStyle={vm.tickets.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="support-agent"
              title="Nenhum ticket"
              subtitle="Abra um chamado se precisar de ajuda."
            />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('ClienteTicketDetalhe', { ticketId: item.id })}>
              <Card style={styles.card}>
                <View style={styles.row}>
                  <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
                    {item.titulo}
                  </Text>
                  <TicketStatusChip status={item.status} />
                </View>
                <Text style={{ color: c.sub, fontSize: 13 }}>{formatTipoTicket(item.tipo)}</Text>
                <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }}>
                  {new Date(item.criadoEm).toLocaleString('pt-BR')}
                </Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  empty: { flexGrow: 1 },
  list: { paddingBottom: spacing.xl },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 16, fontWeight: '700', flex: 1 },
});
