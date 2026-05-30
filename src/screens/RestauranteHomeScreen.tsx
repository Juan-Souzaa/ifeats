import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCallback } from 'react';

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import type { RestauranteStackParamList } from '../navigation/types';

import type { StatusRestaurante } from '../types/api';

import { useRestauranteMeViewModel } from '../hooks/useRestauranteMeViewModel';

import { useAuth } from '../context/AuthContext';

import { RestauranteCover } from '../components/RestauranteCover';
import { Card, ErrorBanner, ScreenShell, useThemeColors } from '../components/ui';

import { palette } from '../theme/colors';

import { spacing, radius } from '../theme/spacing';



type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestauranteHome'>;



function legendaStatus(status: StatusRestaurante): string {

  switch (status) {

    case 'APPROVED':

      return 'Aprovado';

    case 'PENDING_APPROVAL':

      return 'Em análise';

    case 'REJECTED':

      return 'Rejeitado';

    default:

      return status;

  }

}



function statusColor(status: StatusRestaurante): string {

  switch (status) {

    case 'APPROVED':

      return '#16a34a';

    case 'PENDING_APPROVAL':

      return '#d97706';

    case 'REJECTED':

      return '#dc2626';

    default:

      return palette.slate500;

  }

}



export function RestauranteHomeScreen({ navigation }: Props): React.JSX.Element {

  const c = useThemeColors();

  const { setToken } = useAuth();

  const me = useRestauranteMeViewModel();



  useFocusEffect(

    useCallback(() => {

      void me.refresh();

    }, [me.refresh])

  );



  return (

    <ScreenShell

      title="Meu restaurante"

      scroll

      rightAction={

        <Pressable onPress={() => void setToken(null)} hitSlop={10} accessibilityLabel="Sair">

          <MaterialIcons name="logout" size={22} color={palette.primary} />

        </Pressable>

      }

    >

      {me.loading && !me.data ? (

        <ActivityIndicator style={{ marginTop: 40 }} color={palette.primary} size="large" />

      ) : me.error ? (

        <ErrorBanner message={me.error} onRetry={() => void me.refresh()} />

      ) : me.data ? (

        <>

          <Card style={styles.hero}>

            {me.data.fotoUrl ? (
              <RestauranteCover
                fotoUrl={me.data.fotoUrl}
                gradient={['#fb923c', '#ea580c']}
                style={styles.heroPhoto}
                borderRadius={radius.md}
              />
            ) : (
              <View style={[styles.iconWrap, { backgroundColor: c.chipMutedBg }]}>
                <MaterialIcons name="storefront" size={32} color={palette.primary} />
              </View>
            )}

            <Text style={[styles.nome, { color: c.text }]}>{me.data.nome}</Text>

            <Text style={[styles.meta, { color: c.sub }]}>{me.data.email}</Text>

            <View style={[styles.statusPill, { backgroundColor: `${statusColor(me.data.status)}22` }]}>

              <View style={[styles.statusDot, { backgroundColor: statusColor(me.data.status) }]} />

              <Text style={[styles.statusText, { color: statusColor(me.data.status) }]}>

                {legendaStatus(me.data.status)}

              </Text>

            </View>

            {me.data.endereco ? (

              <View style={styles.addrRow}>

                <MaterialIcons name="place" size={18} color={c.sub} />

                <Text style={[styles.addrText, { color: c.sub }]}>{me.data.endereco}</Text>

              </View>

            ) : null}

            {me.data.raioEntregaKm != null ? (

              <Text style={[styles.raioHint, { color: c.muted }]}>

                Raio de entrega: até {me.data.raioEntregaKm} km

              </Text>

            ) : null}

          </Card>



          <Text style={[styles.section, { color: c.sub }]}>Cardápio</Text>

          <View style={styles.menu}>

            <MenuRow icon="restaurant-menu" label="Meus pratos" onPress={() => navigation.navigate('PratosList')} c={c} />

            <MenuRow icon="add-circle-outline" label="Novo prato" onPress={() => navigation.navigate('PratoCadastro')} c={c} />

            <MenuRow

              icon="visibility"

              label="Ver cardápio público"

              onPress={() => navigation.navigate('RestauranteCardapio', { restauranteId: me.data!.id })}

              c={c}

            />

          </View>



          <Text style={[styles.section, { color: c.sub }]}>Operação</Text>

          <View style={styles.menu}>

            <MenuRow icon="receipt-long" label="Gerenciar pedidos" onPress={() => navigation.navigate('RestaurantePedidos')} c={c} />

            <MenuRow icon="payments" label="Ganhos" onPress={() => navigation.navigate('RestauranteGanhos')} c={c} />

          </View>



          <Text style={[styles.section, { color: c.sub }]}>Configurações</Text>

          <View style={styles.menu}>

            <MenuRow icon="edit" label="Editar perfil e endereço" onPress={() => navigation.navigate('RestauranteEditarPerfil')} c={c} />

            <MenuRow icon="my-location" label="Raio de entrega" onPress={() => navigation.navigate('RestauranteRaioEntrega')} c={c} />

          </View>

        </>

      ) : null}

    </ScreenShell>

  );

}



function MenuRow({

  icon,

  label,

  onPress,

  c,

}: {

  icon: keyof typeof MaterialIcons.glyphMap;

  label: string;

  onPress: () => void;

  c: ReturnType<typeof useThemeColors>;

}): React.JSX.Element {

  return (

    <Pressable

      onPress={onPress}

      style={({ pressed }) => [

        styles.menuRow,

        { backgroundColor: c.shell, borderColor: c.border, opacity: pressed ? 0.9 : 1 },

      ]}

    >

      <View style={[styles.menuIcon, { backgroundColor: c.chipMutedBg }]}>

        <MaterialIcons name={icon} size={22} color={palette.primary} />

      </View>

      <Text style={[styles.menuLabel, { color: c.text }]} numberOfLines={1}>

        {label}

      </Text>

      <MaterialIcons name="chevron-right" size={22} color={c.muted} />

    </Pressable>

  );

}



const styles = StyleSheet.create({

  hero: { alignItems: 'center', marginBottom: spacing.sm },

  heroPhoto: { width: '100%', height: 120, marginBottom: spacing.md },

  iconWrap: {

    width: 64,

    height: 64,

    borderRadius: radius.lg,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: spacing.md,

  },

  nome: { fontSize: 20, fontWeight: '800', textAlign: 'center' },

  meta: { fontSize: 14, marginTop: 4, textAlign: 'center' },

  statusPill: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.xs,

    borderRadius: radius.full,

    marginTop: spacing.md,

  },

  statusDot: { width: 8, height: 8, borderRadius: 4 },

  statusText: { fontSize: 13, fontWeight: '700' },

  addrRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: spacing.xs,

    marginTop: spacing.md,

    paddingHorizontal: spacing.sm,

  },

  addrText: { flex: 1, fontSize: 14, lineHeight: 20, textAlign: 'center' },

  raioHint: { fontSize: 12, marginTop: spacing.sm },

  section: {

    fontSize: 12,

    fontWeight: '800',

    textTransform: 'uppercase',

    letterSpacing: 0.6,

    marginTop: spacing.lg,

    marginBottom: spacing.sm,

    paddingHorizontal: 2,

  },

  menu: { gap: spacing.sm },

  menuRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.md,

    padding: spacing.md,

    borderRadius: radius.md,

    borderWidth: StyleSheet.hairlineWidth,

  },

  menuIcon: {

    width: 40,

    height: 40,

    borderRadius: radius.md,

    alignItems: 'center',

    justifyContent: 'center',

  },

  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600' },

});

