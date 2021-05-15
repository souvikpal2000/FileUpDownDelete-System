const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Pics = require("./models/pics");
require("./db/conn");
const app = express();

const viewsPath = path.join(__dirname, "/views");
const staticPath = path.join(__dirname, "/public");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));

var uniqueNo;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        uniqueNo = Date.now();
        cb(null, `${file.fieldname}-${uniqueNo}${path.extname(file.originalname)}`)
    }
});
var upload = multer({ storage: storage });

app.get("/", async (req,res) => {
    try{
        const picsData = await Pics.find();
        if(picsData.length>0){
            return res.status(200).render("index", {data:picsData});
        }
        res.status(200).render("index", {data:{}});
    }catch(err){
        res.status(500).render("index");
    }
});

app.post("/", upload.single('pic'), async (req,res) => {
    try{
        var x = 'images/'+ req.file.fieldname + "-" + uniqueNo + path.extname(req.file.originalname);
        const uploadPic = new Pics({
            picPath: x
        });
        const picData = await uploadPic.save();
        res.status(201).redirect("/");
    }catch(err){
        res.status(501).redirect("/");
    }
});

app.get("/download/:id", async (req,res) => {
    try{
        const picId = req.params.id;
        const data = await Pics.findOne({_id:picId});
        var x = "public/" + data.picPath;
        res.download(x, function(error){
            res.status(404).send(error);
        });
    }catch(err){
        res.status(500).render("index");
    }
});

app.get("/delete/:id", async (req,res) => {
    try{
        const picId = req.params.id;
        const picData = await Pics.findOneAndDelete({_id:picId});
        const deletePath = "public/" + picData.picPath;
        fs.unlink(deletePath, () => {
            res.redirect("/");
        });
    }catch(err){
        res.status(500).render("index");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if(err){
        console.log("Something went Wrong");
    }else{
        console.log(`Server listening at port ${port}`);
    }
})