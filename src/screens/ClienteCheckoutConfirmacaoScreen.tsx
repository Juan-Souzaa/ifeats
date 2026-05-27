import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteCarrinhoStackParamList } from '../navigation/types';
import { useClienteCheckoutConfirmacaoViewModel } from '../hooks/useClienteCheckoutConfirmacaoViewModel';
import { Card, MoneyText, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { uriImagemQr } from '../utils/qrImage';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteCarrinhoStackParamList, 'ClienteCheckoutConfirmacao'>;

function labelStatusPagamento(status: string | null | undefined): string {
  switch (status) {
    case 'PAID':
      return 'Pago';
    case 'PENDING':
      return 'Aguardando pagamento';
    case 'AUTHORIZED':
      return 'Autorizado';
    case 'REFUSED':
      return 'Recusado';
    case 'REFUNDED':
      return 'Reembolsado';
    default:
      return status ?? 'Processando';
  }
}

export function ClienteCheckoutConfirmacaoScreen({ navigation, route }: Props): React.JSX.Element {
  const { pedidoId, total, metodoPagamento, qrCode, qrCodeImageUrl, statusPagamento: initialStatus } =
    route.params;
  const c = useThemeColors();
  const vm = useClienteCheckoutConfirmacaoViewModel(pedidoId, metodoPagamento, initialStatus);
  const isPix = metodoPagamento === 'PIX';
  const qrUri = uriImagemQr(qrCodeImageUrl);
  const status = vm.statusPagamento ?? initialStatus;

  return (
    <ScreenShell title="Pedido confirmado" scroll>
      <View style={[styles.icon, { backgroundColor: vm.isPaid ? c.successBg : c.warningBg }]}>
        <MaterialIcons
          name={vm.isPaid ? 'check-circle' : 'hourglass-top'}
          size={72}
          color={vm.isPaid ? c.success : c.warningText}
        />
      </View>
      <Text style={[styles.title, { color: c.text }]}>
        {vm.isPaid ? 'Pagamento confirmado!' : 'Pedido realizado!'}
      </Text>
      <Text style={[styles.sub, { color: c.sub }]}>
        Pedido #{pedidoId} registrado.
        {isPix && !vm.isPaid
          ? ' Pague com PIX abaixo. Atualizamos o status automaticamente.'
          : vm.isPaid
            ? ' Seu pagamento foi confirmado.'
            : ' Acompanhe na aba Pedidos.'}
      </Text>

      {isPix && vm.polling && !vm.isPaid ? (
        <View style={[styles.waitBanner, { backgroundColor: c.warningBg }]}>
          <Text style={{ color: c.warningText, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
            Aguardando confirmação do banco...
          </Text>
        </View>
      ) : null}

      {vm.isPaid ? (
        <View style={[styles.paidBanner, { backgroundColor: c.successBg }]}>
          <Text style={{ color: c.success, fontWeight: '700', textAlign: 'center' }}>
            PIX recebido com sucesso!
          </Text>
        </View>
      ) : null}

      <Card>
        <Text style={{ color: c.sub, fontSize: 14 }}>Total</Text>
        <MoneyText value={total} accent style={{ fontSize: 24, marginTop: spacing.xs }} />
        {status ? (
          <Text style={{ color: c.sub, marginTop: spacing.sm, fontSize: 14 }}>
            Pagamento: {labelStatusPagamento(status)}
          </Text>
        ) : null}
      </Card>

      {isPix && !vm.isPaid && (qrUri || qrCode) ? (
        <Card>
          <Text style={[styles.pixTitle, { color: c.text }]}>Pague com PIX</Text>
          {qrUri ? <Image source={{ uri: qrUri }} style={styles.qr} resizeMode="contain" /> : null}
          {qrCode ? (
            <Text style={[styles.pixCode, { color: c.sub }]} selectable>
              {qrCode}
            </Text>
          ) : null}
          <Text style={{ color: c.muted, fontSize: 12, textAlign: 'center', marginTop: spacing.sm }}>
            Copie o código ou escaneie o QR no app do seu banco
          </Text>
        </Card>
      ) : null}

      <PrimaryButton
        label="Ver meus pedidos"
        onPress={() => navigation.getParent()?.navigate('TabClientePedidos')}
      />
      <View style={{ height: spacing.md }} />
      <PrimaryButton
        label="Voltar ao início"
        onPress={() => navigation.getParent()?.navigate('TabClienteInicio')}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.lg },
  waitBanner: { padding: spacing.md, borderRadius: 10, marginBottom: spacing.md },
  paidBanner: { padding: spacing.md, borderRadius: 10, marginBottom: spacing.md },
  pixTitle: { fontSize: 17, fontWeight: '800', marginBottom: spacing.md, textAlign: 'center' },
  qr: { width: 220, height: 220, alignSelf: 'center' },
  pixCode: { fontSize: 11, marginTop: spacing.md, textAlign: 'center' },
});
