var fs = require("fs")
async function __init__(){
    console.log("init")
    document.write(__dirname)
    let errorPath = __dirname+"\\errorLog.txt"
    window.onerror = function (message,fileName,lineno,colno,err) {
        console.log("error")  
        fs.open(errorPath,"w",0644,function(e,fd){
            fs.write(fd,err.stack,0,'utf8',function(e){
                fs.closeSync(fd);
                let exec = require('child_process').exec
                exec(`explorer.exe ${errorPath}`)
            })
        });
    }
}

module.exports = {
    __init__,
};