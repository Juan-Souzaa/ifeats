import { Text, type TextProps, type TextStyle } from 'react-native';
import { formatMoney } from '../../utils/money';
import { palette } from '../../theme/colors';

type Props = TextProps & {
  value: number | string | null | undefined;
  accent?: boolean;
  style?: TextStyle;
};

export function MoneyText({ value, accent, style, ...rest }: Props): React.JSX.Element {
  return (
    <Text
      {...rest}
      style={[{ fontWeight: '800', color: accent ? palette.primary : undefined }, style]}
    >
      {formatMoney(value)}
    </Text>
  );
}
