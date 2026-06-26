import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RestauranteCover } from '../RestauranteCover';
import type { RestauranteResponseDTO, StatusRestaurante } from '../../types/api';
import { palette } from '../../theme/colors';
import { formatDistanciaKm, formatTempoMinutos } from '../../utils/distancia';
import { formatAvaliacao, gradientForId } from './categorias';

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

type Props = {
  item: RestauranteResponseDTO;
  dark: boolean;
  cardColor: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  onPress: (id: number) => void;
};

export function RestauranteListRow({ item, dark, cardColor, borderColor, textColor, subColor, onPress }: Props): React.JSX.Element {
  const open = item.status === 'APPROVED';
  const pending = item.status === 'PENDING_APPROVAL';
  const closed = item.status === 'REJECTED';
  const g = gradientForId(item.id);

  return (
    <Pressable
      onPress={() => open && onPress(item.id)}
      disabled={!open}
      style={({ pressed }) => [
        styles.listCard,
        {
          backgroundColor: cardColor,
          borderColor: closed || pending ? borderColor : 'transparent',
          opacity: !open ? 0.72 : pressed ? 0.94 : 1,
        },
      ]}
    >
      <RestauranteCover fotoUrl={item.fotoUrl} gradient={g} style={styles.listImgWrap}>
        {!open ? (
          <View style={styles.listImgOverlay}>
            <Text style={styles.fechadoBadge}>{legendaStatus(item.status)}</Text>
          </View>
        ) : null}
      </RestauranteCover>
      <View style={styles.listBody}>
        <View style={styles.listTitleRow}>
          <Text style={[styles.listNome, { color: textColor }]} numberOfLines={2}>
            {item.nome}
          </Text>
          <View style={[styles.miniStar, { backgroundColor: dark ? palette.slate700 : palette.slate100 }]}>
            <MaterialIcons name="star" size={12} color="#f59e0b" />
            <Text style={[styles.miniStarText, { color: textColor }]}>{formatAvaliacao(item)}</Text>
          </View>
        </View>
        <Text style={[styles.listSub, { color: subColor }]} numberOfLines={1}>
          {item.endereco}
        </Text>
        <View style={styles.listFoot}>
          {open ? (
            <>
              {formatDistanciaKm(item.distanciaKm) ? (
                <View style={styles.chipTime}>
                  <MaterialIcons name="near-me" size={14} color={palette.primary} />
                  <Text style={styles.chipTimeText}>{formatDistanciaKm(item.distanciaKm)}</Text>
                </View>
              ) : (
                <View style={styles.chipTime}>
                  <MaterialIcons name="schedule" size={14} color={palette.primary} />
                  <Text style={styles.chipTimeText}>{legendaStatus(item.status)}</Text>
                </View>
              )}
              {formatTempoMinutos(item.tempoEstimadoMinutos) ? (
                <Text style={[styles.listFootMeta, { color: subColor }]}>
                  {formatTempoMinutos(item.tempoEstimadoMinutos)}
                </Text>
              ) : item.raioEntregaKm != null ? (
                <Text style={[styles.listFootMeta, { color: subColor }]}>Entrega até {item.raioEntregaKm} km</Text>
              ) : (
                <Text style={[styles.listFootMeta, { color: subColor }]}> </Text>
              )}
            </>
          ) : (
            <Text style={[styles.listFootMeta, { color: subColor }]}>
              {pending ? 'Disponível após aprovação' : 'Não aceita pedidos'}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
