import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartComponent({ daily }) {
    const labels = daily.map(day => new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
    const temperatures = daily.map(day => day.temp.day);

    const data = {
        labels,
        datasets: [
            {
                label: 'Daily Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 5)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Temperature Forecast',
            },
           
           
        },
    };

    return (
        // <div >
            <Line data={data} options={options} />
        // </div>
    );
}

export default ChartComponent;
