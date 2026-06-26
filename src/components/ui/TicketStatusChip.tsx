import { StyleSheet, Text, View } from 'react-native';
import type { StatusTicket } from '../../types/api';
import { formatStatusTicket, ticketStatusColor } from '../../utils/ticketStatus';

type Props = { status: StatusTicket };

export function TicketStatusChip({ status }: Props): React.JSX.Element {
  const c = ticketStatusColor(status);
  return (
    <View style={[styles.chip, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]}>{formatStatusTicket(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: '700' },
});
