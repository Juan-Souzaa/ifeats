import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { ClienteStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteTickets'>;

export function ClienteTicketsScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? palette.backgroundDark : palette.backgroundLight;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: text }]}>Tickets de suporte</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.body}>
        <MaterialIcons name="support-agent" size={48} color={palette.primary} style={{ opacity: 0.85 }} />
        <Text style={[styles.title, { color: text }]}>Em breve</Text>
        <Text style={[styles.sub, { color: sub }]}>
          Acompanhe chamados e conversas com o suporte nesta área numa próxima versão.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topTitle: { fontSize: 17, fontWeight: '700' },
  body: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  sub: { marginTop: 10, fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
