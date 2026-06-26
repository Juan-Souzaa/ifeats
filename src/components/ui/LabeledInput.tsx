import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { radius, spacing } from '../../theme/spacing';
import { FormField } from './FormField';
import { useThemeColors } from './useThemeColors';

type Props = TextInputProps & {
  label: string;
  hint?: string;
};

export function LabeledInput({ label, hint, style, ...rest }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <FormField label={label} hint={hint}>
      <TextInput
        placeholderTextColor={c.muted}
        style={[
          styles.input,
          { borderColor: c.border, color: c.text, backgroundColor: c.inputBg },
          style,
        ]}
        {...rest}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
});
