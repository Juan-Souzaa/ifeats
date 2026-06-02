import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { EntregadorStackParamList } from '../navigation/types';
import type { TipoVeiculo } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useEntregadorPerfilViewModel } from '../hooks/useEntregadorPerfilViewModel';
import { Card, ErrorBanner, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { formatContagemAvaliacoes } from '../utils/texto';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorPerfil'>;

const VEICULOS: { key: TipoVeiculo; label: string }[] = [
  { key: 'MOTO', label: 'Moto' },
  { key: 'CARRO', label: 'Carro' },
  { key: 'BICICLETA', label: 'Bicicleta' },
  { key: 'OUTRO', label: 'Outro' },
];

export function EntregadorPerfilScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const { setToken } = useAuth();
  const vm = useEntregadorPerfilViewModel();

  if (vm.loading) {
    return (
      <ScreenShell title="Meu perfil" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Meu perfil" onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <Card>
        <Field label="Nome" value={vm.nome} onChangeText={vm.setNome} c={c} />
        <Field label="Telefone" value={vm.telefone} onChangeText={vm.setTelefone} c={c} />
        <Field
          label="E-mail"
          value={vm.email}
          onChangeText={vm.setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          c={c}
        />
        <Field label="Placa do veículo" value={vm.placaVeiculo} onChangeText={vm.setPlacaVeiculo} c={c} />
        <Text style={[styles.label, { color: c.sub }]}>Tipo de veículo</Text>
        <View style={styles.chips}>
          {VEICULOS.map((v) => {
            const on = vm.tipoVeiculo === v.key;
            return (
              <Pressable
                key={v.key}
                onPress={() => vm.setTipoVeiculo(v.key)}
                style={[styles.chip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
              >
                <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>{v.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Text style={[styles.secTitle, { color: c.text }]}>Suas avaliações</Text>
      <Card>
        {vm.avaliacaoResumo && vm.avaliacaoResumo.totalAvaliacoesEntregador > 0 ? (
          <View style={styles.ratingRow}>
            <View style={[styles.ratingPill, { backgroundColor: c.chipMutedBg }]}>
              <Text style={{ color: c.text, fontWeight: '800', fontSize: 18 }}>
                {vm.avaliacaoResumo.mediaNotaEntregador.toFixed(1)}
              </Text>
              <MaterialIcons name="star" size={18} color={palette.primary} />
            </View>
            <Text style={{ color: c.sub }}>
              {formatContagemAvaliacoes(vm.avaliacaoResumo.totalAvaliacoesEntregador)}
            </Text>
          </View>
        ) : (
          <Text style={{ color: c.muted }}>Você ainda não recebeu avaliações.</Text>
        )}
        {vm.avaliacoes.map((av) => (
          <View key={av.id} style={[styles.reviewItem, { borderTopColor: c.border }]}>
            <View style={styles.reviewTop}>
              <MaterialIcons name="star" size={16} color={palette.primary} />
              <Text style={{ color: c.text, fontWeight: '700' }}>{av.notaEntregador}/5</Text>
              <Text style={{ color: c.muted, fontSize: 12, marginLeft: 'auto' }}>
                {new Date(av.criadoEm).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            {av.comentarioEntregador ? (
              <Text style={{ color: c.sub, marginTop: spacing.xs }}>{av.comentarioEntregador}</Text>
            ) : null}
          </View>
        ))}
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton
          label="Salvar"
          loading={vm.submitting}
          onPress={async () => {
            const ok = await vm.salvar();
            if (ok) navigation.goBack();
          }}
        />
      </View>

      <Pressable
        onPress={() => void setToken(null)}
        style={[styles.logoutBtn, { backgroundColor: c.chipMutedBg }]}
      >
        <MaterialIcons name="logout" size={22} color="#dc2626" />
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  c,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  c: ReturnType<typeof useThemeColors>;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={c.muted}
        style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  secTitle: { fontSize: 16, fontWeight: '800', marginTop: spacing.lg, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  reviewItem: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '700' },
});
