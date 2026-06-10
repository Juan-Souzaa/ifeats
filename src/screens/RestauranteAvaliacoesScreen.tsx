import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList, RestauranteStackParamList } from '../navigation/types';
import type { AvaliacaoRestauranteResponseDTO } from '../types/api';
import * as avaliacaoService from '../services/avaliacaoService';
import { Card, EmptyState, ErrorBanner, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatContagemAvaliacoes } from '../utils/texto';

type Props = NativeStackScreenProps<
  RestauranteStackParamList | ClienteStackParamList,
  'RestauranteAvaliacoes'
>;

function formatData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function RestauranteAvaliacoesScreen({ navigation, route }: Props): React.JSX.Element {
  const { restauranteId, restauranteNome } = route.params;
  const c = useThemeColors();
  const [resumo, setResumo] = useState<{ media: number; total: number } | null>(null);
  const [items, setItems] = useState<AvaliacaoRestauranteResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResumo = useCallback(async () => {
    try {
      const r = await avaliacaoService.resumoRestaurante(restauranteId);
      setResumo({
        media: Number(r.mediaNotaRestaurante),
        total: Number(r.totalAvaliacoesRestaurante),
      });
    } catch {
      setResumo(null);
    }
  }, [restauranteId]);

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const res = await avaliacaoService.listarAvaliacoesRestaurante(restauranteId, pageNum, 15);
        const content = res.content ?? [];
        const lastIdx = res.totalElements === 0 ? 0 : Math.ceil(res.totalElements / res.size) - 1;
        setHasMore(pageNum < lastIdx);
        setPage(pageNum);
        setItems((prev) => (append ? [...prev, ...content] : content));
      } catch {
        setError('Não foi possível carregar as avaliações.');
        if (!append) setItems([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [restauranteId]
  );

  useEffect(() => {
    void loadResumo();
    void loadPage(0, false);
  }, [loadResumo, loadPage]);

  const title = restauranteNome ? `Avaliações · ${restauranteNome}` : 'Avaliações';

  return (
    <ScreenShell title={title} onBack={() => navigation.goBack()} scroll={false}>
      {error ? <ErrorBanner message={error} onRetry={() => void loadPage(0, false)} /> : null}

      {resumo && resumo.total > 0 ? (
        <View style={[styles.resumo, { backgroundColor: c.chipMutedBg }]}>
          <Text style={[styles.resumoNum, { color: palette.primary }]}>
            {resumo.media.toFixed(1)}
          </Text>
          <MaterialIcons name="star" size={22} color={palette.primary} />
          <Text style={[styles.resumoMeta, { color: c.sub }]}>
            {formatContagemAvaliacoes(resumo.total)}
          </Text>
        </View>
      ) : null}

      {loading && items.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={palette.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={items.length === 0 ? styles.empty : styles.list}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasMore && !loadingMore && !loading) void loadPage(page + 1, true);
          }}
          ListEmptyComponent={
            <EmptyState
              icon="star-outline"
              title="Sem avaliações"
              subtitle="Este restaurante ainda não recebeu avaliações de clientes."
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ marginVertical: spacing.lg }} color={palette.primary} />
            ) : null
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.notaRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MaterialIcons
                      key={i}
                      name={i < item.notaRestaurante ? 'star' : 'star-border'}
                      size={16}
                      color={palette.primary}
                    />
                  ))}
                  <Text style={[styles.notaText, { color: c.text }]}>{item.notaRestaurante}/5</Text>
                </View>
                <Text style={[styles.data, { color: c.sub }]}>{formatData(item.criadoEm)}</Text>
              </View>
              {item.comentarioRestaurante ? (
                <Text style={[styles.comentario, { color: c.sub }]}>{item.comentarioRestaurante}</Text>
              ) : (
                <Text style={[styles.semComentario, { color: c.sub }]}>Sem comentário</Text>
              )}
            </Card>
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  resumoNum: { fontSize: 28, fontWeight: '800' },
  resumoMeta: { fontSize: 14, fontWeight: '600' },
  list: { paddingBottom: spacing.xl },
  empty: { flexGrow: 1 },
  card: { marginBottom: spacing.md },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  notaRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  notaText: { marginLeft: 6, fontWeight: '700', fontSize: 14 },
  data: { fontSize: 12 },
  comentario: { marginTop: spacing.sm, fontSize: 14, lineHeight: 20 },
  semComentario: { marginTop: spacing.sm, fontSize: 13, fontStyle: 'italic' },
});
