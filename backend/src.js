
  
const nodemon = require('nodemon')
const net = require('net')
const modbus = require('jsmodbus')
const  Server  = require('modbus-tcp')
const netServer = new net.Server()
const server = new modbus.server.TCP(netServer,{
})

let connectStatus = false
server.on('connection',(client)=>{
  console.log('New connection')
  connectStatus = true 
  
})


// Regis funtion cut Hexa Code
function split (str,index){
  const result = [ str.slice(0,index), str.slice(index)]
  return result
}

// Regis Funtion convert Decimal to ASCII
function decimalToAscii(arrayData) {
    let newArray = [ ]
    let arrayHex = arrayData.map((item)=>{
      let [a,b] = split(item,2)
      let c = [b,a]
      newArray = newArray.concat(c)    
    })
    
    let arr = []
    let arrayAscii = newArray.map((item)=>{
      let buf = Buffer.from(item,"hex")
      let c = [buf.toString('utf8')]
      arr = arr.concat(c)
      
    })
    let nameFinal =  arr[0]+arr[1]+ arr[2]+ arr[3]+ arr[4]+ arr[5]+ arr[6]+ arr[7]+ arr[8]+ arr[9]
    
  return nameFinal
}
// Regis Funtion Device Data
let dataConnected = 0
let aaaaaa= ''
let modelName = ''
let lotNameNo = ''
let downTimeNo  = 0
let standartTime = 0
let cutDeviceData = function (dataDevicePLC){
  let values = dataDevicePLC._body
  aaaaaa = values
  if (values != undefined){
    let deviceValues = values.valuesAsArray
    // Read Model Name
    let arrModelName = [ deviceValues[1].toString(16),deviceValues[2].toString(16),deviceValues[3].toString(16),deviceValues[4].toString(16),deviceValues[5].toString(16)]
    modelName = decimalToAscii( arrModelName) 
    // console.log('Model Name: ', modelName)
    // Read Lot Name
    let arrLotName =  [ deviceValues[6].toString(16),deviceValues[7].toString(16),deviceValues[8].toString(16),deviceValues[9].toString(16),deviceValues[10].toString(16)]
    lotNameNo = decimalToAscii(arrLotName)
    // console.log ('Lot Name: ',lotNameNo)
    //Read Down time
    downTimeNo = deviceValues[12]
    // console.log('Down Time No: ',downTimeNo)

    // Read Standart Time ( Cycletime target)
    standartTime =deviceValues[13]
    // console.log('Standart Time: ', standartTime)
    // return modelName, lotNameNo, downTimeNo,standartTime

    // Check data connected
    dataConnected = deviceValues[0]

    return  modelName,lotNameNo, downTimeNo,standartTime, values, dataConnected
    
  }  
}

// Regis Funtion Coils Data
let runSystem = false
let runMachine = false
let productOK = false

let cutCoilsData = function (dataCoilsPLC){
  let values = dataCoilsPLC._body
  if ( values != undefined){
      let coilsValues = values.valuesAsArray
      runSystem = coilsValues[0]
      runMachine = coilsValues[1]
      productOK = coilsValues[2]   
      }
      
      return [runMachine,runSystem,productOK]
}

// Log Device Data
let deviceData
server.on('postWriteMultipleRegisters',(Device)=>{
   deviceData = cutDeviceData(Device)  
  return deviceData
})
// server.on('preWriteMultipleRegisters')

// Log Coils Data
let coilsData
server.on('postWriteMultipleCoils',(Coils)=>{
  coilsData = cutCoilsData(Coils)
  return coilsData
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

dataMachine1 = {modelName,lotNameNo,downTimeNo,standartTime,runMachine,runSystem,productOK}
console.log(dataMachine1)
}, 10);
 


  

netServer.listen(502)
// setInterval(() => {
//   nodemon({ script: 'TestPLCFX5U/index.js' }).on('start', function () {
//     console.log('nodemon started');
//   }).on('crash', function () {
//     console.log('script crashed for some reason');
//   });
//   nodemon.emit('restart');
  
// }, 1000);






