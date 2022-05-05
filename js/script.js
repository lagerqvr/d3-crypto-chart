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

    // We call on our function to render a candlestick chart
    renderData(data);
};


// Function for changing currency onchange
async function currencyChange(val) {
    let start = new Date(today);

    // Formatting start date for URL
    start.setDate(start.getDate() - document.getElementById("timespan").value);
    start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

    // End date = today + formatting for URL
    let end = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // Construction of URL for GET-request
    const URL = 'https://api.pro.coinbase.com/products/' + val + '/candles?start=' + start + '&end=' + end + '&granularity=' + granularity;

    const resp = await fetch(URL);
    const data = await resp.json();

    // We call on our function to render a candlestick chart
    renderData(data);
};


// Function for changing timespan onchange
async function timespanChange(val) {
    let start = new Date(today);

    // Formatting start date for URL
    start.setDate(start.getDate() - val);
    start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

    // End date = today + formatting for URL
    let end = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    let currency = document.getElementById("currency").value;

    // Construction of URL for GET-request
    const URL = 'https://api.pro.coinbase.com/products/' + currency + '/candles?start=' + start + '&end=' + end + '&granularity=' + granularity;

    const resp = await fetch(URL);
    const data = await resp.json();

    // We call on our function to render a candlestick chart
    renderData(data);
};


// Function for rendering candlestick chart with D3.js
const renderData = (vals) => {

    // Delete previous chart if there is one
    d3.selectAll("#chart > *").remove();

    const handleData = (vals) => {
        const renderD3 = (vals) => {

            // We declare variables for parsing and formatting values
            let p = d3.timeParse("%s");
            let f = d3.timeFormat("%Y-%m-%d");

            // We declare variables for margin, width and height
            let m = {
                t: 20,
                r: 20,
                b: 50,
                l: 70
            };

            let w = 1080 - m.l - m.r;
            let h = 480 - m.t - m.b;

            // We loop over values from data object
            // r = result
            vals.forEach(function (r) {
                let time = p(r[0]);
                r.date = f(time);
                r.low = +r[1];
                r.high = +r[2];
                r.open = +r[3];
                r.close = +r[4];
                r.volume = +r[5];
            });

            // We declare y
            let y = d3.scaleLinear().range([h, 0]);
            y.domain([0, d3.max(vals, function (r) { return r.close; })]);

            // We declare y2
            let y2 = d3.scaleLinear().range([h, 0]);
            y2.domain([0, d3.max(vals, function (r) { return r.volume; })]);

            // We declare x
            let x = d3.scaleTime().range([0, w]);
            x.domain(d3.extent(vals, function (r) { return new Date(r.date); }));

            // We target our chart div with D3
            let s = d3.select("#chart")
                .append("svg")
                .attr("width", w + m.l + m.r)
                .attr("height", h + m.t + m.b)
                .append("g")
                .attr("transform",
                    "translate(" + m.l + "," + m.t + ")")

            s.append("g")
                .attr("transform", "translate(0," + h + ")")
                .call(d3.axisBottom(x));

            s.append("g")
                .call(d3.axisLeft(y));

            s.selectAll("line.ext")
                .data(vals)
                .enter().append("line")
                .transition()
                .duration(750)
                .attr("class", "ext")
                .attr("x1", function (r) {
                    return x(new Date(r.date))
                })
                .attr("x2", function (r) {
                    return x(new Date(r.date))
                })
                .attr("y1", function (r) {
                    return y(r.low);
                })
                .attr("y2", function (r) {
                    return y(r.high);
                });

            s.selectAll("line.ext1")
                .data(vals)
                .enter().append("line")
                .transition()
                .duration(750)
                .attr("class", "ext")
                .attr("x1", function (r) {
                    return x(new Date(r.date)) + 1
                })
                .attr("x2", function (r) {
                    return x(new Date(r.date)) - 1
                })
                .attr("y1", function (r) {
                    return y(r.low);
                })
                .attr("y2", function (r) {
                    return y(r.low);
                });

            s.selectAll("line.ext2")
                .data(vals)
                .enter().append("line")
                .transition()
                .duration(750)
                .attr("class", "ext")
                .attr("x1", function (r) {
                    return x(new Date(r.date)) + 1
                })
                .attr("x2", function (r) {
                    return x(new Date(r.date)) - 1
                })
                .attr("y1", function (r) {
                    return y(r.high);
                })
                .attr("y2", function (r) {
                    return y(r.high);
                });

            // Colors for candlesticks
            let red = "#EF4444"
            let green = "#00C853"

            s.selectAll("rect")
                .data(vals)
                .enter().append("rect")
                .transition()
                .duration(750)
                .attr("x", function (r) {
                    return x(new Date(r.date)) - 3;
                })
                .attr("y", function (r) {
                    return y(Math.max(r.open, r.close));
                })
                .attr("height", function (r) {
                    return y(Math.min(r.open, r.close)) - y(Math.max(r.open, r.close));
                })
                .attr("width", 6)
                .attr("fill", function (r) {
                    return r.open > r.close ? red : green;
                })
        }
        renderD3(vals);
    };
    handleData(vals);
};

// We render our chart on page load (no need for button)
window.onload = function () {
    getData();
};


