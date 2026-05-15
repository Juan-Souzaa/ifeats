import { View, StyleSheet, type ViewProps } from 'react-native';
import { useThemeColors } from './useThemeColors';
import { radius, spacing } from '../../theme/spacing';

type Props = ViewProps & { padded?: boolean };

export function Card({ children, style, padded = true, ...rest }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        {
          backgroundColor: c.shell,
          borderColor: c.border,
          padding: padded ? spacing.lg : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
