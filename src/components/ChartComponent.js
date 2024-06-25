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
         <div >
            <Line data={data} options={options} />
            <div>
                <br/>
                <ul style={{textAlign:"left", color:"GrayText", fontSize:"14px"}}>
                    <li>Plan your irrigation based on the upcoming rain forecasts.</li>
                    <li>Check the weekly weather to plan your trip and pack accordingly.</li>
                    <li>Ensure to have a backup plan for outdoor events considering the weather forecast.</li>
                </ul>
            </div>
        </div>
    );
}

export default ChartComponent;
