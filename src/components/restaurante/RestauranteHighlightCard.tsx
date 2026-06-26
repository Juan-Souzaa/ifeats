import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RestauranteCover } from '../RestauranteCover';
import type { RestauranteResponseDTO } from '../../types/api';
import { formatDistanciaKm } from '../../utils/distancia';
import { formatAvaliacao, gradientForId } from './categorias';

type Props = {
  item: RestauranteResponseDTO;
  textColor: string;
  subColor: string;
  onPress: (id: number) => void;
};

export function RestauranteHighlightCard({ item, textColor, subColor, onPress }: Props): React.JSX.Element {
  const g = gradientForId(item.id);
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ pressed }) => [styles.destaqueCard, { opacity: pressed ? 0.92 : 1 }]}
    >
      <RestauranteCover fotoUrl={item.fotoUrl} gradient={g} style={styles.destaqueImgWrap}>
        <View style={styles.badgeStar}>
          <MaterialIcons name="star" size={14} color="#f59e0b" />
          <Text style={styles.badgeStarText}>{formatAvaliacao(item)}</Text>
        </View>
        {formatDistanciaKm(item.distanciaKm) ? (
          <View style={styles.badgeTime}>
            <Text style={styles.badgeTimeText}>{formatDistanciaKm(item.distanciaKm)}</Text>
          </View>
        ) : null}
      </RestauranteCover>
      <View style={styles.destaqueBody}>
        <Text style={[styles.destaqueNome, { color: textColor }]} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={[styles.destaqueSub, { color: subColor }]} numberOfLines={1}>
          {item.endereco}
        </Text>
        <View style={styles.destaqueFoot}>
          <MaterialIcons name="storefront" size={14} color={subColor} />
          <Text style={[styles.destaqueFootText, { color: subColor }]}>Ver cardápio</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  badgeStarText: { fontSize: 11, fontWeight: '800', color: '#0f172a' },
  badgeTime: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTimeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  destaqueBody: { padding: 12 },
  destaqueNome: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  destaqueSub: { fontSize: 12, marginBottom: 8 },
  destaqueFoot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  destaqueFootText: { fontSize: 12, fontWeight: '600' },
});
