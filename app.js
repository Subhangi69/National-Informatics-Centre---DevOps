// app.js

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hi, I am Subhangi from India and you are at my Node.js application');
});

// Export the app object
module.exports = app;

// Start the server only if the script is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
