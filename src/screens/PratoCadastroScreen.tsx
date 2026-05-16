import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestauranteMeViewModel } from '../hooks/useRestauranteMeViewModel';
import { usePratoCadastroViewModel } from '../hooks/usePratosViewModel';
import type { RestauranteStackParamList } from '../navigation/types';
import type { CategoriaMenu } from '../types/api';
import { palette } from '../theme/colors';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'PratoCadastro'>;

const CATEGORIAS: { key: CategoriaMenu; label: string }[] = [
  { key: 'STARTER', label: 'Entradas' },
  { key: 'MAIN', label: 'Pratos principais' },
  { key: 'DRINK', label: 'Bebidas' },
  { key: 'DESSERT', label: 'Sobremesas' },
];

export function PratoCadastroScreen({ navigation }: Props): React.JSX.Element {
  const dark = useColorScheme() === 'dark';
  const bgPage = dark ? palette.slate900 : palette.white;
  const text = dark ? palette.slate100 : palette.slate900;
  const sub = dark ? palette.slate400 : palette.slate500;
  const border = dark ? palette.slate700 : palette.slate300;
  const dashed = dark ? palette.slate600 : palette.slate300;
  const me = useRestauranteMeViewModel();
  const [rid, setRid] = useState<number | null>(null);
  const vm = usePratoCadastroViewModel(rid);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const r = await me.refresh();
          if (r) setRid(r.id);
        } catch {
          setRid(null);
        }
      })();
    }, [me.refresh])
  );

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]) {
      vm.setFotoUri(res.assets[0].uri);
      vm.setFotoMime(res.assets[0].mimeType ?? 'image/jpeg');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgPage }]} edges={['top']}>
      <View style={[styles.appBar, { borderBottomColor: border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.appTitle, { color: text }]}>Novo Prato</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.uploadBlock}>
          <Pressable onPress={pickImage}>
            {vm.fotoUri ? (
              <Image source={{ uri: vm.fotoUri }} style={styles.photoBox} />
            ) : (
              <View style={[styles.photoBox, styles.photoDashed, { borderColor: dashed }]}>
                <MaterialIcons name="add-a-photo" size={40} color={sub} />
              </View>
            )}
          </Pressable>
          <Text style={[styles.uploadTitle, { color: text }]}>Foto do Prato</Text>
          <Text style={[styles.uploadSub, { color: sub }]}>
            Adicione uma foto de alta qualidade
          </Text>
          <Pressable style={styles.uploadBtn} onPress={pickImage}>
            <Text style={styles.uploadBtnText}>Fazer Upload</Text>
          </Pressable>
        </View>

        <Text style={[styles.fieldLabel, { color: sub }]}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {CATEGORIAS.map((c) => {
            const active = vm.categoria === c.key;
            return (
              <Pressable
                key={c.key}
                onPress={() => vm.setCategoria(c.key)}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: palette.primary }
                    : {
                        backgroundColor: dark ? palette.slate800 : palette.slate100,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active ? { color: palette.white } : { color: text },
                  ]}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.fieldLabel, { color: sub }]}>Nome do Prato</Text>
        <TextInput
          value={vm.nome}
          onChangeText={vm.setNome}
          placeholder="Ex: Feijoada Completa"
          placeholderTextColor={sub}
          style={[styles.input, { color: text, borderColor: border }]}
        />

        <Text style={[styles.fieldLabel, { color: sub, marginTop: 12 }]}>Descrição</Text>
        <TextInput
          value={vm.descricao}
          onChangeText={vm.setDescricao}
          placeholder="Ingredientes, acompanhamentos, etc."
          placeholderTextColor={sub}
          multiline
          style={[styles.input, styles.textArea, { color: text, borderColor: border }]}
        />

        <Text style={[styles.fieldLabel, { color: sub, marginTop: 12 }]}>Preço</Text>
        <View style={styles.priceWrap}>
          <Text style={[styles.rs, { color: sub }]}>R$</Text>
          <TextInput
            value={vm.precoTexto}
            onChangeText={vm.setPrecoTexto}
            placeholder="0,00"
            placeholderTextColor={sub}
            keyboardType="decimal-pad"
            style={[styles.input, styles.priceInput, { color: text, borderColor: border }]}
          />
        </View>

        <View style={[styles.switchRow, { borderColor: dark ? palette.slate800 : palette.slate100 }]}>
          <View>
            <Text style={[styles.switchTitle, { color: text }]}>Disponível</Text>
            <Text style={[styles.switchSub, { color: sub }]}>Ativar para mostrar no cardápio</Text>
          </View>
          <Switch
            value={vm.disponivel}
            onValueChange={vm.setDisponivel}
            trackColor={{ false: palette.slate300, true: palette.primary }}
            thumbColor={palette.white}
          />
        </View>
        {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: bgPage, borderTopColor: border }]}>
        <Pressable
          style={[styles.saveBtn, { opacity: vm.loading || rid == null ? 0.7 : 1 }]}
          disabled={vm.loading || rid == null}
          onPress={async () => {
            const ok = await vm.submit();
            if (ok) navigation.navigate('PratosList');
          }}
        >
          {vm.loading ? (
            <ActivityIndicator color={palette.white} />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Prato</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  iconBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  appTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', paddingRight: 48 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  uploadBlock: { alignItems: 'center', paddingVertical: 20 },
  photoBox: { width: 128, height: 128, borderRadius: 12 },
  photoDashed: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  uploadTitle: { marginTop: 12, fontSize: 18, fontWeight: '700' },
  uploadSub: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  uploadBtn: {
    marginTop: 14,
    height: 40,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(236,73,19,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  uploadBtnText: { color: palette.primary, fontWeight: '700', fontSize: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: { minHeight: 100, paddingTop: 12, textAlignVertical: 'top' },
  priceWrap: { position: 'relative' },
  rs: { position: 'absolute', left: 14, top: 14, zIndex: 1, fontSize: 16 },
  priceInput: { paddingLeft: 40 },
  tabs: { flexGrow: 0, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  switchTitle: { fontSize: 16, fontWeight: '700' },
  switchSub: { fontSize: 13, marginTop: 2 },
  error: { color: '#b91c1c', marginTop: 12 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: palette.white, fontWeight: '700', fontSize: 16 },
});
