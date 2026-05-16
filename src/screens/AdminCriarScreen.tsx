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
import type { AdminStackParamList } from '../navigation/types';
import { useAdminCriarViewModel } from '../hooks/useAdminCriarViewModel';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';
import type { AdminResponseDTO } from '../types/api';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminCriar'>;

function iniciais(login: string): string {
  const base = login.includes('@') ? (login.split('@')[0] ?? login) : login;
  const clean = base.replace(/[^a-zA-Z0-9]/g, '');
  if (clean.length >= 2) return clean.slice(0, 2).toUpperCase();
  return (base.slice(0, 2) || '??').toUpperCase();
}

export function AdminCriarScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const outerBg = dark ? palette.backgroundDark : palette.backgroundLight;
  const shell = dark ? '#0f172a' : palette.white;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate600;
  const border = dark ? palette.slate800 : palette.slate200;
  const inputBg = dark ? '#1e293b' : palette.white;
  const headerBg = dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)';
  const divider = dark ? palette.slate800 : '#f1f5f9';
  const chipMutedBg = dark ? palette.slate800 : palette.slate100;

  const vm = useAdminCriarViewModel();
  const { setToken } = useAuth();
  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={[styles.safeOuter, { backgroundColor: outerBg }]} edges={['top', 'bottom']}>
      <View style={[styles.shell, { borderColor: border, backgroundColor: shell }]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
          <View style={styles.headerSide}>
            {canGoBack ? (
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={12}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
              >
                <MaterialIcons name="arrow-back-ios" size={20} color={palette.primary} />
              </Pressable>
            ) : (
              <View style={styles.headerSideSpacer} />
            )}
          </View>
          <Text style={[styles.headerTitle, { color: text }]} numberOfLines={1}>
            Gestão de Administradores
          </Text>
          <View style={styles.headerSide}>
            <Pressable
              onPress={() => void setToken(null)}
              hitSlop={12}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
              accessibilityLabel="Sair"
            >
              <MaterialIcons name="logout" size={22} color={palette.primary} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>Adicionar Novo Administrador</Text>

            <View style={styles.fieldGap}>
              <Text style={[styles.label, { color: sub }]}>Endereço de E-mail</Text>
              <TextInput
                value={vm.username}
                onChangeText={vm.setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="Digite o endereço de e-mail"
                placeholderTextColor={dark ? palette.slate500 : palette.slate400}
                style={[
                  styles.input,
                  { borderColor: dark ? palette.slate700 : palette.slate300, color: text, backgroundColor: inputBg },
                ]}
              />
            </View>

            <View style={styles.fieldGap}>
              <Text style={[styles.label, { color: sub }]}>Senha</Text>
              <TextInput
                value={vm.password}
                onChangeText={vm.setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={dark ? palette.slate500 : palette.slate400}
                style={[
                  styles.input,
                  { borderColor: dark ? palette.slate700 : palette.slate300, color: text, backgroundColor: inputBg },
                ]}
              />
            </View>

            {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
            {vm.successMessage ? <Text style={styles.ok}>{vm.successMessage}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                { opacity: pressed || vm.loading ? 0.9 : 1, shadowOpacity: dark ? 0.25 : 0.2 },
              ]}
              disabled={vm.loading}
              onPress={() => void vm.submit()}
            >
              {vm.loading ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <>
                  <MaterialIcons name="person-add-alt-1" size={22} color={palette.white} />
                  <Text style={styles.primaryBtnText}>Adicionar</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: divider }]} />

          <View style={styles.section}>
            <View style={styles.equipeHeader}>
              <Text style={[styles.sectionTitle, { color: text, marginBottom: 0 }]}>Equipe Atual</Text>
              <View style={[styles.countBadge, { backgroundColor: chipMutedBg }]}>
                <Text style={[styles.countBadgeText, { color: sub }]}>{vm.admins.length}</Text>
              </View>
            </View>

            {vm.listError ? <Text style={styles.listErr}>{vm.listError}</Text> : null}

            {vm.listLoading && vm.admins.length === 0 ? (
              <ActivityIndicator style={{ marginTop: 16 }} color={palette.primary} />
            ) : null}

            {!vm.listLoading && !vm.listError && vm.admins.length === 0 ? (
              <Text style={[styles.emptyHint, { color: sub }]}>Nenhum administrador na lista.</Text>
            ) : null}

            <View style={styles.equipeList}>
              {vm.admins.map((m) => (
                <AdminRow key={m.id} admin={m} dark={dark} text={text} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function AdminRow({
  admin,
  dark,
  text,
}: {
  admin: AdminResponseDTO;
  dark: boolean;
  text: string;
}): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: dark ? palette.slate700 : palette.slate200,
            borderColor: dark ? palette.slate600 : palette.slate300,
          },
        ]}
      >
        <Text style={[styles.avatarText, { color: dark ? palette.slate300 : palette.slate600 }]}>
          {iniciais(admin.username)}
        </Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowName, { color: text }]} numberOfLines={1}>
          {admin.username}
        </Text>
      </View>
      <View style={styles.rowEnd}>
        <View style={[styles.roleChip, styles.roleChipPrimary]}>
          <Text style={[styles.roleChipText, { color: palette.primary }]}>Administrador</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeOuter: { flex: 1, alignItems: 'stretch' },
  shell: {
    flex: 1,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: { width: 44, alignItems: 'center', justifyContent: 'center' },
  headerSideSpacer: { width: 40, height: 40 },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingRight: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: { backgroundColor: `${palette.primary}18` },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16, letterSpacing: -0.3 },
  fieldGap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: 12,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
  error: { color: '#b91c1c', marginTop: 8, fontSize: 14 },
  ok: { color: '#15803d', marginTop: 8, fontSize: 14, fontWeight: '600' },
  divider: { height: 8, width: '100%', marginTop: 4 },
  equipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countBadgeText: { fontSize: 13, fontWeight: '500' },
  listErr: { color: '#b91c1c', fontSize: 14, marginBottom: 8 },
  emptyHint: { fontSize: 14, lineHeight: 20 },
  equipeList: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginHorizontal: -4,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: { fontWeight: '700', fontSize: 15 },
  rowBody: { flex: 1, minWidth: 0, justifyContent: 'center' },
  rowName: { fontWeight: '700', fontSize: 14 },
  rowEnd: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleChipPrimary: {
    backgroundColor: `${palette.primary}1a`,
    borderColor: `${palette.primary}33`,
  },
  roleChipText: { fontSize: 11, fontWeight: '700' },
});
