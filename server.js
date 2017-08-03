const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const phantom = require('phantom');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'bundle.js'));
});

app.post('/search', (req, res) => {
  const {query} = req.body;

  // search google
  (async function() {

    const instance = await phantom.create();
    const page     = await instance.createPage();

    page.setting('userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36');

    const status   = await page.open(`https://www.google.com/search?q=${query}`);
    const content  = await page.property('content');

    // await page.render('google.png');

    const results  = await page.evaluate(function() {
      const selector = '#rso div[class="g"]:not([id])';
      return document.querySelectorAll(selector).length;
    });
 
    await instance.exit();

    res.json({results});

  }());

});

app.listen(3000);
