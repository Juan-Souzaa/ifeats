import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
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
import { CategoriaChips } from '../components/restaurante/CategoriaChips';
import { RestauranteHighlightCard } from '../components/restaurante/RestauranteHighlightCard';
import { RestauranteListRow } from '../components/restaurante/RestauranteListRow';
import type { ClienteStackParamList } from '../navigation/types';
import type { RestauranteResponseDTO } from '../types/api';
import { useClienteRestaurantesViewModel } from '../hooks/useClienteRestaurantesViewModel';
import { useClienteMeViewModel } from '../hooks/useClienteMeViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteRestaurantes'>;

export function ClienteRestaurantesScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const card = dark ? '#1e293b' : palette.white;
  const border = dark ? palette.slate700 : palette.slate200;
  const inputBg = dark ? '#1e293b' : palette.white;
  const stickyBg = dark ? palette.backgroundDark : palette.backgroundLight;

  const me = useClienteMeViewModel();
  const vm = useClienteRestaurantesViewModel();

  const enderecoEntrega = useMemo(() => {
    if (me.loading && !me.data) return 'Carregando…';
    const e = me.data?.endereco?.trim();
    return e || 'Complete o endereço no seu cadastro';
  }, [me.loading, me.data]);

  const onRefreshAll = useCallback(async () => {
    await Promise.all([vm.refresh(), me.refresh()]);
  }, [vm.refresh, me.refresh]);

  useFocusEffect(
    useCallback(() => {
      void Promise.all([vm.init(), me.refresh()]);
    }, [vm.init, me.refresh])
  );

  useEffect(() => {
    const q = vm.searchQuery.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => void vm.buscar(q), 400);
    return () => clearTimeout(t);
  }, [vm.searchQuery, vm.buscar]);

  const openCardapio = useCallback(
    (restauranteId: number) => navigation.navigate('RestauranteCardapio', { restauranteId }),
    [navigation]
  );

  const listHeader = useMemo(
    () => (
      <>
        <Pressable
          style={[styles.locRow, { backgroundColor: stickyBg }]}
          onPress={() => navigation.navigate('ClienteMeusEnderecos')}
          accessibilityLabel="Alterar endereço de entrega"
        >
          <View style={styles.locTextWrap}>
            <Text style={[styles.locLabel, { color: sub }]}>Entregando em</Text>
            <View style={styles.locLine}>
              <Text style={[styles.locValue, { color: text }]} numberOfLines={2}>
                {enderecoEntrega}
              </Text>
              <MaterialIcons name="expand-more" size={20} color={palette.primary} />
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('ClientePerfil')}
            style={[styles.avatarBtn, { backgroundColor: dark ? palette.slate700 : palette.slate200 }]}
            accessibilityLabel="Meu perfil"
          >
            <MaterialIcons name="person" size={22} color={dark ? palette.slate200 : palette.slate700} />
          </Pressable>
        </Pressable>

        <View style={[styles.searchSticky, { backgroundColor: stickyBg }]}>
          <View style={[styles.searchBox, { backgroundColor: inputBg }]}>
            <MaterialIcons name="search" size={22} color={sub} style={styles.searchIcon} />
            <TextInput
              value={vm.searchQuery}
              onChangeText={vm.setSearchQuery}
              placeholder="Buscar restaurantes, cozinhas, pratos..."
              placeholderTextColor={sub}
              style={[styles.searchInput, { color: text }]}
            />
            <Pressable hitSlop={12} style={styles.tuneBtn}>
              <MaterialIcons name="tune" size={22} color={palette.primary} />
            </Pressable>
          </View>
        </View>

        <CategoriaChips
          dark={dark}
          textColor={text}
          selected={vm.catSelecionada}
          onSelect={(key) => void vm.selecionarCategoria(key)}
        />

        <View style={styles.destaquesHeader}>
          <Text style={[styles.blockTitle, { color: text }]}>Destaques</Text>
          <Pressable hitSlop={8} onPress={() => void vm.selecionarCategoria('all')}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </Pressable>
        </View>
        {vm.destaqueItems.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destaquesScroll}>
            {vm.destaqueItems.map((it) => (
              <RestauranteHighlightCard
                key={it.id}
                item={it}
                textColor={text}
                subColor={sub}
                onPress={openCardapio}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.destaquesEmpty, { color: sub }]}>Nenhum destaque com os filtros atuais.</Text>
        )}

        <View style={[styles.divider, { backgroundColor: dark ? palette.slate800 : palette.slate100 }]} />
        <Text style={[styles.blockTitle, { color: text, marginBottom: 12, paddingHorizontal: 4 }]}>
          Todos os Restaurantes
        </Text>
      </>
    ),
    [stickyBg, sub, text, dark, inputBg, vm, enderecoEntrega, navigation, openCardapio]
  );

  const bottomPad = insets.bottom + 72;

  if (vm.loading && !vm.refreshing && vm.items.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
        <ActivityIndicator style={{ marginTop: 48 }} color={palette.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      {vm.error && vm.items.length === 0 ? (
        <Text style={styles.err}>{vm.error}</Text>
      ) : (
        <FlatList
          data={vm.filtrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }: { item: RestauranteResponseDTO }) => (
            <RestauranteListRow
              item={item}
              dark={dark}
              cardColor={card}
              borderColor={border}
              textColor={text}
              subColor={sub}
              onPress={openCardapio}
            />
          )}
          ListHeaderComponent={listHeader}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
          refreshControl={<RefreshControl refreshing={vm.refreshing} onRefresh={() => void onRefreshAll()} />}
          onEndReachedThreshold={0.35}
          onEndReached={() => {
            if (vm.hasMore && !vm.loadingMore && !vm.loading) void vm.loadMore();
          }}
          ListEmptyComponent={
            !vm.loading ? (
              <Text style={[styles.empty, { color: sub }]}>
                Nenhum restaurante encontrado. Ajuste a busca ou a categoria.
              </Text>
            ) : null
          }
          ListFooterComponent={
            vm.loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} color={palette.primary} /> : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  locTextWrap: { flex: 1, marginRight: 12 },
  locLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
  locLine: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  locValue: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  searchSticky: { paddingHorizontal: 16, paddingBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: { marginLeft: 14 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', paddingVertical: 8, paddingRight: 8 },
  tuneBtn: { paddingRight: 14, paddingLeft: 8 },
  destaquesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  blockTitle: { fontSize: 18, fontWeight: '800' },
  verTodos: { fontSize: 14, fontWeight: '700', color: palette.primary },
  destaquesScroll: { paddingHorizontal: 16, gap: 16, paddingBottom: 8 },
  destaquesEmpty: { paddingHorizontal: 16, marginBottom: 8, fontSize: 14 },
  divider: { height: 8, marginVertical: 8, marginHorizontal: 0 },
  listContent: { paddingHorizontal: 16 },
  err: { color: '#b91c1c', padding: 16 },
  empty: { textAlign: 'center', marginTop: 24, paddingHorizontal: 24, fontSize: 15 },
});
