import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import type { RestauranteResponseDTO, StatusRestaurante } from '../types/api';
import { useClienteRestaurantesViewModel } from '../hooks/useClienteRestaurantesViewModel';
import { useClienteMeViewModel } from '../hooks/useClienteMeViewModel';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteRestaurantes'>;

type CatKey = 'all' | 'pizza' | 'burger' | 'sushi' | 'healthy' | 'sweet' | 'asian';

const CATEGORIAS: {
  key: CatKey;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  keywords: string[];
  lightBg: string;
  lightIcon: string;
  darkBg: string;
  darkIcon: string;
}[] = [
  { key: 'all', label: 'Todos', icon: 'restaurant', keywords: [], lightBg: '#fff7ed', lightIcon: '#ea580c', darkBg: 'rgba(234,88,12,0.2)', darkIcon: '#fb923c' },
  { key: 'pizza', label: 'Pizza', icon: 'local-pizza', keywords: ['pizza', 'pizz'], lightBg: '#ffedd5', lightIcon: '#ea580c', darkBg: 'rgba(234,88,12,0.2)', darkIcon: '#fdba74' },
  { key: 'burger', label: 'Hambúrguer', icon: 'fastfood', keywords: ['burg', 'hamb', 'lanche', 'sand'], lightBg: '#fef3c7', lightIcon: '#d97706', darkBg: 'rgba(217,119,6,0.2)', darkIcon: '#fcd34d' },
  { key: 'sushi', label: 'Sushi', icon: 'set-meal', keywords: ['sushi', 'sashimi', 'jap'], lightBg: '#fee2e2', lightIcon: '#dc2626', darkBg: 'rgba(220,38,38,0.2)', darkIcon: '#fca5a5' },
  { key: 'healthy', label: 'Saudável', icon: 'spa', keywords: ['salad', 'salada', 'natural', 'vegan', 'green', 'bowl'], lightBg: '#dcfce7', lightIcon: '#16a34a', darkBg: 'rgba(22,163,74,0.2)', darkIcon: '#86efac' },
  { key: 'sweet', label: 'Sobremesa', icon: 'icecream', keywords: ['doce', 'sobre', 'doceria', 'cake', 'gelad'], lightBg: '#dbeafe', lightIcon: '#2563eb', darkBg: 'rgba(37,99,235,0.2)', darkIcon: '#93c5fd' },
  { key: 'asian', label: 'Asiática', icon: 'ramen-dining', keywords: ['asia', 'chin', 'tail', 'core', 'thai', 'yakisoba'], lightBg: '#f3e8ff', lightIcon: '#9333ea', darkBg: 'rgba(147,51,234,0.2)', darkIcon: '#d8b4fe' },
];

const HIGHLIGHT_GRADIENTS: [string, string][] = [
  ['#fb923c', '#ef4444'],
  ['#34d399', '#059669'],
  ['#fbbf24', '#ea580c'],
  ['#a78bfa', '#6366f1'],
  ['#f472b6', '#db2777'],
];

function legendaStatus(status: StatusRestaurante): string {
  switch (status) {
    case 'APPROVED':
      return 'Aberto';
    case 'PENDING_APPROVAL':
      return 'Em análise';
    case 'REJECTED':
      return 'Indisponível';
    default:
      return status;
  }
}

function matchesCategory(item: RestauranteResponseDTO, catKey: CatKey): boolean {
  if (catKey === 'all') return true;
  const cat = CATEGORIAS.find((c) => c.key === catKey);
  if (!cat || cat.keywords.length === 0) return true;
  const blob = `${item.nome} ${item.endereco}`.toLowerCase();
  return cat.keywords.some((kw) => blob.includes(kw));
}

