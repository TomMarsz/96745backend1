import { Server } from "socket.io";
import port from "./configs/server.config.js"
import HTTP_RESPONSES from "./constants/http-responses.constant.js";
import app from "./server.js";

app.get("/", (req, res) => {
  res.status(HTTP_RESPONSES.SUCCESS).render('index.handlebars', { title: 'HomePage | Backend 69990', style: 'index.css' })
});

app.get('*', (req, res) => {
  res.status(HTTP_RESPONSES.NOT_FOUND_ERROR).render('404.handlebars', { error: 'Not a valid page', title: '404 Not Found', style: 'index.css' })
})

const httpServer = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
httpServer.on('error', (err) => console.log(`Server Error: ${err}`))

const io = new Server(httpServer)

io.on('connection', socket => {
  console.log(socket.id);
})

export { io }