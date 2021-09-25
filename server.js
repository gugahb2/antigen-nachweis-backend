const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const cors = require("cors");
const filesRouter = require("./app/file_upload.routes");
const qrscanController = require("./app/qrscanController");

// const options = {
//     key: fs.readFileSync("/etc/letsencrypt/live/covidtest4u.de/privkey.pem"),
//     cert: fs.readFileSync("/etc/letsencrypt/live/covidtest4u.de/fullchain.pem")
// };


// cors policy
const corsOptions = {
    "origin": "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '10mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

// configuration for file upload
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));

app.use('/file', filesRouter);
app.use('/qr', qrscanController);

// database model
const db = require("./app/models");

db.sequelize.sync().then(res => {
    // db.sequelize.sync({alter: true});
    db.sequelize.sync();
});

// adding front build path
// const publicPath = path.join(__dirname, 'admin_panel', 'build');
// app.use(express.static(publicPath));
//
// app.get(['/', '/home', '/test-center', '/member', '/schedule/:id?', '/timeslot/:id?', '/test-report/:id?', '/login', '/sign-up', '/test-history'], (req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
// });

app.get("/", (req, res) => {
    res.json({msg: ["Welcome to Covid Test App!"]});
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/testCenter.routes')(app);
require('./app/routes/application.routes')(app);
require('./app/routes/member.routes')(app);
require('./app/routes/timeSlot.routes')(app);
require('./app/routes/confirmation.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// https.createServer(options, app).listen(8080);
