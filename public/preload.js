console.log("preload is loaded")
require("./require.js")
const fs = require("fs")
const path = require("path")
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
    console.log("initPort",port)
    apis = apis?apis:[]
    if(!server){
        server = express()
        let fport =  await portfinder.getPortPromise({port})
        httpServer = server.listen(fport,()=>{
            console.log(fport)
            config.port = fport
            const msg = port != fport?`${port}端口被占用,`:''
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
        res.header("Access-Control-Allow-Origin","*")
        next()
    })
    server.get("/",(req,res)=>{
        res.send("welcome use mock-server")
    })
    server.get("/mock-export",async (req,res)=>{
        let str = "import Mock from 'mockjs'\n"
        let template = fs.readFileSync(path.join(__dirname,"template.tpl"),"utf-8")
        apis.forEach(item=>{
            let format
            try{
                format = JSON.stringify(item.format)
            }catch{
                format = item.format
            }
            str += template.replaceAll("${url}",item.path).replaceAll("${method}",item.method).replaceAll("${format}",format)+"\n\n"
        })
        str += '\n\nMock.setup({timeout:300})'
        console.log(str)
        res.send(str)
    })
    server.get("/doc",(req,res)=>{
        let docArr = apis.map(item=>'接口名称：'+item.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求方法：' + item.method + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求地址：' + 'http://127.0.0.1:'+config.port+item.path)
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

const writeFile = (url,str)=>{
    fs.writeFileSync(url,str)
}
window.createServer = createHttpServer
window.closeServer = closeServer
window.writeFile = writeFile