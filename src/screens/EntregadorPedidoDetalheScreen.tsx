import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';

import type { EntregadorStackParamList } from '../navigation/types';

import type { RastreamentoDTO } from '../types/api';

import { useEntregadorPedidoDetalheViewModel } from '../hooks/useEntregadorPedidoDetalheViewModel';

import { useRoutePolyline } from '../hooks/useRoutePolyline';

import { DeliveryMap, type DeliveryMapMarker } from '../components/map/DeliveryMap';

import { PedidoInfoRow } from '../components/pedido/PedidoInfoRow';

import { PedidoItensCard } from '../components/pedido/PedidoItensCard';

import * as pedidoService from '../services/pedidoService';

import {

  Card,

  ErrorBanner,

  PedidoTimeline,

  PrimaryButton,

  ScreenShell,

  SecondaryButton,

  StatusChip,

  useThemeColors,

} from '../components/ui';

import { formatMetodoPagamento } from '../utils/pedidoStatus';

import { labelClientePedido } from '../utils/clientePedido';

import { toCoord, type LatLng } from '../utils/mapCoords';

import { palette } from '../theme/colors';

import { spacing, radius } from '../theme/spacing';



type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorPedidoDetalhe'>;



export function EntregadorPedidoDetalheScreen({ navigation, route }: Props): React.JSX.Element {

  const { pedidoId, modo } = route.params;

  const c = useThemeColors();

  const vm = useEntregadorPedidoDetalheViewModel(pedidoId, modo);

  const [rastreamento, setRastreamento] = useState<RastreamentoDTO | null>(null);



  const loadRastreamento = useCallback(async () => {

    if (!vm.pedido || vm.pedido.status === 'DELIVERED' || vm.pedido.status === 'CANCELED') return;

    try {

      setRastreamento(await pedidoService.obterRastreamento(pedidoId));

    } catch {

      setRastreamento(null);

    }

  }, [pedidoId, vm.pedido]);



  useEffect(() => {

    if (vm.modo !== 'ativa') return;

    void loadRastreamento();

    const t = setInterval(() => void loadRastreamento(), 15000);

    return () => clearInterval(t);

  }, [vm.modo, loadRastreamento]);



  const restaurante = useMemo(

    () => toCoord(rastreamento?.posicaoRestauranteLat, rastreamento?.posicaoRestauranteLon),

    [rastreamento]

  );

  const destino = useMemo(

    () => toCoord(rastreamento?.posicaoDestinoLat, rastreamento?.posicaoDestinoLon),

    [rastreamento]

  );

  const entregador = useMemo(

    () => toCoord(rastreamento?.posicaoAtualLat, rastreamento?.posicaoAtualLon),

    [rastreamento]

  );



  const routeOrigin = entregador ?? restaurante;

  const { route: routeLine } = useRoutePolyline({

    apiWaypoints: rastreamento?.waypoints,

    origin: routeOrigin,

    destination: destino,

  });



  const mapPoints = useMemo(() => {

    const pts: LatLng[] = [];

    if (restaurante) pts.push(restaurante);

    if (entregador) pts.push(entregador);

    if (destino) pts.push(destino);

    return pts;

  }, [restaurante, entregador, destino]);



  const mapMarkers = useMemo((): DeliveryMapMarker[] => {

    const markers: DeliveryMapMarker[] = [];

    if (restaurante) {

      markers.push({ id: 'restaurante', coordinate: restaurante, title: 'Restaurante', pinColor: '#d97706' });

    }

    if (destino) {

      markers.push({ id: 'destino', coordinate: destino, title: 'Cliente', pinColor: '#2563eb' });

    }

    return markers;

  }, [restaurante, destino]);



  if (vm.loading) {

    return (

      <ScreenShell title="Entrega" onBack={() => navigation.goBack()} scroll={false}>

        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />

      </ScreenShell>

    );

  }



  if (!vm.pedido) {

    return (

      <ScreenShell title="Entrega" onBack={() => navigation.goBack()}>

        <ErrorBanner message={vm.error ?? 'Pedido não encontrado.'} />

      </ScreenShell>

    );

  }



  const p = vm.pedido;

  const showMap = vm.modo === 'ativa' && mapPoints.length > 0;



  return (

    <ScreenShell

      title={`Entrega #${p.id}`}

      onBack={() => navigation.goBack()}

      scrollProps={{ nestedScrollEnabled: true }}

    >

      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}



      <View style={styles.header}>

        <StatusChip status={p.status} />

        <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.sm }}>

          {new Date(p.criadoEm).toLocaleString('pt-BR')}

        </Text>

      </View>



      {vm.modo === 'ativa' && p.status !== 'CANCELED' ? (

        <Card style={{ marginTop: spacing.lg }}>

          <Text style={[styles.sec, { color: c.text }]}>Progresso</Text>

          <PedidoTimeline status={p.status} compact />

        </Card>

      ) : null}



      {showMap ? (

        <View style={[styles.mapWrap, { borderColor: c.border, marginTop: spacing.md }]}>

          <DeliveryMap

            markers={mapMarkers}

            route={routeLine}

            fitPoints={mapPoints}

            height={300}

          />

        </View>

      ) : null}



      <View style={{ marginTop: spacing.md }}>

        <PedidoItensCard pedido={p} />

      </View>



      <Card style={{ marginTop: spacing.md }}>

        <Text style={[styles.sec, { color: c.text }]}>Cliente e entrega</Text>

        <PedidoInfoRow

          icon="person"

          label="Cliente"

          value={labelClientePedido(p)}

        />

        {p.enderecoEntrega ? (

          <PedidoInfoRow icon="location-on" label="Endereço" value={p.enderecoEntrega} />

        ) : null}

        <PedidoInfoRow icon="payment" label="Pagamento" value={formatMetodoPagamento(p.metodoPagamento)} />

        {p.metodoPagamento === 'CASH' && p.troco != null ? (

          <PedidoInfoRow

            icon="attach-money"

            label="Troco para"

            value={p.troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

          />

        ) : null}

      </Card>



      {p.observacoes ? (

        <Card style={{ marginTop: spacing.md }}>

          <Text style={[styles.sec, { color: c.text }]}>Observações</Text>

          <Text style={{ color: c.sub, lineHeight: 20 }}>{p.observacoes}</Text>

        </Card>

      ) : null}



      <View style={{ gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.xxl }}>

        {destino ? (

          <SecondaryButton

            label="Abrir rota no Maps"

            onPress={() => {

              const origin = routeOrigin

                ? `&origin=${routeOrigin.latitude},${routeOrigin.longitude}`

                : '';

              void Linking.openURL(

                `https://www.google.com/maps/dir/?api=1${origin}&destination=${destino.latitude},${destino.longitude}`

              );

            }}

          />

        ) : null}

        {vm.modo === 'disponivel' ? (

          <>

            <PrimaryButton label="Aceitar entrega" onPress={() => void vm.aceitar()} loading={vm.busy} />

            <SecondaryButton

              label="Recusar"

              onPress={() =>

                Alert.alert('Recusar entrega', 'Deseja recusar este pedido?', [

                  { text: 'Voltar', style: 'cancel' },

                  { text: 'Recusar', style: 'destructive', onPress: () => void vm.recusar() },

                ])

              }

              disabled={vm.busy}

            />

          </>

        ) : null}

        {vm.modo === 'ativa' && p.status === 'PREPARING' ? (

          <PrimaryButton label="Saiu para entrega" onPress={() => void vm.saiuEntrega()} loading={vm.busy} />

        ) : null}

        {vm.modo === 'ativa' && p.status === 'OUT_FOR_DELIVERY' ? (

          <PrimaryButton label="Marcar como entregue" onPress={() => void vm.entregue()} loading={vm.busy} />

        ) : null}

      </View>

    </ScreenShell>

  );

}



const styles = StyleSheet.create({

  header: { alignItems: 'flex-start' },

  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },

  mapWrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1 },

});

