export const downloadFile = (data: BlobPart, type: 'csv' | 'xml') => {
  let blob: Blob | undefined;
  if (type === 'csv') {
    blob = new Blob([data], { type: 'text/csv' });
  } else {
    blob = undefined;
  }
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
  }
};
