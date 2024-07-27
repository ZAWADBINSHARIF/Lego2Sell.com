const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./db/connection");
const mongoose = require("mongoose");
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { Parser } = require("json2csv");
const Token = require("./models/token");
const { verifyToken } = require("./middleware/jwt");
const sendEmail = require("./utils/Sendemail.js");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/order");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const GetQuote = require("./models/GetQuote");
const Getorder = require("./models/Getorder");
const uuid = require("uuid");
const moment = require("moment");
const json2csv = require("json2csv").Parser;
const ExcelJS = require("exceljs");
const pdflib = require("pdf-lib");
const { degrees, PDFDocument, rgb, StandardFonts } = pdflib;
const download = require("downloadjs");
// routes
const crypto = require("crypto");
const legoRoute = require("./routes/lego");
const jwt = require("jsonwebtoken");
const AccountDetails = require("./models/AccountDetails");
const UserData = require("./models/UserData");
const MyDetails = require("./models/MyDetails");
const SearchItem = require("./models/Search");
const User = require("./models/user.model");
const fetch = require("node-fetch");
const CryptoJS = require('crypto-js');
const { Config } = require("./config.js");
const { isAdminUser } = require("./utils/adminUser.js");

const keysecret =
  Config.JWTSECRET.SECRET;
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Allow specific origins
const allowedOrigins = [
  'https://www.lego2sell.com',
  'https://lego2sell.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowedOrigins array
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));

const authRoutes = express.Router();

// using routes
app.use("/", legoRoute);

