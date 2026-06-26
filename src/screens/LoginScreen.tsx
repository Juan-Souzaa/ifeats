import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { GuestStackParamList } from '../navigation/types';
import { useAuthViewModel } from '../hooks/useAuthViewModel';
import { useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<GuestStackParamList, 'Login'>;

const SIGNUP_LINKS: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: keyof GuestStackParamList;
}[] = [
  { icon: 'person-add', label: 'Criar conta cliente', route: 'ClienteCadastro' },
  { icon: 'storefront', label: 'Cadastrar restaurante', route: 'RestauranteCadastro' },
  { icon: 'delivery-dining', label: 'Cadastrar entregador', route: 'EntregadorCadastro' },
];

export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAuthViewModel();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.outerBg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={[styles.brandIcon, { backgroundColor: `${palette.primary}18` }]}>
              <MaterialIcons name="restaurant" size={28} color={palette.primary} />
            </View>
            <Text style={[styles.brandTitle, { color: c.text }]}>IFeats</Text>
            <Text style={[styles.brandSub, { color: c.sub }]}>
              Entre com e-mail ou username e senha
            </Text>
          </View>

          <View style={[styles.inputWrap, { borderColor: c.border, backgroundColor: c.inputBg }]}>
            <MaterialIcons name="person-outline" size={20} color={c.muted} />
            <TextInput
              value={vm.email}
              onChangeText={vm.setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="cliente@email.com ou admin"
              placeholderTextColor={c.muted}
              style={[styles.input, { color: c.text }]}
            />
          </View>

          <View style={[styles.inputWrap, { borderColor: c.border, backgroundColor: c.inputBg, marginTop: spacing.md }]}>
            <MaterialIcons name="lock-outline" size={20} color={c.muted} />
            <TextInput
              value={vm.password}
              onChangeText={vm.setPassword}
              secureTextEntry
              placeholder="Sua senha"
              placeholderTextColor={c.muted}
              style={[styles.input, { color: c.text }]}
              onSubmitEditing={() => void tryLogin(vm)}
            />
          </View>

          {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { opacity: pressed || vm.loading ? 0.88 : 1 },
            ]}
            disabled={vm.loading}
            onPress={() => void tryLogin(vm)}
          >
            {vm.loading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Entrar</Text>
            )}
          </Pressable>

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <Text style={[styles.signupLabel, { color: c.sub }]}>Ainda não tem conta?</Text>
          <View style={styles.signupLinks}>
            {SIGNUP_LINKS.map((link) => (
              <Pressable
                key={link.route}
                onPress={() => navigation.navigate(link.route)}
                style={({ pressed }) => [styles.signupRow, { opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialIcons name={link.icon} size={18} color={palette.primary} />
                <Text style={styles.signupText}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

async function tryLogin(vm: ReturnType<typeof useAuthViewModel>): Promise<void> {
  try {
    await vm.login();
  } catch {
    /* erro já em vm.error */
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  brandSub: { marginTop: 6, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  error: { color: '#b91c1c', marginTop: spacing.md, fontSize: 13, textAlign: 'center' },
  primaryBtn: {
    marginTop: spacing.lg,
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: spacing.xl },
  signupLabel: { fontSize: 13, fontWeight: '600', marginBottom: spacing.md, textAlign: 'center' },
  signupLinks: { gap: spacing.md, alignItems: 'center' },
  signupRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  signupText: { color: palette.primary, fontWeight: '700', fontSize: 15 },
});
