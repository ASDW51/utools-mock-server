<script setup>
import { ref } from 'vue'
import {reactive} from 'vue'
defineProps({
  msg: String
})

const count = ref(0)
const msg = ref('')
const path = ref('')
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
  window.createServer(8000,apis,(message)=>{
    msg.value = message
  })
}
const reload = ()=>{
  console.log("reload")
  document.location.reload()
}
</script>

<template>
  <div>
    <div>
       <input type="text" v-model="port"><button @click="createServer">创建服务</button>
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
