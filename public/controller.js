import {get} from "./framework.js"

const prefixes = [
    { symbol: 'NTR', factor: 1e123 }, { symbol: 'OTR', factor: 1e120 }, { symbol: 'sTR', factor: 1e117 },{ symbol: 'STR', factor: 1e114 }, { symbol: 'qTR', factor: 1e111 }, { symbol: 'QTR', factor: 1e108 },{ symbol: 'TTR', factor: 1e105 }, { symbol: 'DTR', factor: 1e102 },{ symbol: 'UTR', factor: 1e99 }, { symbol: 'Tr', factor: 1e96 }, { symbol: 'NV', factor: 1e93 }, { symbol: 'OV', factor: 1e90 }, { symbol: 'sV', factor: 1e87 },{ symbol: 'Sp', factor: 1e84 }, { symbol: 'SV', factor: 1e81 }, { symbol: 'qV', factor: 1e78 },{ symbol: 'QV', factor: 1e75 }, { symbol: 'TV', factor: 1e72 },{ symbol: 'DV', factor: 1e69 }, { symbol: 'UV', factor: 1e66 }, { symbol: 'V', factor: 1e63 }, { symbol: 'ND', factor: 1e60 }, { symbol: 'OD', factor: 1e57 },{ symbol: 'sD', factor: 1e54 }, { symbol: 'SD', factor: 1e51 }, { symbol: 'qD', factor: 1e48 },{ symbol: 'QD', factor: 1e45 }, { symbol: 'TD', factor: 1e42 },{ symbol: 'DD', factor: 1e39 }, { symbol: 'UD', factor: 1e36 }, { symbol: 'D', factor: 1e33 }, { symbol: 'N', factor: 1e30 }, { symbol: 'O', factor: 1e27 },{ symbol: 's', factor: 1e24 }, { symbol: 'S', factor: 1e21 }, { symbol: 'q', factor: 1e18 },{ symbol: 'Q', factor: 1e15 }, { symbol: 'T', factor: 1e12 },{ symbol: 'B', factor: 1e9 }, { symbol: 'M', factor: 1e6 }
];

function print(t){
    console.log(t)
}

let data = {
    // currency: data
}
data["currentTotalUpgrade"] = 0
data["formatType"] = null
data["resourceInput"] = {}

let serverData = {

}

let Widgets = get()

let CURRENT_RESOURCE = ""
const resources = {
    "goldenScrap": "Golden Scrap",
    "starFragments": "Star Fragments",
    "masteryTokens": "Mastery Tokens",
    "magnets": "Magnets",
    "wrench": "Wrench"
}

const resourceColors = {
    "goldenScrap": "orange",
    "starFragments": "yellow",
    "masteryTokens": "orange",
    "magnets": "red",
    "wrench": "lightgray"
}

function getImage(name){
    return `./resource/images/${name}.png`
}

function getBarrelsInformation(state){
    const inputs = state == "current" ? Widgets.posUpgrades.current.controls.inputs : state == "target" ? Widgets.posUpgrades.target.controls.inputs : null
    const barrels = state == "current" ? Widgets.posUpgrades.current.barrels : state == "target" ? Widgets.posUpgrades.target.barrels : null
    if (!inputs || !barrels){
        return
    }

    if (inputs.row.value >= 6 || !Number.isInteger(parseInt(inputs.row.value))){inputs.row.value = null}
    if (inputs.column.value >= 5 || !Number.isInteger(parseInt(inputs.column.value))){inputs.column.value = null}

    const rowPos = inputs.row.value || 0
    const columnPos = inputs.column.value || 0
    const level = inputs.rowcolumnLevel.value || 0
    return {rowpos: rowPos, columnPos: columnPos, level: level, inputs: inputs, barrels: barrels}
}

function setBarrelLevel(state, row, column, input, level){
    if (level < 0){level = 0}
    data[CURRENT_RESOURCE]["barrels"][state][row][column] = parseInt(level)

    if (level == 0){
        input.value = null
        return
    }
    input.value = parseInt(level)
}

