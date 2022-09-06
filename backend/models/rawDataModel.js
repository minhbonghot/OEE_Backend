const mongoose = require("mongoose");

const rawDataSchema = mongoose.Schema(
  {
    machineNo: {
      type: String,
      required: true,
    },
    lotNo: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    cycleTime: {
      type: Number,
      required: true,
    },
    prodTotal: {
      type: Number,
      required: true,
    },
    prodPassed: {
      type: Number,
      required: true,
    },
    prodFailed: {
      type: Number,
      required: true,
    },
    downTimeType: {
      type: Number, // 1-19 unplanned ; 20-29 planned
      required: true,
      default: 0,
    },
    stateStatus: {
      type: Boolean,
      required: true,
    },
    oeeIndicator: {
      type: Number,
      required: true,
    },
    availableIndicator: {
      type: Number,
      required: true,
    },
    performanceIndicator: {
      type: Number,
      required: true,
    },
    qualityIndicator: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rawData", rawDataSchema);
