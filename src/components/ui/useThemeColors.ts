import { useColorScheme } from 'react-native';
import { palette } from '../../theme/colors';

export function useThemeColors() {
  const dark = useColorScheme() === 'dark';
  return {
    dark,
    outerBg: dark ? palette.backgroundDark : palette.backgroundLight,
    shell: dark ? '#0f172a' : palette.white,
    text: dark ? palette.slate100 : palette.slate900,
    sub: dark ? palette.slate400 : palette.slate600,
    muted: dark ? palette.slate500 : palette.slate500,
    border: dark ? palette.slate800 : palette.slate200,
    inputBg: dark ? '#1e293b' : palette.white,
    headerBg: dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)',
    divider: dark ? palette.slate800 : '#f1f5f9',
    chipMutedBg: dark ? palette.slate800 : palette.slate100,
    success: '#16a34a',
    successBg: dark ? 'rgba(22,163,74,0.2)' : 'rgba(22,163,74,0.12)',
    error: '#dc2626',
    errorBg: dark ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.1)',
    warningBg: dark ? 'rgba(245,158,11,0.2)' : palette.amber100,
    warningText: dark ? '#fcd34d' : palette.amber800,
  };
}