function setResource(name){
    if (resources[name] == null){
        return
    }

    const BARREL_MASTERY_RED = {"magnets":18,"wrench":19,"starFragments":20}
    // hide barrel master pos upgrade
    if (BARREL_MASTERY_RED[name]){
        Widgets.masteryReductionDiv.style.display = "Flex"
        Widgets.masteryReductionDiv.querySelectorAll("span")[1].innerHTML = `(Barrel Mastery Level ${BARREL_MASTERY_RED[name]})`

        if (data["masteryReduction"] == null){
            data["masteryReduction"] = {}
        }

        if (data["masteryReduction"][name]){            
            Widgets.masteryReductionDiv.querySelector("input").value = parseFloat(data["masteryReduction"][name] || 1)
        }
        else{
            Widgets.masteryReductionDiv.querySelector("input").value = 1 // default
        }

    }
    else{
        Widgets.masteryReductionDiv.style.display = "None"
    }
    

    const resourcename = resources[name]
    CURRENT_RESOURCE = name
    // set current resource text
    Widgets.Resource.currentResourceTxt.innerHTML = "Current Currency: "+ resourcename

    // change picture in amount input
    Widgets.currentResourceInput.image.src = getImage(name)

    // update current resouce input
    if (data["resourceInput"][CURRENT_RESOURCE] && data["resourceInput"][CURRENT_RESOURCE].str){
        Widgets.currentResourceInput.input.value = data["resourceInput"][CURRENT_RESOURCE].str
    }
    else{
        data["resourceInput"][CURRENT_RESOURCE] = {}
        Widgets.currentResourceInput.input.value = ""
    }

    // create data
    if (data[name] == null){
        data[name] = {}
    }

    if (data[name]["barrels"] == null){
        // create barrel data
        data[name]["barrels"] = {}
        data[name]["barrels"]["current"] = {}
        data[name]["barrels"]["target"] = {}
        for (let row=0+1;row<5+1;row++){
            data[name]["barrels"]["current"][row] = {}
            data[name]["barrels"]["target"][row] = {}
            for (let column=0+1;column<4+1;column++){
                data[name]["barrels"]["current"][row][column] = 0
                data[name]["barrels"]["target"][row][column] = 0
            }
        }
    }

    // change the barrels color to the resource color
    for (let row=0+1;row<5+1;row++){
        for (let column=0+1;column<4+1;column++){
            const currentBarrel = Widgets.posUpgrades.current.barrels[row][column]
            const targetBarrel = Widgets.posUpgrades.target.barrels[row][column]

            const colour = resourceColors[name] || "white"

            currentBarrel.querySelector("input").style.color = colour
            targetBarrel.querySelector("input").style.color = colour

            currentBarrel.querySelector("input").style.setProperty('--placeholder-color',resourceColors[name] || "white")
            targetBarrel.querySelector("input").style.setProperty('--placeholder-color',resourceColors[name] || "white")

            const style = document.createElement('style');
            style.innerHTML = `
                .barrelInputLevel::placeholder {
                    color: ${colour};
                    opacity: 1; /* Optional: fully visible */
                }
            `    
            document.head.appendChild(style);


            // set values
            setBarrelLevel("current",row,column,currentBarrel.querySelector("input"),data[name]["barrels"]["current"][row][column])
            setBarrelLevel("target",row,column,targetBarrel.querySelector("input"),data[name]["barrels"]["target"][row][column])
        }
    }

    // change requirement picture
    Widgets.requirementsDiv.querySelector("img").src = getImage(name)

    const vT = ["current","target"]
    // reset row column inputs
    for (let i=0;i<vT.length;i++){
        Widgets.posUpgrades[vT[i]].controls.inputs.row.value = null
        Widgets.posUpgrades[vT[i]].controls.inputs.column.value = null
        Widgets.posUpgrades[vT[i]].controls.inputs.rowcolumnLevel.value = null
        rowcolumnValueChanged(vT[i])
    }

    updateToServer()
}

function numberFormatChanged(name){
    Widgets.NumberFormat.text.innerHTML = "Number Format: " + name
    data["formatType"] = name

    updatePositionUpgradeUI()
}

function rowcolumnValueChanged(state){
    const info = getBarrelsInformation(state)
    if (!info) { return }

    const rowPos = info.rowpos
    const columnPos = info.columnPos
    const level = info.level
    const barrels = info.barrels
    const inputs = info.inputs

    // for (let row=0+1;row<5+1;row++){
    //     for (let column=0+1; column<4+1;column++){
    //     }
    // }

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){

            let newRow = rowPos == 0 ? row : rowPos
            let newColumn = columnPos == 0 ? column : columnPos

            if (row == newRow && column == newColumn){
                // same row same column
                barrels[row][column].style.border = "1px solid white"
            }
            else{
                // not the target position
                 barrels[row][column].style.border = "0px solid white"
            }            
        }
    }
}

