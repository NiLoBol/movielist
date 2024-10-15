import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Define the interface for the genre
interface Genre {
  id: number;
  name: string;
  count: number;
}

// Define the props interface
interface PieChartProps {
  genresList?: Genre[]; // genresList can be undefined
}

// Predefined color palette for the genres
const genreColors: { [key: number]: string } = {
    28: '#ABDEE6', // Action
    12: '#CBAACB', // Adventure
    16: '#FFF5B5', // Animation
    35: '#FFCCB6', // Comedy
    80: '#F3B0C3', // Crime
    99: '#C6DBDA', // Documentary
    18: '#FEF1E8', // Drama
    10751: '#FED7C3', // Family
    14: '#F6E6AC', // Fantasy
    36: '#ECD5E3', // History
    27: '#FF968A', // Horror
    10402: '#FFAEA5', // Music
    9648: '#FFC5BF', // Mystery
    10749: '#FFD8BE', // Romance
    878: '#FFC8A2', // Science Fiction
    10770: '#D4F0F0', // TV Movie
    53: '#8FCACA', // Thriller
    10752: '#CCE2CB', // War
    37: '#B6CFB6', // Western
  };
  

const PieChart: React.FC<PieChartProps> = ({ genresList }) => {
  useEffect(() => {
    if (!genresList) {
      return; // Early return if genresList is undefined
    }

    // Create data for the chart
    const data = {
      labels: genresList.map((genre) => genre.name),
      datasets: [{
        label: 'Genres',
        data: genresList.map((genre) => genre.count),
        backgroundColor: genresList.map((genre) => genreColors[genre.id] || '#CCCCCC'), // Use the predefined color or a fallback color
        borderColor: genresList.map((genre) => genreColors[genre.id]?.replace(/0.6/, '1') || '#FFFFFF'), // Use the same color for border or a fallback color
        borderWidth: 1,
      }],
    };

    // Get the canvas element and its context
    const canvas = document.getElementById('myPieChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Check if the context is valid
    if (ctx) {
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Genre Distribution',
            },
          },
        },
      });

      // Cleanup chart on component unmount
      return () => {
        myPieChart.destroy();
      };
    } else {
      console.error('Failed to get canvas 2D context');
    }
  }, [genresList]);

  // Render a fallback message if genresList is undefined
  if (!genresList) {
    return <div>No genres available to display.</div>;
  }

  return (
    <div>
      <canvas id="myPieChart" width="400" height="400"></canvas>
    </div>
  );
};

export default PieChart;
