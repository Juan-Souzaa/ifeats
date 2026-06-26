import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteEditarPerfilViewModel } from '../hooks/useClienteEditarPerfilViewModel';
import { useAuth } from '../context/AuthContext';
import { Card, ErrorBanner, PrimaryButton, ScreenShell, SecondaryButton } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteEditarPerfil'>;

export function ClienteEditarPerfilScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const border = dark ? palette.slate700 : palette.slate300;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const { setToken } = useAuth();
  const vm = useClienteEditarPerfilViewModel();

  if (vm.loading) {
    return (
      <ScreenShell title="Editar perfil" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Editar perfil" onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <Card>
        <Field label="Nome" value={vm.nome} onChangeText={vm.setNome} border={border} text={text} sub={sub} />
        <Field
          label="E-mail"
          value={vm.email}
          onChangeText={vm.setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          border={border}
          text={text}
          sub={sub}
        />
        <Field label="Telefone" value={vm.telefone} onChangeText={vm.setTelefone} border={border} text={text} sub={sub} />
      </Card>
      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton
          label="Salvar alterações"
          loading={vm.submitting}
          onPress={async () => {
            const ok = await vm.salvar();
            if (ok) navigation.goBack();
          }}
        />
      </View>
      <View style={{ marginTop: spacing.md }}>
        <SecondaryButton
          label="Excluir minha conta"
          onPress={() =>
            Alert.alert(
              'Excluir conta',
              'Esta ação é irreversível. Todos os seus dados serão removidos.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Confirmar exclusão', 'Tem certeza absoluta?', [
                      { text: 'Não', style: 'cancel' },
                      {
                        text: 'Sim, excluir',
                        style: 'destructive',
                        onPress: async () => {
                          const ok = await vm.excluirConta();
                          if (ok) await setToken(null);
                        },
                      },
                    ]);
                  },
                },
              ]
            )
          }
        />
      </View>
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  border,
  text,
  sub,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  border: string;
  text: string;
  sub: string;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={sub}
        style={[styles.input, { borderColor: border, color: text }]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
});
