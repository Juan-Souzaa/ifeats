import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { EntregadorStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorArea'>;

export function EntregadorAreaScreen(_props: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;

  const { setToken } = useAuth();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Entregador</Text>
        <Pressable onPress={() => void setToken(null)} hitSlop={10}>
          <MaterialIcons name="logout" size={24} color={palette.primary} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <MaterialIcons name="delivery-dining" size={56} color={palette.primary} />
        <Text style={[styles.msg, { color: text }]}>
          Área do entregador: aceitar pedidos e rotas poderão ser integradas nas próximas entregas.
        </Text>
        <Text style={[styles.sub, { color: sub }]}>
          Quando a sua conta for aprovada, poderá usar o mesmo e-mail e senha para entrar e acompanhar entregas.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '800' },
  body: { alignItems: 'center', gap: 16, paddingTop: 24 },
  msg: { fontSize: 16, textAlign: 'center', lineHeight: 22, fontWeight: '600' },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
