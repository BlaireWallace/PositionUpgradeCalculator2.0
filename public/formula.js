var bigInt = require("big-integer");
var bigNumber = require("bignumber.js");

const { toScientificNotationFromString, formatNumberWithSpaces, convertToMetricPrefixes } = require("../public/numberFormat")

function getGoldenScrapLevel_(level) {
    if (level <= 400) {
        return Math.pow(10, 9) * level;
    } else if (level <= 500) {
        return 1.05 * Math.pow(10, 9) * level;
    } else {
        let ceil = Math.ceil((level - 500.0) / 100.0);
        return 1.05 * Math.pow(1.2, ceil) * (Math.pow(10, 9) * level);
    }
}

function getStarFragmentLevel_(level) {
    if (level <= 10) {
        return Math.pow(10, 4) * level;
    }
    let ceil = Math.ceil(level / 10.0);
    if (ceil % 2 === 0) { // even
        return Math.pow(10, 4) * level * Math.pow(2, Math.ceil(level / 20.0));
    } else if (ceil % 2 !== 0) { // odd
        return Math.pow(10, 4) * level * Math.pow(2, Math.ceil(level / 20.0)) * (3 / 4.0);
    } else {
        return 0;
    }
}

function getMasteryLevel_(level) {
    if (level <= 500) {
        return level;
    } else {
        let exp = (level - 500) / 100.0;
        return level * Math.pow(level, exp);
    }
}

function getMagnetLevel_(level) {
    return 2.5 * Math.pow(10, 6) * Math.pow(1.15, level - 1) * level;
}

function getWrenchesLevel_(level) {
    return Math.pow(10, 9) * Math.pow(1.075, level - 1) * level;
}

function getGoldenScrapLevel(level) {
    if (level <= 400) {
        return new bigNumber(10).pow(9).multipliedBy(level)
        // return Math.pow(10, 9) * level;
    } else if (level <= 500) {
        return new bigNumber(1.05).multipliedBy(new bigNumber(10).pow(9)).multipliedBy(level)
        // return 1.05 * Math.pow(10, 9) * level;
    } else {
        let ceil = Math.ceil((level - 500.0) / 100.0);
        return new bigNumber(1.05).multipliedBy(new bigNumber(1.2).pow(ceil)).multipliedBy(new bigNumber(10).pow(9)).multipliedBy(level)
        // return 1.05 * Math.pow(1.2, ceil) * (Math.pow(10, 9) * level);
    }
}

function getStarFragmentLevel(level) {
    if (level <= 10) {
        let m1 = new bigNumber(10).pow(4) 
        return m1.multipliedBy(level)
        // return Math.pow(10, 4) * level;
    }
    let ceil = Math.ceil(level / 10.0);
    let m1 = new bigNumber(10).pow(4)
    let m2 = new bigNumber(level)
    let m3 = new bigNumber(2).pow(Math.ceil(level/20))
    let m4 = new bigNumber(3).dividedBy(4)
    if (ceil % 2 === 0) { // even
        return m1.multipliedBy(m2).multipliedBy(m3)
        // return Math.pow(10, 4) * level * Math.pow(2, Math.ceil(level / 20.0));
    } else if (ceil % 2 !== 0) { // odd
        return m1.multipliedBy(m2).multipliedBy(m3).multipliedBy(m4)
        // return Math.pow(10, 4) * level * Math.pow(2, Math.ceil(level / 20.0)) * (3 / 4.0);
    } else {
        return 0;
    }
}

function getMasteryLevel(level) {
    if (level <= 500) {
        return level;
    } else {
        let m1 = new bigNumber(level - 500).dividedBy(100)
        return new bigNumber(level).multipliedBy(2).pow(m1)
        // return level * Math.pow(level, exp);
    }
}

function getMagnetLevel(level) {
    let m1 = new bigNumber(2.5)
    let m2 = new bigNumber(10).pow(6)
    let m3 = new bigNumber(1.15).pow(level-1)
    let m4 = new bigNumber(level)
    return m1.multipliedBy(m2).multipliedBy(m3).multipliedBy(m4)
    // return 2.5 * Math.pow(10, 6) * Math.pow(1.15, level - 1) * level;
}

function getWrenchesLevel(level) {
    let m1 = new bigNumber(10).pow(9)
    let m2 = new bigNumber(1.075).pow(level-1)
    let m3 = new bigNumber(level)
    return m1.multipliedBy(m2).multipliedBy(m3)
    // return Math.pow(10, 9) * Math.pow(1.075, level - 1) * level;
}

function test(){

    // for (let i = 1; i<2;i++){

    // }
    // const l = 2
    // let m1 = new bigNumber(10).pow(4) 

    // // console.log(m1.toString())
    // // console.log(m2.toString())
    // // console.log(m3.toString())
    // // console.log(m4.toString())

    // let result = m1.multipliedBy(l)
    // console.log("result: " + result)

    // console.log(toScientificNotationFromString(result.toString()))
}


module.exports = {
    getGoldenScrapLevel,
    getStarFragmentLevel,
    getMasteryLevel,
    getMagnetLevel,
    getWrenchesLevel,
    test,
}