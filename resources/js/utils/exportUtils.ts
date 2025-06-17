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

export const generateXML = (data: Record<string, string>[]) => {
  const xmlDoc = document.implementation.createDocument(null, 'root');
  for (const dataPoint of data) {
    const parent = xmlDoc.createElement('data-point');
    for (const [key, value] of Object.entries(dataPoint)) {
      const child = xmlDoc.createElement(key);
      const textEl = xmlDoc.createTextNode(value);
      child.appendChild(textEl);
      parent.appendChild(child);
    }
    xmlDoc.documentElement.appendChild(parent);
  }

  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  downloadFile(xmlString, 'xml');
};
