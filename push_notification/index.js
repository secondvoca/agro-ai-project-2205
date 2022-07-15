const express = require("express")
const webpush = require("web-push")
const bodyParser = require("body-parser")
const path = require("path")


const publicVapidKey = 'BNIzDhe0gjguRMGE4EBMoybwBIA-CG3cZrGL7KdzxrBhlOw3FUSOsNwXkDhSiwPl-n8Tt5NSbUPppzbdRN6ry-0'
const privateVapidKey = 'geBmHhBJ-KjkXYJ3VOzmhcZW7tH3twZs7ygXrtN06qE'

const mailto = 'mailto:secondvoca@naver.com'
webpush.setVapidDetails(mailto, publicVapidKey, privateVapidKey)


const app = express()
app.use(express.static(path.join(__dirname, "client")))
app.use(bodyParser.json())
app.post("/subscribe", (req, res) => {
    const subscription = req.body
    res.status(201).json({})
    const payload = JSON.stringify({title:"Push Test"})
    webpush
        .sendNotification(subscription, payload)
        .catch((err) => console.error(err))
})

const port = 5000

app.listen(port, () => console.log(`server started on port ${port}`))