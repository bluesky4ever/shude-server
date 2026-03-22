const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let materials = [];

app.get('/materials', (req, res) => {
  res.json(materials);
});

app.listen(3001, () => console.log('Server running'));
