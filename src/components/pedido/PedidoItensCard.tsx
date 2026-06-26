import { StyleSheet, Text, View } from 'react-native';
import type { PedidoResponseDTO } from '../../types/api';
import { Card, MoneyText, useThemeColors } from '../ui';
import { spacing } from '../../theme/spacing';

type Props = { pedido: PedidoResponseDTO };

export function PedidoItensCard({ pedido }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <Card>
      <Text style={[styles.sec, { color: c.text }]}>Itens do pedido</Text>
      {pedido.itens?.map((i) => (
        <View key={i.id} style={styles.itemRow}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontWeight: '600' }}>
              {i.quantidade}x {i.pratoNome}
            </Text>
            <Text style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>
              {i.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} un.
            </Text>
          </View>
          <MoneyText value={i.subtotal} />
        </View>
      ))}
      <View style={[styles.divider, { backgroundColor: c.border }]} />
      <View style={styles.itemRow}>
        <Text style={{ color: c.sub }}>Subtotal</Text>
        <MoneyText value={pedido.subtotal} />
      </View>
      <View style={styles.itemRow}>
        <Text style={{ color: c.sub }}>Taxa de entrega</Text>
        <MoneyText value={pedido.taxaEntrega} />
      </View>
      <View style={styles.itemRow}>
        <Text style={{ color: c.text, fontWeight: '800' }}>Total</Text>
        <MoneyText value={pedido.total} accent />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm, gap: spacing.md },
  divider: { height: 1, marginVertical: spacing.md },
});
