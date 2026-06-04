import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { useThemeColors } from './useThemeColors';
import { spacing } from '../../theme/spacing';

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  optional?: boolean;
};

export function StarRatingInput({ label, value, onChange, optional }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: c.text }]}>
        {label}
        {optional ? <Text style={{ color: c.muted, fontWeight: '500' }}> (opcional)</Text> : null}
      </Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={8}>
            <MaterialIcons
              name={n <= value ? 'star' : 'star-border'}
              size={36}
              color={n <= value ? palette.primary : c.muted}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { fontSize: 15, fontWeight: '700', marginBottom: spacing.sm },
  stars: { flexDirection: 'row', gap: spacing.xs },
});