function barrelValueChanged(state, row, column, input){
    if (input.value < 0 || !Number.isInteger(parseInt(input.value))){
        setBarrelLevel(state,row,column,input,0)
    }
    setBarrelLevel(state,row,column,input,input.value)
    updateToServer()
}

function setrowcolValues(state){ // state may be current or target
    const info = getBarrelsInformation(state)
    if (!info) { return }
    
    const rowPos = info.rowpos
    const columnPos = info.columnPos
    const level = info.level
    const barrels = info.barrels
    const inputs = info.inputs

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){

            let newRow = rowPos == 0 ? row : rowPos
            let newColumn = columnPos == 0 ? column : columnPos
            // if row is 0 and column != 0 then set all rows respect to column
            setBarrelLevel(state,newRow,newColumn,barrels[newRow][newColumn].querySelector("input"), level)
        }
    }
    updateToServer()
}

function setAllValues(state){
    const info = getBarrelsInformation(state)
    if (!info) { return }
    
    const barrels = info.barrels
    const level = info.inputs.setall.value || 0

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){
            setBarrelLevel(state,row,column,barrels[row][column].querySelector("input"), level)
        }
    }
    updateToServer()
}

function resetBarrelLevels(state){
    const info = getBarrelsInformation(state)
    if (!info) { return }
    
    const barrels = info.barrels
    const level = info.inputs.setall.value || 0

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){
            setBarrelLevel(state,row,column,barrels[row][column].querySelector("input"), 0)
        }
    }
    updateToServer()
}

function barrelAdditive(state,n){
    const info = getBarrelsInformation(state)
    if (!info) { return }
    
    const barrels = info.barrels
    const level = n

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){
            const l = parseInt(barrels[row][column].querySelector("input").value) || 0
            setBarrelLevel(state,row,column,barrels[row][column].querySelector("input"),l + level)
        }
    }
    updateToServer()
}

function cloneBarrels(state){
    let t = ["current","target"]
    let current = null
    let target = null
    t.forEach(a=>{
        if (state == a){
            current = a
        }
        else{
            target = a
        }
    })

    const currentInfo = getBarrelsInformation(current)
    const targetInfo = getBarrelsInformation(target)
    if (!currentInfo || !targetInfo) { return }
    
    const currentBarrels = currentInfo.barrels
    const targetBarrels = targetInfo.barrels

    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){
          setBarrelLevel(state,row,column,currentBarrels[row][column].querySelector("input"), targetBarrels[row][column].querySelector("input").value)
        }
    }
    updateToServer()
}


function upgradeCostReductionChanged(input){
    // update server
    const max = 20
    let d = parseFloat(input.value.replace("%",''))
    if (Number.isNaN(d)){
        input.value = null
        data["reductionPercent"] = 0
        return
    }

    if (d<0){
        d = 0
    }
    else if(d>max){
        d = max
    }

    input.value = "%" + d

    data["reductionPercent"] = d

    updateToServer()
}
  
function currentResourceInputChanged(){
    // check if the input is in proper format
    const text = Widgets.currentResourceInput.input.value.toString()

    let value = null
    let s = null
    
    if (/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text)){
        // the input is a number or a scientific
        value = parseFloat(text)
        s = text
    } // if number is a suffix
    else {
        const regex = /^([\d.]+)([a-zA-Z]+)$/; // Capture number and suffix
        const match = text.match(regex);
    
        if (match) {
            const numberPart = parseFloat(match[1]);
            const suffix = match[2];
            
            // Find the matching prefix factor
            const prefix = prefixes.find(p => p.symbol === suffix);
            
            if (prefix) {
                value = numberPart * prefix.factor;
                s = text
            }
        }
    }

    Widgets.currentResourceInput.input.style.color = text.length == 0 ? "black" : !value ? "red" : "black"

    data["resourceInput"][CURRENT_RESOURCE] = {
        data: value,
        str: text
    }

    if (text.length == 0){
        saveData()
    }

    if (value != null){
        updateToServer()
    }
}

