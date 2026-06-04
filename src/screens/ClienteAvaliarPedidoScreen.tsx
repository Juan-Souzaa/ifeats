import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ClientePedidosStackParamList } from '../navigation/types';
import * as avaliacaoService from '../services/avaliacaoService';
import {
  Card,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  StarRatingInput,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClientePedidosStackParamList, 'ClienteAvaliarPedido'>;

export function ClienteAvaliarPedidoScreen({ navigation, route }: Props): React.JSX.Element {
  const { pedidoId, avaliacaoId } = route.params;
  const c = useThemeColors();
  const isEdit = avaliacaoId != null;
  const [notaPedido, setNotaPedido] = useState(0);
  const [notaRestaurante, setNotaRestaurante] = useState(0);
  const [notaEntregador, setNotaEntregador] = useState(0);
  const [comentarioPedido, setComentarioPedido] = useState('');
  const [comentarioRestaurante, setComentarioRestaurante] = useState('');
  const [comentarioEntregador, setComentarioEntregador] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const a = await avaliacaoService.buscarAvaliacaoPorPedido(pedidoId);
        setNotaPedido(a.notaPedido);
        setNotaRestaurante(a.notaRestaurante);
        setNotaEntregador(a.notaEntregador ?? 0);
        setComentarioPedido(a.comentarioPedido ?? '');
        setComentarioRestaurante(a.comentarioRestaurante ?? '');
        setComentarioEntregador(a.comentarioEntregador ?? '');
      } catch {
        setError('Não foi possível carregar a avaliação.');
      } finally {
        setLoadingData(false);
      }
    })();
  }, [isEdit, pedidoId]);

  const valid = notaPedido >= 1 && notaRestaurante >= 1;

  const enviar = async () => {
    if (!valid) {
      setError('Informe as notas obrigatórias do pedido e do restaurante.');
      return;
    }
    setLoading(true);
    setError(null);
    const dto = {
      notaPedido,
      notaRestaurante,
      notaEntregador: notaEntregador >= 1 ? notaEntregador : undefined,
      comentarioPedido: comentarioPedido.trim() || undefined,
      comentarioRestaurante: comentarioRestaurante.trim() || undefined,
      comentarioEntregador: comentarioEntregador.trim() || undefined,
    };
    try {
      if (isEdit && avaliacaoId) {
        await avaliacaoService.editarAvaliacao(avaliacaoId, dto);
      } else {
        await avaliacaoService.criarAvaliacao(pedidoId, dto);
      }
      navigation.goBack();
    } catch {
      setError('Não foi possível enviar sua avaliação.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <ScreenShell title="Avaliar pedido" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={isEdit ? 'Editar avaliação' : 'Avaliar pedido'} onBack={() => navigation.goBack()}>
      {error ? <ErrorBanner message={error} /> : null}
      <Card>
        <StarRatingInput label="Nota do pedido" value={notaPedido} onChange={setNotaPedido} />
        <TextInput
          value={comentarioPedido}
          onChangeText={setComentarioPedido}
          placeholder="Comentário sobre o pedido"
          placeholderTextColor={c.muted}
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          multiline
        />
      </Card>
      <Card style={{ marginTop: spacing.md }}>
        <StarRatingInput label="Nota do restaurante" value={notaRestaurante} onChange={setNotaRestaurante} />
        <TextInput
          value={comentarioRestaurante}
          onChangeText={setComentarioRestaurante}
          placeholder="Comentário sobre o restaurante"
          placeholderTextColor={c.muted}
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          multiline
        />
      </Card>
      <Card style={{ marginTop: spacing.md }}>
        <StarRatingInput
          label="Nota do entregador"
          value={notaEntregador}
          onChange={setNotaEntregador}
          optional
        />
        <TextInput
          value={comentarioEntregador}
          onChangeText={setComentarioEntregador}
          placeholder="Comentário sobre a entrega"
          placeholderTextColor={c.muted}
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          multiline
        />
      </Card>
      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton
          label={isEdit ? 'Salvar alterações' : 'Enviar avaliação'}
          onPress={() => void enviar()}
          loading={loading}
          disabled={!valid}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '700', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.md,
    minHeight: 72,
    textAlignVertical: 'top',
  },
});
