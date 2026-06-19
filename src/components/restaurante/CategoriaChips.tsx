import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { CATEGORIAS, type CatKey } from './categorias';

type Props = {
  dark: boolean;
  textColor: string;
  selected: CatKey;
  onSelect: (key: CatKey) => void;
};

export function CategoriaChips({ dark, textColor, selected, onSelect }: Props): React.JSX.Element {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
      {CATEGORIAS.map((c) => {
        const sel = selected === c.key;
        const bubbleBg = dark ? c.darkBg : c.lightBg;
        const iconCol = dark ? c.darkIcon : c.lightIcon;
        return (
          <Pressable key={c.key} onPress={() => onSelect(c.key)} style={styles.catItem}>
            <View
              style={[
                styles.catBubble,
                { backgroundColor: bubbleBg },
                sel && { backgroundColor: palette.primary },
              ]}
            >
              <MaterialIcons name={c.icon} size={28} color={sel ? palette.white : iconCol} />
            </View>
            <Text style={[styles.catLabel, { color: textColor }]} numberOfLines={1}>
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  catScroll: { paddingHorizontal: 16, paddingVertical: 16, gap: 16 },
  catItem: { alignItems: 'center', width: 72 },
  catBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: { marginTop: 8, fontSize: 11, fontWeight: '700', textAlign: 'center' },
});
