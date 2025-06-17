import { downloadFile } from './downloadFile';

export const generateCSV = (columns: string[], data: string[][]) => {
  const csvData: string[] = [];
  csvData.push(columns.join(','));
  for (const row of data) {
    csvData.push(row.join(','));
  }
  const result: BlobPart = csvData.join('\n');
  downloadFile(result, 'csv');
};