function gradientForId(id: number): [string, string] {
  return HIGHLIGHT_GRADIENTS[Math.abs(id) % HIGHLIGHT_GRADIENTS.length]!;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [catSelecionada, setCatSelecionada] = useState<CatKey>('all');

  const enderecoEntrega = useMemo(() => {
    if (me.loading && !me.data) {
      return 'Carregando…';
    }
    const e = me.data?.endereco?.trim();
    if (e) return e;
    return 'Complete o endereço no seu cadastro';
  }, [me.loading, me.data]);

  const onRefreshAll = useCallback(async () => {
    await Promise.all([vm.refresh(), me.refresh()]);
  }, [vm.refresh, me.refresh]);

  useFocusEffect(
    useCallback(() => {
      void vm.init();
    }, [vm.init])
  );

  const filtrados = useMemo(() => {
    let out = vm.items.filter((r) => matchesCategory(r, catSelecionada));
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (r) => r.nome.toLowerCase().includes(q) || r.endereco.toLowerCase().includes(q)
      );
    }
    return out;
  }, [vm.items, catSelecionada, searchQuery]);

  const destaqueItems = useMemo(() => {
    const aprovados = vm.items.filter((r) => r.status === 'APPROVED' && matchesCategory(r, catSelecionada));
    const q = searchQuery.trim().toLowerCase();
    const base = q
      ? aprovados.filter(
          (r) => r.nome.toLowerCase().includes(q) || r.endereco.toLowerCase().includes(q)
        )
      : aprovados;
    return base.slice(0, 6);
  }, [vm.items, catSelecionada, searchQuery]);

  const renderDestaque = useCallback(
    (item: RestauranteResponseDTO) => {
      const g = gradientForId(item.id);
      return (
        <Pressable
          key={item.id}
          onPress={() => navigation.navigate('RestauranteCardapio', { restauranteId: item.id })}
          style={({ pressed }) => [styles.destaqueCard, { opacity: pressed ? 0.92 : 1 }]}
        >
          <View style={styles.destaqueImgWrap}>
            <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.badgeStar}>
              <MaterialIcons name="star" size={14} color="#f59e0b" />
              <Text style={styles.badgeStarText}>Em breve</Text>
            </View>
            {item.raioEntregaKm != null ? (
              <View style={styles.badgeTime}>
                <Text style={styles.badgeTimeText}>Até {item.raioEntregaKm} km</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.destaqueBody}>
            <Text style={[styles.destaqueNome, { color: text }]} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={[styles.destaqueSub, { color: sub }]} numberOfLines={1}>
              {item.endereco}
            </Text>
            <View style={styles.destaqueFoot}>
              <MaterialIcons name="storefront" size={14} color={sub} />
              <Text style={[styles.destaqueFootText, { color: sub }]}>Ver cardápio</Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [navigation, text, sub]
  );

  const renderRow = useCallback(
    ({ item }: { item: RestauranteResponseDTO }) => {
      const open = item.status === 'APPROVED';
      const pending = item.status === 'PENDING_APPROVAL';
      const closed = item.status === 'REJECTED';
      const g = gradientForId(item.id);
      const onPress = () => {
        if (open) navigation.navigate('RestauranteCardapio', { restauranteId: item.id });
      };
      return (
        <Pressable
          onPress={onPress}
          disabled={!open}
          style={({ pressed }) => [
            styles.listCard,
            {
              backgroundColor: card,
              borderColor: closed || pending ? border : 'transparent',
              opacity: !open ? 0.72 : pressed ? 0.94 : 1,
            },
          ]}
        >
          <View style={styles.listImgWrap}>
            <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            {!open ? (
              <View style={styles.listImgOverlay}>
                <Text style={styles.fechadoBadge}>{legendaStatus(item.status)}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.listBody}>
            <View style={styles.listTitleRow}>
              <Text style={[styles.listNome, { color: text }]} numberOfLines={2}>
                {item.nome}
              </Text>
              <View style={[styles.miniStar, { backgroundColor: dark ? palette.slate700 : palette.slate100 }]}>
                <MaterialIcons name="star" size={12} color="#f59e0b" />
                <Text style={[styles.miniStarText, { color: text }]}>—</Text>
              </View>
            </View>
            <Text style={[styles.listSub, { color: sub }]} numberOfLines={1}>
              {item.endereco}
            </Text>
            <View style={styles.listFoot}>
              {open ? (
                <>
                  <View style={styles.chipTime}>
                    <MaterialIcons name="schedule" size={14} color={palette.primary} />
                    <Text style={styles.chipTimeText}>{legendaStatus(item.status)}</Text>
                  </View>
                  {item.raioEntregaKm != null ? (
                    <Text style={[styles.listFootMeta, { color: sub }]}>Até {item.raioEntregaKm} km</Text>
                  ) : (
                    <Text style={[styles.listFootMeta, { color: sub }]}> </Text>
                  )}
                </>
              ) : (
                <Text style={[styles.listFootMeta, { color: sub }]}>
                  {pending ? 'Disponível após aprovação' : 'Não aceita pedidos'}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      );
    },
    [card, border, dark, navigation, text, sub]
  );

  const listHeader = useMemo(
    () => (
      <>
        <View style={[styles.locRow, { backgroundColor: stickyBg }]}>
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
        </View>

        <View style={[styles.searchSticky, { backgroundColor: stickyBg }]}>
          <View style={[styles.searchBox, { backgroundColor: inputBg }]}>
            <MaterialIcons name="search" size={22} color={sub} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar restaurantes, cozinhas, pratos..."
              placeholderTextColor={sub}
              style={[styles.searchInput, { color: text }]}
            />
            <Pressable hitSlop={12} style={styles.tuneBtn}>
              <MaterialIcons name="tune" size={22} color={palette.primary} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIAS.map((c) => {
            const sel = catSelecionada === c.key;
            const bubbleBg = dark ? c.darkBg : c.lightBg;
            const iconCol = dark ? c.darkIcon : c.lightIcon;
            return (
              <Pressable
                key={c.key}
                onPress={() => setCatSelecionada(c.key)}
                style={styles.catItem}
              >
                <View
                  style={[
                    styles.catBubble,
                    { backgroundColor: bubbleBg },
                    sel && { backgroundColor: palette.primary },
                  ]}
                >
                  <MaterialIcons name={c.icon} size={28} color={sel ? palette.white : iconCol} />
                </View>
                <Text style={[styles.catLabel, { color: text }]} numberOfLines={1}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.destaquesHeader}>
          <Text style={[styles.blockTitle, { color: text }]}>Destaques</Text>
          <Pressable
            hitSlop={8}
            onPress={() => {
              setCatSelecionada('all');
              setSearchQuery('');
            }}
          >
            <Text style={styles.verTodos}>Ver todos</Text>
          </Pressable>
        </View>
        {destaqueItems.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destaquesScroll}
          >
            {destaqueItems.map((it) => renderDestaque(it))}
          </ScrollView>
        ) : (
          <Text style={[styles.destaquesEmpty, { color: sub }]}>
            Nenhum destaque com os filtros atuais.
          </Text>
        )}

        <View style={[styles.divider, { backgroundColor: dark ? palette.slate800 : palette.slate100 }]} />

        <Text style={[styles.blockTitle, { color: text, marginBottom: 12, paddingHorizontal: 4 }]}>
          Todos os Restaurantes
        </Text>
      </>
    ),
    [
      stickyBg,
      sub,
      text,
      dark,
      inputBg,
      searchQuery,
      setSearchQuery,
      catSelecionada,
      destaqueItems,
      renderDestaque,
      enderecoEntrega,
    ]
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
          data={filtrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRow}
          ListHeaderComponent={listHeader}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
          refreshControl={
            <RefreshControl refreshing={vm.refreshing} onRefresh={() => void onRefreshAll()} />
          }
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
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  catScroll: { paddingHorizontal: 16, paddingVertical: 16, gap: 16 },
  catItem: { alignItems: 'center', width: 72 },
  catBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: { marginTop: 8, fontSize: 11, fontWeight: '700', textAlign: 'center' },
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
  destaqueCard: { width: 256, borderRadius: 12, overflow: 'hidden', backgroundColor: 'transparent' },
  destaqueImgWrap: { height: 128, position: 'relative' },
  badgeStar: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeStarText: { fontSize: 11, fontWeight: '800', color: palette.slate900 },
  badgeTime: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTimeText: { color: palette.white, fontSize: 11, fontWeight: '600' },
  destaqueBody: { padding: 12 },
  destaqueNome: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  destaqueSub: { fontSize: 12, marginBottom: 8 },
  destaqueFoot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  destaqueFootText: { fontSize: 12, fontWeight: '600' },
  destaquesEmpty: { paddingHorizontal: 16, marginBottom: 8, fontSize: 14 },
  divider: { height: 8, marginVertical: 8, marginHorizontal: 0 },
  listContent: { paddingHorizontal: 16 },
  listCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  listImgWrap: { width: 96, height: 96, borderRadius: 8, overflow: 'hidden', backgroundColor: palette.slate200 },
  listImgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fechadoBadge: {
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: palette.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  listBody: { flex: 1, justifyContent: 'center', minWidth: 0 },
  listTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  listNome: { flex: 1, fontSize: 16, fontWeight: '800', lineHeight: 20 },
  miniStar: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  miniStarText: { fontSize: 11, fontWeight: '800' },
  listSub: { fontSize: 12, marginBottom: 8 },
  listFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  chipTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${palette.primary}18`,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chipTimeText: { fontSize: 11, fontWeight: '700', color: palette.primary },
  listFootMeta: { fontSize: 11, fontWeight: '600' },
  err: { color: '#b91c1c', padding: 16 },
  empty: { textAlign: 'center', marginTop: 24, paddingHorizontal: 24, fontSize: 15 },
});
