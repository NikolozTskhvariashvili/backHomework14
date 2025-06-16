const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    birthDate: {
      type: Number,
      required: true,
    },
    blogs: { type: [mongoose.Schema.Types.ObjectId], ref: "blog", default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
