const holdingsData = {
    updatedDate: '2026.09.19',
    realized: [
        { date: '2026.04.21', name: '楽天グループ', quantity: '1株', saleAmount: 805, profit: 54 },
        { date: '2026.05.15', name: 'サンリオ', quantity: '5株', saleAmount: 4277, profit: -878 },
        { date: '2026.06.29', name: '日経平均レバレッジ・インデックス連動上場型投信', quantity: '1', saleAmount: 77500, profit: -940 },
        { date: '2026.06.30', name: '日経平均レバレッジ・インデックス連動上場型投信', quantity: '1', saleAmount: 80000, profit: 2000 },
        { date: '2026.07.01', name: '日経平均レバレッジ・インデックス連動上場型投信', quantity: '1', saleAmount: 80760, profit: 1260 },
        { date: '2026.07.02', name: 'ENEOSホールディングス', quantity: '1株', saleAmount: 1203, profit: -197 },
        { date: '2026.07.08', name: 'スペースエクスプロレーションテクノA', quantity: '1株', saleAmount: 24645, profit: -7545 },
        { date: '2026.09.16', name: 'ENEOSホールディングス', quantity: '20株', saleAmount: 29450, profit: 3890 },
    ],
    current: [
        { name: '全世界株式（オール・カントリー）', type: '投資信託', quantity: '56,127', purchaseCost: 210000, marketValue: 210655, profit: 654 },
        { name: 'ENEOSホールディングス', type: '国内株式', quantity: '20株', purchaseCost: 25560, marketValue: 28630, profit: 3070 },
        { name: '三菱HCキャピタル', type: '国内株式', quantity: '20株', purchaseCost: 25860, marketValue: 27690, profit: 1830 },
        { name: 'VYMバンガード米国高配当株式ETF', type: '外国株式', quantity: '3', purchaseCost: 79053, marketValue: 75164, profit: -3889 }
    ]
}

const formatYen = (amount) => `¥${amount.toLocaleString('ja-JP')}`;
const formatSignedYen = (amount) => `${amount >= 0 ? '+' : '-'}¥${Math.abs(amount).toLocaleString('ja-JP')}`;
const valueClass = (amount) => amount >= 0 ? 'positive-value' : 'negative-value';

const realizedRows = document.getElementById('realizedRows');
const realizedTotal = document.getElementById('realizedTotal');
const holdingRows = document.getElementById('holdingRows');
const holdingTotal = document.getElementById('holdingTotal');

realizedRows.innerHTML = holdingsData.realized.map((record) => `
    <tr>
        <td>${record.date}</td>
        <td>${record.name}</td>
        <td>${record.quantity}</td>
        <td>${formatYen(record.saleAmount)}</td>
        <td class="${valueClass(record.profit)}">${formatSignedYen(record.profit)}</td>
    </tr>
`).join('');

const realizedSaleTotal = holdingsData.realized.reduce((total, record) => total + record.saleAmount, 0);
const realizedProfitTotal = holdingsData.realized.reduce((total, record) => total + record.profit, 0);
realizedTotal.innerHTML = `
    <tr>
        <th colspan="3">合計</th>
        <td>${formatYen(realizedSaleTotal)}</td>
        <td class="${valueClass(realizedProfitTotal)}">${formatSignedYen(realizedProfitTotal)}</td>
    </tr>
`;

holdingRows.innerHTML = holdingsData.current.map((record) => `
    <tr>
        <td>${record.name}</td>
        <td>${record.type}</td>
        <td>${record.quantity}</td>
        <td>${formatYen(record.purchaseCost)}</td>
        <td>${formatYen(record.marketValue)}</td>
        <td class="${valueClass(record.profit)}">${formatSignedYen(record.profit)}</td>
    </tr>
`).join('');

const purchaseCostTotal = holdingsData.current.reduce((total, record) => total + record.purchaseCost, 0);
const marketValueTotal = holdingsData.current.reduce((total, record) => total + record.marketValue, 0);
const holdingProfitTotal = holdingsData.current.reduce((total, record) => total + record.profit, 0);
holdingTotal.innerHTML = `
    <tr>
        <th colspan="3">合計</th>
        <td>${formatYen(purchaseCostTotal)}</td>
        <td>${formatYen(marketValueTotal)}</td>
        <td class="${valueClass(holdingProfitTotal)}">${formatSignedYen(holdingProfitTotal)}</td>
    </tr>
`;

document.getElementById('realizedUpdatedDate').textContent = holdingsData.updatedDate;
document.getElementById('holdingsUpdatedDate').textContent = holdingsData.updatedDate;
