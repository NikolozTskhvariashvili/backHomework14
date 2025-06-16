const { Router } = require("express");
const blogModel = require("../models/blog.model");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/user.model");

const blogRouter = Router();

blogRouter.get("/", async (req, res) => {
  const posts = await blogModel.find().populate('author', 'fullName email')
  res.json(posts);
});

blogRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "invalid id" });

  const blog = await blogModel.findById(id);
  if (!blog) return res.status(400).json({ error: "blog not found" });
  res.json(blog);
});

blogRouter.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "fields are required" });

  const blog = await blogModel.create({ title, content, author: req.userId });
  console.log(req.userId)
  const user = await userModel.findByIdAndUpdate(req.userId, {
    $push: { blogs: blog._id },
  });
  res.status(201).json({ error: "blog created succsesfully", data: blog });
});

blogRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "invalid id" });
  const blog = await blogModel.findById(id)
  if(req.userId !== blog.author._id.toString()){
    return res.status(400).json({error:"not ur blog"})
  }
  const deleteBlog = await blogModel.findByIdAndDelete(id);
  if (!deleteBlog) return res.status(400).json({ error: "blog not found" });
  res.json({ message: "deleted succsesfully", data: deleteBlog });
});

blogRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "invalid id" });
  const blogs = await blogModel.findById(id);

  if(req.userId !== blogs.author._id.toString()){
    return res.status(400).json({error:"not ur blog"})
  }

  const updateRequest = {};
  const { content, title } = req.body;
  if (content) updateRequest.content = content;
  if (title) updateRequest.title = title;

  const updatedBlog = await blogModel.findByIdAndUpdate(id, updateRequest);
  res.json({ message: "updated succsesfully", data: updatedBlog });
});

module.exports = blogRouter;
