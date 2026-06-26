import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useThemeColors } from './useThemeColors';
import { spacing, radius } from '../../theme/spacing';

type Props = { count?: number };

export function SkeletonList({ count = 4 }: Props): React.JSX.Element {
  const c = useThemeColors();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.75, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const bone = { backgroundColor: c.border };

  return (
    <View style={styles.wrap}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.row, { borderColor: c.border, opacity }]}
        >
          <View style={[styles.thumb, bone]} />
          <View style={styles.lines}>
            <View style={[styles.line, styles.lineShort, bone]} />
            <View style={[styles.line, bone]} />
            <View style={[styles.line, styles.lineMed, bone]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.md },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.md },
  lines: { flex: 1, gap: spacing.sm, justifyContent: 'center' },
  line: { height: 12, borderRadius: 6, width: '90%' },
  lineShort: { width: '55%' },
  lineMed: { width: '40%' },
});
