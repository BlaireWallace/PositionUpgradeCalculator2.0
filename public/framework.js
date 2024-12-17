
export function get(){
    return Widgets
} 

function print(t){
    console.log(t)
}

// Get all the widgets and put it in a dictionary
var Widgets = {}

// load Current resources
const currentResouceText = document.getElementById("currentResourceTxt")
const resourceDiv = document.getElementById("resourceDiv")

const resources = [
    "goldenScrap",
    "starFragments",
    "masteryTokens",
    "magnets",
    "wrench",
]

const resourceItemFrame = document.getElementById("resourceDiv").querySelector("#itemFrame")
let resourceItems = {}
for (let i=0; i < resources.length; i++){
    const name = resources[i]
    const clone = resourceItemFrame.cloneNode(true);

    clone.querySelector("img").src = `./resource/images/${name}.png`
    resourceDiv.appendChild(clone)

    resourceItems[name] = clone
}
resourceDiv.removeChild(resourceItemFrame)

// Remember Levels
const rememberLevelDiv = document.getElementById("rememberLevelDiv")

// Number Format
let numberFormatItems = {}
const numberFormatDiv = document.getElementById("numberFormatDiv")
const numberFormatButton = numberFormatDiv.querySelector("div").querySelector("button")
const formatTypes = ["Normal","Suffix","Scientific"]

for (let i=0;i<formatTypes.length;i++){
    const name = formatTypes[i]
    const clone = numberFormatButton.cloneNode(true)

    clone.innerText = name
    numberFormatDiv.querySelector("div").appendChild(clone)

    numberFormatItems[name] = clone
}
numberFormatDiv.querySelector("div").removeChild(numberFormatButton)

// position reduction input
const posReductionInput = document.getElementById("posReductionDiv").querySelector("input")

const masteryReductionDiv = document.getElementById("masteryReductionDiv")

// current resource input
const currentResourceInput = {
    "input": document.getElementById("currentResourceDiv").querySelector("input"),
    "image": document.getElementById("currentResourceDiv").querySelector("div").querySelector("img")
}

// current total upgrade position
const currentTotalUpgradeInput = document.getElementById("currentUpgradeTotalDiv").querySelector("div").querySelector("input")
const reductionPercentText = document.getElementById("currentUpgradeTotalDiv").querySelectorAll("span")[1]
reductionPercentText.innerHTML = ""

// Barrel Upgrade div
const posUpgradeDiv = document.getElementById("posUpgradeDiv")
const posUpgradeSection = posUpgradeDiv.querySelector("div")

let posUpgradeValue = {}

function newUpgradeDiv(name){
    let barrels = {}
    const cloneDiv = posUpgradeSection.cloneNode(true)
    const barrelFrame = cloneDiv.querySelector("#chart").querySelector("div")
    const column = 4
    const row = 5

    cloneDiv.querySelector("span").innerHTML = name || "null container"

    // barral position
    for (let x = 1; x<row+1; x++){
        barrels[x] = {}
        for (let y = 1; y<column+1; y++){
            const barrelClone = barrelFrame.cloneNode(true)
            cloneDiv.querySelector("#chart").appendChild(barrelClone)
            barrels[x][y] = barrelClone
        }
    }

    // buttons
    const chartDesc = cloneDiv.querySelector("#chartDesc")
    const rowcoldiv = chartDesc.querySelector("#SetRowColumnDiv")
    const setValuesDiv = chartDesc.querySelector("#setValuesDiv")
    let controls = {
        "buttons": {
            "setrowcol": rowcoldiv.querySelector("#setRowColumnValue").querySelector("button"),
            "setall": setValuesDiv.querySelectorAll("div")[0].querySelector("button"),
            "reset": setValuesDiv.querySelectorAll("div")[1].querySelectorAll("button")[0],
            "clone": setValuesDiv.querySelectorAll("div")[1].querySelectorAll("button")[1],
            "add": setValuesDiv.querySelectorAll("div")[2].querySelectorAll("button")[0],
            "sub": setValuesDiv.querySelectorAll("div")[2].querySelectorAll("button")[1]
        },
        "inputs": {
            "row": rowcoldiv.querySelector("#setRowValue").querySelector("input"),
            "column": rowcoldiv.querySelector("#setColumnValue").querySelector("input"),
            "rowcolumnLevel": rowcoldiv.querySelector("#setRowColumnValue").querySelector("input"),
            "setall": setValuesDiv.querySelectorAll("div")[0].querySelector("input")
        }
    }

    barrelFrame.style.display = "none"
    posUpgradeDiv.appendChild(cloneDiv)
    return {
        "controls": controls,
        "barrels": barrels
    }
}

const currentLevels = newUpgradeDiv("Current Levels")
const targetLevels = newUpgradeDiv("Target Levels")

posUpgradeSection.style.display = "none"

// Status text for posupgrades
const posUpgradeStatusText = document.getElementById("posupgradeStatusText")

// the visual requirements div
const requirementsDiv = document.getElementById("requirementsDiv")
const extraResourceText = document.getElementById("extraResourceText")

// visual total upgrade desc
const totalUpgradeDesc = {
    "current": document.getElementById("totalUpgradeDescDiv").querySelectorAll(".totalupgradeDescDiv")[0],
    "now": document.getElementById("totalUpgradeDescDiv").querySelectorAll(".totalupgradeDescDiv")[1]
}

const reductionInput = {
    "input": document.getElementById("currentTotalUpgradesInput").querySelector("div").querySelector("input"),
    "copy": document.getElementById("currentTotalUpgradesInput").querySelector("div").querySelector("button")
}

const targetReductionInput = document.getElementById("targetTotalUpgradesInput")

const totalUpgradeStatusText = document.getElementById("totalupgradeStatusText")

const requireTotalUpgradeText = document.getElementById("totalupgradeRequirementsDiv")

// -------------
// Setting all widgets to dictionary

// Resource input
Widgets["Resource"] = {
    "currentResourceTxt": currentResouceText,
    "items": resourceItems
}

// Rememeber level
Widgets["rememberLevel"] = rememberLevelDiv

// Number Format
Widgets["NumberFormat"] = {
    "text": numberFormatDiv.querySelector("span"),
    "items": numberFormatItems
}

// position reduction input
Widgets["positionReductionInput"] = posReductionInput

Widgets["masteryReductionDiv"] = masteryReductionDiv

// current resource input
Widgets["currentResourceInput"] = currentResourceInput

// current total upgrade input
Widgets["totalUpgradeInput"] = {
    "input": currentTotalUpgradeInput,
    "txt": reductionPercentText
}

// Barrel div
Widgets["posUpgrades"] = {
    "current": currentLevels,
    "target": targetLevels
}

Widgets["posUpgradeStatusText"] = posUpgradeStatusText

Widgets["requirementsDiv"] = requirementsDiv
Widgets["extraResourceText"] = extraResourceText

Widgets["totalUpgradeDesc"] = totalUpgradeDesc

Widgets["reductionInput"] = reductionInput

Widgets["targetReductionInput"] = targetReductionInput

Widgets["totalUpgradeStatusText"] = totalUpgradeStatusText

Widgets["requireTotalUpgradeText"] = requireTotalUpgradeText
