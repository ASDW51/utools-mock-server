<template>
    <div class="folder-detail">
       <div class="row align-middle">
           <div class="desc-text" style="flex:1">
               名称
           </div>
           <el-input style="flex:4;" v-model="active.name" @input="input"/>
       </div>
       <div class="row align-middle" style="margin-top:10px;">
           <div class="desc-text" style="flex:1">
               路径
           </div>
           <el-input style="flex:4;" placeholder="/" v-model="active.path" @input="input"/>
       </div>
    </div>
</template>
<script>
import { computed, reactive, ref, toRefs } from 'vue'
import {debounce} from "../util/index"
export default {
    props:{
        active:{
            type:Object,
            default:{}
        }
    },
    setup(props, {emit}){
        console.log(props)
        const input = debounce(()=>{
            console.log("save")
            emit("saveM")
        },1000)
        return {
            ...toRefs(props),
            input
        }
    }
}
</script>
<style scoped>
.folder-detail{
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
}
</style>