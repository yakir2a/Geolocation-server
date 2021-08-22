const express = require('express')
const app = express()
const port = 8080

app.get('/hello', (req, res) => {
    res.status(200).end()
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})