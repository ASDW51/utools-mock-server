<script setup>
import { ref } from 'vue'
import {reactive} from 'vue'
defineProps({
  msg: String
})

const serverListening = ref(false)
const loading = ref(false)
const msg = ref('')
const errmsg = ref('')
const errData = reactive([])
const path = ref('/a')
const format = ref(JSON.stringify({
    "student|50":[
        {name:"@cname()"}
    ]
}))
const port = ref(8000)
/**
 * {
 *   api:'',
 *   dataFormat:''
 * }
 * 
 */
const apis = reactive({})
const addData = ()=>{
  apis[path.value] = {
    path:path.value,
    format:new Function( 'return'+format.value)(),
    method:"get"
  }
  console.log(apis)
}
const createServer = ()=>{
  loading.value = true
  window.createServer(8000,apis,(message)=>{
    msg.value = message
    serverListening.value = true
    loading.value = false
  })
}
const closeServer = (restart=true)=>{
  loading.value = true
  window.closeServer((...data)=>{
    console.log(data)
    serverListening.value = false
    loading.value = false
    restart && createServer()
  })
}
const reload = ()=>{
  console.log("reload")
  document.location.reload()
}

window.onerror = (msg,...data)=>{
  console.log("error")
  errmsg.value = msg,
  errData.value = data
}
</script>

<template>
  <div>
    <div>{{errmsg}}-------{{errData}}</div>
    <div>
       <input type="text" v-model="port">
       <button @click="createServer" v-if="!serverListening" :disabled="loading">创建服务</button>
       <span v-else>
         <button @click="closeServer(false)" :disabled="loading">关闭服务</button>
       <button @click="closeServer(true)" :disabled="loading">重启服务</button>
       </span>
       <div>
         {{msg}}
       </div>
    </div>
    <button @click="addData">添加</button>
    <button @click="reload">reload</button>
    <div class="flex">
       <div>路径：<input type="text" v-model="path"></div>
       <div>数据模板：<textarea name="" id="" cols="30" rows="5" v-model="format"></textarea></div>
    </div>
  </div>
</template>

<style scoped>
.flex{
  display: flex;
}
.flex-column{
  flex-direction: column;
}
</style>