function currentTotalUpgradeChanged(){
    const input = Widgets.totalUpgradeInput.input
    let n = parseInt(input.value)
    if (n <= 0){
        n = 0
        Widgets.totalUpgradeDesc.current.style.display = "none"
    }
    else{
        Widgets.totalUpgradeDesc.current.style.display = "flex"
    }

    if (!Number.isNaN(n)){
        input.value = n
    }
    else{
        Widgets.totalUpgradeDesc.current.style.display = "flex"
    }
    
    // update server (get reduction number)
    data["currentTotalUpgrade"] = n

    let rednum = Math.pow(.9999,n).toFixed(4) 
    rednum = rednum > .01 ? rednum : .01
    const currentReduction = rednum

    const total_ = serverData["deltaTotalUpgrades"] + data["currentTotalUpgrade"]
    let newrednum = Math.pow(.9999,total_).toFixed(4) 
    newrednum = newrednum > .01 ? newrednum : .01
    const newReduction = newrednum

    // change Current total upgrades text
    Widgets.totalUpgradeDesc.current.querySelectorAll("h2")[1].innerHTML = n + " [% " + currentReduction + " ]"

    // Widgets.totalUpgradeDesc.now.innerHTML = "e" + " [% some reduction]"
    // total upgrade requirement
    if (!data["currentTotalUpgrade"] || data["currentTotalUpgrade"] == 0){
        Widgets.totalUpgradeDesc.current.style.display = "none"
    }
    else{
        Widgets.totalUpgradeDesc.current.style.display = "flex"
    }

    if (!serverData["deltaTotalUpgrades"] || serverData["deltaTotalUpgrades"] == 0){
        Widgets.totalUpgradeDesc.now.style.display = "none"
    }
    else{
        Widgets.totalUpgradeDesc.now.style.display = "flex"

        Widgets.totalUpgradeDesc.now.querySelectorAll("h2")[1].innerHTML = total_ + "(+"+serverData["deltaTotalUpgrades"]+") [" + newReduction + "]"
    }

    saveData()
}

// update to server
async function updateToServer(){

    try{
        Widgets.posUpgradeStatusText.innerHTML = "Status: Calculating"
        Widgets.posUpgradeStatusText.style.color = "yellow"

        const response = await fetch("/calculate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parcel: {
                    data: data[CURRENT_RESOURCE].barrels,
                    resource: CURRENT_RESOURCE,
                    reductionPercent: data.reductionPercent || 0,
                    resourceAmountInput: data["resourceInput"][CURRENT_RESOURCE].data,
                    masteryReduction: data["masteryReduction"][CURRENT_RESOURCE] || 1
                },
            }) 
        })

        const result = await response.json()
        // update front end value
        if (result.status != "success"){
            displayStatusMessage(false,result.message)
        }
        else{
            displayStatusMessage(true)
        }

        serverData = result.data
        updatePositionUpgradeUI()

        saveData()
    } catch (error){
        Widgets.posUpgradeStatusText.innerHTML = "Status: SYSTEM ERROR"
        Widgets.posUpgradeStatusText.style.color = "red"
    }
}

function displayStatusMessage(status,str){
    Widgets.posUpgradeStatusText.innerHTML = status ? "Status: Good" : "Status: " +  str
    Widgets.posUpgradeStatusText.style.color = status ? "lime" : "red"
}

function updatePositionUpgradeUI(){
    const requirementText = Widgets.requirementsDiv.querySelectorAll("h2")[0]
    const requirementPostText = Widgets.requirementsDiv.querySelectorAll("h2")[1]
    const extraResourceText = Widgets.extraResourceText
    extraResourceText.style.display = "none"

    if (serverData["resource"] == CURRENT_RESOURCE && serverData["total"+data.formatType.toLowerCase()] && serverData["messageState"]){
        // set value
        const numTotal = serverData["total"+data.formatType.toLowerCase()]
        const finalTotal = serverData["final"+data.formatType.toLowerCase()]
        if (serverData["messageState"] == "noState"){
            requirementText.innerHTML = "You need: " + numTotal
            requirementPostText.innerHTML = ""
        }
        else if (serverData["messageState"] == "enough" && finalTotal && numTotal){
            extraResourceText.style.display = "block"

            requirementText.innerHTML = "You have: " + finalTotal
            requirementPostText.innerHTML = "left"
            extraResourceText.innerHTML = "Total Cost: " + numTotal
        }
        else if (serverData["messageState"] == "notenough" && finalTotal && numTotal){
            requirementText.innerHTML = "You need: " + finalTotal
            requirementPostText.innerHTML = "more"        
        }
    }
    else{
        // reset requirement text
        requirementText.innerHTML = ""
        requirementPostText.innerHTML = ""   
    }

    currentTotalUpgradeChanged()
    document.getElementById("countTracker").innerHTML = `This calculator has been calculated ${serverData.counter} times!`
}

