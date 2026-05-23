import express from "express"
import handlebars from "express-handlebars"
import router from "./router/index.js"
import mongoConnect from "./db/index.js";

const app = express()

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
})

app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', hbs.engine)
app.set('views', process.cwd() + '/src/views')

mongoConnect()

router(app)

export default app