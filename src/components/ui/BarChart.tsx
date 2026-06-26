import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { useThemeColors } from './useThemeColors';

export type BarChartItem = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  title?: string;
  items: BarChartItem[];
  formatValue?: (value: number) => string;
};

export function BarChart({ title, items, formatValue }: Props): React.JSX.Element {
  const c = useThemeColors();
  const max = Math.max(1, ...items.map((i) => i.value));
  const fmt = formatValue ?? ((v: number) => String(v));

  return (
    <View>
      {title ? <Text style={[styles.title, { color: c.text }]}>{title}</Text> : null}
      <View style={styles.list}>
        {items.map((item) => {
          const pct = (item.value / max) * 100;
          const color = item.color ?? palette.primary;
          return (
            <View key={item.label} style={styles.row}>
              <Text style={[styles.label, { color: c.sub }]} numberOfLines={1}>
                {item.label}
              </Text>
              <View style={[styles.track, { backgroundColor: c.chipMutedBg }]}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
              </View>
              <Text style={[styles.value, { color: c.text }]}>{fmt(item.value)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 15, fontWeight: '800', marginBottom: spacing.md },
  list: { gap: spacing.md },
  row: { gap: spacing.xs },
  label: { fontSize: 12, fontWeight: '600' },
  track: { height: 10, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full, minWidth: 4 },
  value: { fontSize: 12, fontWeight: '700', alignSelf: 'flex-end' },
});
