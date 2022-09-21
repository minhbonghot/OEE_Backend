///////////////////////////////////////
//___counting product___\\
let prodTemp = 0
let productOk = dataMachine1

setInterval(() => {
    // console.log(minh)
}, 1000);

setInterval (() => {
    if (productOk == true) {
    prodTemp++
    }
}, 2000)

// setInterval (() => {
//     console.log('3' + prodTemp)
//     },60000)

initData = () => {
    let present = new Date()
    let year = present.getFullYear();
    let month = present.getMonth() + 1;
    let day = present.getDate();
    let hour = present.getHours();
    let minute = present.getMinutes();
    
    if (month < 10 || month == 0) { 
        month = `0${month}`
    } else {
        month = month
    }

    if ( day < 10|| day == 0) { 
        day = `0${day}`
    } else {
        day = day
    }
    if (hour < 10|| hour == 0) {  
        hour = `0${hour}`
    } else {
        hour = hour
    }

    if (minute < 10|| minute == 0) { 
        minute = `0${minute}`
    } else {
        minute = minute
    }


    let dateCreated = `${year}-${month}-${day}T${hour}:${minute}`
    let machineOn = dataMachine1.runSystem
    let stateStatus = dataMachine1.runMachine
    let machineNo = 'may1' //*********Dat ten may khi setup**********\\
    let lotNo = dataMachine1.lotNameNo
    let modelNo = dataMachine1.modelName
    let target = 0
    let cycleTime = dataMachine1.standartTime 
    //let prodTemp = 0
    let prodTotal = prodTemp
    let prodPassed = prodTemp
    let prodFailed = 0
    let downTimeType = dataMachine1.downTimeNo
    let oeeIndicator = 0
    let availableIndicator = 0
    let performanceIndicator = 0
    let qualityIndicator = 0

    //___calculating OEE___\\
    //A
    if (stateStatus == true) {
        availableIndicator = 1
    } else {
        availableIndicator = 0
    }
    //P
        performanceIndicator = (cycleTime*prodTemp)/600 // do cycletime nhân với 10 để khử dấu phẩy nếu giá trị cycletime là kiểu số thực, nên ta chia cho thêm cho 10
    //Q
    if (prodTemp > 0) {
        qualityIndicator = 1
    } else {
        qualityIndicator = 0
    }
    //OEE
        oeeIndicator = availableIndicator*performanceIndicator*qualityIndicator


    return prodTemp, testData = {
        machineNo: machineNo,
        lotNo,
        modelNo: modelNo,
        target: target,
        cycleTime: cycleTime,
        prodTotal: prodTotal,
        prodPassed: prodPassed,
        prodFailed: prodFailed,
        downTimeType: downTimeType,
        stateStatus: stateStatus,
        machineOn: machineOn,
        oeeIndicator: oeeIndicator,
        availableIndicator: availableIndicator,
        performanceIndicator: performanceIndicator,
        qualityIndicator: qualityIndicator,
        year: String(year),
        month: String(month),
        day: String(day),
        hour: String(hour),
        minute: String(minute),
        dateCreated: String(dateCreated),
    }
}
    
setInterval(() => {
    initData()
    // console.log(dataMachine1)
    prodTemp = 0
    testData.machineOn = false
    testData.stateStatust = false
    testData.machineNo = "0"
    testData.lotNo = "0"
    testData.modelNo = "0"
    testData.target = 0
    testData.cycleTime = 0 
    testData.prodTemp = prodTemp
    testData.prodTotal = prodTemp
    testData.prodPassed = prodTemp
    testData.prodFailed = 0
    testData.downTimeType = 0
    testData.oeeIndicator = 0
    testData.availableIndicator = 0
    testData.performanceIndicator = 0
    testData.qualityIndicator = 0
}, 1000);

