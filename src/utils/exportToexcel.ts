
import * as XLSX from "xlsx";
type ExportOptions<T> = {
  data: T[];
  headersMap: { [K in keyof T]?: string };
  sheetName?: string;
  fileName?: string;
  formatters?: Partial<{ [K in keyof T]: (value: T[K]) => any }>;
};

export function exportToExcel<T>({
  data,
  headersMap,
  sheetName = "Sheet1",
  fileName = "ExportedData.xlsx",
  formatters = {},
}: ExportOptions<T>): void {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const formattedData = data.map((item) => {
    return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
      const typedKey = key as keyof T;
      const label = headersMap[typedKey]!;
      let value = item[typedKey];
      if (formatters[typedKey]) {
        value = formatters[typedKey]!(value);
      }

      acc[label] = value ?? "";
      return acc;
    }, {});
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}
