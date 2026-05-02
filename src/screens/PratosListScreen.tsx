import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestauranteMeViewModel } from '../hooks/useRestauranteMeViewModel';
import { usePratosViewModel } from '../hooks/usePratosViewModel';
import { formatPrecoBRL } from '../utils/preco';
import { resolveMediaUrl } from '../utils/imageUrl';
import { palette } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';
import type { CategoriaMenu, PratoResponseDTO } from '../types/api';

const CATEGORIA_LABEL: Record<CategoriaMenu, string> = {
  STARTER: 'Entradas',
  MAIN: 'Pratos principais',
  DRINK: 'Bebidas',
  DESSERT: 'Sobremesas',
};

type Props = NativeStackScreenProps<RootStackParamList, 'PratosList'>;

export function PratosListScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const card = dark ? palette.slate800 : palette.white;
  const border = dark ? palette.slate700 : palette.slate100;

  const me = useRestauranteMeViewModel();
  const pratos = usePratosViewModel(me.data?.id ?? null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void (async () => {
        const r = await me.refresh();
        if (!alive || !r) return;
        await pratos.loadFor(r.id);
      })();
      return () => {
        alive = false;
      };
    }, [me.refresh, pratos.loadFor])
  );

  const renderItem = ({ item }: { item: PratoResponseDTO }) => {
    const img = resolveMediaUrl(item.fotoUrl);
    return (
      <View style={[styles.row, { backgroundColor: card, borderColor: border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.nome, { color: text }]}>{item.nome}</Text>
          <Text style={[styles.cat, { color: sub }]}>{CATEGORIA_LABEL[item.categoria]}</Text>
          {item.descricao ? (
            <Text style={[styles.desc, { color: sub }]} numberOfLines={2}>
              {item.descricao}
            </Text>
          ) : null}
          <Text style={styles.preco}>{formatPrecoBRL(Number(item.preco))}</Text>
          <Pressable
            onPress={() => navigation.navigate('PratoEditar', { prato: item })}
            style={styles.editBtn}
          >
            <MaterialIcons name="edit" size={16} color={palette.primary} />
            <Text style={styles.editTx}>Editar</Text>
          </Pressable>
        </View>
        {img ? (
          <Image source={{ uri: img }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPh, { borderColor: border }]}>
            <MaterialIcons name="image" size={28} color={sub} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={26} color={text} />
        </Pressable>
        <Text style={[styles.title, { color: text }]}>Cardápio</Text>
        <Pressable onPress={() => navigation.navigate('PratoCadastro')} hitSlop={12}>
          <MaterialIcons name="add" size={28} color={palette.primary} />
        </Pressable>
      </View>
      {pratos.loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} color={palette.primary} />
      ) : (
        <FlatList
          data={pratos.items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: sub }]}>Nenhum prato cadastrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: { fontSize: 18, fontWeight: '800' },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  nome: { fontSize: 16, fontWeight: '700' },
  cat: { fontSize: 12, marginTop: 2 },
  desc: { fontSize: 13, marginTop: 4 },
  preco: { marginTop: 8, fontWeight: '800', fontSize: 16, color: palette.primary },
  editBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  editTx: { color: palette.primary, fontWeight: '700', fontSize: 13 },
  thumb: { width: 88, height: 88, borderRadius: 10 },
  thumbPh: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 15 },
});
