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
    console.log(arr)
    arr.children && arr.children.map(item=>{
      if(item.children && item.children.length > 0 && item.type == 'dir'){
         flatPath(item,path + item.path + '/',target)
         console.log("jin")
      }else{
          let p = path+item.path
         item.type=='item' && target.push({...item,path:p})
      }
    })
    console.log(target)
}
const debounce = (fn,wait)=>{
    let timer = null
    return (...data)=>{
        if(timer)clearTimeout(timer)
        timer = setTimeout(()=>{
            fn(...data)
        },wait)
    }
}
const transformPath = (str)=>{
    return str.replace(/\/+/g,'\/')
}

//删除一个元素，把id || pid = this 相关联的都删掉
const delItem = (arr,id,ids)=>{
   arr.forEach((element,index) => {
     if(element.pid == id){
         ids.push(element.id)
         delItem(arr,element.id,ids)
     }
   });
    
}
export {flatPath, debounce,transformPath,delItem}
export default {
    flatPath,
    debounce,
    transformPath,
    delItem
}