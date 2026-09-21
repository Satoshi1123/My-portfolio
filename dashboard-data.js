const dashboardData = [
    { date: '2026-03-28', profit: 11, breakdown: [2163, 0, 0] },
    { date: '2026-04-04', profit: 153, breakdown: [7171, 10288, 0] },
    { date: '2026-04-11', profit: 399, breakdown: [7033, 10673, 0] },
    { date: '2026-04-18', profit: 882, breakdown: [12872, 10996, 0] },
    { date: '2026-04-25', profit: 6, breakdown: [17757, 11062, 0] },
    { date: '2026-05-02', profit: -515, breakdown: [17805, 50496, 0] },
    { date: '2026-05-09', profit: 128, breakdown: [17274, 51614, 0] },
    { date: '2026-05-16', profit: 2089, breakdown: [13860, 52766, 0] },
    { date: '2026-05-23', profit: 1140, breakdown: [13000, 52677, 0] },
    { date: '2026-05-30', profit: 2337, breakdown: [20888, 93700, 0] },
    { date: '2026-06-06', profit: 2675, breakdown: [26817, 94525, 0] },
    { date: '2026-06-13', profit: -721, breakdown: [38301, 92235, 0] },
    { date: '2026-06-20', profit: 489, breakdown: [39184, 94892, 29860] },
    { date: '2026-06-27', profit: -6974, breakdown: [75975, 93680, 24768] },
    { date: '2026-07-04', profit: -1544, breakdown: [75860, 134369, 26101] },
    { date: '2026-07-11', profit: -406, breakdown: [77370, 135518, 26035] },
    { date: '2026-07-18', profit: -241, breakdown: [77540, 135532, 26016] },
    { date: '2026-07-25', profit: 4027, breakdown: [81580, 135196, 26579] },
    { date: '2026-08-01', profit: 531, breakdown: [82560, 171950, 52066] },
    { date: '2026-08-08', profit: 4872, breakdown: [82910, 175530, 52478] },
    { date: '2026-08-15', profit: 5496, breakdown: [79660, 178816, 53066] },
    { date: '2026-08-22', profit: 3456, breakdown: [81140, 175892, 52470] },
    { date: '2026-08-29', profit: 5359, breakdown: [81010, 218007, 78623] },
    { date: '2026-09-04', profit: -590, breakdown: [81700, 212973, 77017] },
    { date: '2026-09-11', profit: -3246, breakdown: [85280, 208359, 75352] },
    { date: '2026-09-18', profit: -691, breakdown: [56320, 210665, 75164] }
];

const assetLabels = ['国内株式（現物）', '投資信託', '外国株式'];
const availableYears = [...new Set(dashboardData.map((record) => record.date.slice(0, 4)))].sort();
const chartLabels = dashboardData.map((record) => record.date.slice(5).replace('-', '/'));
const profitData = dashboardData.map((record) => record.profit);
const breakdownData = dashboardData.map((record) => record.breakdown);
const totalAssetData = breakdownData.map((amounts) => amounts.reduce((total, amount) => total + amount, 0));
let currentChartLabels = chartLabels;
let currentBreakdownData = breakdownData;
const latestRecord = dashboardData.at(-1);
const previousAsset = totalAssetData.at(-2);
const latestAsset = totalAssetData.at(-1);
const weeklyAssetChange = latestAsset - previousAsset;
const formatYen = (amount) => `¥${amount.toLocaleString('ja-JP')}`;
const formatSignedYen = (amount) => `${amount >= 0 ? '+' : '-'}¥${Math.abs(amount).toLocaleString('ja-JP')}`;

document.getElementById('totalAssetValue').textContent = formatYen(latestAsset);
document.getElementById('currentProfitValue').textContent = formatSignedYen(latestRecord.profit);
document.getElementById('weeklyAssetChange').innerHTML = `<span>${weeklyAssetChange >= 0 ? '↗' : '↘'}</span> 前週から ${formatSignedYen(weeklyAssetChange)}`;
document.getElementById('selectedDate').textContent = `${chartLabels.at(-1)} 時点`;

