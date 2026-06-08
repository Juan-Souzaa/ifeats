import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { AdminStackParamList } from '../navigation/types';
import type { CupomResponseDTO, TipoDesconto } from '../types/api';
import { useAdminCuponsViewModel } from '../hooks/useAdminCuponsViewModel';
import {
  Card,
  DateField,
  EmptyState,
  ErrorBanner,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { formatDataBR, parseApiDate } from '../utils/data';
import { formatPrecoBRL } from '../utils/preco';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminCupons'>;

function descontoLabel(cup: CupomResponseDTO): string {
  if (cup.tipoDesconto === 'PERCENTUAL') return `${cup.valorDesconto}% OFF`;
  return `${formatPrecoBRL(Number(cup.valorDesconto))} OFF`;
}

function CupomCard({
  item,
  busy,
  onEdit,
  onToggle,
}: {
  item: CupomResponseDTO;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
}): React.JSX.Element {
  const c = useThemeColors();
  const usoPct = item.usosMaximos > 0 ? Math.min(100, (item.usosAtuais / item.usosMaximos) * 100) : 0;
  const esgotado = item.usosAtuais >= item.usosMaximos;

  return (
    <Card style={styles.cupomCard}>
      <View style={styles.cupomHeader}>
        <View style={[styles.cupomIcon, { backgroundColor: `${palette.primary}18` }]}>
          <MaterialIcons name="local-offer" size={22} color={palette.primary} />
        </View>
        <View style={styles.cupomHeadText}>
          <Text style={[styles.codigo, { color: c.text }]}>{item.codigo}</Text>
          <Text style={[styles.descontoTag, { color: palette.primary }]}>{descontoLabel(item)}</Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: item.ativo && !esgotado ? c.successBg : c.chipMutedBg,
            },
          ]}
        >
          <Text
            style={{
              color: item.ativo && !esgotado ? c.success : c.muted,
              fontWeight: '700',
              fontSize: 11,
            }}
          >
            {!item.ativo ? 'Inativo' : esgotado ? 'Esgotado' : 'Ativo'}
          </Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <MetaItem icon="calendar-today" label="Vigência" value={`${formatDataBR(item.dataInicio)} – ${formatDataBR(item.dataFim)}`} />
        <MetaItem
          icon="shopping-cart"
          label="Pedido mín."
          value={Number(item.valorMinimo) > 0 ? formatPrecoBRL(Number(item.valorMinimo)) : 'Sem mínimo'}
        />
      </View>

      <View style={styles.usoBlock}>
        <View style={styles.usoRow}>
          <Text style={[styles.usoLabel, { color: c.sub }]}>Usos</Text>
          <Text style={[styles.usoVal, { color: c.text }]}>
            {item.usosAtuais} / {item.usosMaximos}
          </Text>
        </View>
        <View style={[styles.usoTrack, { backgroundColor: c.chipMutedBg }]}>
          <View style={[styles.usoFill, { width: `${usoPct}%`, backgroundColor: palette.primary }]} />
        </View>
      </View>

      <View style={styles.actions}>
        <SecondaryButton label="Editar" onPress={onEdit} disabled={busy} />
        <SecondaryButton
          label={item.ativo ? 'Desativar' : 'Ativar'}
          onPress={onToggle}
          disabled={busy}
        />
      </View>
    </Card>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.metaItem}>
      <MaterialIcons name={icon} size={16} color={c.muted} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.metaLabel, { color: c.muted }]}>{label}</Text>
        <Text style={[styles.metaValue, { color: c.text }]} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export function AdminCuponsScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminCuponsViewModel();
  const minFim = parseApiDate(vm.dataInicio) ?? undefined;

  const formHeader = (
    <View style={styles.formWrap}>
      <Card style={[styles.formCard, vm.editandoId ? styles.formEditing : null]}>
        <View style={styles.formTitleRow}>
          <MaterialIcons
            name={vm.editandoId ? 'edit' : 'add-circle-outline'}
            size={22}
            color={palette.primary}
          />
          <Text style={[styles.formTitle, { color: c.text }]}>
            {vm.editandoId ? 'Editar cupom' : 'Novo cupom'}
          </Text>
        </View>

        <LabeledInput
          label="Código"
          value={vm.codigo}
          onChangeText={vm.setCodigo}
          placeholder="Ex: IFEATS10"
          autoCapitalize="characters"
          hint="Será salvo em maiúsculas"
        />

        <Text style={[styles.groupLabel, { color: c.text }]}>Tipo de desconto</Text>
        <View style={styles.tipoRow}>
          {(['PERCENTUAL', 'VALOR_FIXO'] as TipoDesconto[]).map((t) => {
            const on = vm.tipoDesconto === t;
            return (
              <Pressable
                key={t}
                onPress={() => vm.setTipoDesconto(t)}
                style={[
                  styles.tipoChip,
                  { backgroundColor: on ? palette.primary : c.chipMutedBg, borderColor: on ? palette.primary : c.border },
                ]}
              >
                <MaterialIcons
                  name={t === 'PERCENTUAL' ? 'percent' : 'attach-money'}
                  size={18}
                  color={on ? palette.white : c.sub}
                />
                <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 13 }}>
                  {t === 'PERCENTUAL' ? 'Percentual' : 'Valor fixo'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.row2}>
          <View style={styles.col}>
            <LabeledInput
              label={vm.tipoDesconto === 'PERCENTUAL' ? 'Desconto (%)' : 'Desconto (R$)'}
              value={vm.valorDesconto}
              onChangeText={vm.setValorDesconto}
              placeholder={vm.tipoDesconto === 'PERCENTUAL' ? '10' : '15,00'}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.col}>
            <LabeledInput
              label="Pedido mínimo (R$)"
              value={vm.valorMinimo}
              onChangeText={vm.setValorMinimo}
              placeholder="0"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <LabeledInput
          label="Usos máximos"
          value={vm.usosMaximos}
          onChangeText={vm.setUsosMaximos}
          placeholder="100"
          keyboardType="number-pad"
          hint="Quantas vezes o cupom pode ser utilizado"
        />

        <Text style={[styles.groupLabel, { color: c.text }]}>Período de validade</Text>
        <DateField label="Data de início" value={vm.dataInicio} onChange={vm.setDataInicio} />
        <DateField
          label="Data de fim"
          value={vm.dataFim}
          onChange={vm.setDataFim}
          minimumDate={minFim}
        />

        {vm.editandoId ? (
          <View style={styles.formActions}>
            <PrimaryButton label="Salvar alterações" onPress={() => void vm.salvarEdicao()} loading={vm.busy} />
            <SecondaryButton label="Cancelar edição" onPress={vm.cancelarEdicao} disabled={vm.busy} />
          </View>
        ) : (
          <PrimaryButton label="Criar cupom" onPress={() => void vm.criar()} loading={vm.busy} />
        )}
      </Card>

      <Text style={[styles.listTitle, { color: c.text }]}>
        Cupons cadastrados {vm.lista.length > 0 ? `(${vm.lista.length})` : ''}
      </Text>
    </View>
  );

  return (
    <ScreenShell title="Cupons" onBack={() => navigation.goBack()} scroll={false} contentPadding={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      {vm.loading ? (
        <View style={{ padding: spacing.lg }}>
          {formHeader}
          <SkeletonList />
        </View>
      ) : (
        <FlatList
          data={vm.lista}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={formHeader}
          ListEmptyComponent={
            <EmptyState
              icon="local-offer"
              title="Nenhum cupom"
              subtitle="Crie o primeiro cupom usando o formulário acima."
            />
          }
          renderItem={({ item }) => (
            <CupomCard
              item={item}
              busy={vm.busy}
              onEdit={() => vm.iniciarEdicao(item)}
              onToggle={() => void vm.toggle(item)}
            />
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  formWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  formCard: { marginBottom: spacing.lg },
  formEditing: { borderWidth: 2, borderColor: palette.primary },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  formTitle: { fontSize: 17, fontWeight: '800' },
  groupLabel: { fontSize: 13, fontWeight: '700', marginBottom: spacing.sm },
  tipoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tipoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  row2: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  formActions: { gap: spacing.sm, marginTop: spacing.xs },
  listTitle: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  cupomCard: { marginBottom: spacing.md },
  cupomHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
  cupomIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupomHeadText: { flex: 1 },
  codigo: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  descontoTag: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  metaGrid: { gap: spacing.sm, marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  metaLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  metaValue: { fontSize: 13, fontWeight: '600', marginTop: 1 },
  usoBlock: { marginBottom: spacing.md },
  usoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  usoLabel: { fontSize: 12, fontWeight: '600' },
  usoVal: { fontSize: 12, fontWeight: '800' },
  usoTrack: { height: 6, borderRadius: radius.full, overflow: 'hidden' },
  usoFill: { height: '100%', borderRadius: radius.full },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
