const express = require('express')
const app = express()
const fs = require('fs')
const port = 3000
app.get('/', (res, req) => {
    res.sendfile(__dir + "/index.html")
})
app.get('/vidstream', (res, req) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send('HEADER REQUIRED!!!')
    }
    const path = "video.mp4"
    const size = fs.statSync("video.mp4").size
    const chunk = 10 ** 6 //1 MB
    const beginning = Number(range.replace(/\D/g, ''))
    const end = Math.min(beginning + chunk, size - 1)
    const length = end - beginning + 1
    const headers = {
        "Content-Range" : `bytes ${beginning } -${end} / ${size}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": length,
        "Content-Type" : "video/mp4"
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(path, { beginning, end })
    videoStream.pipe(res)


})

app.listen(port, () => {
    console.log('Server is up and running')
})