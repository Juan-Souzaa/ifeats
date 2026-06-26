import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { StatusPedido } from '../../types/api';
import { formatStatusPedido, PEDIDO_TIMELINE, timelineIndex } from '../../utils/pedidoStatus';
import { palette } from '../../theme/colors';
import { useThemeColors } from './useThemeColors';
import { spacing } from '../../theme/spacing';

type Props = {
  status: StatusPedido;
  compact?: boolean;
};

const ICONS: Record<StatusPedido, keyof typeof MaterialIcons.glyphMap> = {
  CREATED: 'receipt-long',
  CONFIRMED: 'check-circle',
  PREPARING: 'restaurant',
  OUT_FOR_DELIVERY: 'delivery-dining',
  DELIVERED: 'home',
  CANCELED: 'cancel',
};

export function PedidoTimeline({ status, compact }: Props): React.JSX.Element | null {
  const c = useThemeColors();
  if (status === 'CANCELED') return null;

  const idx = timelineIndex(status);

  return (
    <View style={styles.wrap}>
      {PEDIDO_TIMELINE.map((st, i) => {
        const done = idx >= i;
        const active = idx === i;
        return (
          <View key={st} style={[styles.row, compact && styles.rowCompact]}>
            <View style={styles.left}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done ? palette.primary : c.border,
                    borderColor: active ? palette.primary : 'transparent',
                    borderWidth: active ? 2 : 0,
                  },
                ]}
              >
                {done ? (
                  <MaterialIcons name={ICONS[st]} size={compact ? 12 : 14} color={palette.white} />
                ) : null}
              </View>
              {i < PEDIDO_TIMELINE.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: idx > i ? palette.primary : c.border },
                  ]}
                />
              ) : null}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: done ? c.text : c.muted,
                  fontWeight: active ? '800' : done ? '600' : '500',
                  fontSize: compact ? 12 : 14,
                },
              ]}
            >
              {formatStatusPedido(st)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, minHeight: 36 },
  rowCompact: { minHeight: 28 },
  left: { alignItems: 'center', width: 28 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 3, flex: 1, minHeight: 12, borderRadius: 2, marginVertical: 2 },
  label: { flex: 1, paddingTop: 3 },
});
