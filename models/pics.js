const mongoose = require("mongoose");

const picsSchema = new mongoose.Schema({
    picPath: {
        type: String,
    }
});

const pic = new mongoose.model("pic", picsSchema);

module.exports = pic;