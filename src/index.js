

const express = require("express");
const PORT = process.env.PORT || 5000;

const app = express();


const bodyParser = require("body-parser");

//importing router
const route = require("./routes/route");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
)

//api root path 
app.use("/api/users",route);

//basic root call 
app.get("/",(req,res)=>{
    res.json({info:"NodeJs , Express & Postgres Api"});
})


app.listen(PORT,()=>{
    console.log(`App is listening in port ${PORT}...`);
})