mongoose.connect(
  "mongodb+srv://lego2sell:2xgT5yICDBIn1z1T@cluster0.x8j4tbk.mongodb.net/lego2sell",
  // "mongodb+srv://lego2sell:m3xZnjcAv.!sAyp@cluster0.x8j4tbk.mongodb.net/lego2sell",
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
// connectToDatabase()
const db = mongoose.connection;

// Once connected, log a message
db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
// app.use("/auth", authRoute)
// app.use("/users", userRoute)
app.listen(5100, () => {
  console.log(`SERVER RUNNING ON PORT ${5100}`);
});

var transport = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "support@lego2sell.com",
    pass: "PzpUTS4NtGCWO0sY",
  },
});
app.post("/signup", async (req, res) => {
  try {
    console.log("test");
    const { email, password } = req.body;

    const encryptedData = req.header('source');
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    if (decryptedData !== expectedData) {
      return res.status(400).json({ message: 'Unauthorized request.' });
    }

    // Generate a unique ID for the user
    const userId = uuid.v4();

    // Check if the email already exists
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", email });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the generated ID
    const newUser = new UserData({
      userId: userId,
      email,
      password: hashedPassword,
      admin: "user",
    });
    await newUser.save();

    // Retrieve the _id value of the new user document
    const newUserId = newUser._id;

    return res
      .status(201)
      .json({ message: "Signup successful", userId: newUserId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/update-email/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { newEmail } = req.body;

    // Check if the new email already exists
    const existingUser = await UserData.findOne({ email: newEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", email: newEmail });
    }

    // Update the email
    await UserData.findByIdAndUpdate(userId, { email: newEmail });

    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await UserData.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the email and password are valid, generate a token or perform any other login logic
    // Here you can generate a JWT (JSON Web Token) for authentication, if needed

    return res
      .status(200)
      .json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

// Save user data by ID
app.post("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    // Find the user by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's data
    user.data = data;
    await user.save();

    return res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// Retrieve user data by ID
app.get("/GetOrder", async (req, res) => {
  try {
    // const { id } = req.params

    // Find the user by ID
    const user = await UserData.find({});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Find the user by token
    const user = await UserData.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate the token
    user.token = null;
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/get_Quote/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = new GetQuote(req.body);

    // Find the user by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's data
    user.data = data;
    await user.save();

    return res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/MyDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = new MyDetails(req.body);

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Update the user details
    user.Mydetails = data;
    await user.save();

    return res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Function to generate a random 7-digit offer ID
const generateOfferId = () => {
  const min = 1000000; // Minimum 7-digit number
  const max = 9999999; // Maximum 7-digit number
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const handleModifyPdf = async (timestamp, offerId) => {
  const url = "https://lego2sell.com/completpdf.pdf";

  const response = await fetch(url);
  if (!response.ok) {
    return res.status(500).send(`HTTP error! Status: ${response.status}`);
  }

  const existingPdfBytes = await response.arrayBuffer();

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const firstPage = pages[1];
  const { width, height } = firstPage.getSize();
  firstPage.drawText(`${timestamp}`, {
    x: 220,
    y: 240,
    size: 18,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  const second = pages[1];
  const { width1, height1 } = second.getSize();
  firstPage.drawText(`#${offerId}`, {
    x: 220,
    y: 200,
    size: 18,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
  // Trigger the browser to download the PDF document
};
app.get("/download-pdf", async (req, res) => {
  try {
    const { timestamp, offerId } = req.query;
    const pdfBytes = await handleModifyPdf(timestamp, offerId);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=completePdf.pdf");

    // Send the modified PDF as a response
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating or sending PDF:", error);
    res.status(500).send(`Error :${error}`);
  }
});
app.post("/Getorder/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Add one hour to the new date object
    // updatedTimestamp.setHours(updatedTimestamp.getHours())
    const data = new Getorder({
      ...req.body,
      timestamp: new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
      }),
    });

    const offerId = generateOfferId();

    data.offerId = offerId;
    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User details not found" });
    }

    // Push the new order into the existing user.Order array
    user.Order.push(data);
    await user.save();


    const mailOptions = {
      from: "noreply@lego2sell.com",
      to: user.email,
      subject: "Offer Summary",
      html: ` <div style="word-spacing:normal;background-color:#eeeeee">
      <div style="background-color:#eeeeee">

          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100% ">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                              <div
                                  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="background:#ffffff;background-color:#ffffff;width:100%">
                                      <tbody>
                                          <tr>
                                              <td
                                                  style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                                                  <div class="m_-1190145159820946285mj-column-per-100"
                                                      style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          role="presentation" style="vertical-align:top" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td align="center"
                                                                      style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                                      <table border="0" cellpadding="0"
                                                                          cellspacing="0" role="presentation"
                                                                          style="border-collapse:collapse;border-spacing:0px">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td style="width:244px">
                                                                                      <img height="auto"
                                                                                          src="https://drive.google.com/uc?export=download&id=13lX7daaiEy6d24Chj_LPqAz8g6c3-pzh"
                                                                                          style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px"
                                                                                          width="244"
                                                                                          class="CToWUd a6T"
                                                                                          data-bit="iit" tabindex="0">
                                                                                      <div class="a6S" dir="ltr"
                                                                                          style="opacity: 0.01; left: 846px; top: 160px;">
                                                                                          <div id=":o5"
                                                                                              class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
                                                                                              role="button"
                                                                                              tabindex="0"
                                                                                              aria-label="Download attachment "
                                                                                              jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc3MTkyOTc2MDQ3ODI0MzkwMSIsbnVsbCxbXV0."
                                                                                              data-tooltip-class="a1V"
                                                                                              data-tooltip="Download">
                                                                                              <div class="akn">
                                                                                                  <div
                                                                                                      class="aSK J-J5-Ji aYr">
                                                                                                  </div>
                                                                                              </div>
                                                                                          </div>
                                                                                      </div>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </div>

                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                              <div
                                  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="background:#ffffff;background-color:#ffffff;width:100%">
                                      <tbody>
                                          <tr>
                                              <td
                                                  style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                                                  <div class="m_-1190145159820946285mj-column-per-100"
                                                      style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          role="presentation" style="vertical-align:top" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td align="center"
                                                                      style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                                      <div
                                                                          style="font-size:16px;font-weight:500;
                                                                      line-height:30px;text-align:left;color:#000000">
                                                                          HI ${user.Mydetails[0].firstName}
                                                                          <br /><br />

                                                                          Thank you for choosing Lego®2sell to sell
                                                                          your new LEGO® set to Us. Please find below
                                                                          your Offer summary, and don’t forget to go
                                                                          over our packaging checklist in the
                                                                          <b>download and print label</b> tab below
                                                                          before you send your item to make sure it
                                                                          reaches us in tip-top condition.
                                                                          <br /><br />

                                                                          We look forward to receiving your LEGO® Set.
                                                                          <br /><br />

                                                                          Regards <br />
                                                                          LEGO®2sell
                                                                      </div>

                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </div>

                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div <div
                                  style=" background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                  style="background:#ffffff;background-color:#ffffff;width:100%">
                                  <tbody>
                                      <tr>
                                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">

                                              <div class="m_-1190145159820946285mj-column-per-100"
                                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                                  <table border="0" cellpadding="0" cellspacing="0"
                                                      role="presentation" style="vertical-align:top" width="100%">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center"
                                                                  style="font-size:0px;padding:10px 15px;padding-bottom:0;word-break:break-word">
                                                                  <div
                                                                      style="font-size:26px;font-weight:700;text-align:center;color:#000000; width:100%">
                                                                      Offer Summary</div>
                                                                      <div style="font-size: 18px; text-align:center; width:100%; margin-top: 10px;">
                                                                      <a href="https://www.lego2sell.com/my-account">Check Status</a></div>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>

                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
          </div>

          <table cellspacing="0" cellpadding="0" style="width: 80%; margin: 0px auto; font-family: Arial, sans-serif; background-color: #ffffff;">
          <tr >
              <td>
                  <h3 style="font-size: 1.125rem;font-weight: bold;margin-bottom: 1rem;text-align: center; width: 100%;">${data.ProductName}: ${data.ProductId}</h3>
                  <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 1rem; text-align: center; width: 100%;">Offer ID: #${data.offerId}</h3>
                  <div style="border-radius: 9999px; font-size: 1rem; padding: 0.5rem 1rem; font-weight: bold; background-color: #3B82F6; color:white; width: 100%; text-align:center">${data.Status}</div>
              </td>
          </tr>
          <tr style="height:1rem;"></tr>
          <tr style="margin-top:20px;">
              <td style="font-size: 1.125rem; background-color: #F8F8FE; padding: 1.5rem; margin-top: 5px; border-radius: 1rem;">
                  <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%;">
                      <tr>
                          <td style="text-align: left;">Date & Time</td>
                          <td style="text-align: right; white-space: nowrap;">${data.timestamp}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- No. of Items -->
                      <tr style="padding-bottom: 1rem;">
                          <td style="text-align: left;">No. of items</td>
                          <td style="text-align: right; white-space: nowrap;">${data.noItems}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- Delivery Method -->
                      <tr style="padding-bottom: 1rem;">
                          <td style="text-align: left;">Delivery Method</td>
                          <td style="text-align: right; white-space: nowrap;">${data.Deliverymethod ? data.Deliverymethod : "Drop off"}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- Status -->
                      <tr>
                          <td style="text-align: left;">Status</td>
                          <td style="text-align: right; white-space: nowrap;">${data.Status}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- Payment Method -->
                      <tr>
                          <td style="text-align: left;">Payment Method</td>
                          <td style="text-align: right; white-space: nowrap;">${user.Mydetails[0].paymentMethod}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- Condition -->
                      <tr style="padding-bottom: 1rem;">
                          <td style="text-align: left;">Condition</td>
                          <td style="text-align: right; white-space: nowrap;">${data.setCondition}</td>
                      </tr>
                      <tr style="height: 1rem;"></tr>
                      <!-- Horizontal Line -->
                      <tr>
                          <td colspan="2"><hr style="margin-top: 1rem;"></td>
                      </tr>
                      <!-- Total Offer Value -->
                      <tr>
                          <td style="font-weight: bold; font-size: 1.125rem; text-align: left;">Total offer value</td>
                          <td style="font-weight: bold; text-align: right; white-space: nowrap; font-size: 1.125rem; color: #706AEA;">£${data.Price}</td>
                      </tr>
                  </table>
                  <div style="cursor: pointer; width: 100%; margin-top: 1rem; text-align: center;">
                  <a href="https://api.lego2sell.com/download-pdf?timestamp=${data.timestamp}&offerId=${data.offerId}"
                     style="display: block; width: 100%; padding: 12px 0; border-radius: 1rem; background-color: #3B82F6; color: white; font-weight: bold; font-size: 18px; text-align: center; text-decoration: none;">Download and print label</a>
              </div>

              </td>
          </tr>
      </table>









          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:50px 20px;text-align:center">

                              <div class="m_-1190145159820946285mj-column-per-100"
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>
                                          <tr>
                                              <td align="center"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:30px;font-weight:800;line-height:40px;text-align:center;color:#000000">
                                                      LEGO2Sell.com - The best place to sell Your New LEGO® Sets
                                                      online</div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:0 20px;text-align:center">

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>

                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">
                                                      High payouts</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">
                                                      We pride ourselves on offering the highest price for your new
                                                      LEGO® sets online.</div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>
                                      </tbody>
                                  </table>
                              </div>

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>

                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">
                                                      Next-day payments</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">
                                                      Need your money fast? we'll send you your payment the same day
                                                      we accept your new LEGO® set.</div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:0 20px;text-align:center">

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>

                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">
                                                      Postage Refund </div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">
                                                      We will give you up to £2.49 for each LEGO® set we
                                                      accept.<br><br></div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>
                                      </tbody>
                                  </table>
                              </div>

                              <div
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>
                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">
                                                      Totally hassle-free</div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td align="left"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                                  <div
                                                      style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">
                                                      We Buy your new LEGO® Sets with no fees or delayed payments, No
                                                      customer returns or hassle - simply box it, send it and get
                                                      paid. </div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>




          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                              <div class="m_-1190145159820946285mj-column-per-100"
                                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top" width="100%">
                                      <tbody>
                                          <tr>
                                              <td align="center"
                                                  style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word">
                                                  <div
                                                      style="font-size:15px;font-weight:400;line-height:1;text-align:center;color:#87888f">
                                                      <p style="margin:0 auto;line-height:1.5">Sent by LEGO®
                                                          LEGO2sell.com email system; this address is not monitored
                                                          for response. Please direct all enquiries to:
                                                          support@lego2sell.com.
                                                          Visit us online at lego2sell.com to turn your New LEGO® Sets
                                                          into cash.</p>
                                                  </div>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div style="background:#6c65e2;background-color:#6c65e2;margin:0px auto;max-width:600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background:#6c65e2;background-color:#6c65e2;width:100%">
                  <tbody>

                      <td align="center"
                          style="direction:ltr;font-size:0px;padding:20px 0;padding-top:50px;text-align:center">
                          <div class="m_-1190145159820946285mj-column-per-100"
                              style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                              <div border="0" cellpadding="0" cellspacing="0" role="presentation"
                                  style="vertical-align:top;" width="100%">


                                  <div align="center"
                                      style="font-size:0px;padding:0px 25px;padding-bottom:10px;word-break:break-word">
                                      <div
                                          style="font-size:24px;font-weight:800;line-height:1.3;text-align:center;color:#fff">
                                          <a style="color:#fff" href="mailto:Support@lego2sell.com"
                                              target="_blank">Support@lego2sell.com</a>
                                      </div>
                                  </div>

                              </div>
                          </div>

                      </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div style="margin-top: 20px;display:flex;align-items:center;justify-content: center;">
                <div style="display:flex;justify-content:center;align-items:center;gap: 90px;">
                    <a href="https://gfabhgf.r.bh.d.sendibt3.com/tr/cl/5IjHwDQyEheGHlEmH7UZsbkuCMW7wls2nzat6x4qIO9HUxjGUyv-IASII8-eBXR3Wqnmu3TI6wOtAf71KPFoeen6Y04LTjWzlTtX-sKYKlmQOrQy3VzuO2ApVsM_X67fg1wd2EAScpWRStGXlIwn0Q9CNRXKSzwqd03xvmAy2KeDvBDlWn3cRiQUybtHLJzIs-XYYwVtXTvTtTgrtc1LjLFHmFkzp-Kx16ZFDiinquN5MhxK2B4Qg5u1UvvpPvll2SfUqZgbUU0s4K8_wSBMDFTD5cYEXg2wRxvylK0oI4XuORJcSb4">
                        <img style="width:60px; height:60px;" src="https://img-cache.net/im/6501765/3e9b6470ac44a09fdd26f8512f2e2169e69ddf5363d517b341cc5486bbce2529.png?e=9dX3-NgYHe_d_Ocq6EAM5SptXaGSg6nSAMVKA-ohUf0NAhySrUbBfaHG0LoxZPBUq3Jo8HS2CQ1v9594P94KLJ2OdsV_wB6nb3mocQyfMjPVWQfCI6PCnu2_mJT76KbQ06iEMLxKKjW1v3gzVH4UHas1vTLuN0XVGyn69YrL7SszzjPwWre7O3PDyVD9x4sTdPwU-FYxOkYH6KoYILMIiuv3IufIgeJUiH9ey-s_duZX_B4eainC4wuO8Q9Xjte2iaobhiTqD6Tdygop-CTBDbfwLrsS4BPgQ47aUcjF4f6SpHC2g9GkWIfs-bEdQqknabkUk6TYr9y2fVCybFnNQtQAM1ExgW72pV0">
                    </a>
                    <a style="margin-left:20px;" href="https://gfabhgf.r.bh.d.sendibt3.com/tr/cl/HPaeNbLNeyGwi17jyz6PoAzixjvWDfjTz1nH0xRNaq9DdgzcLGb68JGrUa_635LhU5JScVNiYznsgeZa_2tsQA5HyrVvjNZE_FMlcPF3f8n8EPjc1K1FgHAi1uUGMnD5pviD_hZoDw_yLQ7UmLYRt3h5bC7rpgTi3v6MoSWtT2nWS2AiX1JT7Kc5FUDHaFVdPctHQTrQU4N_c_GVgMv53Sz0RR1PxuvsBezhV8FzPCgC2y1O-1p07RuY">
                        <img style="width:60px;height:60px;margin-left:20px" src="https://img-cache.net/im/6501765/3600d0d16664ec8a1dfe6b589b7a6411855800ade8232ec8771d405385b62ee9.png?e=OSZm70Mexs78q64dyX07fYgn_MzvxUFh1wbUQKZUGdCziD-tDOdCp4RwCSaulhJk8AaJz_qqHX58Z9l_nOkB1CVEKbFGll_iRRHlZslTc5-vJu-KI6V4NStTNT0NTPKKGBEpNN5phLipxS0SE0IS6VzQADZRIZirtQyR28-UGsCLTtMPM7DDK_YnMxeLCQJdCyJf1LHIZRB-M2rXumQlmKUNTtC4W6B6GZUjW52wYq3fh-jbi2ZXZAP2wEnJndXi3HKSX8IM9xY8RQUfAKrIoP15hsQsRR2bLtI">
                </a></div><a style="margin-left:20px;" href="https://gfabhgf.r.bh.d.sendibt3.com/tr/cl/HPaeNbLNeyGwi17jyz6PoAzixjvWDfjTz1nH0xRNaq9DdgzcLGb68JGrUa_635LhU5JScVNiYznsgeZa_2tsQA5HyrVvjNZE_FMlcPF3f8n8EPjc1K1FgHAi1uUGMnD5pviD_hZoDw_yLQ7UmLYRt3h5bC7rpgTi3v6MoSWtT2nWS2AiX1JT7Kc5FUDHaFVdPctHQTrQU4N_c_GVgMv53Sz0RR1PxuvsBezhV8FzPCgC2y1O-1p07RuY">
            </a>
          </div>






          </td>
          </tr>
          </tbody>
          </table>
      </div>

  </div>

  <br><img
      src="https://ci4.googleusercontent.com/proxy/2qzrSYIHO_Dx7Ktrw95Rr8WgHrdsbdoxzFkke8wYu1cP4uCRE2xJQR2EEjS6d1YUkgsyMlndVAU4RxEQIZw-xiSsuUVARgB9BPKmQpVl_nVjEpEvZv-Pr45tEozhM6_QX6gXtAGajK2WwHz34djmE9A4qPQTH9u4uRV-r79IDzhBu_BTazSfe-s=s0-d-e1-ft#https://x5lns.mjt.lu/oo/BAAABFeYYHMAAAAAAAAAAQ78zosAAYCsfx0AAAAAABFh-QBkuPi-4Cjf8uMdSoGCbEqwqkkU7wABkMI/1175b2fc/e.gif"
      height="1" width="1" alt="" border="0" style="height:1px;width:1px;border:0" class="CToWUd" data-bit="iit"
      jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
  <div class="yj6qo"></div>
  <div class="adL">
  </div>
  </div>

  <script src="" async defer></script>`,

    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error", error);
      } else {
        console.log("Email sent", info.response);
      }
    });

    return res
      .status(200)
      .json({ message: "Data saved successfully", offerId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/Search/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = new SearchItem(req.body);

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Update the user details
    user.Search = data;
    await user.save();

    return res.status(200).json({ message: "Data saved successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/Getorder/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Retrieve the user's orders
    const orders = user.Order;

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/Mydetails/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Retrieve the user's orders
    const Mydetails = user.Mydetails;

    return res.status(200).json({ Mydetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/Mydetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newValue } = req.body; // Assuming the new value is sent in the request body

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Update the Mydetails property with the new value
    user.Mydetails = newValue;

    // Save the updated user details
    await user.save();

    return res.status(200).json({ message: "Mydetails updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/Getorder/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { orderId, Status } = req.body;
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Find the order in the user's Order array by orderId
    const order = user.Order.find((o) => o._id.toString() === orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status of the order
    order.Status = Status;

    user.markModified("Order"); // Mark the Order array as modified
    await user.save();

    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create a model based on the schema
const FormData = mongoose.model("contactusSubmit", formDataSchema);

// app.post("/contactus/submit", (req, res) => {
//   const { name, email, message } = req.body

//   // Create a new FormData document
//   const formData = new FormData({
//     name: name,
//     email: email,
//     message: message,
//   })

//   // Save the form data to MongoDB
//   formData
//     .save()
//     .then(() => {
//       console.log("Form data saved successfully!")
//       res.send("Form submitted successfully!")
//     })
//     .catch((error) => {
//       console.error("Error saving form data:", error)
//       res.send("An error occurred while submitting the form.")
//     })
// })

app.get("/contactus/submit", (req, res) => {
  FormData.find()
    .then((submissions) => {
      res.render("submissions", { submissions });
    })
    .catch((error) => {
      console.error("Error retrieving form submissions:", error);
      res.send("An error occurred while retrieving form submissions.");
    });
});

const transporter1 = nodemailer.createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: " passwordreset@lego2sell.com",
    pass: "e9cc2ee67b0f5bd287349f1e",
  },
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.forwardemail.net",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "noreply@lego2sell.com",
//     pass: "3S,Mh&;R&^Zz",
//   },
// })
// send email Link For reset Password
app.post("/sendpasswordlink", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }

  try {
    const userfind = await UserData.findOne({ email: email });
    // token generate for reset password

    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: "20m",
    });

    const setusertoken = await UserData.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: "noreply@lego2sell.com",
        to: email,
        subject: "Password reset requested",
        text: `This Link Valid For 2 MINUTES https://lego2sell.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
        html: `<div style="word-spacing:normal;background-color:#eeeeee">
  <div style="background-color:#eeeeee">

    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

              <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                    <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                        <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                    <tbody>
                                      <tr>
                                        <td style="width:244px">
                                          <img height="auto" src="https://drive.google.com/uc?export=download&id=13lX7daaiEy6d24Chj_LPqAz8g6c3-pzh" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="244" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 846px; top: 160px;"><div id=":o5" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc3MTkyOTc2MDQ3ODI0MzkwMSIsbnVsbCxbXV0." data-tooltip-class="a1V" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>




<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

          <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:34px;font-weight:800;line-height:50px;text-align:center;color:#000000">Password Recovery</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

          <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:18px;font-weight:400;line-height:33px;text-align:center;color:#87888f">A request has been made to reset your password. If you have not made this request please <a style="color:#6c65e2;font-weight:700;text-decoration:none" href="https://lego2sell.com/contact" target="_blank" data-saferedirecturl="https://lego2sell.com/contact">Contact Us</a></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

          <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:15px;word-break:break-word">
                    <div  style="font-size:20px;font-weight:800;line-height:25px;text-align:center;color:#000000">Your Reset Link</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

          <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:0 30px;word-break:break-word">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;width:90%;line-height:100%">
                      <tbody><tr>
                                                      <td align="center" bgcolor="#0066ff" role="presentation" style="border:none;border-radius:10px;height:50px;background:#0066ff" valign="middle">
                              <a href="https://lego2sell.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}" style="display:inline-block;background:#0066ff;color:#ffffff;font-size:20px;font-weight:600;line-height:28px;margin:0;text-decoration:none;text-transform:none;padding:22px 0;border-radius:55px" target="_blank" data-saferedirecturl="https://lego2sell.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}"> Reset Password </a>
                            </td>
                                                </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:50px 20px;text-align:center">

          <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:30px;font-weight:800;line-height:40px;text-align:center;color:#000000"> LEGO2Sell.com - The best place to sell Your New LEGO® Sets online</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:0 20px;text-align:center">

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>

                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">High payouts</div>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">We pride ourselves on offering the highest price for your new LEGO® sets online.</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
              </tbody>
            </table>
          </div>

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>

                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">Next-day payments</div>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">Need your money fast? we'll send you your payment the same day we accept your new LEGO® set.</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
    <tbody>
      <tr>
        <td style="direction:ltr;font-size:0px;padding:0 20px;text-align:center">

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>

                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">Postage Refund </div>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">We will give you up to £2.49 for each LEGO® set we accept.<br><br></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
              </tbody>
            </table>
          </div>

          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:20px;font-weight:800;line-height:25px;text-align:left;color:#000000">Totally hassle-free</div>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word">
                    <div style="font-size:15px;font-weight:400;line-height:25px;text-align:left;color:#87888f">We Buy your new LEGO® Sets with no fees or delayed payments, No customer returns or  hassle - simply box it, send it and get paid. </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </td>
      </tr>
    </tbody>
  </table>
</div>




              <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
                  <tbody>
                    <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">

                        <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word">
                                  <div style="font-size:15px;font-weight:400;line-height:1;text-align:center;color:#87888f">
                                    <p style="margin:0 auto;line-height:1.5">Sent by LEGO® LEGO2sell.com email system; this address is not monitored for response. Please direct all enquiries to: support@lego2sell.com.
Visit us online at lego2sell.com to turn your New LEGO® Sets into cash.</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style="background:#6c65e2;background-color:#6c65e2;margin:0px auto;max-width:600px">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#6c65e2;background-color:#6c65e2;width:100%">
                  <tbody>

                      <td align="center" style="direction:ltr;font-size:0px;padding:20px 0;padding-top:50px;text-align:center">
                        <div class="m_-1190145159820946285mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                          <div border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;display:flex" width="100%">


                                <div align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word">
                                  <div style="font-size:24px;font-weight:800;line-height:1.3;text-align:center;color:#fff"><a style="color:#fff" href="mailto:Support@lego2sell.com" target="_blank">Support@lego2sell.com</a></div>
                                </div>


<div style="display:flex;align-items:center;justify-content:center;">
    <div style="display:flex;justify-content:center;align-items:center;gap: 90px;">
         <a href="https://www.facebook.com/people/Lego2sell/61550272267735/?mibextid=LQQJ4d">
            <img style="width:60px; height:60px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" />
        </a>
        <a style="margin-left:20px;" href="https://www.tiktok.com/@lego2sell.com">
            <img  style="width:60px;height:60px;margin-left:20px" src="https://static-00.iconduck.com/assets.00/tik-tok-icon-2048x2048-mmnsrcbe.png" />
    </div>
</div>


                          </div>
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>






            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

<br><img src="https://ci4.googleusercontent.com/proxy/2qzrSYIHO_Dx7Ktrw95Rr8WgHrdsbdoxzFkke8wYu1cP4uCRE2xJQR2EEjS6d1YUkgsyMlndVAU4RxEQIZw-xiSsuUVARgB9BPKmQpVl_nVjEpEvZv-Pr45tEozhM6_QX6gXtAGajK2WwHz34djmE9A4qPQTH9u4uRV-r79IDzhBu_BTazSfe-s=s0-d-e1-ft#https://x5lns.mjt.lu/oo/BAAABFeYYHMAAAAAAAAAAQ78zosAAYCsfx0AAAAAABFh-QBkuPi-4Cjf8uMdSoGCbEqwqkkU7wABkMI/1175b2fc/e.gif" height="1" width="1" alt="" border="0" style="height:1px;width:1px;border:0" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."><div class="yj6qo"></div><div class="adL">
</div></div>`,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: error });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
});

// verify user for forgot password time
app.get("/forgotpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  const encryptedData = req.header('source');
  // Encryption key (must match the key used for encryption)
  const encryptionKey = 'legotwosell';

  // Decrypt the data
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  // Compare the decrypted data with a known value
  const expectedData = 'frontend';

  if (decryptedData !== expectedData) {
    return res.status(400).json({ message: 'Unauthorized request.' });
  }

  try {
    const validuser = await UserData.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    console.log(verifyToken);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// change password

app.post("/forgotpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const encryptedData = req.header('source');
  // Encryption key (must match the key used for encryption)
  const encryptionKey = 'legotwosell';

  // Decrypt the data
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  // Compare the decrypted data with a known value
  const expectedData = 'frontend';

  if (decryptedData !== expectedData) {
    return res.status(400).json({ message: 'Unauthorized request.' });
  }

  try {
    // Find the user by ID and verify token
    const validUser = await UserData.findOne({ _id: id, verifytoken: token });

    // Verify the token
    const verifyToken = jwt.verify(token, keysecret);

    if (validUser && verifyToken._id) {
      // Hash the new password
      const newPassword = await bcrypt.hash(password, 12);

      // Update the user's password in the database
      const updatedUser = await UserData.findByIdAndUpdate(
        { _id: id },
        { password: newPassword }
      );

      // Save the updated user data
      await updatedUser.save();

      // Respond with a success message
      res
        .status(201)
        .json({ status: 201, message: "Password reset successful" });
    } else {
      // Invalid user or token
      res
        .status(401)
        .json({ status: 401, message: "User not exist or invalid token" });
    }
  } catch (error) {
    // Error handling
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
});

// app.post("/forgotpassword/:id/:token", async (req, res) => {
//   const { id, token } = req.params

//   const { password } = req.body

//   try {
//     const validuser = await UserData.findOne({ _id: id, verifytoken: token })

//     const verifyToken = jwt.verify(token, keysecret)

//     if (validuser && verifyToken._id) {
//       const newpassword = await bcrypt.hash(password, 12)

//       const setnewuserpass = await userdb.findByIdAndUpdate(
//         { _id: id },
//         { password: newpassword }
//       )

//       setnewuserpass.save()
//       res.status(201).json({ status: 201, setnewuserpass })
//     } else {
//       res.status(401).json({ status: 401, message: "user not exist" })
//     }
//   } catch (error) {
//     res.status(401).json({ status: 401, error })
//   }
// })

app.put("/Mydetails/Marketingpreferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Marketingpreferences } = req.body;

    // Find the user details by ID
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Find the order in the user's Order array by orderId
    const mydetails = user.Mydetails.find((o) => o._id.toString());
    if (!mydetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status of the order
    mydetails.Marketingpreferences = Marketingpreferences;

    user.markModified("Mydetails"); // Mark the Order array as modified
    await user.save();

    return res
      .status(200)
      .json({ message: "Marketing Preferences status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@lego2sell.com",
    pass: "3037971520209ce1a7094d6a",
  },
});

app.post("/contactus/submit", (req, res) => {
  const { name, email, message } = req.body;

  // Create a new FormData document
  const formData = new FormData({
    name: name,
    email: email,
    message: message,
  });

  // Save the form data to MongoDB (Assuming formData is a Mongoose model)
  formData
    .save()
    .then(() => {
      console.log("Form data saved successfully!");
      const mailOptions = {
        from: "support@lego2sell.com",
        to: "support@lego2sell.com",
        subject: "ContactUs Form Submition",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: error });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Succsfully" });
        }
      });
    })
    .catch((error) => {
      console.error("Error saving form data:", error);
      res.send("An error occurred while submitting the form.");
    });
});

// app.post("/contactus/submit", (req, res) => {
//   const { name, email, message } = req.body

//   // Create a new FormData document
//   const formData = new FormData({
//     name: name,
//     email: email,
//     message: message,
//   })

//   // Save the form data to MongoDB (Assuming formData is a Mongoose model)
//   formData
//     .save()
//     .then(() => {
//       console.log("Form data saved successfully!")
//       const mailOptions = {
//         from: "support@lego2sell.com",
//         to: "support@lego2sell.com",
//         subject: "ContactUs Form Submition",
//         text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//       }

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending email:", error)
//           res.send(
//             "An error occurred while submitting the form and sending the email."
//           )
//         } else {
//           console.log("Email sent:", info.response)
//           res.send("Form submitted successfully! Email sent to recipient.")
//         }
//       })
//     })
//     .catch((error) => {
//       console.error("Error saving form data:", error)
//       res.send("An error occurred while submitting the form.")
//     })
// })

app.delete("/delete-account", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { email } = req.body;

    const encryptedData = req.header('source');
    const user_id = req.header('user-id');
    const user_admin = await UserData.findById(user_id);
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    console.log(decryptedData, user_id);

    if (decryptedData !== expectedData || user_id == '' || user_id == null) {
      return res.status(404).json({ message: 'Unauthorized request.' });
    }

    console.log(user_admin.admin, ">>>>>> admin");
    // Check if the user is admin or not
    if (user_admin.admin !== 'admin') {
      return res
        .status(400)
        .json({ message: "Not allowed to delete account", email });
    }

    // Check if the userId and password are provided in the request
    if (!email) {
      return res
        .status(400)
        .json({ message: "User ID and password are required", email });
    }

    // Find the user by userId
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's hashed password

    // If the user is found and the password is valid, proceed with account deletion
    await UserData.deleteOne({ email });
    return res
      .status(200)
      .json({ message: "Account deleted successfully", email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the email exists in the database
    const existingUser = await UserData.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user exists, return all data for that user
    return res.status(200).json(existingUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/data", async (req, res) => {
  const encryptedData = req.header('source');
  // Encryption key (must match the key used for encryption)
  const encryptionKey = 'legotwosell';

  // Decrypt the data
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  // Compare the decrypted data with a known value
  const expectedData = 'frontend';

  if (decryptedData !== expectedData) {
    return res.status(400).json({ message: 'Unauthorized request.' });
  }

  try {
    const result = await UserData.find({});
    res.json(result);
  } catch (error) {
    console.error("Error retrieving data from MongoDB:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/export/csv", async (req, res) => {
  try {
    const data = await UserData.find({}, { email: 1, _id: 0 }); // Only fetch the email field

    const fields = ["email"];
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="emails.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
// app.get("/export/csv", async (req, res) => {
//   try {
//     const data = await UserData.find({}, { email: 1, _id: 0 }) // Only fetch the email field

//     // Convert data to CSV
//     const fields = ["email"]
//     const json2csvParser = new json2csv({ fields })
//     const csv = json2csvParser.parse(data)

//     res.setHeader("Content-Disposition", 'attachment; filename="emails.csv"')
//     res.set("Content-Type", "text/csv")
//     res.status(200).send(csv)
//   } catch (error) {
//     res.status(500).send("Internal Server Error")
//   }
// })

// app.get("/export/csv/email", async (req, res) => {
//   try {
//     const data = await UserData.find({}, { _id: 0, data: 1 }) // Only fetch the "data" field
//     // const data = new GetQuote.find({})
//     // Convert data to CSV
//     const fields = ["data"]
//     const json2csvParser = new json2csv({ fields })
//     const csv = json2csvParser.parse(data)

//     res.setHeader("Content-Disposition", 'attachment; filename="emails.csv"')
//     res.set("Content-Type", "text/csv")
//     res.status(200).send(csv)
//   } catch (error) {
//     res.status(500).send("Internal Server Error")
//   }
// })

app.get("/export/csv/alldata", async (req, res) => {
  try {
    const data = await UserData.find({});

    const encryptedData = req.header('source');
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    if (decryptedData !== expectedData) {
      return res.status(400).json({ message: 'Unauthorized request.' });
    }

    // Convert data to CSV
    const fields = Object.keys(data[0]._doc); // Get all field names from the first document
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/usersWithOrderCount", async (req, res) => {
  try {
    // Find all users
    const users = await UserData.find({});

    const encryptedData = req.header('source');
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    if (decryptedData !== expectedData) {
      return res.status(400).json({ message: 'Unauthorized request.' });
    }

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Calculate the total number of orders across all users, excluding Paid and Rejected orders
    let totalOrderCount = 0;
    users.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.status !== "Paid" && order.status !== "Rejected") {
          totalOrderCount++;
        }
      });
    });

    return res.status(200).json({ totalOrderCount, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/TotalPriceOut", async (req, res) => {
  try {
    // Find all users
    const users = await UserData.find({});

    const encryptedData = req.header('source');
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    if (decryptedData !== expectedData) {
      return res.status(400).json({ message: 'Unauthorized request.' });
    }

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Calculate the total paid out amount and total order count, excluding Rejected orders
    let totalPaidOut = 0;
    let totalOrderCount = 0;
    users.forEach((user) => {
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          totalPaidOut += order.Price;
        }
      });
    });

    return res.status(200).json({ totalPaidOut, totalOrderCount, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const FormDiscount = new mongoose.Schema({
  MintValue: {
    type: Number,
    default: 50
  },
  VeryGood: {
    type: Number,
    default: 55
  }
});

// Create a model based on the schema
const FormDiscountValue = mongoose.model("DiscountValue", FormDiscount);

app.put("/DiscountValue", async (req, res) => {

  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_id = req.header('user-id');
    const user_admin = await UserData.findById(user_id);

    // Check if the user is admin or not
    if (user_admin.admin !== 'admin') {
      return res
        .status(400)
        .json({ message: "Not allowed to delete account", email });
    }
    // Extract data from the request body
    const { MintValue, VeryGood } = req.body;

    // Define the update operation using $set
    const updateOperation = {
      $set: { MintValue, VeryGood },
    };

    // Update the matching documents using updateMany

    const result = await FormDiscountValue.updateMany({}, updateOperation);
    console.log(result);

    return res.status(200).json({
      message: "Data updated successfully",
      modifiedCount: result.nModified,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/DiscountValueGet", async (req, res) => {
  try {
    // Retrieve data from the FormDiscountValue collection
    const discountValues = await FormDiscountValue.find({}).exec();

    return res.status(200).json(discountValues);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/DiscountValuePOST", async (req, res) => {
  try {
    // Extract data from the request body
    const { MintValue, VeryGood } = req.body;

    // Create a new instance of FormDiscountValue
    const newDiscountValue = new FormDiscountValue({ MintValue, VeryGood });

    // Save the new instance to the database
    await newDiscountValue.save();

    return res.status(201).json({
      message: "Data created successfully",
      data: newDiscountValue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/Filter", async (req, res) => {
  try {
    const allUserData = await UserData.find({});

    // Filter orders without "Paid" status
    const filteredUserData = allUserData.map((user) => ({
      ...user.toObject(),
      Order: user.Order.filter((order) => order.Status !== "Paid"),
    }));

    res.json(filteredUserData);
  } catch (error) {
    console.error("Error retrieving data from MongoDB:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/GetorderValue", async (req, res) => {
  try {

    const encryptedData = req.header('source');
    // Encryption key (must match the key used for encryption)
    const encryptionKey = 'legotwosell';

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the decrypted data with a known value
    const expectedData = 'frontend';

    if (decryptedData !== expectedData) {
      return res.status(400).json({ message: 'Unauthorized request.' });
    }

    const users = await UserData.find();

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    const allOrdersWithDetails = users.flatMap((user) => {
      return user.Order.map((order) => ({
        user: user,
        order: order,
      }));
    });

    return res.status(200).json({ orders: allOrdersWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/export/csv/alldata1", async (req, res) => {
  try {
    const data = await UserData.find({}, "Mydetails Order");

    // Convert data to CSV
    if (data.length === 0 || !data[0].Mydetails || !data[0].Order) {
      return res.status(404).send("No data found");
    }

    const myDetailsFields = Object.keys(data[0].Mydetails[0]);
    const orderFields = Object.keys(data[0].Order[0]);

    const csvFields = [
      ...myDetailsFields.map((field) => {
        return {
          label: `Mydetails.${field}`,
          value: (row) =>
            row.Mydetails && row.Mydetails.length > 0
              ? row.Mydetails[0][field] || ""
              : "",
        };
      }),
      ...orderFields.map((field) => {
        return {
          label: `Order.${field}`,
          value: (row) =>
            row.Order && row.Order.length > 0 ? row.Order[0][field] || "" : "",
        };
      }),
    ];

    const json2csvParser = new json2csv({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/export/csv/order", async (req, res) => {
  try {
    const data = await UserData.find({}, "Mydetails Order");

    // Convert data to CSV
    if (data.length === 0 || !data[0].Mydetails || !data[0].Order) {
      return res.status(404).send("No data found");
    }

    const orderFields = Object.keys(data[0].Order[0]);

    const csvFields = [
      ...orderFields.map((field) => {
        return {
          label: `Order.${field}`,
          value: (row) =>
            row.Order && row.Order.length > 0 ? row.Order[0][field] || "" : "",
        };
      }),
    ];

    const json2csvParser = new json2csv({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/export/csv/mydetails", async (req, res) => {
  try {
    const data = await UserData.find({}, "Mydetails Order");

    // Convert data to CSV
    if (data.length === 0 || !data[0].Mydetails || !data[0].Order) {
      return res.status(404).send("No data found");
    }

    const myDetailsFields = Object.keys(data[0].Mydetails[0]);

    const csvFields = [
      ...myDetailsFields.map((field) => {
        return {
          label: `Mydetails.${field}`,
          value: (row) =>
            row.Mydetails && row.Mydetails.length > 0
              ? row.Mydetails[0][field] || ""
              : "",
        };
      }),
    ];

    const json2csvParser = new json2csv({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/email", async (req, res) => {
  try {
    const users = await UserData.find({}, "data");

    if (users.length === 0) {
      return res.status(404).send("No data found");
    }

    const csvFields = [
      {
        label: "Email",
        value: (row) => row.email || "",
      },
    ];

    console.log("csvFields", csvFields);

    const emailData = users
      .flatMap((user) =>
        user.data.map((item) => ({
          title: "Email",
          email: item.email,
        }))
      )
      .filter((item) => item.email);

    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(emailData);

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="all-emails.csv"'
    );
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/alldata2", async (req, res) => {
  try {
    const data = await UserData.find({}, "Mydetails Order");

    // Convert data to CSV
    if (data.length === 0) {
      return res.status(404).send("No data found");
    }

    const csvFields = [];

    if (data[0].Mydetails && data[0].Mydetails.length > 0) {
      const myDetailsFields = Object.keys(data[0].Mydetails[0]);
      csvFields.push(
        ...myDetailsFields.map((field) => {
          return {
            label: `Mydetails.${field}`,
            value: (row) =>
              row.Mydetails && row.Mydetails.length > 0
                ? row.Mydetails[0][field] || ""
                : "",
          };
        })
      );
    }

    if (data[0].Order && data[0].Order.length > 0) {
      const orderFields = Object.keys(data[0].Order[0]);
      csvFields.push(
        ...orderFields.map((field) => {
          return {
            label: `Order.${field}`,
            value: (row) =>
              row.Order && row.Order.length > 0
                ? row.Order[0][field] || ""
                : "",
          };
        })
      );
    }

    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/alldata3", async (req, res) => {
  try {
    const data = await UserData.find({}, "Mydetails Order");

    // Convert data to CSV
    if (data.length === 0) {
      return res.status(404).send("No data found");
    }

    const csvFields = [];

    if (data[0].Mydetails && data[0].Mydetails.length > 0) {
      const myDetailsFields = Object.keys(data[0].Mydetails[0]);
      csvFields.push(
        ...myDetailsFields.map((field) => {
          return {
            label: `Mydetails.${field}`,
            value: (row) =>
              row.Mydetails && row.Mydetails.length > 0
                ? row.Mydetails[0][field] || ""
                : "",
          };
        })
      );
    }

    if (data[0].Order && data[0].Order.length > 0) {
      const orderFields = ["productName", "productId", "productCondition"]; // Define the specific fields you want to include
      csvFields.push(
        ...orderFields.map((field) => {
          return {
            label: `Order.${field}`,
            value: (row) =>
              row.Order && row.Order.length > 0
                ? row.Order[0][field] || ""
                : "",
          };
        })
      );
    }

    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/alldata4", async (req, res) => {
  try {
    const data = await UserData.find({}, "Order"); // Only fetch the 'Order' field

    // Convert data to CSV
    if (data.length === 0) {
      return res.status(404).send("No data found");
    }

    const csvFields = [];

    if (data[0].Order && data[0].Order.length > 0) {
      const orderFields = Object.keys(data[0].Order[0]);
      csvFields.push(
        ...orderFields.map((field) => {
          return {
            label: `Order.${field}`,
            value: (row) =>
              row.Order && row.Order.length > 0
                ? row.Order[0][field] || ""
                : "",
          };
        })
      );
    }

    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/order1", async (req, res) => {
  try {
    const data = await UserData.find({}, "Order");

    // Convert data to CSV
    if (data.length === 0 || !data[0].Order) {
      return res.status(404).send("No data found");
    }

    const orderFields = data[0].Order[0] ? Object.keys(data[0].Order[0]) : [];

    const csvFields = orderFields.map((field) => {
      return {
        label: `Order.${field}`,
        value: (row) =>
          row.Order && row.Order.length > 0 ? row.Order[0][field] || "" : "",
      };
    });

    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(data);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/export/csv/alldata6", async (req, res) => {
  try {
    const data = await UserData.find({}, "Order");

    // Convert data to CSV
    if (data.length === 0) {
      return res.status(404).send("No data found");
    }

    const csvFields = [
      {
        label: "ProductName",
        value: (row) => row.ProductName || "",
      },
      {
        label: "ProductId",
        value: (row) => row.ProductId || "",
      },
      {
        label: "setCondition",
        value: (row) => row.setCondition || "",
      },
    ];

    const orderFields = data.flatMap((user) => user.Order);
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(orderFields);

    res.setHeader("Content-Disposition", 'attachment; filename="alldata2.csv"');
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
