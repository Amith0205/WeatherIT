const express = require("express");
const port = process.env.PORT || 8000
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

require("dotenv").config({path:'./config/config.env'});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) => {  
    res.render("home"); 
});

app.post("/", (req,res) => {
    let city = req.body.cityName;
    const apiKey =process.env.APIKEY;
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=metric&appid="+ apiKey;
    try{
        https.get(url, (response) => {
            response.on("data", (data) => {
                if(data) {

                    let weatherData = JSON.parse(data);
                    // console.log(weatherData);
                    let description = weatherData.weather[0].description;
                    let temperature = weatherData.main.temp;
                    let icon = weatherData.weather[0].icon
                    let imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                    res.render("data", {weatherDesc: description, cityTemp: temperature, queryCity: city, imgSRC: imgURL});
                } else {
                    res.redirect("/home");
                }
            });
        });
    } catch(err) {
        res.redirect("/home");
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});