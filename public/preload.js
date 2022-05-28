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
let config = {
    port:0
}
const createHttpServer = async (port,apis,callback)=>{
    apis = apis?apis:{}
    if(!server){
        server = express()
        portfinder.getPort((err,fport)=>{
            server.listen(fport,()=>{
                console.log(fport)
                config.port = fport
                const msg = port !== fport?`${port}端口被占用,`:''
                callback(`${msg}服务器在${fport}端口启动`)
            })
        })
    }else{
        const msg = port !== config.port?`${port}端口被占用,`:''
        callback(`${msg}服务器在${config.port}端口启动`)
    }
    server.get("/",(req,res)=>{
        res.json("hello world")
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
window.createServer = createHttpServer