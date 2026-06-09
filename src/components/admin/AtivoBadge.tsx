import { StyleSheet, Text, View } from 'react-native';
import { radius } from '../../theme/spacing';

type Props = { ativo: boolean };

export function AtivoBadge({ ativo }: Props): React.JSX.Element {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: ativo ? 'rgba(22,163,74,0.15)' : 'rgba(100,116,139,0.2)' },
      ]}
    >
      <Text style={{ color: ativo ? '#16a34a' : '#64748b', fontSize: 12, fontWeight: '700' }}>
        {ativo ? 'Ativo' : 'Inativo'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
});
