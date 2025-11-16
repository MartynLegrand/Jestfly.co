import { TimeSeriesData } from '@/lib/analytics/types';

export const downloadChartAsCSV = (data: TimeSeriesData[], title: string): void => {
  // Create a simple CSV from the data
  const headers = ['name', 'value', 'secondaryValue'].filter(
    header => header === 'name' || header === 'value' || 
    (header === 'secondaryValue' && data[0]?.secondaryValue !== undefined)
  );
  
  const csvContent = 
    headers.join(',') + '\n' + 
    data.map(row => {
      const values = [row.name, row.value];
      if (headers.includes('secondaryValue')) {
        values.push(row.secondaryValue !== undefined ? row.secondaryValue.toString() : '');
      }
      return values.join(',');
    }).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
