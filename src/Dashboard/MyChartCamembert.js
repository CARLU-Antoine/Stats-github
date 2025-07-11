import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function MyChartCamembert() {
  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 250,
    },
    title: {
      text: 'Top 3 des projets GitHub (Vues)',
      style: {
        color: '#FFFFFF',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b> vues',
    },
    accessibility: {
      point: {
        valueSuffix: ' vues',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: '#FFFFFF',
          },
        },
      },
    },
    series: [
      {
        name: 'Vues',
        colorByPoint: true,
        data: [
          { name: 'Projet 1', y: 150 },
          { name: 'Projet 2', y: 100 },
          { name: 'Projet 3', y: 75 },
        ],
      },
    ],
    legend: {
      itemStyle: {
        color: '#FFFFFF',
      },
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

export default MyChartCamembert;
