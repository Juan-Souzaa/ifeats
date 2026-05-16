import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import type { RestauranteStackParamList } from '../navigation/types';
import { useRestauranteMeViewModel } from '../hooks/useRestauranteMeViewModel';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestauranteHome'>;

export function RestauranteHomeScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const card = dark ? palette.slate800 : palette.white;
  const border = dark ? palette.slate700 : palette.slate200;

  const { setToken } = useAuth();
  const me = useRestauranteMeViewModel();

  useFocusEffect(
    useCallback(() => {
      void me.refresh();
    }, [me.refresh])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Meu restaurante</Text>
        <Pressable onPress={() => void setToken(null)} hitSlop={10}>
          <MaterialIcons name="logout" size={24} color={palette.primary} />
        </Pressable>
      </View>

      {me.loading && !me.data ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={palette.primary} />
      ) : me.error ? (
        <Text style={styles.err}>{me.error}</Text>
      ) : me.data ? (
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.nome, { color: text }]}>{me.data.nome}</Text>
          <Text style={[styles.meta, { color: sub }]}>{me.data.email}</Text>
          <Text style={[styles.meta, { color: sub }]}>Status: {me.data.status}</Text>
          <Text style={[styles.meta, { color: sub }]}>{me.data.endereco}</Text>

          <Pressable
            style={styles.btn}
            onPress={() => navigation.navigate('PratosList')}
          >
            <MaterialIcons name="restaurant-menu" size={22} color={palette.white} />
            <Text style={styles.btnText}>Meus pratos</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate('PratoCadastro')}
          >
            <MaterialIcons name="add-circle-outline" size={22} color={palette.primary} />
            <Text style={styles.btnOutlineText}>Novo prato</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnGhost]}
            onPress={() =>
              navigation.navigate('RestauranteCardapio', { restauranteId: me.data!.id })
            }
          >
            <MaterialIcons name="visibility" size={22} color={palette.primary} />
            <Text style={styles.btnOutlineText}>Ver cardápio</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  title: { fontSize: 22, fontWeight: '800' },
  card: { borderRadius: 16, padding: 18, borderWidth: 1, gap: 10 },
  nome: { fontSize: 20, fontWeight: '800' },
  meta: { fontSize: 14 },
  err: { color: '#b91c1c', marginTop: 12 },
  btn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    height: 48,
    borderRadius: 12,
  },
  btnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: palette.primary,
  },
  btnOutlineText: { color: palette.primary, fontWeight: '700', fontSize: 16 },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
