import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { GuestStackParamList } from '../navigation/types';
import { EnderecoFormFields } from '../components/EnderecoFormFields';
import { useClienteCadastroViewModel } from '../hooks/useClienteCadastroViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<GuestStackParamList, 'ClienteCadastro'>;

export function ClienteCadastroScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const border = dark ? palette.slate700 : palette.slate300;
  const card = dark ? palette.slate800 : palette.white;

  const vm = useClienteCadastroViewModel();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={26} color={text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: text }]}>Novo cliente</Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Field label="Nome" value={vm.nome} onChangeText={vm.setNome} borderColor={border} color={text} sub={sub} />
          <Field
            label="E-mail (será o login)"
            value={vm.email}
            onChangeText={vm.setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            borderColor={border}
            color={text}
            sub={sub}
          />
          <Field label="Telefone" value={vm.telefone} onChangeText={vm.setTelefone} borderColor={border} color={text} sub={sub} />
          <Field
            label="Senha (6–20 caracteres)"
            value={vm.password}
            onChangeText={vm.setPassword}
            secureTextEntry
            borderColor={border}
            color={text}
            sub={sub}
          />
          <Text style={[styles.section, { color: text }]}>Endereço</Text>
          <EnderecoFormFields
            endereco={vm.endereco}
            onChange={(field, value) => {
              if (field === 'principal') return;
              if (field === 'estado') {
                vm.setEnderecoField('estado', value.toUpperCase().slice(0, 2));
              } else {
                vm.setEnderecoField(field, value);
              }
            }}
            cepBuscando={vm.cepBuscando}
            cepAviso={vm.cepAviso}
            borderColor={border}
            textColor={text}
            subColor={sub}
          />
          {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
          {vm.successMessage ? <Text style={styles.ok}>{vm.successMessage}</Text> : null}
          <Pressable
            style={[styles.btn, { opacity: vm.loading ? 0.85 : 1 }]}
            disabled={vm.loading}
            onPress={async () => {
              const r = await vm.submit();
              if (r) {
                navigation.navigate('Login');
              }
            }}
          >
            {vm.loading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.btnText}>Cadastrar</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  borderColor,
  color,
  sub,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  borderColor: string;
  color: string;
  sub: string;
} & Partial<React.ComponentProps<typeof TextInput>>): React.JSX.Element {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={sub}
        style={[styles.input, { borderColor, color }]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  section: { fontWeight: '800', marginTop: 8, marginBottom: 4, fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 15 },
  error: { color: '#b91c1c', marginTop: 8 },
  ok: { color: '#15803d', marginTop: 8, fontWeight: '600' },
  btn: {
    marginTop: 16,
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
});
