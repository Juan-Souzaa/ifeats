import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteCarrinhoStackParamList } from '../navigation/types';
import { useClienteCheckoutViewModel } from '../hooks/useClienteCheckoutViewModel';
import {
  Card,
  ErrorBanner,
  MoneyText,
  PrimaryButton,
  ScreenShell,
  StepIndicator,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import type { MetodoPagamento } from '../types/api';
import { resolveMediaUrl } from '../utils/imageUrl';

type Props = NativeStackScreenProps<ClienteCarrinhoStackParamList, 'ClienteCheckout'>;

const STEPS = ['Resumo', 'Pagamento', 'Confirmação'];

const METODOS: { key: MetodoPagamento; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'PIX', label: 'PIX', icon: 'qr-code-2' },
  { key: 'CASH', label: 'Dinheiro', icon: 'payments' },
  { key: 'CREDIT_CARD', label: 'Cartão', icon: 'credit-card' },
];

export function ClienteCheckoutScreen({ navigation, route }: Props): React.JSX.Element {
  const { restauranteId } = route.params;
  const c = useThemeColors();
  const vm = useClienteCheckoutViewModel(restauranteId);

  const onConfirmar = async () => {
    const res = await vm.confirmar();
    if (res) {
      navigation.replace('ClienteCheckoutConfirmacao', {
        pedidoId: res.pedido.id,
        total: Number(res.pedido.total),
        metodoPagamento: res.pedido.metodoPagamento,
        qrCode: res.pagamento.qrCode,
        qrCodeImageUrl: res.pagamento.qrCodeImageUrl,
        statusPagamento: res.pagamento.status,
      });
    }
  };

  if (vm.loading) {
    return (
      <ScreenShell title="Checkout" onBack={() => navigation.goBack()} scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Checkout"
      onBack={() => (vm.step > 0 ? vm.setStep(vm.step - 1) : navigation.goBack())}
      footer={
        vm.step < 2 ? (
          <View style={[styles.footer, { borderTopColor: c.border, backgroundColor: c.shell }]}>
            <PrimaryButton
              label={vm.step === 0 ? 'Continuar' : 'Confirmar pedido'}
              onPress={() => {
                if (vm.step === 0) vm.setStep(1);
                else void onConfirmar();
              }}
              loading={vm.submitting}
              disabled={!vm.carrinho?.itens?.length}
            />
          </View>
        ) : undefined
      }
    >
      <StepIndicator steps={STEPS} current={vm.step} />
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      {vm.step === 0 ? (
        <>
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[styles.secTitle, { color: c.text }]}>Resumo</Text>
            {vm.carrinho?.itens?.map((i) => {
              const foto = resolveMediaUrl(i.pratoFotoUrl);
              return (
                <View key={i.id} style={styles.resumoRow}>
                  {foto ? (
                    <Image source={{ uri: foto }} style={styles.itemThumb} resizeMode="cover" />
                  ) : (
                    <View style={[styles.itemThumb, styles.itemThumbPh, { backgroundColor: c.border }]}>
                      <MaterialIcons name="restaurant" size={20} color={c.muted} />
                    </View>
                  )}
                  <Text style={[styles.resumoNome, { color: c.text }]}>
                    {i.quantidade}x {i.pratoNome}
                  </Text>
                  <MoneyText value={i.subtotal} />
                </View>
              );
            })}
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <View style={styles.resumoRow}>
              <Text style={{ color: c.sub }}>Total</Text>
              <MoneyText value={vm.carrinho?.total} accent />
            </View>
          </Card>

          <View style={styles.endHeader}>
            <Text style={[styles.secTitle, { color: c.text, marginBottom: 0 }]}>Endereço de entrega</Text>
            <Pressable
              onPress={() =>
                navigation.getParent()?.navigate('TabClienteInicio', { screen: 'ClienteMeusEnderecos' })
              }
              hitSlop={8}
            >
              <Text style={{ color: palette.primary, fontWeight: '700', fontSize: 13 }}>Gerenciar</Text>
            </Pressable>
          </View>
          {vm.enderecos.length === 0 ? (
            <Text style={{ color: c.sub, marginBottom: spacing.lg }}>
              Usaremos o endereço principal do seu cadastro.
            </Text>
          ) : (
            vm.enderecos.map((e) => {
              const sel = e.id === vm.enderecoId;
              return (
                <Pressable
                  key={e.id}
                  onPress={() => vm.setEnderecoId(e.id)}
                  style={[
                    styles.endCard,
                    { borderColor: sel ? palette.primary : c.border, backgroundColor: c.inputBg },
                  ]}
                >
                  <MaterialIcons
                    name={sel ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={22}
                    color={sel ? palette.primary : c.muted}
                  />
                  <Text style={{ color: c.text, flex: 1, fontSize: 14 }}>
                    {e.logradouro}, {e.numero} — {e.bairro}, {e.cidade}
                  </Text>
                </Pressable>
              );
            })
          )}

          <TextInput
            value={vm.observacoes}
            onChangeText={vm.setObservacoes}
            placeholder="Observações (opcional)"
            placeholderTextColor={c.muted}
            multiline
            style={[
              styles.obsInput,
              { borderColor: c.border, backgroundColor: c.inputBg, color: c.text },
            ]}
          />
        </>
      ) : (
        <>
          <Text style={[styles.secTitle, { color: c.text }]}>Forma de pagamento</Text>
          <View style={styles.metodos}>
            {METODOS.map((m) => {
              const on = vm.metodo === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => vm.setMetodo(m.key)}
                  style={[
                    styles.metodoTile,
                    {
                      borderColor: on ? palette.primary : c.border,
                      backgroundColor: on ? 'rgba(236,73,19,0.1)' : c.inputBg,
                    },
                  ]}
                >
                  <MaterialIcons name={m.icon} size={28} color={on ? palette.primary : c.muted} />
                  <Text style={{ color: on ? palette.primary : c.text, fontWeight: '700' }}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {vm.metodo === 'CASH' ? (
            <TextInput
              value={vm.troco}
              onChangeText={vm.setTroco}
              placeholder="Troco para (opcional)"
              placeholderTextColor={c.muted}
              keyboardType="decimal-pad"
              style={[
                styles.obsInput,
                { borderColor: c.border, backgroundColor: c.inputBg, color: c.text },
              ]}
            />
          ) : null}

          {vm.metodo === 'CREDIT_CARD' ? (
            <Card>
              <Text style={[styles.secTitle, { color: c.text }]}>Dados do cartão</Text>
              <TextInput
                value={vm.numeroCartao}
                onChangeText={vm.setNumeroCartao}
                placeholder="Número do cartão"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                maxLength={19}
                style={[styles.field, { borderColor: c.border, color: c.text, backgroundColor: c.shell }]}
              />
              <TextInput
                value={vm.nomeTitular}
                onChangeText={vm.setNomeTitular}
                placeholder="Nome no cartão"
                placeholderTextColor={c.muted}
                style={[styles.field, { borderColor: c.border, color: c.text, backgroundColor: c.shell }]}
              />
              <View style={styles.cardRow}>
                <TextInput
                  value={vm.validade}
                  onChangeText={vm.setValidade}
                  placeholder="MM/AA"
                  placeholderTextColor={c.muted}
                  maxLength={5}
                  style={[
                    styles.field,
                    styles.fieldHalf,
                    { borderColor: c.border, color: c.text, backgroundColor: c.shell },
                  ]}
                />
                <TextInput
                  value={vm.cvv}
                  onChangeText={vm.setCvv}
                  placeholder="CVV"
                  placeholderTextColor={c.muted}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  style={[
                    styles.field,
                    styles.fieldHalf,
                    { borderColor: c.border, color: c.text, backgroundColor: c.shell },
                  ]}
                />
              </View>
            </Card>
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  secTitle: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  endHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resumoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
  },
  itemThumbPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumoNome: { flex: 1, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, marginVertical: spacing.md },
  endCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  obsInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 80,
    marginTop: spacing.lg,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  metodos: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  metodoTile: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.sm,
  },
  field: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  cardRow: { flexDirection: 'row', gap: spacing.sm },
  fieldHalf: { flex: 1 },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
