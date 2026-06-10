import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import type { StatusTicket } from '../types/api';
import { useAdminTicketDetalheViewModel } from '../hooks/useAdminOpsViewModel';
import * as adminService from '../services/adminService';
import {
  Card,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  TicketStatusChip,
  useThemeColors,
} from '../components/ui';
import { formatPrioridadeTicket, formatTipoTicket } from '../utils/ticketStatus';
import { extractErrorMessage } from '../utils/errors';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminTicketDetalhe'>;

export function AdminTicketDetalheScreen({ navigation, route }: Props): React.JSX.Element {
  const { ticketId } = route.params;
  const c = useThemeColors();
  const vm = useAdminTicketDetalheViewModel(ticketId);

  const handleAtribuir = (): void => {
    void (async () => {
      try {
        const admins = await adminService.listarAdmins();
        if (admins.length === 0) {
          Alert.alert('Atribuir ticket', 'Nenhum administrador disponível.');
          return;
        }
        if (admins.length === 1) {
          await vm.atribuir(admins[0].id);
          return;
        }
        Alert.alert(
          'Atribuir ticket',
          'Selecione um administrador:',
          [
            ...admins.map((a) => ({
              text: a.username,
              onPress: () => void vm.atribuir(a.id),
            })),
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      } catch (e) {
        Alert.alert('Erro', extractErrorMessage(e));
      }
    })();
  };

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
            <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.sm }}>
              Aberto por {t.criadoPorNome}
            </Text>
            {t.atribuidoANome ? (
              <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }}>
                Atribuído a {t.atribuidoANome}
              </Text>
            ) : null}
          </Card>

          <SecondaryButton
            label="Atribuir"
            onPress={handleAtribuir}
            loading={vm.atribuindo}
            disabled={vm.atribuindo}
          />

          <Text style={[styles.sec, { color: c.text }]}>Alterar status</Text>
          <View style={styles.statusRow}>
            {(['EM_ANDAMENTO', 'RESOLVIDO'] as StatusTicket[]).map((s) => {
              const on = t.status === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => void vm.atualizarStatus(s)}
                  style={[styles.statusBtn, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
                >
                  <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>
                    {s === 'EM_ANDAMENTO' ? 'Em andamento' : 'Resolvido'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

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

          <View style={[styles.novoComentario, { borderTopColor: c.border }]}>
            <Text style={[styles.sec, { color: c.text, marginTop: 0 }]}>Novo comentário</Text>
            <TextInput
              value={vm.comentario}
              onChangeText={vm.setComentario}
              placeholder="Escreva um comentário..."
              placeholderTextColor={c.muted}
              style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
              multiline
            />
            <PrimaryButton
              label="Enviar comentário"
              loading={vm.submittingComentario}
              onPress={() => void vm.enviarComentario()}
            />
          </View>

          <View style={[styles.resolver, { borderTopColor: c.border }]}>
            <Text style={[styles.sec, { color: c.text, marginTop: 0 }]}>Resolução</Text>
            <TextInput
              value={vm.resolucao}
              onChangeText={vm.setResolucao}
              placeholder="Descreva a resolução do ticket..."
              placeholderTextColor={c.muted}
              style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
              multiline
            />
            <PrimaryButton label="Resolver ticket" onPress={() => void vm.resolver()} />
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
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  list: { flex: 1 },
  comment: { marginBottom: spacing.sm },
  novoComentario: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.sm },
  resolver: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.sm, marginTop: spacing.md },
  input: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, minHeight: 80, fontSize: 15 },
});
