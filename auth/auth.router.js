const { Router } = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const isAuth = require("../middleware/isAuth.middleware");

const authRouter = Router();

authRouter.post("/sign-up", async (req, res) => {
  const { fullName, email, password, birthDate } = req.body;
  if (!fullName || !email || !password || !birthDate)
    return res.status(400).json({ error: "fields are required" });

  const existedUser = await userModel.findOne({ email: email.toLowerCase() });
  if (existedUser) return res.status(400).json({ error: "user already exist" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({
    fullName,
    email,
    password: hashedPassword,
    birthDate,
  });
  res.status(201).json({ message: "created succsesfully" });
});

authRouter.post("/sign-in", async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "fields are required" });

  const existedUser = await userModel
    .findOne({ email: email.toLowerCase() })
    .select("password");
  if (!existedUser)
    return res.status(400).json({ error: "email or password is incorrect" });

  const isPassed = await bcrypt.compare(password, existedUser.password);
  if (!isPassed)
    return res.status(400).json({ error: "email or passwrod  is incorrect" });

  const payload = {
    userId: existedUser._id,
  };
  const accsesToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
  res.json({ accsesToken });
});

authRouter.get("/current-user", isAuth,async (req, res) => {
  console.log(req.userId)
  const user = await userModel.findById(req.userId);
  res.json(user);
});

module.exports = authRouter;
