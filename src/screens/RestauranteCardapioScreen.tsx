import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestauranteCardapioViewModel } from '../hooks/useRestauranteCardapioViewModel';
import type { ClienteStackParamList, RestauranteStackParamList } from '../navigation/types';
import type { CategoriaMenu } from '../types/api';
import { formatPrecoBRL } from '../utils/preco';
import { formatContagemAvaliacoes } from '../utils/texto';
import { RestauranteCover } from '../components/RestauranteCover';
import { resolveMediaUrl } from '../utils/imageUrl';
import { palette } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as carrinhoService from '../services/carrinhoService';
import * as avaliacaoService from '../services/avaliacaoService';

type Props = NativeStackScreenProps<
  RestauranteStackParamList | ClienteStackParamList,
  'RestauranteCardapio'
>;

const TABS: { key: CategoriaMenu; label: string }[] = [
  { key: 'STARTER', label: 'Entradas' },
  { key: 'MAIN', label: 'Pratos Principais' },
  { key: 'DRINK', label: 'Bebidas' },
  { key: 'DESSERT', label: 'Sobremesas' },
];

export function RestauranteCardapioScreen({ navigation, route }: Props): React.JSX.Element {
  const { restauranteId } = route.params;
  const { rest, pratos, tab, setTab, loading, filtered, contagemPorTab } =
    useRestauranteCardapioViewModel(restauranteId);
  const { hasRole } = useAuth();
  const isCliente = hasRole('ROLE_CLIENTE');
  const { refresh, setRestauranteId } = useCart();
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addMsg, setAddMsg] = useState<string | null>(null);
  const [rating, setRating] = useState<{ media: number; total: number } | null>(null);

  const dark = useColorScheme() === 'dark';

  useEffect(() => {
    if (!isCliente || !rest) return;
    void (async () => {
      try {
        const r = await avaliacaoService.resumoRestaurante(restauranteId);
        setRating({
          media: Number(r.mediaNotaRestaurante),
          total: Number(r.totalAvaliacoesRestaurante),
        });
      } catch {
        setRating(null);
      }
    })();
  }, [isCliente, restauranteId, rest?.id]);

  const adicionar = async (pratoId: number) => {
    setAddingId(pratoId);
    setAddMsg(null);
    try {
      setRestauranteId(restauranteId);
      await carrinhoService.adicionarItem({ pratoId, quantidade: 1 });
      await refresh();
      setAddMsg('Adicionado ao carrinho');
    } catch {
      setAddMsg('Não foi possível adicionar ao carrinho');
    } finally {
      setAddingId(null);
    }
  };
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const card = dark ? palette.slate800 : palette.white;
  const border = dark ? palette.slate700 : palette.slate100;

  if (loading && !rest) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator color={palette.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!rest) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: bg }]}>
        <Text style={{ color: sub }}>Não foi possível carregar.</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: palette.primary, fontWeight: '700' }}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView edges={['top']} style={styles.stickyTop}>
        <View style={[styles.topBar, { backgroundColor: dark ? `${palette.backgroundDark}E6` : `${palette.backgroundLight}E6` }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.tbBtn}>
            <MaterialIcons name="arrow-back" size={24} color={text} />
          </Pressable>
          <Text style={[styles.tbTitle, { color: text }]} numberOfLines={1}>
            {rest.nome}
          </Text>
          <View style={styles.tbBtn} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroWrap}>
          <RestauranteCover
            fotoUrl={rest.fotoUrl}
            gradient={['#fb923c', '#ea580c']}
            style={styles.hero}
            borderRadius={12}
          >
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroGrad}>
              <Text style={styles.heroTitle}>{rest.nome}</Text>
              <Text style={styles.heroSub}>Cardápio • {rest.endereco}</Text>
            </LinearGradient>
          </RestauranteCover>
        </View>

        <View style={[styles.info, { borderBottomColor: border }]}>
          <Pressable
            style={styles.ratingRow}
            onPress={() =>
              navigation.navigate('RestauranteAvaliacoes', {
                restauranteId,
                restauranteNome: rest.nome,
              })
            }
            disabled={!isCliente}
          >
            <View style={styles.ratingPill}>
              <Text style={styles.ratingNum}>
                {rating ? rating.media.toFixed(1) : '—'}
              </Text>
              <MaterialIcons name="star" size={18} color={palette.primary} />
            </View>
            <Text style={[styles.rateLink, { color: palette.primary }]}>
              {rating && rating.total > 0
                ? `${formatContagemAvaliacoes(rating.total)} · Ver todas`
                : 'Ver avaliações'}
            </Text>
            {isCliente ? (
              <MaterialIcons name="chevron-right" size={22} color={palette.primary} />
            ) : null}
          </Pressable>
          {addMsg ? (
            <Text style={{ color: palette.primary, fontWeight: '600', fontSize: 13 }}>{addMsg}</Text>
          ) : null}
          <View style={styles.metaRow}>
            <Meta icon="schedule" text="IFeats" />
            <Meta icon="directions-bike" text={rest.raioEntregaKm != null ? `${rest.raioEntregaKm} km` : 'Raio —'} />
            <Meta icon="phone" text={rest.telefone} />
          </View>
        </View>

        <View style={[styles.tabsBar, { backgroundColor: bg, borderBottomColor: border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsInner}>
            {TABS.map((t) => {
              const on = t.key === tab;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  style={[
                    styles.tab,
                    on
                      ? styles.tabOn
                      : { backgroundColor: dark ? palette.slate800 : palette.slate100 },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabTx,
                      on ? styles.tabTxOn : { color: dark ? palette.slate300 : palette.slate700 },
                    ]}
                  >
                    {t.label}
                    {contagemPorTab[t.key] > 0 ? ` (${contagemPorTab[t.key]})` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.listPad}>
          <Text style={[styles.secTitle, { color: text }]}>
            {TABS.find((x) => x.key === tab)?.label}
          </Text>
          {filtered.length === 0 ? (
            <Text style={[styles.empty, { color: sub }]}>
              {pratos.length === 0
                ? 'Nenhum prato cadastrado ainda.'
                : 'Nenhum prato nesta categoria. Toque em outra aba acima.'}
            </Text>
          ) : (
            filtered.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemNome, { color: text }]}>{item.nome}</Text>
                  {item.descricao ? (
                    <Text style={[styles.itemDesc, { color: sub }]} numberOfLines={3}>
                      {item.descricao}
                    </Text>
                  ) : null}
                  <Text style={styles.itemPreco}>{formatPrecoBRL(Number(item.preco))}</Text>
                </View>
                <View style={styles.thumbCol}>
                  {resolveMediaUrl(item.fotoUrl) ? (
                    <Image source={{ uri: resolveMediaUrl(item.fotoUrl)! }} style={styles.thumb} />
                  ) : (
                    <View style={[styles.thumb, styles.thumbPh]}>
                      <MaterialIcons name="restaurant" size={28} color={sub} />
                    </View>
                  )}
                  {isCliente && item.disponivel !== false ? (
                    <Pressable
                      style={styles.addBtn}
                      onPress={() => void adicionar(item.id)}
                      disabled={addingId === item.id}
                    >
                      {addingId === item.id ? (
                        <ActivityIndicator color={palette.white} size="small" />
                      ) : (
                        <>
                          <MaterialIcons name="add" size={18} color={palette.white} />
                          <Text style={styles.addBtnText}>Adicionar</Text>
                        </>
                      )}
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Meta({ icon, text }: { icon: keyof typeof MaterialIcons.glyphMap; text: string }) {
  return (
    <View style={styles.metaItem}>
      <MaterialIcons name={icon} size={18} color={palette.slate500} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stickyTop: { zIndex: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.slate200,
  },
  tbBtn: { width: 48, height: 44, justifyContent: 'center', alignItems: 'center' },
  tbTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  heroWrap: { paddingHorizontal: 16, paddingTop: 8 },
  hero: { height: 220, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' },
  heroGrad: { padding: 16, paddingTop: 48 },
  heroTitle: { color: palette.white, fontSize: 26, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.9)', marginTop: 4, fontSize: 13, fontWeight: '500' },
  info: { padding: 16, borderBottomWidth: 1, gap: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(236,73,19,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ratingNum: { fontSize: 18, fontWeight: '800', color: palette.primary },
  rateLink: { fontSize: 13, fontWeight: '600' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: palette.slate600 },
  tabsBar: { borderBottomWidth: 1 },
  tabsInner: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row' },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  tabOn: { backgroundColor: palette.primary },
  tabTx: { fontSize: 13, fontWeight: '600' },
  tabTxOn: { color: palette.white, fontWeight: '700' },
  listPad: { padding: 16, paddingBottom: 40 },
  secTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  empty: { fontSize: 14, marginTop: 8 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemNome: { fontSize: 16, fontWeight: '700' },
  itemDesc: { fontSize: 13, marginTop: 4 },
  itemPreco: { marginTop: 8, fontSize: 16, fontWeight: '800', color: palette.primary },
  thumbCol: { alignItems: 'center', gap: 8 },
  thumb: { width: 96, height: 96, borderRadius: 10 },
  thumbPh: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 96,
    justifyContent: 'center',
  },
  addBtnText: { color: palette.white, fontWeight: '800', fontSize: 12 },
});
