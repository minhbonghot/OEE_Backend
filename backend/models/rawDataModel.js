const mongoose = require('mongoose')

const rawSchema = mongoose.Schema({
    machineNo: {
        type: Number,
        required: true
    },
    lotNo: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
    cycleTime: {
        type: Number,
        required: true
    },
    prodTotal: {
        type: Number,
        required: true
    },
    prodGood: {
        type: Number,
        required: true
    },
    prodFail: {
        type: Number,
        required: true
    },
    unplanDowntimeType: {
        type: Number,
        required: true
    },
    planDowntimeType: {
        type: Number,
        required: true
    },
    runStatus: {
        type: Boolean,
        required: true
    },
    OEE: {
        type: Number,
        required: true
    },
    A: {
        type: Number,
        required: true
    },
    P: {
        type: Number,
        required: true
    },
    Q: {
        type: Number,
        required: true
    },
}, { timestamp: true }
)

module.exports = mongoose.model('rawData', rawSchema)