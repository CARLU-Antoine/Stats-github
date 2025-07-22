import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function MyLineChart({ data }) {
  const formaterSerie = (tab, key) =>
    Array.isArray(tab)
      ? tab.map(item => [new Date(item.date).getTime(), item[key] || 0])
      : [];

  // Transformer l'objet en tableau
  const projetsArray = Object.entries(data).map(([projet, donneesParDate]) => ({
    projet,
    donneesParDate,
  }));

  const series = projetsArray.flatMap(projetData => ([
    {
      name: `${projetData.projet} - Vues`,
      data: formaterSerie(projetData.donneesParDate, 'vues'),
      color: undefined,
    },
    {
      name: `${projetData.projet} - Clones`,
      data: formaterSerie(projetData.donneesParDate, 'clones'),
      dashStyle: 'ShortDash',
      color: undefined,
    }
  ]));

  const options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      height: 300,
    },
    title: {
      text: 'Évolution des vues et clones par projet',
      style: { color: '#FFFFFF' },
    },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: '#FFFFFF' } },
      title: { text: 'Date', style: { color: '#FFFFFF' } },
    },
    yAxis: {
      title: { text: 'Nombre', style: { color: '#FFFFFF' } },
      labels: { style: { color: '#FFFFFF' } },
    },
    tooltip: {
      xDateFormat: '%d %b %Y',
      shared: true,
      valueSuffix: '',
    },
    series,
    legend: {
      itemStyle: { color: '#FFFFFF' },
      itemHoverStyle: { color: '#CCC' },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
}


export default MyLineChart;
