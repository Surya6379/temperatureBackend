const { users, tempData, testData } = require("../Model/Schema");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "suryasivaram135@gmail.com",
    pass: "ebvb vpmt crvb fnjf",
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// 1. GET http://localhost:3000/users? emailId =< emailId >
exports.getDetails = async (req, res) => {
  try {
    const detail = await users.findOne({ emailId: req.params.email }, {});
    // console.log(detail);
    if (detail == null) {
      res.status(201).json({
        status: "Fail",
        data: detail,
      });
    } else {
      res.status(201).json({
        status: "Successfully fetched user",
        data: detail,
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "Fail",
    });
  }
};

// 2. POST http://localhost:3000/users
exports.registerUser = async (req, res) => {
  try {
    let data = req.body;
    const emailDetails = await users.find({ emailId: req.body.emailId });
    const userDetails = await users.find({ userID: req.body.userID });
    if (emailDetails.length > 0) {
      res.status(409).json({
        successFlag: false,
        message: "Email ID already registered",
      });
    } else if (userDetails.length > 0) {
      res.status(409).json({
        successFlag: false,
        message: "User ID already registered",
      });
    } else {
      const allUsers = await users.find({});
      data["id"] = allUsers.length + 1;
      const detail = await users.create(data);
      if (detail) {
        res.status(201).json({
          successFlag: true,
          message: "Successefully registered user",
          data: detail,
        });
      } else {
        res.status(404).json({
          successFlag: false,
          message: "Cant register the user",
        });
      }
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      error: err,
    });
  }
};

// 3. GET http://localhost:3000/users? emailId =< emailId >& password =< password >
exports.loginUser = async (req, res) => {
  try {
    const detail = await users.findOne({ userId: req.body.userId });
    if (detail == null) {
      res.status(400).json({
        successFlag: false,
        message: "User Name not registered",
      });
    } else if (detail.password != req.body.password) {
      res.status(400).json({
        successFlag: false,
        message: "Credentials are wrong",
      });
    } else {
      res.status(201).json({
        successFlag: true,
        message: "Login successful",
        data: detail,
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cant login try again later",
    });
  }
};

exports.addDevice = async (req, res) => {
  try {
    let data = req.body;
    const deviceDetails = await tempData.find({ deviceID: req.body.deviceID });
    if (deviceDetails.length > 0) {
      let details = await tempData.findOneAndUpdate(
        { deviceID: req.body.deviceID },
        { userID: req.body.userID, roomName: req.body.roomName }
      );
      if (details) {
        res.status(201).json({
          successFlag: true,
          message: "Device Updated",
        });
      }
    } else {
      let details = await tempData.create(data);
      if (details) {
        res.status(200).json({
          successFlag: true,
          message: "Successefully registered device",
        });
      } else {
        res.status(404).json({
          successFlag: false,
          message: "Cant register the device",
        });
      }
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      successFlag: false,
      error: err,
    });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const deviceDetails = await tempData.find({ userID: req.params.userID });
    if (deviceDetails.length > 0) {
      res.status(201).json({
        successFlag: true,
        message: "Devices Fetched Successfully",
        data: deviceDetails,
      });
    } else {
      res.status(404).json({
        successFlag: false,
        message: "No Devices available",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      error: err,
    });
  }
};

exports.updateTemp = async (req, res) => {
  try {
    let reqData = req.body,
      date = getCurrentDate();
    console.log(reqData);
    const device = await tempData.findOne({ deviceID: reqData.deviceID });
    if (device) {
      let deviceData = device.data;
      if (deviceData) {
        let givDateData = deviceData.find((item) => item.date === date);
        givDateData?.data?.push({
          value: reqData.data,
          time: getCurrentTime(),
        });
        let sum = 0;
        givDateData?.data?.forEach((item) => (sum += Number(item.value)));
        let avg = sum / givDateData?.data?.length;
        givDateData["avg"] = avg;
      } else {
        deviceData = [
          {
            date: date,
            data: [
              {
                value: reqData.data,
                time: getCurrentTime(),
              },
            ],
            avg: reqData.data,
          },
        ];
      }
      device.data = deviceData;
      const updatedData = await tempData.findOneAndReplace(
        { deviceID: reqData.deviceID },
        device
      );
      if (updatedData) {
        res.status(201).json({
          successFlag: true,
          message: "Successefully updated temperature",
        });
      } else {
        res.status(404).json({
          successFlag: false,
          message: "Cant update",
        });
      }
    } else {
      res.status(404).json({
        successFlag: false,
        message: "Device does not exist",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "error",
      successFlag: false,
      error: err,
    });
  }
};

// exports.updateTemp = async (req, res) => {

//     try {
//         let data = req.body
//         const deviceDetails = await tempData.find({ deviceId: req.body.deviceId })
//         if (deviceDetails.length > 0) {
//             let details = await tempData.findOneAndUpdate({ deviceId: req.body.deviceId },
//                 { value: req.body.value });
//             if (details) {
//                 res.status(201).json({
//                     successFlag: true,
//                     message: "Temperature Updated"
//                 })
//             }
//         }
//         else {
//             res.status(404).json({
//                 successFlag: false,
//                 message: "Device Not Found"
//             })
//         }
//     } catch (err) {
//         res.status(404).json({
//             status: "error",
//             successFlag: false,
//             error: err
//         })
//     }
// }

function getCurrentDate() {
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "-" + mm + "-" + yyyy;
}

function getCurrentTime() {
  let currentDate = new Date();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return String(hours + ":" + minutes + ":" + seconds);
}
