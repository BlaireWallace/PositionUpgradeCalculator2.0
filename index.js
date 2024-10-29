
require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');

var bigNumber = require("bignumber.js");
const { getGoldenScrapLevel, getStarFragmentLevel, getMasteryLevel, getMagnetLevel, getWrenchesLevel, test } = require('./public/formula');
const { toScientificNotationFromString, formatNumberWithSpaces, convertToMetricPrefixes } = require('./public/numberFormat');
const path_ = "./public/data.json";

test()

const formula = {
    "goldenScrap": getGoldenScrapLevel,
    "starFragments": getStarFragmentLevel,
    "masteryTokens": getMasteryLevel,
    "magnets": getMagnetLevel,
    "wrench": getWrenchesLevel,
}

const PORT = process.env.PORT || 4000
app.use(express.json())

function print(t){
    console.log(t)
}

function getCounter(){
    if (fs.existsSync(path_)) {
        const data = JSON.parse(fs.readFileSync(path_, 'utf8'));
         return data.count
      } else {
        return 1
      }
}

function updateCount() {
    if (fs.existsSync(path_)) {
      const data = JSON.parse(fs.readFileSync(path_, 'utf8'));
      data.count += 1;
      fs.writeFileSync(path_, JSON.stringify(data, null, 2));
    } else {
      const data = { count: 1 };
      fs.writeFileSync(path_, JSON.stringify(data, null, 2));
    }
  }

function isCompatible(a,b){
    let good = true
    for (let row = 1; row < 6; row++){
        for (let column = 1; column < 5; column++){
            const vA = a[row][column]
            const vB = b[row][column]

            if (vA > vB){
                good = false
                break
            }
        }
    }
    return good
}

function getUpgradeCosts(name,a,b,reduction){
    const reductionPercent = new bigNumber(reduction).dividedBy(100)
    let total = new bigNumber(0)
    let totalUpgrades = 0

    let v = {}

    for (let row = 1; row < 6; row++){
        for (let column = 1; column < 5; column++){
            const currentLevel = a[row][column]
            const targetLevel = b[row][column]
            let posPrice = new bigNumber(0)

            if (v[currentLevel] && v[currentLevel][targetLevel]){
                const copyTotal = total.plus(v[currentLevel][targetLevel])
                const difference = targetLevel - currentLevel
                totalUpgrades += difference
                total = copyTotal
            }
            else { // go get the posPrice
                for (let i=currentLevel + 1;i<targetLevel + 1; i++){
                    let price = new bigNumber(formula[name](i))
                    let reductionPrice = new bigNumber(Math.floor(price.multipliedBy(reductionPercent).plus(.5)))
                    const newPrice = new bigNumber(price.minus(reductionPrice))
    
                    const copyTotal = total.plus(newPrice)
                    total = copyTotal
    
                    const copyPosPrice = posPrice.plus(newPrice)
                    posPrice = copyPosPrice
    
                    totalUpgrades++
                }
    
                if (!v[currentLevel]){
                    v[currentLevel] = {}
                }
                v[currentLevel][targetLevel] = posPrice
            }

        }
    }

    return {cost: total, totalUpgrades: totalUpgrades}
}

app.use(express.static(path.join(__dirname,'public')))

app.get('/data', (req,res) => {
    const data = JSON.parse(fs.readFileSync(path_, 'utf8'));
    res.send({data: data.count}) // Increment the count
})

app.post('/calculate', (req,res)=>{
    const parcel = req.body.parcel

    const current = parcel.data.current
    const target = parcel.data.target

    const resourceName = parcel.resource
    const usersAmount = parcel.resourceAmountInput
    const reductionPercent = parcel.reductionPercent
    const currentTotalUpgrades = parcel.currentTotalUpgrades

    let data = {
        resource: resourceName,
        deltaTotalUpgrades: 0,
        counter: getCounter()
    }

    if (!isCompatible(current,target)){
        console.log("error");
        res.json({status: "failed",data: data, message: "Current position level is higher than target position level!"})
        return
    }

    // calculate the level base on min max
    const info = getUpgradeCosts(resourceName, current, target, reductionPercent)

    if (info.cost.isEqualTo(0)){
        res.json({status: "success", data: data})
        return
    }

    let finalCost = new bigNumber(info.cost.toString())
    let totalCost = new bigNumber(info.cost.toString())

    let messageState = "noState"
    if (usersAmount != null){
        let userAmount = new bigNumber(usersAmount)
        let final = finalCost.minus(userAmount)
        finalCost = final

        messageState = finalCost.isNegative() ? "enough" : "notenough"
        messageState = finalCost.isEqualTo(0) ? "enough" : messageState

        finalCost = finalCost.absoluteValue()
    }

    data = {
        finalnormal: formatNumberWithSpaces(finalCost.toFixed()),
        finalsuffix: convertToMetricPrefixes(finalCost.toFixed()),
        finalscientific: toScientificNotationFromString(finalCost.toFixed()),

        totalnormal: formatNumberWithSpaces(totalCost.toFixed()),
        totalsuffix: convertToMetricPrefixes(totalCost.toFixed()),
        totalscientific: toScientificNotationFromString(totalCost.toFixed()),

        deltaTotalUpgrades: info.totalUpgrades,
        messageState: messageState,

        resource: resourceName,
        counter: getCounter()
    }

    // loop through each barral pos, get level difference and calculate

    updateCount()
    res.json({status: "success", data: data})
})

app.post('/calculateUpgradeReduction', (req,res)=>{
    const parcel = req.body.parcel
    const percent = parcel.percent
    let currentTotal = new bigNumber(parcel.current) // parseInt(parcel.current != null ? parcel.current : parcel.current.length == 0 ? 0 : 0)
    if (isNaN(currentTotal)){
        currentTotal = new bigNumber(0)
    }

    const final = new bigNumber(Math.log(percent) / Math.log(.9999)).minus(currentTotal)

    if (Number.isNaN(final)){
        res.send({status: "none",data: {counter: getCounter()}})
        return
    }

    if (final < 0){
        res.send({status: "failed", message: "Your total upgrade is too high!", data: {counter: getCounter()}})
        return
    }

    updateCount()
    res.send({status: "success", data: {required: parseInt(final), total: parseInt(final.plus(currentTotal).toFixed()),counter: getCounter()}})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
