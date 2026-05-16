import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { GuestStackParamList } from '../navigation/types';
import { useAuthViewModel } from '../hooks/useAuthViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<GuestStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const card = dark ? palette.slate800 : palette.white;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const border = dark ? palette.slate700 : palette.slate300;

  const vm = useAuthViewModel();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>IFeats</Text>
          <Text style={[styles.subtitle, { color: sub }]}>Entre com e-mail ou username e senha</Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>E-mail ou username</Text>
          <TextInput
            value={vm.email}
            onChangeText={vm.setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="cliente@email.com ou admin"
            placeholderTextColor={sub}
            style={[styles.input, { color: text, borderColor: border }]}
          />
          <Text style={[styles.label, { color: sub, marginTop: 12 }]}>Senha</Text>
          <TextInput
            value={vm.password}
            onChangeText={vm.setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={sub}
            style={[styles.input, { color: text, borderColor: border }]}
          />
          {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { opacity: pressed || vm.loading ? 0.85 : 1 },
            ]}
            disabled={vm.loading}
            onPress={async () => {
              try {
                await vm.login();
              } catch {
                /* erro já em vm.error */
              }
            }}
          >
            {vm.loading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Entrar</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.links}>
          <Pressable style={styles.linkRow} onPress={() => navigation.navigate('ClienteCadastro')}>
            <MaterialIcons name="person-add" size={20} color={palette.primary} />
            <Text style={styles.link}>Criar conta cliente</Text>
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => navigation.navigate('RestauranteCadastro')}>
            <MaterialIcons name="storefront" size={20} color={palette.primary} />
            <Text style={styles.link}>Cadastrar restaurante</Text>
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => navigation.navigate('EntregadorCadastro')}>
            <MaterialIcons name="delivery-dining" size={20} color={palette.primary} />
            <Text style={styles.link}>Cadastrar entregador</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  header: { marginBottom: 28, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { marginTop: 6, fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 8 },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
  },
  error: { color: '#b91c1c', marginTop: 10, fontSize: 13 },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
  links: { marginTop: 20, gap: 12 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  link: { color: palette.primary, fontWeight: '700', fontSize: 15 },
});
