console.log("preload is loaded")
require("./require.js")
const data = Mock.mock({
    "student|50":[
        {name:"@cname()"}
    ]
})
console.log(data)
window.getData = ()=>{
    return data
}
let server = null
let httpServer = null
let config = {
    port:0
}
let sockets = []
const createHttpServer = async (port,apis,callback)=>{
    apis = apis?apis:{}
    if(!server){
        server = express()
        let fport =  await portfinder.getPortPromise()
        httpServer = server.listen(fport,()=>{
            console.log(fport)
            config.port = fport
            const msg = port !== fport?`${port}端口被占用,`:''
            callback({msg:`${msg}服务器在${fport}端口启动`,port:fport})
        })
    }else{
        const msg = port !== config.port?`${port}端口被占用,`:''
        callback({msg:`${msg}服务器在${config.port}端口启动`,port:config.port})
    }
    httpServer && httpServer.on("connection",(socket)=>{
        console.log("有新连接")
        sockets.push(socket)
    })
    server.use((req,res,next)=>{
        next()
    })
    server.get("/",(req,res)=>{
        res.json("hello world")
    })
    server.get("/doc",(req,res)=>{
        let docArr = apis.map(item=>'接口名称：'+item.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求方法：' + item.method + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求地址：' + item.path)
        console.log("doc",docArr)
        let r = docArr.join("<br/>")
        console.log(r)
        res.send(r)
    })
    console.log(apis)
    for(let key in apis){
        let api = apis[key]
        console.log(api.format)
        let format;
        try{
            format = JSON.parse(api.format)
        }catch{
            format = api.format
        }
        console.log(api)
        console.log(api.method)
        server[api.method](api.path,function(req,res){
            return res.json(Mock.mock(format))
        })
    }
   
}
const closeServer = (callback)=>{
    sockets.forEach(socket=>{
        socket.destroy()
    })
    httpServer.close((...data)=>{
        server = null
        callback(...data)
    })
}
window.createServer = createHttpServer
window.closeServer = closeServer