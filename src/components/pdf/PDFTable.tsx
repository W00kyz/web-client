import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface Field {
  name: string;
  width: string | number;
}

interface TableProps {
  fields: Field[];
  rows: Record<string, any>[];
  children?: ReactNode;
}

interface TableHeaderProps {
  fields: Field[];
}

interface TableRowProps {
  fields: Field[];
  data: Record<string, any>;
  index: number;
}

interface TableFooterProps {
  children?: ReactNode;
}

const styles = StyleSheet.create({
  table: {
    width: "auto",
    maxWidth: 500,
    alignSelf: "center",
  },
  tableRow: {
    flexDirection: "row",
    fontSize: 10,
    paddingVertical: 4,
  },
  tableCol: {
    paddingHorizontal: 4,
    textAlign: "center",
  },
  header: {
    backgroundColor: "#3b5998", // azul escuro
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#dbe9f4", // azul clarinho
    fontStyle: "italic",
  },
  rowEven: {
    backgroundColor: "#e6f0fa", // azul bem claro
  },
  rowOdd: {
    backgroundColor: "#ffffff",
  },
});

// Table
export const Table: React.FC<TableProps> = ({ fields, rows, children }) => (
  <View style={styles.table}>
    <TableHeader fields={fields} />
    {rows.map((row, i) => (
      <TableRow key={i} fields={fields} data={row} index={i} />
    ))}
    {children && <TableFooter>{children}</TableFooter>}
  </View>
);

// TableHeader
export const TableHeader: React.FC<TableHeaderProps> = ({ fields }) => (
  <View style={[styles.tableRow, styles.header]}>
    {fields.map(({ name, width }, i) => (
      <View style={[styles.tableCol, { width }]} key={i}>
        <Text style={{ color: "#fff" }}>{name}</Text>
      </View>
    ))}
  </View>
);

// TableRow
export const TableRow: React.FC<TableRowProps> = ({ fields, data, index }) => {
  const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

  return (
    <View style={[styles.tableRow, rowStyle]} wrap={false}>
      {fields.map(({ name, width }, i) => (
        <View style={[styles.tableCol, { width }]} key={i}>
          <Text>{data[name]}</Text>
        </View>
      ))}
    </View>
  );
};

// TableFooter
export const TableFooter: React.FC<TableFooterProps> = ({ children }) => (
  <View style={[styles.tableRow, styles.footer]}>{children}</View>
);
