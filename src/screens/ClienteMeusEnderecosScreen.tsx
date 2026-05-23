import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { useClienteEnderecosViewModel } from '../hooks/useClienteEnderecosViewModel';
import {
  Card,
  EmptyState,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteMeusEnderecos'>;

export function ClienteMeusEnderecosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useClienteEnderecosViewModel();

  return (
    <ScreenShell
      title="Meus endereços"
      onBack={() => navigation.goBack()}
      scroll={false}
      rightAction={
        <Pressable onPress={() => navigation.navigate('ClienteEnderecoForm', {})} hitSlop={12}>
          <MaterialIcons name="add" size={26} color={palette.primary} />
        </Pressable>
      }
    >
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.enderecos}
          keyExtractor={(e) => String(e.id)}
          contentContainerStyle={vm.enderecos.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="place"
              title="Nenhum endereço"
              subtitle="Adicione um endereço para facilitar seus pedidos."
            />
          }
          ListFooterComponent={
            vm.enderecos.length > 0 ? (
              <View style={{ marginTop: spacing.md }}>
                <PrimaryButton
                  label="Adicionar endereço"
                  onPress={() => navigation.navigate('ClienteEnderecoForm', {})}
                />
              </View>
            ) : (
              <PrimaryButton
                label="Adicionar endereço"
                onPress={() => navigation.navigate('ClienteEnderecoForm', {})}
              />
            )
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              {item.principal ? (
                <View style={[styles.badge, { backgroundColor: c.successBg }]}>
                  <Text style={{ color: c.success, fontSize: 11, fontWeight: '700' }}>Principal</Text>
                </View>
              ) : null}
              <Text style={[styles.addr, { color: c.text }]}>
                {item.logradouro}, {item.numero}
                {item.complemento ? ` — ${item.complemento}` : ''}
              </Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>
                {item.bairro} · {item.cidade}/{item.estado} · CEP {item.cep}
              </Text>
              <View style={styles.actions}>
                {!item.principal ? (
                  <SecondaryButton
                    label="Tornar principal"
                    onPress={() => void vm.tornarPrincipal(item.id)}
                    disabled={vm.busyId != null}
                  />
                ) : null}
                <SecondaryButton
                  label="Editar"
                  onPress={() => navigation.navigate('ClienteEnderecoForm', { enderecoId: item.id })}
                />
                <Pressable
                  onPress={() =>
                    Alert.alert('Excluir endereço', 'Deseja remover este endereço?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Excluir', style: 'destructive', onPress: () => void vm.excluir(item.id) },
                    ])
                  }
                  hitSlop={8}
                  style={styles.deleteBtn}
                >
                  <MaterialIcons name="delete-outline" size={22} color={c.error} />
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  empty: { flexGrow: 1, padding: spacing.lg },
  list: { paddingBottom: spacing.xl },
  card: { marginBottom: spacing.md },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: spacing.sm },
  addr: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, alignItems: 'center' },
  deleteBtn: { marginLeft: 'auto', padding: 4 },
});
