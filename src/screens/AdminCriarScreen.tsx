import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { AdminStackParamList } from '../navigation/types';
import type { AdminResponseDTO } from '../types/api';
import { useAdminCriarViewModel } from '../hooks/useAdminCriarViewModel';
import { Card, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminCriar'>;

function iniciais(login: string): string {
  const base = login.includes('@') ? (login.split('@')[0] ?? login) : login;
  const clean = base.replace(/[^a-zA-Z0-9]/g, '');
  if (clean.length >= 2) return clean.slice(0, 2).toUpperCase();
  return (base.slice(0, 2) || '??').toUpperCase();
}

export function AdminCriarScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminCriarViewModel();

  return (
    <ScreenShell title="Equipe administrativa" onBack={() => navigation.goBack()} scroll>
      <Text style={[styles.hint, { color: c.sub }]}>
        Adicione novos administradores com acesso ao painel.
      </Text>

      <Card>
        <Field label="E-mail ou username" value={vm.username} onChangeText={vm.setUsername} c={c} />
        <Field label="Senha inicial" value={vm.password} onChangeText={vm.setPassword} secureTextEntry c={c} />
        {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
        {vm.successMessage ? <Text style={styles.ok}>{vm.successMessage}</Text> : null}
        <PrimaryButton label="Adicionar administrador" loading={vm.loading} onPress={() => void vm.submit()} />
      </Card>

      <View style={styles.equipeHeader}>
        <Text style={[styles.equipeTitle, { color: c.text }]}>Equipe atual</Text>
        <View style={[styles.countBadge, { backgroundColor: c.chipMutedBg }]}>
          <Text style={[styles.countText, { color: c.sub }]}>{vm.admins.length}</Text>
        </View>
      </View>

      {vm.listError ? <Text style={styles.error}>{vm.listError}</Text> : null}

      {vm.listLoading && vm.admins.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 16 }} color={palette.primary} />
      ) : null}

      {!vm.listLoading && !vm.listError && vm.admins.length === 0 ? (
        <Text style={[styles.emptyHint, { color: c.sub }]}>Nenhum administrador na lista.</Text>
      ) : null}

      <View style={styles.equipeList}>
        {vm.admins.map((m) => (
          <AdminRow key={m.id} admin={m} c={c} />
        ))}
      </View>
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  c,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  c: ReturnType<typeof useThemeColors>;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={c.muted}
        autoCapitalize="none"
        style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        {...rest}
      />
    </View>
  );
}

function AdminRow({
  admin,
  c,
}: {
  admin: AdminResponseDTO;
  c: ReturnType<typeof useThemeColors>;
}): React.JSX.Element {
  return (
    <View style={[styles.row, { borderColor: c.border }]}>
      <View style={[styles.avatar, { backgroundColor: c.chipMutedBg }]}>
        <Text style={[styles.avatarText, { color: c.text }]}>{iniciais(admin.username)}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>
          {admin.username}
        </Text>
        <Text style={{ color: c.sub, fontSize: 12 }}>Administrador</Text>
      </View>
      <MaterialIcons name="verified-user" size={20} color={palette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  error: { color: '#b91c1c', marginBottom: spacing.sm, fontSize: 14 },
  ok: { color: '#15803d', marginBottom: spacing.sm, fontSize: 14, fontWeight: '600' },
  equipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  equipeTitle: { fontSize: 16, fontWeight: '800' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  countText: { fontSize: 13, fontWeight: '600' },
  emptyHint: { fontSize: 14, lineHeight: 20 },
  equipeList: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', fontSize: 14 },
  rowBody: { flex: 1, minWidth: 0 },
  rowName: { fontWeight: '700', fontSize: 15 },
});
