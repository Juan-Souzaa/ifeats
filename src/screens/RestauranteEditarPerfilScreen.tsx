import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import type { RestauranteStackParamList } from '../navigation/types';
import { EnderecoFormFields } from '../components/EnderecoFormFields';
import { useRestauranteEditarPerfilViewModel } from '../hooks/useRestauranteEditarPerfilViewModel';
import { Card, ErrorBanner, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestauranteEditarPerfil'>;

export function RestauranteEditarPerfilScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useRestauranteEditarPerfilViewModel();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]) {
      vm.setFotoUri(res.assets[0].uri);
      vm.setFotoMime(res.assets[0].mimeType ?? 'image/jpeg');
    }
  };

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

      <Text style={[styles.secTitle, { color: c.text }]}>Foto do restaurante</Text>
      <Card>
        <Pressable onPress={() => void pickImage()} style={styles.photoPress}>
          {vm.fotoPreview ? (
            <Image source={{ uri: vm.fotoPreview }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoEmpty, { borderColor: c.border, backgroundColor: c.chipMutedBg }]}>
              <MaterialIcons name="add-a-photo" size={32} color={c.muted} />
              <Text style={{ color: c.sub, marginTop: spacing.sm, fontSize: 13 }}>Adicionar foto</Text>
            </View>
          )}
        </Pressable>
        <Text style={[styles.photoHint, { color: c.sub }]}>
          Aparece na listagem para os clientes. Recomendado: foto da fachada ou do ambiente.
        </Text>
      </Card>

      <Text style={[styles.secTitle, { color: c.text }]}>Dados do restaurante</Text>
      <Card>
        <Field label="Nome" value={vm.nome} onChangeText={vm.setNome} c={c} />
        <Field
          label="E-mail"
          value={vm.email}
          onChangeText={vm.setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          c={c}
        />
        <Field label="Telefone" value={vm.telefone} onChangeText={vm.setTelefone} c={c} />
      </Card>

      <Text style={[styles.secTitle, { color: c.text }]}>Endereço</Text>
      <Card>
        <EnderecoFormFields
          endereco={vm.endereco}
          onChange={vm.setEnderecoField}
          cepBuscando={vm.cepBuscando}
          cepAviso={vm.cepAviso}
          borderColor={c.border}
          textColor={c.text}
          subColor={c.sub}
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

function Field({
  label,
  value,
  onChangeText,
  c,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  c: ReturnType<typeof useThemeColors>;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={c.muted}
        style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  secTitle: { fontSize: 16, fontWeight: '800', marginBottom: spacing.sm, marginTop: spacing.md },
  photoPress: { alignItems: 'center' },
  photo: { width: '100%', height: 160, borderRadius: radius.md },
  photoEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: { fontSize: 12, lineHeight: 18, marginTop: spacing.sm, textAlign: 'center' },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
});
