// script.js
document.getElementById('convert').addEventListener('click', convertCurrency);

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const chartCanvas = document.getElementById('myChart');

    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        if (!response.ok) {
            throw new Error('Error fetching the data');
        }

        const data = await response.json();
        const rate = data.serie[0].valor;
        const convertedAmount = (amount / rate).toFixed(2);
        resultDiv.innerHTML = ` ${amount} CLP = ${convertedAmount} ${currency.toUpperCase()}`;

        
        const labels = data.serie.slice(0, 10).map(item => item.fecha.slice(0, 10)).reverse();
        const values = data.serie.slice(0, 10).map(item => item.valor).reverse();

        
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial de los últimos 10 días (${currency.toUpperCase()})`,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });

        errorDiv.innerHTML = ''; 
    } catch (error) {
        errorDiv.innerHTML = 'Error: ' + error.message;
        resultDiv.innerHTML = '';
        chartCanvas.innerHTML = '';
    }
}
