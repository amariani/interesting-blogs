const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const requiredPassLength = 3;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    minlength: requiredPassLength,
    required: true,
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const User = mongoose.model("User", userSchema);

// MongoDB Response Transformer
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userSchema.plugin(uniqueValidator);

module.exports = { User, requiredPassLength };
