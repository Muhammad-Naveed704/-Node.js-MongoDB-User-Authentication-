import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const app = express();
const port = 8800;
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("db connected");
  } catch (err) {
    console.log(err);
  }
};
app.use(express.json());

// This Code for Create User IN MongoDb start
//example  http://localhost:8800/users

app.post("/users", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(200).send("user register");
  } catch (error) {
    next(error);
  }
});

// This Code for Create User IN MongoDb End

//This code For User Login Start
//example  http://localhost:8800/login
app.post("/login", async (req, res) => {
  try {
    const loggedUser = await User.findOne({ email: req.body.email });
    !loggedUser && res.status(404).json("wrong email");

    const validPasscode = bcrypt.compareSync(
      req.body.password,
      loggedUser.password
    );
    !validPasscode && res.status(400).json("wrong password");

    res.status(200).json("User logged In");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
//This code For User Login End

//  This Code For  updated user In MongoDB start
//example  http://localhost:8800/users/replace your mongodb user id

app.put("/users/:id", async (req, res) => {
  console.log(req.body);

  try {
    const userId = req.params.id;
    const updateData = req.body;

    const newUser = await User.findByIdAndUpdate(userId, updateData);

    res.status(201).json({
      message: "updated",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// //  This Code For  updated user In MongoDB End

// // delete user code start
// When deleting a user, you must have the MongoDB document ID of the user 
// and ensure that the correct endpoint path is defined in your code. Moreover,
//  when using the DELETE method, there is no requirement to include any data in 
//  the JSON file; rather, the focus is on selecting the appropriate deletion route."

// example  http://localhost:8800/users/replace your mongodb user id

  app.delete("/users/:id", async (req, res) => {
    console.log(req.body);
  
    try {
      const userId = req.params.id;
  
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "User Deleted",
        data: deletedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
});
  
 // delete user code end

app.listen(port, () => {
  console.log("server running on " + port);
  connect();
});
