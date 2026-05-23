import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import type { EnderecoRequestDTO } from '../types/api';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  endereco: EnderecoRequestDTO;
  onChange: (field: keyof EnderecoRequestDTO, value: string) => void;
  cepBuscando?: boolean;
  cepAviso?: string | null;
  borderColor: string;
  textColor: string;
  subColor: string;
};

export function EnderecoFormFields({
  endereco,
  onChange,
  cepBuscando,
  cepAviso,
  borderColor,
  textColor,
  subColor,
}: Props): React.JSX.Element {
  return (
    <View>
      <View style={styles.cepRow}>
        <View style={{ flex: 1 }}>
          <Field
            label="CEP"
            value={endereco.cep}
            onChangeText={(t) => onChange('cep', t)}
            keyboardType="number-pad"
            maxLength={9}
            borderColor={borderColor}
            textColor={textColor}
            subColor={subColor}
          />
        </View>
        {cepBuscando ? (
          <ActivityIndicator style={{ marginTop: 22, marginLeft: 8 }} color={palette.primary} />
        ) : null}
      </View>
      {cepAviso ? <Text style={styles.cepHint}>{cepAviso}</Text> : null}
      <Field
        label="Logradouro"
        value={endereco.logradouro}
        onChangeText={(t) => onChange('logradouro', t)}
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
      <Field
        label="Número"
        value={endereco.numero}
        onChangeText={(t) => onChange('numero', t)}
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
      <Field
        label="Complemento"
        value={endereco.complemento ?? ''}
        onChangeText={(t) => onChange('complemento', t)}
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
      <Field
        label="Bairro"
        value={endereco.bairro}
        onChangeText={(t) => onChange('bairro', t)}
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
      <Field
        label="Cidade"
        value={endereco.cidade}
        onChangeText={(t) => onChange('cidade', t)}
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
      <Field
        label="Estado (UF)"
        value={endereco.estado}
        onChangeText={(t) => onChange('estado', t)}
        maxLength={2}
        autoCapitalize="characters"
        borderColor={borderColor}
        textColor={textColor}
        subColor={subColor}
      />
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  borderColor,
  textColor,
  subColor,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  borderColor: string;
  textColor: string;
  subColor: string;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: subColor }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={subColor}
        style={[styles.input, { borderColor, color: textColor }]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cepHint: { color: palette.primary, fontSize: 12, marginBottom: spacing.sm },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
});
