import { StyleSheet, Text, View } from 'react-native';
import type { StatusEntregador, StatusRestaurante } from '../../types/api';
import {
  corStatusModeracao,
  legendaStatusEntregador,
  legendaStatusRestaurante,
} from '../../utils/moderacaoStatus';

type Props = {
  status: StatusRestaurante | StatusEntregador;
  tipo?: 'restaurante' | 'entregador';
};

export function ModeracaoStatusChip({ status, tipo = 'restaurante' }: Props): React.JSX.Element {
  const colors = corStatusModeracao(status);
  const label =
    tipo === 'entregador' ? legendaStatusEntregador(status as StatusEntregador) : legendaStatusRestaurante(status as StatusRestaurante);

  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '700' },
});
