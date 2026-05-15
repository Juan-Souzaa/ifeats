
export function formatContagemAvaliacoes(total: number): string {
  return total === 1 ? '1 avaliação' : `${total} avaliações`;
}
