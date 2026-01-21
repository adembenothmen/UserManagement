//create server
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//connsect DB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/MernProject").then(() => {
  console.log("Connected to MongoDB");
});

//import user model
const UserModel = require("./models/Users");

//get users
app.get("/users", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

//create user
app.post("/createUser", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// delete user
app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Deleted", user: deleted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//import Admin model
const AdminModel = require("./models/Admins");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const admin = await AdminModel.findOne({ username });

  admin && res.json({ message: "Admin already exists" });

  const hashedPass = await bcrypt.hashSync(password, 10);

  const newAdmin = new AdminModel({ username, password: hashedPass });
  await newAdmin.save();
  return res.json({ message: "Admin created successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminModel.findOne({ username });
  if (!admin) {
    return res.status(401).json({ message: "Admin not found" });
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ id: admin._id }, "adem7/2/2003");
  return res.json({ token, adminId: admin._id });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
