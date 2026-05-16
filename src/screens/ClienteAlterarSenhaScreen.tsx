import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteMeViewModel } from '../hooks/useClienteMeViewModel';
import { useClienteAlterarSenhaViewModel } from '../hooks/useClienteAlterarSenhaViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteAlterarSenha'>;

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  borderColor,
  bg,
  color,
  sub,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  borderColor: string;
  bg: string;
  color: string;
  sub: string;
}): React.JSX.Element {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: sub }]}>{label}</Text>
      <View style={[styles.inputRow, { borderColor, backgroundColor: bg }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          placeholder={placeholder}
          placeholderTextColor={sub}
          style={[styles.input, { color }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable onPress={() => setShow((s) => !s)} style={styles.eyeBtn} hitSlop={8}>
          <MaterialIcons name={show ? 'visibility' : 'visibility-off'} size={20} color={sub} />
        </Pressable>
      </View>
    </View>
  );
}

export function ClienteAlterarSenhaScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate300 : palette.slate600;
  const cardBg = dark ? '#1e293b' : palette.white;
  const border = dark ? palette.slate700 : palette.slate300;

  const me = useClienteMeViewModel();
  const vm = useClienteAlterarSenhaViewModel();

  useFocusEffect(
    useCallback(() => {
      void me.refresh();
    }, [me.refresh])
  );

  const id = me.data?.id;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Alterar senha</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.intro, { color: sub }]}>
            Por favor, insira sua senha atual e escolha uma nova para proteger sua conta.
          </Text>

          {me.loading && !id ? (
            <ActivityIndicator color={palette.primary} style={{ marginTop: 24 }} />
          ) : !id ? (
            <Text style={styles.err}>Não foi possível carregar seus dados. Volte e tente de novo.</Text>
          ) : (
            <>
              <PasswordField
                label="Senha atual"
                value={vm.senhaAtual}
                onChangeText={vm.setSenhaAtual}
                placeholder="Insira a senha atual"
                borderColor={border}
                bg={cardBg}
                color={text}
                sub={sub}
              />
              <PasswordField
                label="Nova senha"
                value={vm.novaSenha}
                onChangeText={vm.setNovaSenha}
                placeholder="Insira a nova senha"
                borderColor={border}
                bg={cardBg}
                color={text}
                sub={sub}
              />
              <PasswordField
                label="Confirmar nova senha"
                value={vm.confirmar}
                onChangeText={vm.setConfirmar}
                placeholder="Confirme a nova senha"
                borderColor={border}
                bg={cardBg}
                color={text}
                sub={sub}
              />

              {vm.error ? <Text style={styles.err}>{vm.error}</Text> : null}
              {vm.successMessage ? <Text style={styles.ok}>{vm.successMessage}</Text> : null}

              <Text style={[styles.tipsTitle, { color: text }]}>Dicas de segurança</Text>
              <View style={[styles.tipsBox, { borderColor: `${palette.primary}33`, backgroundColor: dark ? `${palette.primary}18` : `${palette.primary}0d` }]}>
                <Tip text="Use pelo menos 8 caracteres, combinando letras, números e símbolos." dark={dark} />
                <Tip text="Evite usar informações pessoais como datas de nascimento ou nomes." dark={dark} />
                <Tip text="Não reutilize senhas em plataformas diferentes." dark={dark} />
              </View>
            </>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>

        {id ? (
          <View
            style={[
              styles.footer,
              {
                backgroundColor: `${bg}ee`,
                borderTopColor: dark ? palette.slate800 : palette.slate200,
                paddingBottom: 12 + insets.bottom,
              },
            ]}
          >
            <Pressable
              style={({ pressed }) => [styles.submitBtn, { opacity: pressed || vm.loading ? 0.88 : 1 }]}
              disabled={vm.loading}
              onPress={() => void vm.submit(id)}
            >
              {vm.loading ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <Text style={styles.submitText}>Atualizar senha</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Tip({ text, dark }: { text: string; dark: boolean }): React.JSX.Element {
  return (
    <View style={styles.tipRow}>
      <MaterialIcons name="check-circle" size={18} color={palette.primary} style={{ marginTop: 2 }} />
      <Text style={[styles.tipText, { color: dark ? palette.slate400 : palette.slate600 }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', marginRight: 48 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  intro: { textAlign: 'center', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  eyeBtn: { paddingHorizontal: 14, height: 48, justifyContent: 'center' },
  err: { color: '#b91c1c', fontSize: 14, marginTop: 4, marginBottom: 8 },
  ok: { color: '#15803d', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tipsTitle: { fontSize: 16, fontWeight: '800', marginTop: 20, marginBottom: 12 },
  tipsBox: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: { color: palette.white, fontSize: 16, fontWeight: '800' },
});
