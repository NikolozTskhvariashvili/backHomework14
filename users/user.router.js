const { Router } = require("express");
const userModel = require("../models/user.model");
const { isValidObjectId } = require("mongoose");
const blogModel = require("../models/blog.model");

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await userModel.find().populate("blogs", "title content");
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "invalid id" });

  const user = await userModel.findById(id).populate("blogs", "title content");
  if (!user) return res.status(400).json({ error: "user not found" });
  res.json({ user });
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "invalid id" });
  const deletedUser = await userModel.findByIdAndDelete(id);
  if (!deletedUser) return res.status(400).json({ error: "user not found" });
  await blogModel.deleteMany({ author: id });

  res.json({ message: "deleted succsesfully", data: deletedUser });
});

module.exports = userRouter;
