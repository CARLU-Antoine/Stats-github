import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function MyChartBar() {
  const options = {
    title: {
      text: 'Statistiques GitHub',
      style: {
        color: '#FFFFFF'
      }
    },
    chart: {
      height: 250,
      type: 'column',
      backgroundColor: 'transparent',
    },
    xAxis: {
      categories: ['Projet 1', 'Projet 2', 'Projet 3'],
      labels: {
        style: {
          color: '#FFFFFF'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Nombre',
        style: {
          color: '#FFFFFF'
        }
      },
      labels: {
        style: {
          color: '#FFFFFF'
        }
      }
    },
    legend: {
      itemStyle: {
        color: '#FFFFFF'
      }
    },
    series: [
      {
        name: 'Vues',
        data: [150, 100, 75],
      },
      {
        name: 'Clones',
        data: [50, 40, 20],
      },
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: {
              color: '#FFFFFF'
            }
          }
        }
      }]
    }
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

export default MyChartBar;