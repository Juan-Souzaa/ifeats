import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteCarrinhoStackParamList, ClienteTabParamList } from '../navigation/types';
import { useClienteCarrinhoViewModel } from '../hooks/useClienteCarrinhoViewModel';
import {
  Card,
  EmptyState,
  ErrorBanner,
  MoneyText,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { resolveMediaUrl } from '../utils/imageUrl';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<ClienteCarrinhoStackParamList>,
  NativeStackNavigationProp<ClienteTabParamList>
>;

export function ClienteCarrinhoScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const c = useThemeColors();
  const vm = useClienteCarrinhoViewModel();
  const itens = vm.carrinho?.itens ?? [];
  const temItens = itens.length > 0;

  const footer = temItens ? (
    <View style={[styles.footer, { borderTopColor: c.border, backgroundColor: c.shell }]}>
      <View style={styles.footerRow}>
        <Text style={[styles.footerLabel, { color: c.sub }]}>Subtotal</Text>
        <MoneyText value={vm.carrinho?.subtotal} style={{ color: c.text }} />
      </View>
      {(vm.carrinho?.desconto ?? 0) > 0 ? (
        <View style={styles.footerRow}>
          <Text style={[styles.footerLabel, { color: c.success }]}>Desconto</Text>
          <MoneyText value={-(vm.carrinho?.desconto ?? 0)} style={{ color: c.success }} />
        </View>
      ) : null}
      <View style={[styles.footerRow, styles.totalRow]}>
        <Text style={[styles.totalLabel, { color: c.text }]}>Total</Text>
        <MoneyText value={vm.carrinho?.total} accent style={{ fontSize: 20 }} />
      </View>
      <PrimaryButton
        label="Finalizar pedido"
        onPress={() => {
          if (vm.restauranteId) {
            navigation.navigate('ClienteCheckout', { restauranteId: vm.restauranteId });
          }
        }}
        disabled={!vm.restauranteId || vm.busy}
        loading={vm.busy}
      />
    </View>
  ) : undefined;

  return (
    <ScreenShell title="Carrinho" scroll footer={footer}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      <Card style={styles.cupomCard}>
        <Text style={[styles.secTitle, { color: c.text }]}>Cupom de desconto</Text>
        {vm.carrinho?.cupom ? (
          <View style={[styles.cupomApplied, { backgroundColor: c.successBg }]}>
            <MaterialIcons name="local-offer" size={20} color={c.success} />
            <Text style={[styles.cupomCode, { color: c.success }]}>{vm.carrinho.cupom.codigo}</Text>
            <Pressable onPress={() => void vm.removerCupom()} hitSlop={8}>
              <MaterialIcons name="close" size={20} color={c.success} />
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.cupomRow}>
              <TextInput
                value={vm.cupomCodigo}
                onChangeText={vm.setCupomCodigo}
                placeholder="Código do cupom"
                placeholderTextColor={c.muted}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  { borderColor: c.border, backgroundColor: c.inputBg, color: c.text },
                ]}
              />
              <Pressable
                onPress={() => void vm.aplicarCupom()}
                style={[styles.applyBtn, { backgroundColor: palette.primary }]}
                disabled={vm.busy}
              >
                <Text style={styles.applyBtnText}>Aplicar</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => void vm.abrirCupons()} style={styles.verCupons}>
              <Text style={{ color: palette.primary, fontWeight: '700', fontSize: 14 }}>
                Ver cupons disponíveis
              </Text>
            </Pressable>
          </>
        )}
      </Card>

      {vm.loading ? (
        <SkeletonList count={3} />
      ) : !temItens ? (
        <EmptyState
          icon="shopping-cart"
          title="Seu carrinho está vazio"
          subtitle="Explore restaurantes e adicione pratos deliciosos."
          actionLabel="Explorar restaurantes"
          onAction={() => navigation.getParent()?.navigate('TabClienteInicio')}
        />
      ) : (
        itens.map((item) => {
          const foto = resolveMediaUrl(item.pratoFotoUrl);
          return (
          <Card key={item.id} style={styles.itemCard}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.itemGrad} resizeMode="cover" />
            ) : (
              <LinearGradient colors={['#fb923c', '#ef4444']} style={styles.itemGrad}>
                <MaterialIcons name="restaurant" size={28} color={palette.white} />
              </LinearGradient>
            )}
            <View style={styles.itemBody}>
              <Text style={[styles.itemNome, { color: c.text }]} numberOfLines={2}>
                {item.pratoNome}
              </Text>
              <MoneyText value={item.precoUnitario} style={{ color: c.sub, fontSize: 13 }} />
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => void vm.alterarQuantidade(item.id, item.quantidade - 1)}
                  style={[styles.stepBtn, { borderColor: c.border }]}
                  disabled={vm.busy || item.quantidade <= 1}
                >
                  <MaterialIcons name="remove" size={18} color={c.text} />
                </Pressable>
                <Text style={[styles.qty, { color: c.text }]}>{item.quantidade}</Text>
                <Pressable
                  onPress={() => void vm.alterarQuantidade(item.id, item.quantidade + 1)}
                  style={[styles.stepBtn, { borderColor: c.border }]}
                  disabled={vm.busy}
                >
                  <MaterialIcons name="add" size={18} color={c.text} />
                </Pressable>
              </View>
            </View>
            <View style={styles.itemRight}>
              <MoneyText value={item.subtotal} accent />
              <Pressable onPress={() => void vm.remover(item.id)} hitSlop={8} disabled={vm.busy}>
                <MaterialIcons name="delete-outline" size={22} color={c.error} />
              </Pressable>
            </View>
          </Card>
          );
        })
      )}

      {vm.busy && temItens ? (
        <ActivityIndicator color={palette.primary} style={{ marginTop: spacing.md }} />
      ) : null}

      <Modal visible={vm.modalCupons} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: c.shell }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.text }]}>Cupons disponíveis</Text>
              <Pressable onPress={() => vm.setModalCupons(false)}>
                <MaterialIcons name="close" size={24} color={c.sub} />
              </Pressable>
            </View>
            {vm.cuponsDisponiveis.length === 0 ? (
              <Text style={[styles.modalEmpty, { color: c.sub }]}>Nenhum cupom disponível no momento.</Text>
            ) : (
              vm.cuponsDisponiveis.map((cup) => (
                <Pressable
                  key={cup.id}
                  onPress={() => void vm.aplicarCupom(cup.codigo)}
                  style={[styles.cupomOption, { borderColor: c.border }]}
                >
                  <MaterialIcons name="local-offer" size={22} color={palette.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cupomOptCode, { color: c.text }]}>{cup.codigo}</Text>
                    <Text style={{ color: c.sub, fontSize: 12 }}>
                      {cup.tipoDesconto === 'PERCENTUAL'
                        ? `${cup.valorDesconto}% off`
                        : `R$ ${cup.valorDesconto} off`}{' '}
                      · mín. {cup.valorMinimo}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={c.muted} />
                </Pressable>
              ))
            )}
            <SecondaryButton label="Fechar" onPress={() => vm.setModalCupons(false)} />
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cupomCard: { marginBottom: spacing.lg },
  secTitle: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  cupomRow: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
  },
  applyBtn: {
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  applyBtnText: { color: palette.white, fontWeight: '800' },
  verCupons: { marginTop: spacing.md },
  cupomApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  cupomCode: { flex: 1, fontWeight: '800', fontSize: 15 },
  itemCard: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  itemGrad: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: { flex: 1, gap: 4 },
  itemNome: { fontSize: 15, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 16, fontWeight: '800', minWidth: 24, textAlign: 'center' },
  itemRight: { alignItems: 'flex-end', gap: spacing.sm },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 14 },
  totalRow: { marginTop: spacing.xs, marginBottom: spacing.md },
  totalLabel: { fontSize: 17, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    maxHeight: '70%',
    gap: spacing.md,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalEmpty: { textAlign: 'center', paddingVertical: spacing.xl },
  cupomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  cupomOptCode: { fontSize: 16, fontWeight: '800' },
});