async function reductionrateInputChanged(){
    let input = Widgets.targetReductionInput.querySelector("div").querySelector("input")

    if (/^\d*\.?\d*$/.test(input.value) && input.value[0] == "." && !Number.isNaN(input.value)) {
        if (Number.isInteger(parseInt(input.value[1]))){
            try{
                Widgets.totalUpgradeStatusText.innerHTML = "Status: Calculating"
                Widgets.totalUpgradeStatusText.style.color = "yellow"

                const reductionInputValue = Widgets.reductionInput.input.value != null ? Widgets.reductionInput.input.value : 0
                const response = await fetch("/calculateUpgradeReduction", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        parcel: {
                            percent: input.value,
                            current: reductionInputValue
                        },
                    }) 
                })
        
                const result = await response.json()
                document.getElementById("countTracker").innerHTML = `This calculator has been calculated ${result.data.counter} times!`

                if (result.status == "success"){
                    Widgets.requireTotalUpgradeText.style.display = "flex"
                    Widgets.requireTotalUpgradeText.querySelectorAll("h2")[0].innerHTML = "You need " + result.data.required
                    Widgets.requireTotalUpgradeText.querySelectorAll("h2")[1].innerHTML = "more upgrades [" + result.data.total + "]"
                    Widgets.totalUpgradeStatusText.innerHTML = "Status: Good"
                    Widgets.totalUpgradeStatusText.style.color = "lime"
                }
                else if (result.status == "failed"){
                    Widgets.requireTotalUpgradeText.style.display = "none"
                    Widgets.totalUpgradeStatusText.innerHTML = "Status: " + result.message
                    Widgets.totalUpgradeStatusText.style.color = "red"
                }
                else{}
            }catch (error){

            }
        }
    }
    else{
        input.value = input.value.slice(0, -1);
        Widgets.totalUpgradeStatusText.innerHTML = "Status: Good"
        Widgets.totalUpgradeStatusText.style.color = "lime"
        Widgets.requireTotalUpgradeText.style.display = "none"
    }

    data["curentTotalUpgrade2"] = Widgets.reductionInput.input.value
    data["targetReductionInput"] = input.value
    saveData()
}

// click connection for buttons
for (let name in Widgets.Resource.items){
    const button = Widgets.Resource.items[name]

    button.addEventListener("click", function(){
        setResource(name)
    })
}

// number format changed
for (let name in Widgets.NumberFormat.items){
    const item = Widgets.NumberFormat.items[name]
    item.addEventListener("click", function(){
        numberFormatChanged(name)
    })
}

// reduction rate changed function
Widgets.positionReductionInput.addEventListener("input",function(){
    upgradeCostReductionChanged(Widgets.positionReductionInput,Widgets.positionReductionInput.value)
})

// resource input changed
Widgets.currentResourceInput.input.addEventListener("input", currentResourceInputChanged)

Widgets.totalUpgradeInput.input.addEventListener("input", function(){
    currentTotalUpgradeChanged()
})

