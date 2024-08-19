
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ExpenseChart = ({ expenses }) => {
    // Transform expenses into chart data
    const groupedExpenses = expenses.reduce((acc, expense) => {
        const date = new Date(expense.Date).toLocaleDateString();
        if (!acc[date]) acc[date] = 0;
        acc[date] += +expense.Amount;
        return acc;
    }, {});

    const dates = Object.keys(groupedExpenses);
    const amounts = Object.values(groupedExpenses);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Total Expenses',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Total: $${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                grid: {
                    display: false,
                },

            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='chart-container'>
            <h3>Total Expenses per Date</h3>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ExpenseChart;


