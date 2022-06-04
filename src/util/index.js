/*
let project = {
    "test1":{
        name:"测试项目",
        path:"/",
        editable:false,
        type:"dir",
        params:{},
        children:[
            {
                name:"用户",
                path:"user",
                editable:false,
                type:"item",
                params:{},
                format:{}
            },
        ]
    }
}
*/
const flatPath = (arr,path,target)=>{
    arr.children && arr.children.map(item=>{
      if(item.children && item.children.length > 0 && item.type == 'dir'){
         flatPath(item,path + item.path + '/',target)
      }else{
          let p = path+item.path
         item.type=='item' && target.push({...item,path:p})
      }
    })
}

export {flatPath}
export default {
    flatPath
}