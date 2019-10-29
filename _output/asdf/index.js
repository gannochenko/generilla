const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello');
});

const port = process.env.PORT || 3000;

app.listen({ port }, () => {
    console.log(`🚀 Application is ready at http://localhost:${port}`);
});
