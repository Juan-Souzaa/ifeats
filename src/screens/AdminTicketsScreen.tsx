import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AdminStackParamList } from '../navigation/types';

import type { StatusTicket, TipoTicket } from '../types/api';

import { useAdminTicketsViewModel } from '../hooks/useAdminOpsViewModel';

import {

  Card,

  EmptyState,

  ErrorBanner,

  ScreenShell,

  SkeletonList,

  TicketStatusChip,

  useThemeColors,

} from '../components/ui';

import { formatStatusTicket, formatTipoTicket } from '../utils/ticketStatus';

import { palette } from '../theme/colors';

import { spacing, radius } from '../theme/spacing';



type Props = NativeStackScreenProps<AdminStackParamList, 'AdminTickets'>;



const FILTROS: { key: StatusTicket | null; label: string }[] = [

  { key: null, label: 'Todos' },

  { key: 'ABERTO', label: formatStatusTicket('ABERTO') },

  { key: 'EM_ANDAMENTO', label: formatStatusTicket('EM_ANDAMENTO') },

  { key: 'RESOLVIDO', label: formatStatusTicket('RESOLVIDO') },

  { key: 'FECHADO', label: formatStatusTicket('FECHADO') },

];



const FILTROS_TIPO: { key: TipoTicket | null; label: string }[] = [
  { key: null, label: 'Todos tipos' },
  { key: 'RECLAMACAO', label: formatTipoTicket('RECLAMACAO') },
  { key: 'SUPORTE_TECNICO', label: formatTipoTicket('SUPORTE_TECNICO') },
  { key: 'SUGESTAO', label: formatTipoTicket('SUGESTAO') },
];

export function AdminTicketsScreen({ navigation }: Props): React.JSX.Element {

  const c = useThemeColors();

  const vm = useAdminTicketsViewModel();



  return (

    <ScreenShell title="Tickets" onBack={() => navigation.goBack()} scroll={false}>

      <View style={styles.body}>

        {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}



        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={false}

          style={styles.filtrosScroll}

          contentContainerStyle={styles.filtros}

        >

          {FILTROS.map((f) => {

            const on = vm.statusFiltro === f.key;

            return (

              <Pressable

                key={f.key ?? 'todos'}

                onPress={() => vm.setStatusFiltro(f.key)}

                style={[styles.filtroChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}

              >

                <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>

                  {f.label}

                </Text>

              </Pressable>

            );

          })}

        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
          contentContainerStyle={styles.filtros}
        >
          {FILTROS_TIPO.map((f) => {
            const on = vm.tipoFiltro === f.key;
            return (
              <Pressable
                key={f.key ?? 'tipo-todos'}
                onPress={() => vm.setTipoFiltro(f.key)}
                style={[styles.filtroChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
              >
                <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {vm.loading ? (

          <SkeletonList />

        ) : (

          <FlatList

            style={styles.list}

            data={vm.tickets}

            keyExtractor={(t) => String(t.id)}

            refreshControl={

              <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />

            }

            contentContainerStyle={vm.tickets.length === 0 ? styles.empty : styles.listContent}

            ListEmptyComponent={

              <EmptyState

                icon="support-agent"

                title="Nenhum ticket"

                subtitle={

                  vm.statusFiltro

                    ? `Não há chamados com status "${formatStatusTicket(vm.statusFiltro)}".`

                    : 'Não há chamados registrados.'

                }

              />

            }

            renderItem={({ item }) => (

              <Pressable onPress={() => navigation.navigate('AdminTicketDetalhe', { ticketId: item.id })}>

                <Card style={styles.card}>

                  <View style={styles.row}>

                    <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>

                      {item.titulo}

                    </Text>

                    <TicketStatusChip status={item.status} />

                  </View>

                  <Text style={{ color: c.sub, fontSize: 13 }}>{formatTipoTicket(item.tipo)}</Text>

                  <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }}>

                    {item.criadoPorNome} · {new Date(item.criadoEm).toLocaleString('pt-BR')}

                  </Text>

                </Card>

              </Pressable>

            )}

          />

        )}

      </View>

    </ScreenShell>

  );

}



const styles = StyleSheet.create({

  body: { flex: 1 },

  filtrosScroll: { flexGrow: 0, flexShrink: 0, marginBottom: spacing.md },

  filtros: { gap: spacing.sm, alignItems: 'center' },

  filtroChip: {

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

    borderRadius: radius.full,

    alignSelf: 'center',

  },

  list: { flex: 1 },

  empty: { flexGrow: 1 },

  listContent: { paddingBottom: spacing.xxl },

  card: { marginBottom: spacing.md },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },

  title: { fontSize: 16, fontWeight: '700', flex: 1 },

});

