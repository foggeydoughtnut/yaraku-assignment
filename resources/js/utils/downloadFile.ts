export const downloadFile = (data: BlobPart, type: 'csv' | 'xml') => {
  let blob: Blob | undefined;
  if (type === 'csv') {
    blob = new Blob([data], { type: 'text/csv' });
  } else {
    blob = new Blob([data], { type: 'text/plain' });
  }
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'csv' ? 'data.csv' : 'data.xml';
    a.click();
  }
};
