const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let materials = [];

app.get('/materials', (req, res) => {
  res.json(materials);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running'));
