import type { MaterialIcons } from '@expo/vector-icons';
import type { RestauranteResponseDTO } from '../../types/api';

export type CatKey = 'all' | 'pizza' | 'burger' | 'sushi' | 'healthy' | 'sweet' | 'asian';

export const CATEGORIAS: {
  key: CatKey;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  keywords: string[];
  cozinhaApi?: string;
  lightBg: string;
  lightIcon: string;
  darkBg: string;
  darkIcon: string;
}[] = [
  { key: 'all', label: 'Todos', icon: 'restaurant', keywords: [], lightBg: '#fff7ed', lightIcon: '#ea580c', darkBg: 'rgba(234,88,12,0.2)', darkIcon: '#fb923c' },
  { key: 'pizza', label: 'Pizza', icon: 'local-pizza', keywords: ['pizza', 'pizz', 'italian'], cozinhaApi: 'pizza', lightBg: '#ffedd5', lightIcon: '#ea580c', darkBg: 'rgba(234,88,12,0.2)', darkIcon: '#fdba74' },
  { key: 'burger', label: 'Hambúrguer', icon: 'fastfood', keywords: ['burg', 'hamb', 'lanche', 'lab'], cozinhaApi: 'burger', lightBg: '#fef3c7', lightIcon: '#d97706', darkBg: 'rgba(217,119,6,0.2)', darkIcon: '#fcd34d' },
  { key: 'sushi', label: 'Sushi', icon: 'set-meal', keywords: ['sushi', 'sashimi', 'jap', 'zen'], cozinhaApi: 'sushi', lightBg: '#fee2e2', lightIcon: '#dc2626', darkBg: 'rgba(220,38,38,0.2)', darkIcon: '#fca5a5' },
  { key: 'healthy', label: 'Saudável', icon: 'spa', keywords: ['salad', 'salada', 'natural', 'vegan', 'green', 'bowl'], cozinhaApi: 'green', lightBg: '#dcfce7', lightIcon: '#16a34a', darkBg: 'rgba(22,163,74,0.2)', darkIcon: '#86efac' },
  { key: 'sweet', label: 'Sobremesa', icon: 'icecream', keywords: ['doce', 'sobre', 'doceria', 'cake', 'gelad', 'açaí', 'acai', 'padaria', 'mania'], lightBg: '#dbeafe', lightIcon: '#2563eb', darkBg: 'rgba(37,99,235,0.2)', darkIcon: '#93c5fd' },
  { key: 'asian', label: 'Asiática', icon: 'ramen-dining', keywords: ['asia', 'chin', 'china', 'wok', 'tail', 'core', 'thai', 'yakisoba', 'zen', 'tapioca'], lightBg: '#f3e8ff', lightIcon: '#9333ea', darkBg: 'rgba(147,51,234,0.2)', darkIcon: '#d8b4fe' },
];

export const HIGHLIGHT_GRADIENTS: [string, string][] = [
  ['#fb923c', '#ef4444'],
  ['#34d399', '#059669'],
  ['#fbbf24', '#ea580c'],
  ['#a78bfa', '#6366f1'],
  ['#f472b6', '#db2777'],
];

export function matchesCategory(item: RestauranteResponseDTO, catKey: CatKey): boolean {
  if (catKey === 'all') return true;
  const cat = CATEGORIAS.find((c) => c.key === catKey);
  if (!cat || cat.keywords.length === 0) return true;
  const blob = `${item.nome} ${item.endereco}`.toLowerCase();
  return cat.keywords.some((kw) => blob.includes(kw));
}

export function gradientForId(id: number): [string, string] {
  return HIGHLIGHT_GRADIENTS[Math.abs(id) % HIGHLIGHT_GRADIENTS.length]!;
}

export function formatAvaliacao(item: RestauranteResponseDTO): string {
  const media = item.mediaAvaliacao;
  const total = item.totalAvaliacoes;
  if (media != null && total != null && total > 0) {
    return `${Number(media).toFixed(1)} (${total})`;
  }
  return '—';
}

export function cozinhaApiForCategoria(catKey: CatKey): string | undefined {
  return CATEGORIAS.find((c) => c.key === catKey)?.cozinhaApi;
}
