
const axios = require("axios");
const nodemon = require('nodemon')
const net = require('net')
const modbus = require('jsmodbus')
const netServer = new net.Server()
const server = new modbus.server.TCP(netServer, {
})

let connectStatus = false
server.on('connection', (client) => {
  try {
    console.log('New connection')
    connectStatus = true
  } catch (error) {
    console.log(error)
  }
})


// Regis funtion cut Hexa Code
function split(str, index) {
  const result = [str.slice(0, index), str.slice(index)]
  return result
}

// Regis Funtion convert Decimal to ASCII
function decimalToAscii(arrayData) {
  let newArray = []
  let arrayHex = arrayData.map((item) => {
    let [a, b] = split(item, 2)
    let c = [b, a]
    newArray = newArray.concat(c)
  })

  let arr = []
  let arrayAscii = newArray.map((item) => {
    let buf = Buffer.from(item, "hex")
    let c = [buf.toString('utf8')]
    arr = arr.concat(c)

  })
  let nameFinal = arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + arr[5] + arr[6] + arr[7] + arr[8] + arr[9]

  return nameFinal
}
// Regis Funtion Device Data
let dataConnected = 0
let aaaaaa = ''
let modelName = ''
let lotNameNo = ''
let downTimeNo = 0
let standartTime = 0
let cutDeviceData = function (dataDevicePLC) {
  let values = dataDevicePLC._body
  aaaaaa = values
  if (values != undefined) {
    let deviceValues = values.valuesAsArray
    // Read Model Name
    let arrModelName = [deviceValues[1].toString(16), deviceValues[2].toString(16), deviceValues[3].toString(16), deviceValues[4].toString(16), deviceValues[5].toString(16)]
    modelName = decimalToAscii(arrModelName)
    // console.log('Model Name: ', modelName)
    // Read Lot Name
    let arrLotName = [deviceValues[6].toString(16), deviceValues[7].toString(16), deviceValues[8].toString(16), deviceValues[9].toString(16), deviceValues[10].toString(16)]
    lotNameNo = decimalToAscii(arrLotName)
    // console.log ('Lot Name: ',lotNameNo)
    //Read Down time
    downTimeNo = deviceValues[12]
    // console.log('Down Time No: ',downTimeNo)

    // Read Standart Time ( Cycletime target)
    standartTime = deviceValues[13]
    // console.log('Standart Time: ', standartTime)
    // return modelName, lotNameNo, downTimeNo,standartTime

    // Check data connected
    dataConnected = deviceValues[0]

    return modelName, lotNameNo, downTimeNo, standartTime, values, dataConnected

  }
}

// Regis Funtion Coils Data
let runSystem = false
let runMachine = false
let productOK = false

let cutCoilsData = function (dataCoilsPLC) {
  let values = dataCoilsPLC._body
  if (values != undefined) {
    let coilsValues = values.valuesAsArray
    runSystem = coilsValues[0]
    runMachine = coilsValues[1]
    productOK = coilsValues[2]
  }

  return [runMachine, runSystem, productOK]
}

// Log Device Data
let deviceData
server.on('postWriteMultipleRegisters', (Device) => {
  try {
    deviceData = cutDeviceData(Device)
    return deviceData
  } catch (error) {
    console.log(error)
  }
})
// server.on('preWriteMultipleRegisters')

// Log Coils Data
let coilsData
server.on('postWriteMultipleCoils', (Coils) => {
  try {
    coilsData = cutCoilsData(Coils)
    return coilsData
  } catch (error) {
    console.log(error)
  }
})

//Write data
// let i = 0
// setInterval(() => {
//   i++
//   server.holding.writeUInt16LE(i,0)
//   if (i>200) {i=0 }
// }, 1000);


let dataMachine1 = {}
let log = setInterval(() => {
  dataMachine1 = { modelName, lotNameNo, downTimeNo, standartTime, runMachine, runSystem, productOK }
}, 200);

///////////////////////////////////////
//___counting product___\\
let prodTemp = 0
// let productOk = productOK

let confirmSignal = false
setInterval(() => {
  if (productOK == false) {
    confirmSignal = true
  }

  if (productOK == true && confirmSignal == true) {
    prodTemp++
    confirmSignal = false
  }
}, 200)

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

  if (day < 10 || day == 0) {
    day = `0${day}`
  } else {
    day = day
  }
  if (hour < 10 || hour == 0) {
    hour = `0${hour}`
  } else {
    hour = hour
  }

  if (minute < 10 || minute == 0) {
    minute = `0${minute}`
  } else {
    minute = minute
  }


  let dateCreated = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`
  let machineOn = dataMachine1.runSystem
  let stateStatus = dataMachine1.runMachine
  let machineNo = 'may1' //*********Dat ten may khi setup**********\\
  let machineNo1 = 'Optimus'
  let machineNo2 = 'BumbleBee'
  let lotNo = dataMachine1.lotNameNo
  let modelNo = dataMachine1.modelName
  let target = 0
  let cycleTime = dataMachine1.standartTime / 10   // do cycletime nhân với 10 để khử dấu phẩy nếu giá trị cycletime là kiểu số thực, nên ta chia cho thêm cho 10
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
  performanceIndicator = (cycleTime * prodTemp) / 60
  //Q
  if (prodTemp > 0) {
    qualityIndicator = 1
  } else {
    qualityIndicator = 0
  }
  //OEE
  oeeIndicator = availableIndicator * performanceIndicator * qualityIndicator


  return prodTemp,
    testData = {
      machineNo: machineNo,
      lotNo: lotNo,
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
    },
    testData1 = {
      machineNo: machineNo1,
      lotNo: lotNo,
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
    },
    testData2 = {
      machineNo: machineNo2,
      lotNo: lotNo,
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

const main = async (rawDataItem) => {
  try {
    await axios.post("https://nittan.pambu.net/api/v1/rawData", rawDataItem);
    console.log("New Data Added");
  }
  catch (error) {
    console.log(error);
  }
}

setInterval(() => {
  initData()
  console.log(testData)
  console.log(testData1)
  console.log(testData2)
  main(testData);
  main(testData1)
  main(testData2)
  prodTemp = 0
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
}, 60000);




netServer.listen(502)

