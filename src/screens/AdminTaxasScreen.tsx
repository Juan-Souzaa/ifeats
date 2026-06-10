import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import type { TipoTaxa } from '../types/api';
import { useAdminTaxasViewModel } from '../hooks/useAdminOpsViewModel';
import {
  Card,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminTaxas'>;

const TIPOS: { key: TipoTaxa; label: string }[] = [
  { key: 'TAXA_RESTAURANTE', label: 'Restaurante' },
  { key: 'TAXA_ENTREGADOR', label: 'Entregador' },
];

export function AdminTaxasScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminTaxasViewModel();

  return (
    <ScreenShell title="Taxas da plataforma" onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      <View style={styles.tipos}>
        {TIPOS.map((t) => {
          const on = vm.tipoTaxa === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => vm.setTipoTaxa(t.key)}
              style={[styles.tipoChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700' }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={[styles.sec, { color: c.text }]}>Nova taxa (%)</Text>
        <TextInput
          value={vm.percentual}
          onChangeText={vm.setPercentual}
          placeholder="Ex: 10"
          placeholderTextColor={c.muted}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        />
        <PrimaryButton label="Criar configuração" onPress={() => void vm.criar()} loading={vm.submitting} />
      </Card>

      <Text style={[styles.sec, { color: c.text }]}>Histórico</Text>
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.historico}
          keyExtractor={(h) => String(h.id)}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          ListEmptyComponent={
            <Text style={{ color: c.muted, textAlign: 'center', padding: spacing.lg }}>Nenhuma configuração.</Text>
          }
          renderItem={({ item }) => (
            <Card style={{ marginBottom: spacing.sm }}>
              <View style={styles.histTop}>
                <Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>{item.percentual}%</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: item.ativo ? 'rgba(22,163,74,0.15)' : 'rgba(100,116,139,0.2)' },
                  ]}
                >
                  <Text style={{ color: item.ativo ? '#16a34a' : c.muted, fontWeight: '700', fontSize: 11 }}>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
              <Text style={{ color: c.sub, fontSize: 12 }}>
                {new Date(item.criadoEm).toLocaleString('pt-BR')}
              </Text>
            </Card>
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tipos: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tipoChip: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 15,
  },
  histTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
