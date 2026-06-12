import { labelClientePedido } from '../clientePedido';

describe('labelClientePedido', () => {
  it('monta label com nome e telefone', () => {
    const pedido = { clienteId: 1, clienteNome: 'Ana', clienteTelefone: '11999' } as never;
    expect(labelClientePedido(pedido, { nome: 'Ana', telefone: '11999' } as never)).toBe(
      'Ana · 11999'
    );
  });

  it('usa id quando sem nome', () => {
    const pedido = { clienteId: 7 } as never;
    expect(labelClientePedido(pedido)).toBe('#7');
  });
});
