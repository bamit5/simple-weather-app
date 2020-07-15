const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const apiKey = require('./config.js').apiKey;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// TODO add header
const getWeather = async (city = 'los angeles') => {
  try {
    // fetch url and change to json format
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const weather = await response.json();

    // checks if user inputted a non-recognized city
    if (weather.main === undefined) throw new Error('Non-recognized city');
    
    console.log(weather);
    return weather;

  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.post('/', async (req, res) => {
  try {
    // get and render weather
    const weather = await getWeather(req.body.city);
    const weatherText = `It's ${weather.main.temp} degrees Fahrenheit in ${weather.name}`;
    res.render('index', { weather: weatherText, error: null });

  } catch (err) {
    // render error (handle a non-recognized city)
    res.render('index', {
      weather: null,
      error: err.message === 'Non-recognized city' ? 'That city is not recognized' : 'Error' + ', please try again.'
    });
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
