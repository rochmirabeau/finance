let fs = require ('fs')
const puppeteer = require('puppeteer');

(async () => {
 const browser = await puppeteer.launch();
 const page = await browser.newPage();
 await page.goto('https://finance.yahoo.com/most-active');
 await page.screenshot({path: 'yahoo.png'});

 const stocks = await page.evaluate(() => {
    // I want symbol, name, price and %change
    // aria-label Symbol = stock symbol
    // aria-label Name = company name
    // aria-label Change = % Change
    // aria-label Price = Price
    const fields = [ "Name", "Symbol", "Price (Intraday)", "Change"]
    const grabFromRow = (row, className) => row
     .querySelector(`td.${className}`)
     .innerText
    
    var data = []
    var aria = '[aria-label^="Name"]'
    var STOCK_SELECTOR = 'table.W'
    let section = document.querySelector("#scr-res-table")

    let cells = Array.from(section.querySelectorAll(("td")))
    console.log(cells[0])
    let rows = Array.from(section.querySelectorAll("tr"))
      .reduce( (a, b, c) => {
	if(fields.includes(cells[c])) a[c] = cells[c].innerText
	return a
      }, {})
	//.filter(cell => fields.includes(cell.getAttribute("aria-label")))
//    let stockRows = Array.from(section.querySelectorAll('table > tbody > tr > td'))
//      .filter(cell => fields.includes(cell.getAttribute('aria-label')))
//      .map(name => `${name.getAttribute("aria-label")}: ${name.innerText}`)

    let stockRows = Array.from(section.querySelectorAll('table > tbody > tr'))
     .map (x => x.innerText)
	//make each row and object where {field I want: field value}
// 	.reduce( accum, row => {
// 	    const name = "."
// 	    return row
// 	}, {})
//      .filter(cell => fields.includes(cell.getAttribute('aria-label')))
//      .map(name => `${name.getAttribute("aria-label")}: ${name.innerText}`)

//  fs.writeFile(
//    './stocks.json', 
//    JSON.stringify(stockRows, null, '  '),
//    (err) => err ? console.log(`Error: ${err}`) : console.log(`Data Written`)
//  )

    return rows 

 })
 console.log(stocks)

 await browser.close();
})();


