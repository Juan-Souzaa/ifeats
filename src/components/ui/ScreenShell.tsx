import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { useThemeColors } from './useThemeColors';
import { spacing } from '../../theme/spacing';

type Props = {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  footer?: ReactNode;
  /** Padding interno padrão (spacing.lg). Desative para listas full-bleed. */
  contentPadding?: boolean;
};

export function ScreenShell({
  title,
  onBack,
  rightAction,
  children,
  scroll = true,
  scrollProps,
  footer,
  contentPadding = true,
}: Props): React.JSX.Element {
  const c = useThemeColors();
  const contentStyle = contentPadding ? styles.scrollContent : styles.scrollContentFlush;
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={contentStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safeOuter, { backgroundColor: c.outerBg }]} edges={['top', 'bottom']}>
      <View style={[styles.shell, { borderColor: c.border, backgroundColor: c.shell }]}>
        <View style={[styles.header, { backgroundColor: c.headerBg, borderBottomColor: c.border }]}>
          <View style={styles.headerSide}>
            {onBack ? (
              <Pressable
                onPress={onBack}
                hitSlop={12}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
              >
                <MaterialIcons name="arrow-back-ios" size={20} color={palette.primary} />
              </Pressable>
            ) : (
              <View style={styles.headerSideSpacer} />
            )}
          </View>
          <Text style={[styles.headerTitle, { color: c.text }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerSide}>{rightAction ?? <View style={styles.headerSideSpacer} />}</View>
        </View>
        {body}
        {footer}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeOuter: { flex: 1 },
  shell: { flex: 1, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  scrollContentFlush: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: { width: 48, alignItems: 'center', justifyContent: 'center' },
  headerSideSpacer: { width: 40, height: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtnPressed: { opacity: 0.65 },
});
