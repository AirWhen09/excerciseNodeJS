const express = require('express');
const port = 3003;
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path : './.env' });

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.set("view engine", "hbs");
app.use("/auth", require("./routes/auth"));

app.use("/", require("./routes/accountRoutes"));

app.listen(port, ()=>{
    console.log("Server Running @ http://localhost:"+port);
});

