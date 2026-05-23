import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from 'react-native';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteEnderecoFormViewModel } from '../hooks/useClienteEnderecoFormViewModel';
import { EnderecoFormFields } from '../components/EnderecoFormFields';
import { Card, ErrorBanner, PrimaryButton, ScreenShell } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteEnderecoForm'>;

export function ClienteEnderecoFormScreen({ navigation, route }: Props): React.JSX.Element {
  const { enderecoId } = route.params;
  const dark = useColorScheme() === 'dark';
  const border = dark ? palette.slate700 : palette.slate300;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const vm = useClienteEnderecoFormViewModel(enderecoId);

  if (vm.loading) {
    return (
      <ScreenShell title={vm.isEdit ? 'Editar endereço' : 'Novo endereço'} onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={vm.isEdit ? 'Editar endereço' : 'Novo endereço'} onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <Card>
        <EnderecoFormFields
          endereco={vm.endereco}
          onChange={vm.setField}
          cepBuscando={vm.cepBuscando}
          cepAviso={vm.cepAviso}
          borderColor={border}
          textColor={text}
          subColor={sub}
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

const styles = StyleSheet.create({});
