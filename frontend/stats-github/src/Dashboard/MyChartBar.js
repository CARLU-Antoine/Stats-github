import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function MyChartBar({ tableauLabelProjet, tableauQuantiteVues, tableauQuantiteClones }) {
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
      categories: tableauLabelProjet,
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
        data: tableauQuantiteVues,
      },
      {
        name: 'Clones',
        data: tableauQuantiteClones,
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
        containerProps={{ style: { width: '100%', height: '1OO%' } }}
      />
    </div>
  );
}

export default MyChartBar;
