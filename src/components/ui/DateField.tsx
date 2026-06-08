import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { radius, spacing } from '../../theme/spacing';
import { formatDataBR, parseApiDate, toApiDate } from '../../utils/data';
import { FormField } from './FormField';
import { useThemeColors } from './useThemeColors';
import { palette } from '../../theme/colors';

type Props = {
  label: string;
  value: string;
  onChange: (apiDate: string) => void;
  hint?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate();
}

function clampDate(ano: number, mes: number, dia: number): { ano: number; mes: number; dia: number } {
  const maxDia = diasNoMes(ano, mes);
  return { ano, mes, dia: Math.min(dia, maxDia) };
}

function DatePickerModal({
  visible,
  initial,
  minimumDate,
  maximumDate,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  initial: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}): React.JSX.Element {
  const c = useThemeColors();
  const minYear = minimumDate?.getFullYear() ?? new Date().getFullYear() - 1;
  const maxYear = maximumDate?.getFullYear() ?? new Date().getFullYear() + 2;

  const [ano, setAno] = useState(initial.getFullYear());
  const [mes, setMes] = useState(initial.getMonth() + 1);
  const [dia, setDia] = useState(initial.getDate());

  useEffect(() => {
    if (!visible) return;
    setAno(initial.getFullYear());
    setMes(initial.getMonth() + 1);
    setDia(initial.getDate());
  }, [visible, initial]);

  const anos = useMemo(() => {
    const out: number[] = [];
    for (let y = minYear; y <= maxYear; y++) out.push(y);
    return out;
  }, [minYear, maxYear]);

  const dias = useMemo(() => {
    const max = diasNoMes(ano, mes);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [ano, mes]);

  useEffect(() => {
    if (dia > dias.length) setDia(dias.length);
  }, [dia, dias.length]);

  const confirmar = () => {
    const { ano: a, mes: m, dia: d } = clampDate(ano, mes, dia);
    const date = new Date(a, m - 1, d);
    if (minimumDate && date < stripTime(minimumDate)) {
      onConfirm(stripTime(minimumDate));
      return;
    }
    if (maximumDate && date > stripTime(maximumDate)) {
      onConfirm(stripTime(maximumDate));
      return;
    }
    onConfirm(date);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: c.shell }]} onPress={() => undefined}>
          <Text style={[styles.sheetTitle, { color: c.text }]}>Selecionar data</Text>

          <View style={styles.wheels}>
            <WheelColumn
              label="Dia"
              items={dias.map(String)}
              selected={String(dia)}
              onSelect={(v) => setDia(Number(v))}
            />
            <WheelColumn
              label="Mês"
              items={MESES}
              selected={MESES[mes - 1] ?? MESES[0]}
              onSelect={(v) => setMes(MESES.indexOf(v) + 1)}
            />
            <WheelColumn
              label="Ano"
              items={anos.map(String)}
              selected={String(ano)}
              onSelect={(v) => setAno(Number(v))}
            />
          </View>

          <View style={styles.sheetActions}>
            <Pressable onPress={onClose} style={[styles.sheetBtn, { backgroundColor: c.chipMutedBg }]}>
              <Text style={{ color: c.text, fontWeight: '700' }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                confirmar();
                onClose();
              }}
              style={[styles.sheetBtn, { backgroundColor: palette.primary }]}
            >
              <Text style={{ color: palette.white, fontWeight: '700' }}>Confirmar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function WheelColumn({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.wheelCol}>
      <Text style={[styles.wheelLabel, { color: c.muted }]}>{label}</Text>
      <ScrollView style={styles.wheelScroll} showsVerticalScrollIndicator={false}>
        {items.map((item) => {
          const on = item === selected;
          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              style={[styles.wheelItem, on && { backgroundColor: `${palette.primary}18` }]}
            >
              <Text style={{ color: on ? palette.primary : c.text, fontWeight: on ? '800' : '600' }}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function DateField({
  label,
  value,
  onChange,
  hint,
  minimumDate,
  maximumDate,
}: Props): React.JSX.Element {
  const c = useThemeColors();
  const [open, setOpen] = useState(false);

  const dateValue = useMemo(() => parseApiDate(value) ?? new Date(), [value]);
  const display = value ? formatDataBR(value) : 'Selecionar data';

  return (
    <FormField label={label} hint={hint}>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, { borderColor: c.border, backgroundColor: c.inputBg }]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display}`}
      >
        <MaterialIcons name="event" size={20} color={palette.primary} />
        <Text style={[styles.value, { color: value ? c.text : c.muted }]}>{display}</Text>
        <MaterialIcons name="expand-more" size={22} color={c.muted} />
      </Pressable>

      <DatePickerModal
        visible={open}
        initial={dateValue}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onClose={() => setOpen(false)}
        onConfirm={(d) => onChange(toApiDate(d))}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  value: { flex: 1, fontSize: 15, fontWeight: '600' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', marginBottom: spacing.md, textAlign: 'center' },
  wheels: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  wheelCol: { flex: 1 },
  wheelLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  wheelScroll: { maxHeight: 200 },
  wheelItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  sheetActions: { flexDirection: 'row', gap: spacing.sm },
  sheetBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
});
