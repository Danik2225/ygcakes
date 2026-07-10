const express = require("express");
const path = require("path");
const multer = require("multer");
const db = require("./database");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/cakes", (req, res) => {
    db.all("SELECT * FROM cakes ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post("/api/cakes", upload.single("image"), (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = "/uploads/" + req.file.filename;

    db.run(
        "INSERT INTO cakes(name,price,image) VALUES(?,?,?)",
        [name, price, image],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success:true,
                id:this.lastID
            });

        }
    );

});

app.delete("/api/cakes/:id",(req,res)=>{

    db.run(
        "DELETE FROM cakes WHERE id=?",
        [req.params.id],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success:true
            });

        }
    );

});

app.get("/api/orders",(req,res)=>{

    db.all("SELECT * FROM orders ORDER BY id DESC",[],(err,rows)=>{

        if(err){
            return res.status(500).json(err);
        }

        res.json(rows);

    });

});

app.post("/api/orders",(req,res)=>{

    const {name,phone,address,email,total}=req.body;

    db.run(
        "INSERT INTO orders(name,phone,address,email,total,status) VALUES(?,?,?,?,?,?)",
        [name,phone,address,email,total,"Новый"],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success:true,
                id:this.lastID
            });

        }
    );

});

app.put("/api/orders/:id",(req,res)=>{

    db.run(
        "UPDATE orders SET status='Выполнен' WHERE id=?",
        [req.params.id],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success:true
            });

        }
    );

});

app.delete("/api/orders/:id",(req,res)=>{

    db.run(
        "DELETE FROM orders WHERE id=?",
        [req.params.id],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success:true
            });

        }
    );

});

app.listen(PORT, () => {
    console.log(`Сервер запущен: https://ygcakes`);
});
