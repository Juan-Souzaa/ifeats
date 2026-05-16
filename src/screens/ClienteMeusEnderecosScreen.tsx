import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteMeViewModel } from '../hooks/useClienteMeViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteMeusEnderecos'>;

export function ClienteMeusEnderecosScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const card = dark ? '#1e293b' : palette.white;

  const me = useClienteMeViewModel();

  useFocusEffect(
    useCallback(() => {
      void me.refresh();
    }, [me.refresh])
  );

  const endereco = me.data?.endereco?.trim();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: text }]}>Meus endereços</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: card, borderColor: dark ? palette.slate700 : palette.slate200 }]}>
          <View style={styles.cardHead}>
            <MaterialIcons name="home" size={22} color={palette.primary} />
            <Text style={[styles.cardTitle, { color: text }]}>Endereço principal</Text>
          </View>
          {endereco ? (
            <Text style={[styles.endereco, { color: text }]}>{endereco}</Text>
          ) : (
            <Text style={[styles.hint, { color: sub }]}>
              Nenhum endereço cadastrado ainda. Use o cadastro ou fale com o suporte para atualizar.
            </Text>
          )}
          {me.data?.telefone ? (
            <Text style={[styles.tel, { color: sub }]}>Telefone: {me.data.telefone}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 18, borderWidth: 1 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  endereco: { fontSize: 15, lineHeight: 22 },
  hint: { fontSize: 14, lineHeight: 20 },
  tel: { marginTop: 14, fontSize: 14 },
});
