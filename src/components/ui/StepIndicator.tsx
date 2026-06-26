import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { useThemeColors } from './useThemeColors';
import { spacing } from '../../theme/spacing';

type Props = {
  steps: string[];
  current: number;
};

export function StepIndicator({ steps, current }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.wrap}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={label} style={styles.step}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: done || active ? palette.primary : c.chipMutedBg,
                  borderColor: active ? palette.primary : c.border,
                },
              ]}
            >
              {done ? (
                <MaterialIcons name="check" size={14} color={palette.white} />
              ) : (
                <Text style={[styles.dotNum, { color: active ? palette.white : c.muted }]}>{i + 1}</Text>
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: active ? c.text : c.muted, fontWeight: active ? '700' : '500' },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {i < steps.length - 1 ? (
              <View style={[styles.line, { backgroundColor: done ? palette.primary : c.border }]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', marginBottom: spacing.xl, alignItems: 'flex-start' },
  step: { flex: 1, alignItems: 'center', position: 'relative' },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.xs,
  },
  dotNum: { fontSize: 12, fontWeight: '800' },
  label: { fontSize: 11, textAlign: 'center' },
  line: {
    position: 'absolute',
    top: 14,
    left: '55%',
    right: '-45%',
    height: 2,
    zIndex: -1,
  },
});
