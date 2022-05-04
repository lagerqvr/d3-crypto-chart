// Projekt 2 - JS, d3.js

let today = new Date();

// Start date = 30 days back
let start = new Date(today);

// Formatting start date for URL
start.setDate(start.getDate() - 29);
start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

// End date = today + formatting for URL
let end = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// Currency
let currency = 'BTC-EUR';

// Granularity
let granularity = '86400';

async function getData() {

    // Construction of URL for GET-request
    const URL = 'https://api.pro.coinbase.com/products/' + currency + '/candles?start=' + start + '&end=' + end + '&granularity=' + granularity;

    const resp = await fetch(URL);
    const data = await resp.json();

    console.log(URL);
    console.log(data);

    // We call on our function to render a candlestick chart
    renderData(data);
};

// Function for changing currency onchange
const currencyChange = (val) => {
    console.log("currency");
}

// Function for changing timespan onchange
const timespanChange = (val) => {
    console.log("timespan");
}

// Function for rendering candlestick chart
const renderData = (data) => {
    console.log(data);
}

// We render our chart on page load
window.onload = function () {
    getData();
};

/* console.log(end);
console.log(start);
console.log(URL); */


