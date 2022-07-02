<script setup>
// This starter template is using Vue 3 <script setup> SFC
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {useRouter} from "vue-router"
const router = useRouter()
utools.onPluginEnter((e)=>{
  console.log("插件启动时",e)
  let code = e.code
  if(code == 'setting'){
    router.push("/setting")
  }else if(code == 'import'){
    router.push({
      path:"/setting",
      query:{
        mode:"import",
        address:e.payload
      }
    })
  }else{
    router.push("/index")
  }

})
</script> 

<template>
  <router-view></router-view>
</template>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  width: 100vw;
  height: 100vh;
}
#app{
  width: 100%;
  height: 100%;
}

.input-shadow{
  box-shadow: 0 4px 10px rgba(0, 0, 0, .3);
}
.desc-text{
  color: #131314;
  font-size: 14px;
  margin-right: 5px;
}
.row{
  display: flex;
  flex-direction: row;
}
.column{
  display: flex;
  flex-direction: column;
}
.align-middle{
  align-items: center;
}
.justify-center{
  justify-content: center;
}
</style>
