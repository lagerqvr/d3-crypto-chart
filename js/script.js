
// Del 1
let today = new Date();
let start = new Date(today);

// Start date
start.setDate(start.getDate() - 29);
start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

// End date
let end = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// Currency
let currency = 'BTC-EUR';

// Granularity
let granularity = '86400';

// Construction of URL for GET-request
const URL = 'https://api.pro.coinbase.com/products/' + currency + '/candles?start=' + start + '&end=' + end + '&granularity=' + granularity;

async function getData() {
    const resp = await fetch(URL);
    const data = await resp.json();

    console.log(URL);
    console.log(data);
};

/* console.log(end);
console.log(start);
console.log(URL); */


