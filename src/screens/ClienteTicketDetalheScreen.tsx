import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteTicketDetalheViewModel } from '../hooks/useClienteTicketDetalheViewModel';
import {
  Card,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  TicketStatusChip,
  useThemeColors,
} from '../components/ui';
import { formatPrioridadeTicket, formatTipoTicket } from '../utils/ticketStatus';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteTicketDetalhe'>;

export function ClienteTicketDetalheScreen({ navigation, route }: Props): React.JSX.Element {
  const { ticketId } = route.params;
  const c = useThemeColors();
  const vm = useClienteTicketDetalheViewModel(ticketId);

  if (vm.loading && !vm.detalhe) {
    return (
      <ScreenShell title="Ticket" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  const t = vm.detalhe?.ticket;

  return (
    <ScreenShell title={t ? `#${t.id}` : 'Ticket'} onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      {t ? (
        <>
          <Card>
            <View style={styles.row}>
              <Text style={[styles.title, { color: c.text }]}>{t.titulo}</Text>
              <TicketStatusChip status={t.status} />
            </View>
            <Text style={{ color: c.sub, marginTop: spacing.xs }}>
              {formatTipoTicket(t.tipo)} · {formatPrioridadeTicket(t.prioridade)}
            </Text>
            <Text style={{ color: c.text, marginTop: spacing.md, lineHeight: 20 }}>{t.descricao}</Text>
          </Card>
          <Text style={[styles.sec, { color: c.text }]}>Comentários</Text>
          <FlatList
            data={vm.detalhe?.comentarios ?? []}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: spacing.md }}
            ListEmptyComponent={
              <Text style={{ color: c.muted, textAlign: 'center', padding: spacing.lg }}>
                Nenhum comentário ainda.
              </Text>
            }
            renderItem={({ item }) => (
              <Card style={styles.comment}>
                <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }}>{item.autorNome}</Text>
                <Text style={{ color: c.sub, fontSize: 11 }}>
                  {new Date(item.criadoEm).toLocaleString('pt-BR')}
                </Text>
                <Text style={{ color: c.text, marginTop: spacing.xs }}>{item.comentario}</Text>
              </Card>
            )}
          />
          <View style={[styles.reply, { borderTopColor: c.border }]}>
            <TextInput
              value={vm.comentario}
              onChangeText={vm.setComentario}
              placeholder="Escreva um comentário..."
              placeholderTextColor={c.muted}
              style={[styles.input, { borderColor: c.border, color: c.text }]}
              multiline
            />
            <PrimaryButton
              label="Enviar"
              loading={vm.submitting}
              onPress={() => void vm.enviarComentario()}
            />
          </View>
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  title: { fontSize: 18, fontWeight: '800', flex: 1 },
  sec: { fontSize: 16, fontWeight: '800', marginTop: spacing.lg, marginBottom: spacing.sm },
  list: { flex: 1 },
  comment: { marginBottom: spacing.sm },
  reply: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 60, fontSize: 15 },
});
