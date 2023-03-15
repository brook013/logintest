const express = require('express')
const app = express()
const port = 3003
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

app.use(express.static("views"));

const ACCOUNTS = sequelize.define('ACCOUNTS', {
  // Model attributes are defined here
  ACCOUNT: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PASSWORD: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
});

(async () => {
  await ACCOUNTS.sync();
}
)();


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/join', async function (req, res) {
  const { account } = req.query
  const { password } = req.query
  const jane = await ACCOUNTS.create({ ACCOUNT: account, PASSWORD: password });
  console.log("Jane's auto-generated ID:", jane.id);
  res.redirect('/')
})

app.get('/login', async function (req, res) {
  const { account } = req.query
  const { password } = req.query
  const project = await ACCOUNTS.findOne({ where: { ACCOUNT: account, PASSWORD: password } });
  if (project) {
    res.redirect("https://k13.toonthe.com/");
  } else {
    res.redirect("https://www.google.com/");
  }
});


app.get('/check', async function (req, res) {
  const check = await ACCOUNTS.findAll();
  res.render('check', { check: check });
  console.log(check)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
