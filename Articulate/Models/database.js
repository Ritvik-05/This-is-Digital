const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://agrawalritvik05:Ritvik05@@cluster0.iles0rj.mongodb.net/?retryWrites=true&w=majority")
    // .connect("mongodb://127.0.0.1:27017/MindBlogger")
    .then(() => console.log("db connected!"))
    .catch((err) => console.log(err));
