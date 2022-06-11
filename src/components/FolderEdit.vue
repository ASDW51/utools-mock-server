<template>
    <div class="folder-detail">
       <div class="row align-middle">
           <div class="desc-text" style="flex:1">
               名称
           </div>
           <el-input style="flex:4;" v-model="active.name"/>
       </div>
       <div class="row align-middle" style="margin-top:10px;">
           <div class="desc-text" style="flex:1">
               路径
           </div>
           <el-input style="flex:4;" placeholder="/" v-model="active.path"/>
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
        
        return {
            ...toRefs(props)
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