// setting barrels vales
const vT = ["current","target"]
for (let i=0;i<vT.length;i++){
    // set row column button clicked
    Widgets.posUpgrades[vT[i]].controls.buttons.setrowcol.addEventListener("click",function(){
       setrowcolValues(vT[i])
    }) 
    // set all button clicked
    Widgets.posUpgrades[vT[i]].controls.buttons.setall.addEventListener("click",function(){
        setAllValues(vT[i])
     }) 
    // reset button clicked
    Widgets.posUpgrades[vT[i]].controls.buttons.reset.addEventListener("click",function(){
        resetBarrelLevels(vT[i])
     }) 

    // additive button
    Widgets.posUpgrades[vT[i]].controls.buttons.add.addEventListener("click",function(){
        barrelAdditive(vT[i],-1)
    }) 
    // sub button
    Widgets.posUpgrades[vT[i]].controls.buttons.sub.addEventListener("click",function(){
        barrelAdditive(vT[i],1)
    }) 

    // clone button
    Widgets.posUpgrades[vT[i]].controls.buttons.clone.addEventListener("click",function(){
        cloneBarrels(vT[i],1)
    }) 

    // row input changed
    Widgets.posUpgrades[vT[i]].controls.inputs.row.addEventListener("input",function(){
        rowcolumnValueChanged(vT[i])
    })
    // column input changed
    Widgets.posUpgrades[vT[i]].controls.inputs.column.addEventListener("input",function(){
        rowcolumnValueChanged(vT[i])
    })
    rowcolumnValueChanged(vT[i])

    // barrel input changed
    for (let row=0+1;row<5+1;row++){
        for (let column=0+1; column<4+1;column++){
            Widgets.posUpgrades[vT[i]].barrels[row][column].querySelector("input").addEventListener("input",function(){
                barrelValueChanged(vT[i], row, column, Widgets.posUpgrades[vT[i]].barrels[row][column].querySelector("input"))
            })
        }
    }
}

// Position Upgrade Reduction Calculator
Widgets.reductionInput.copy.addEventListener("click", function(){
    Widgets.reductionInput.input.value = data["currentTotalUpgrade"] != null ? data["currentTotalUpgrade"] : 0
    reductionrateInputChanged()
})

Widgets.reductionInput.input.addEventListener("input", reductionrateInputChanged)

Widgets.targetReductionInput.querySelector("div").querySelector("input").addEventListener("input", function(){
    reductionrateInputChanged()
})

Widgets.masteryReductionDiv.querySelector("input").addEventListener("input", function(){
    // mastery reduction changed (only applies wrench, magnets, and frags)
    if (data["masteryReduction"] == null){
        data["masteryReduction"] = {}
    }

    const BARREL_MASTERY_RED = ["magnets","wrench","starFragments"]
    // hide barrel master pos upgrade
    if (BARREL_MASTERY_RED.includes(CURRENT_RESOURCE)){
        data["masteryReduction"][CURRENT_RESOURCE] = parseFloat(Widgets.masteryReductionDiv.querySelector("input").value)
    }

    updateToServer()
})

Widgets.calculatePositionUpgradeButton.addEventListener("click", function(){
    updateToServer()
})

Widgets.calculateTotalUpgradeButton.addEventListener("click", function(){
    reductionrateInputChanged()
})

Widgets.rememberLevel.querySelector("input").addEventListener("input", function(){
    const bool = Widgets.rememberLevel.querySelector("input").checked

    data["rememberme"] = bool
    saveData()
})

function saveData(){
    if (data["rememberme"] == true) {
        localStorage.setItem("user",JSON.stringify(data))
    }
}

function loadData(){
    const value = JSON.parse(localStorage.getItem("user"))

    if (value != null){
        data = value
        console.log(data)
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(){
    const seconds = 1
    while (true) {
        try{
            const response = await fetch("/data", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    
            const result = await response.json()
            document.getElementById("countTracker").innerHTML = `This calculator has been calculated ${result.data} times!`
        }catch (error){

        }
        await delay(1000 * seconds)
    }
}

function detectPageCloseOrReload() {
    window.addEventListener("beforeunload", (event) => {
        // event.preventDefault();
        if (data["rememberme"]){
            saveData()
        }
        else{
           localStorage.clear()
        }
    });
}

 // Check if data exists on page load
 window.addEventListener("load", () => {
    loadData()

    Widgets.targetReductionInput.querySelector("div").querySelector("input").value = data["targetReductionInput"] != null ? data["targetReductionInput"] : null
    Widgets.rememberLevel.querySelector("input").checked = data["rememberme"]

    Widgets.positionReductionInput.value = data["reductionPercent"] != null ? "%" + data["reductionPercent"] : null

    Widgets.totalUpgradeInput.input.value = data["currentTotalUpgrade"] != null ? data["currentTotalUpgrade"] : null

    Widgets.reductionInput.input.value = data["curentTotalUpgrade2"] != null ? data["curentTotalUpgrade2"] : null


    setResource("goldenScrap") // default
    displayStatusMessage(true)
    numberFormatChanged("Suffix")
    updatePositionUpgradeUI()
    reductionrateInputChanged()
    
});

detectPageCloseOrReload()

run()
