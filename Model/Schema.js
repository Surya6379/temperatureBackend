const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection successful!"));

const userSchema = new mongoose.Schema({
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  userID: {
    type: String,
    unique: true,
    required: true,
  },
  mobileNo: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
});

const temperatureDataSchema = new mongoose.Schema({
  deviceID: {
    type: String,
    required: true,
    unique: true,
  },
  userID: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
  },
  data: {},
});

const testSchema = new mongoose.Schema({
  id: {
    type: String,
  },
});

const users = mongoose.model("users", userSchema);
const tempData = mongoose.model("tempData", temperatureDataSchema);
const testData = mongoose.model("testData", testSchema);
module.exports = { users, tempData, testData };
