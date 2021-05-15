const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/picture", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
    console.log(err);
})