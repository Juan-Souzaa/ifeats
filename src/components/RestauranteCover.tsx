import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { resolveMediaUrl } from '../utils/imageUrl';

type Props = {
  fotoUrl?: string | null;
  gradient: [string, string];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  borderRadius?: number;
};

export function RestauranteCover({
  fotoUrl,
  gradient,
  style,
  children,
  borderRadius = 0,
}: Props): React.JSX.Element {
  const uri = resolveMediaUrl(fotoUrl);

  return (
    <View style={[styles.wrap, style, borderRadius > 0 ? { borderRadius, overflow: 'hidden' } : null]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});
