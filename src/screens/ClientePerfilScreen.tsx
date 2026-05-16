import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteMeViewModel } from '../hooks/useClienteMeViewModel';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClientePerfil'>;

function iniciais(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

export function ClientePerfilScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const card = dark ? '#1e293b' : palette.white;
  const borderHead = dark ? `${palette.primary}33` : `${palette.primary}22`;

  const { setToken } = useAuth();
  const me = useClienteMeViewModel();

  useFocusEffect(
    useCallback(() => {
      void me.refresh();
    }, [me.refresh])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { borderBottomColor: borderHead }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backWrap}>
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Meu Perfil</Text>
        <View style={styles.backWrap} />
      </View>

      {me.loading && !me.data ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={palette.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: dark ? palette.slate700 : palette.slate200,
                  borderColor: `${palette.primary}33`,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: palette.primary }]}>{iniciais(me.data?.nome ?? '')}</Text>
            </View>
            <Text style={[styles.nome, { color: text }]}>{me.data?.nome ?? '—'}</Text>
            <Text style={styles.email}>{me.data?.email ?? '—'}</Text>
          </View>

          <View style={styles.menu}>
            <MenuRow
              icon="place"
              label="Meus endereços"
              onPress={() => navigation.navigate('ClienteMeusEnderecos')}
              dark={dark}
              card={card}
              text={text}
            />
            <MenuRow
              icon="lock"
              label="Alterar senha"
              onPress={() => navigation.navigate('ClienteAlterarSenha')}
              dark={dark}
              card={card}
              text={text}
            />
            <MenuRow
              icon="confirmation-number"
              label="Tickets de suporte"
              onPress={() => navigation.navigate('ClienteTickets')}
              dark={dark}
              card={card}
              text={text}
            />

            <Pressable
              onPress={() => void setToken(null)}
              style={[styles.menuCardDanger, { backgroundColor: card }]}
            >
              <View style={styles.iconDanger}>
                <MaterialIcons name="logout" size={22} color="#dc2626" />
              </View>
              <Text style={styles.labelDanger}>Sair</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  dark,
  card,
  text,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  dark: boolean;
  card: string;
  text: string;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuCard,
        { backgroundColor: card, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: dark ? `${palette.primary}33` : `${palette.primary}18` }]}>
        <MaterialIcons name={icon} size={22} color={palette.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: text }]} numberOfLines={1}>
        {label}
      </Text>
      <MaterialIcons name="chevron-right" size={22} color={dark ? palette.slate500 : palette.slate400} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
  scroll: { paddingBottom: 32 },
  hero: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 40, fontWeight: '800' },
  nome: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  email: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: palette.primary,
    opacity: 0.85,
    textAlign: 'center',
  },
  menu: { paddingHorizontal: 16, gap: 8 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: `${palette.primary}14`,
  },
  menuCardDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDanger: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220,38,38,0.12)',
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  labelDanger: { flex: 1, fontSize: 16, fontWeight: '600', color: '#dc2626' },
});
