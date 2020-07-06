
const fs = require("fs")
const puppeteer = require('puppeteer');

(async () => {
 const browser = await puppeteer.launch();
 const page = await browser.newPage();
 await page.goto('https://finance.yahoo.com/most-active');
 await page.screenshot({path: 'example.png'});

 const stocks = await page.evaluate(() => {
    const data = []
    let section = document.querySelector("#scr-res-table")
    Array.from(section.querySelectorAll('table > tbody > tr'))
     .forEach(row => {
	let value = Array.from(row.querySelectorAll("td")).map(cell => cell.innerText)
	const [Symbol, Name, Price, Change, PercentChange, Volume, AverageVolume, MarketCap] = value
	data.push({Name, Symbol, Price, Change, PercentChange, Volume, AverageVolume, MarketCap})
     })

    let averagePercentChange = data.reduce( (acc, val, i, arr) => {
	let change = val.PercentChange.toString().split("")
	change.pop()
	let sign = change.shift().toString()
	let num = Number(change.join(""))
	if (sign === "+") acc += num
	else acc -= num

	return acc / arr.length
    }, 0)
    return { data , averagePercentChange }
 })
 await browser.close();
 fs.writeFileSync("./stocks", JSON.stringify(stocks,null , " ") )
})();



