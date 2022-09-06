const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const rawDataModel = require("./models/rawDataModel");
const { fakeData } = require("./fakeData");
const {
  DOWNTIME_UNPLANNED_SETTING_MACHINE,
} = require("./constants/downtimeType");

const app = express();

connectDB();

let count = 0;
const length = fakeData.length;

const addData = async ({ count }) => {
  try {
    console.log(count);
    console.log(length);
    if (count === length) {
      console.log("====DONE====");
      return null;
    }
    const data = await rawDataModel.create(fakeData[count]);

    // const data = await rawDataModel.find({
    //     downtimeType: DOWNTIME_UNPLANNED_SETTING_MACHINE
    // })
    console.log("Data Created_________");
    setTimeout(() => {
      // add data to db
      count++;
      addData({ count });
    }, 60000);
  } catch (error) {
    console.error(error);
  }
};
app.get("/api/seedData", (req, res) => {
  addData({ count });
  //   setTimeout(() => {
  //     // add data to db
  //     addData({ count });
  //   }, 60000);
});
app.listen(port, () => console.log(`Server started on port ${port}`));
