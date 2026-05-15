import { StyleSheet, Text, View } from 'react-native';
import type { StatusPedido } from '../../types/api';
import { formatStatusPedido, statusColor } from '../../utils/pedidoStatus';

type Props = { status: StatusPedido };

export function StatusChip({ status }: Props): React.JSX.Element {
  const colors = statusColor(status);
  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{formatStatusPedido(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '700' },
});
