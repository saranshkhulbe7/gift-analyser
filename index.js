const https = require('https'); 
const express = require('express');
const bodyParser = require('body-parser');
const instaObj = require('instagram-basic-data-scraper-with-username');
const extractwords = require('extractwords');
var keyword_extractor = require("keyword-extractor");


const  app = express();
const port = 2300;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile( __dirname + "/land.html");
})

app.post('/', (req, res) => {
    var backslashn = String.fromCharCode(92)+"n";
    const user = req.body.user_name;
    instaObj.specificField(user, 'bio').then(bio => {
    var biography = bio.data;
    biography = biography.split(backslashn).join("");
    console.log(biography);
    var bioArray = extractwords(biography);
    biography = bioArray.join(" ");
    bioArray = keyword_extractor.extract(biography,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false

   });
   console.log(bioArray);
    bioArray.push(req.body.occasion);
    bioArray.push(req.body.profession);
    var urlArray=[];
    for(var i=0; i<bioArray.length;i++)
    {
        var url = "https://www.google.com/search?q="+bioArray[i]+"&hl=en&sxsrf=ALeKk00_655crOMz853JVQheZncLSfsSxg:1618535904269&source=lnms&tbm=shop&sa=X&ved=2ahUKEwiTuoSNzIHwAhUp7HMBHe8qD7QQ_AUoAXoECAEQAw&biw=1440&bih=703https://www.amazon.in/s?k=";
        urlArray.push(url);
    }
    var responseHTML = "<h1>Here are some gift suggestions</h1> <br>";
    for(var i=urlArray.length-1;i>=0;i--)
    {
        responseHTML = responseHTML + "<a href=" + urlArray[i] + ">gift suggestion "+ Number(urlArray.length-i) +"</a>" + "<br>";
    }
    res.send(responseHTML);
});
});

app.listen(port, function() {
    console.log("Server started on " + port);
});