const myPieChart = new Chart(document.getElementById('myPieChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: assetLabels,
        datasets: [{ data: latestRecord.breakdown, backgroundColor: ['#ff8b73', '#55c7a5', '#ffd166'], borderWidth: 5, borderColor: '#fffdf9', hoverOffset: 8 }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
            legend: { position: 'bottom', labels: { padding: 18, usePointStyle: true, pointStyle: 'circle', font: { family: 'Nunito', size: 12 } } },
            tooltip: { callbacks: { label: (item) => ` ${item.label}: ${formatYen(item.raw)}` } }
        }
    }
});

function updatePieChart(index) {
    myPieChart.data.datasets[0].data = currentBreakdownData[index];
    myPieChart.update();
    document.getElementById('selectedDate').textContent = `${currentChartLabels[index]} 時点`;
}

const trendChart = new Chart(document.getElementById('chart1').getContext('2d'), {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [
            { label: '週間損益', data: profitData, yAxisID: 'profit', borderColor: '#55c7a5', backgroundColor: 'rgba(85, 199, 165, .13)', fill: true, borderWidth: 3, tension: .42, pointRadius: 3, pointHoverRadius: 7, pointBackgroundColor: '#fffdf9', pointBorderColor: '#55c7a5', pointBorderWidth: 2 },
            { label: '保有資産額', data: totalAssetData, yAxisID: 'asset', borderColor: '#ff8b73', backgroundColor: 'transparent', fill: false, borderWidth: 2, borderDash: [6, 5], tension: .35, pointRadius: 2, pointHoverRadius: 6, pointBackgroundColor: '#fffdf9', pointBorderColor: '#ff8b73', pointBorderWidth: 2 }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: true, position: 'top', labels: { usePointStyle: true, padding: 18, font: { family: 'Nunito', size: 11 } } },
            tooltip: { displayColors: false, backgroundColor: '#25443f', padding: 12, cornerRadius: 10, callbacks: { label: (item) => ` ${item.dataset.label}: ${formatYen(item.raw)}` } }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#8a9b98', font: { family: 'Nunito', size: 11 }, maxTicksLimit: 9 } },
            profit: { position: 'left', grid: { color: '#e8efec' }, ticks: { color: '#8a9b98', callback: (value) => formatYen(value) }, suggestedMin: -8000, suggestedMax: 6000 },
            asset: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#ff8b73', callback: (value) => `¥${(value / 1000).toFixed(0)}k` } }
        },
        onClick: (event, elements) => { if (elements.length) updatePieChart(elements[0].index); },
        onHover: (event, elements) => { event.native.target.style.cursor = elements.length ? 'pointer' : 'default'; }
    }
});

const yearTabs = document.getElementById('yearTabs');
yearTabs.innerHTML = availableYears.map((year) => `<button class="year-tab" type="button" data-year="${year}">${year}年</button>`).join('');

function selectYear(year) {
    const yearRecords = dashboardData.filter((record) => record.date.startsWith(year));
    const yearLabels = yearRecords.map((record) => record.date.slice(5).replace('-', '/'));
    const yearProfits = yearRecords.map((record) => record.profit);
    const yearBreakdowns = yearRecords.map((record) => record.breakdown);
    const yearAssets = yearBreakdowns.map((amounts) => amounts.reduce((total, amount) => total + amount, 0));
    const latestYearRecord = yearRecords.at(-1);
    const previousYearAsset = yearAssets.at(-2) ?? yearAssets.at(-1);
    const yearAssetChange = yearAssets.at(-1) - previousYearAsset;

    currentChartLabels = yearLabels;
    currentBreakdownData = yearBreakdowns;
    trendChart.data.labels = yearLabels;
    trendChart.data.datasets[0].data = yearProfits;
    trendChart.data.datasets[1].data = yearAssets;
    trendChart.update();
    myPieChart.data.datasets[0].data = latestYearRecord.breakdown;
    myPieChart.update();
    document.getElementById('totalAssetValue').textContent = formatYen(yearAssets.at(-1));
    document.getElementById('currentProfitValue').textContent = formatSignedYen(latestYearRecord.profit);
    document.getElementById('weeklyAssetChange').innerHTML = `<span>${yearAssetChange >= 0 ? '↗' : '↘'}</span> 前週から ${formatSignedYen(yearAssetChange)}`;
    document.getElementById('selectedDate').textContent = `${yearLabels.at(-1)} 時点`;
    yearTabs.querySelectorAll('.year-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.year === year));
}

yearTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('.year-tab');
    if (tab) selectYear(tab.dataset.year);
});

selectYear(availableYears.at(-1));
