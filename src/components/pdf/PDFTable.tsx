import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface Field {
  name: string;
  width: string | number;
}

interface TableProps<T> {
  fields: Field[];
  rows: T[];
  children?: ReactNode;
}

interface TableHeaderProps {
  fields: Field[];
}

interface TableRowProps<T> {
  fields: Field[];
  data: T;
  index: number;
}

interface TableFooterProps {
  children?: ReactNode;
}

const styles = StyleSheet.create({
  table: {
    width: 'auto',
    maxWidth: 500,
    alignSelf: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    fontSize: 10,
    paddingVertical: 4,
  },
  tableCol: {
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#3b5998',
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#dbe9f4',
    fontStyle: 'italic',
  },
  rowEven: {
    backgroundColor: '#e6f0fa',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
});

// Type guard para garantir que data é objeto com string keys
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function Table<T>(props: TableProps<T>) {
  const { fields, rows, children } = props;

  return (
    <View style={styles.table}>
      <TableHeader fields={fields} />
      {rows.map((row, i) => (
        <TableRow key={i} fields={fields} data={row} index={i} />
      ))}
      {children && <TableFooter>{children}</TableFooter>}
    </View>
  );
}

export const TableHeader: React.FC<TableHeaderProps> = ({ fields }) => (
  <View style={{ ...styles.tableRow, ...styles.header }} fixed>
    {fields.map(({ name, width }, i) => (
      <View style={{ ...styles.tableCol, width }} key={i}>
        <Text style={{ color: '#fff' }}>{name}</Text>
      </View>
    ))}
  </View>
);

export function TableRow<T>(props: TableRowProps<T>) {
  const { fields, data, index } = props;
  const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

  return (
    <View style={{ ...styles.tableRow, ...rowStyle }} wrap={false}>
      {fields.map(({ name, width }, i) => {
        let value = '';

        if (isRecord(data) && name in data) {
          const val = data[name];
          value = String(val ?? '');
        }

        return (
          <View style={{ ...styles.tableCol, width }} key={i}>
            <Text>{value}</Text>
          </View>
        );
      })}
    </View>
  );
}

export const TableFooter: React.FC<TableFooterProps> = ({ children }) => (
  <View style={{ ...styles.tableRow, ...styles.footer }}>{children}</View>
);
