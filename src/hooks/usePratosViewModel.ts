import { useCallback, useState } from 'react';
import type { CategoriaMenu, PratoResponseDTO } from '../types/api';
import * as pratoService from '../services/pratoService';
import { parsePrecoInput } from '../utils/preco';

export function usePratosViewModel(restauranteId: number | null) {
  const [items, setItems] = useState<PratoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (restauranteId == null) return;
    setError(null);
    setLoading(true);
    try {
      const page = await pratoService.listarPratos(restauranteId, { size: 100 });
      setItems(page.content ?? []);
    } catch {
      setError('Erro ao listar pratos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [restauranteId]);

  const loadFor = useCallback(async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      const page = await pratoService.listarPratos(id, { size: 100 });
      setItems(page.content ?? []);
    } catch {
      setError('Erro ao listar pratos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, load, loadFor };
}

export function usePratoCadastroViewModel(restauranteId: number | null) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoTexto, setPrecoTexto] = useState('');
  const [categoria, setCategoria] = useState<CategoriaMenu>('STARTER');
  const [disponivel, setDisponivel] = useState(true);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoMime, setFotoMime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setNome('');
    setDescricao('');
    setPrecoTexto('');
    setCategoria('STARTER');
    setDisponivel(true);
    setFotoUri(null);
    setFotoMime(null);
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    if (restauranteId == null) return false;
    setError(null);
    if (!nome.trim()) {
      setError('Nome do prato é obrigatório');
      return false;
    }
    const preco = parsePrecoInput(precoTexto);
    if (preco == null) {
      setError('Preço inválido');
      return false;
    }
    setLoading(true);
    try {
      await pratoService.criarPrato(restauranteId, {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        preco,
        categoria,
        disponivel,
        fotoUri: fotoUri ?? undefined,
        fotoMime: fotoMime ?? undefined,
      });
      reset();
      return true;
    } catch (e: unknown) {
      const err = e as { message?: string };
      if (typeof err.message === 'string' && err.message.length > 0) {
        setError(err.message);
      } else {
        setError('Erro ao salvar prato');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [restauranteId, nome, descricao, precoTexto, categoria, disponivel, fotoUri, fotoMime, reset]);

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    precoTexto,
    setPrecoTexto,
    categoria,
    setCategoria,
    disponivel,
    setDisponivel,
    fotoUri,
    setFotoUri,
    setFotoMime,
    loading,
    error,
    submit,
    reset,
  };
}

function precoParaInput(preco: number): string {
  return Number.isFinite(preco) ? String(preco).replace('.', ',') : '';
}

export function usePratoEdicaoViewModel(restauranteId: number | null, prato: PratoResponseDTO) {
  const [nome, setNome] = useState(prato.nome);
  const [descricao, setDescricao] = useState(prato.descricao ?? '');
  const [precoTexto, setPrecoTexto] = useState(precoParaInput(Number(prato.preco)));
  const [categoria, setCategoria] = useState<CategoriaMenu>(prato.categoria);
  const [disponivel, setDisponivel] = useState(Boolean(prato.disponivel));
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoPreviewUri, setFotoPreviewUri] = useState<string | null>(prato.fotoUrl);
  const [fotoMime, setFotoMime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFoto = useCallback((uri: string | null, mime: string | null) => {
    setFotoUri(uri);
    setFotoPreviewUri(uri);
    setFotoMime(mime);
  }, []);

  const submit = useCallback(async () => {
    if (restauranteId == null) return false;
    setError(null);
    if (!nome.trim()) {
      setError('Nome do prato é obrigatório');
      return false;
    }
    const preco = parsePrecoInput(precoTexto);
    if (preco == null) {
      setError('Preço inválido');
      return false;
    }
    setLoading(true);
    try {
      await pratoService.atualizarPrato(restauranteId, prato.id, {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        preco,
        categoria,
        disponivel,
        fotoUri: fotoUri ?? undefined,
        fotoMime: fotoMime ?? undefined,
      });
      return true;
    } catch (e: unknown) {
      const err = e as { message?: string };
      if (typeof err.message === 'string' && err.message.length > 0) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar prato');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [restauranteId, prato.id, nome, descricao, precoTexto, categoria, disponivel, fotoUri, fotoMime]);

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    precoTexto,
    setPrecoTexto,
    categoria,
    setCategoria,
    disponivel,
    setDisponivel,
    fotoUri,
    fotoPreviewUri,
    setFoto,
    loading,
    error,
    submit,
  };
}
