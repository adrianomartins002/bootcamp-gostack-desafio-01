
const express = require('express')

const server = express();

let projects = []
let numberOfRequests = 0

server.use(express.json())

//middleware
function verificarProjetoExistente(req, res, next){

    let project = projects.filter(project=>{
        if(project.id == req.params.id)
            return project
    })

    if(project.length<=0)
        res.status(400).json("Project does not exists")
    
    next()
}

function contadorRequests(req,res,next){
    console.log("Number of requests:", ++numberOfRequests)
    next()
}

server.get('/projects',contadorRequests, (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', verificarProjetoExistente, contadorRequests,(req, res) => {
    return res.json(projects.filter(req.params.id))
})

server.post('/projects', contadorRequests, (req, res) => {
    const {id, title} = req.body
    let tasks = []
    let newObject = {id, title, tasks}
    projects.push(newObject)

    return res.json(projects)
})

server.post('/projects/:id/tasks', verificarProjetoExistente,contadorRequests,(req, res) => {
    const {id} = req.params
    const {title} = req.body
    let tasks = []
    let newObjectTask = {title}
    projects.map(project=>{
        if(project.id == id)
            return project.tasks.push(newObjectTask)
    })

    return res.json(projects)
})

server.put('/projects/:id', verificarProjetoExistente,contadorRequests, (req, res) => {
    
    projects.map(project=>{
        if(project.id == req.params.id)
            return project.title = req.body.title
    })

    return res.json(projects)
})

server.delete('/projects/:id', verificarProjetoExistente, contadorRequests,(req, res) => {
    projects = projects.filter(project=>{
        if(project.id != req.params.id)
            return project
    })
    return res.json(projects)
})



server.listen(3000, console.log("---------- Rodando na porta 3000 ---------"))