import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '../ui';
import { spacing } from '../../theme/spacing';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
};

export function PedidoInfoRow({ icon, label, value }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.row}>
      <MaterialIcons name={icon} size={18} color={c.muted} />
      <View style={styles.text}>
        <Text style={{ color: c.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: c.text, fontSize: 14, marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  text: { flex: 1 },
});
