import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RestauranteStackParamList } from '../navigation/types';
import { useRestauranteRaioViewModel } from '../hooks/useRestauranteRaioViewModel';
import { Card, ErrorBanner, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestauranteRaioEntrega'>;

export function RestauranteRaioEntregaScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useRestauranteRaioViewModel();

  if (vm.loading) {
    return (
      <ScreenShell title="Raio de entrega" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Raio de entrega" onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <Card>
        <Text style={[styles.hint, { color: c.sub }]}>
          Defina o raio máximo em quilômetros para aceitar pedidos na sua região.
        </Text>
        <Text style={[styles.label, { color: c.sub }]}>Raio (km)</Text>
        <TextInput
          value={vm.raio}
          onChangeText={vm.setRaio}
          keyboardType="decimal-pad"
          placeholderTextColor={c.muted}
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        />
      </Card>
      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton
          label="Salvar"
          loading={vm.submitting}
          onPress={async () => {
            const ok = await vm.salvar();
            if (ok) navigation.goBack();
          }}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
});
