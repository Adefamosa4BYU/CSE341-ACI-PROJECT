require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");
const connectDB = require("./DB/Connections");
const userRouter = require('./routes/index')
const trainingsRouter = require('./routes/trainings')
const errorHandler = require('./middleware/errorHandler');
// const passport = require('passport');
const session = require('express-session')
const passport = require("./config/passport")
const GitHubStrategy = require('passport-github2').Strategy
const app = express();

connectDB();

app.use(express.json({extended:false}))

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors())

app.use('/', require('./routes/swagger.js'));

app.use('/api/', userRouter)

// app.use('/api/trainings', trainingsRouter);

// app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error Handling
app.use(errorHandler);

const Port = process.env.Port || 8080;

app.listen(Port, () => console.log(`Server started at port ${Port}`));
