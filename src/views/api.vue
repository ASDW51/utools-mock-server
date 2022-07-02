<template>
    <div>
        <el-table :data="state.data">
            <el-table-column prop="name" label="接口名称"></el-table-column>
            <el-table-column prop="method" label="请求方法"></el-table-column>
            <el-table-column prop="path" label="请求地址">
                <template #default="scoped">
                    <div class="link" v-if="scoped.row.method=='GET'" @click="jump(scoped.row.path)">{{scoped.row.path}}</div>
                    <div v-else>
                        <el-tooltip :content="scoped.row.method+'请求不可预览'">
                            {{scoped.row.path}}
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import axios from "axios"
import { onMounted, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
const getDoc = (port)=>{
    return axios.get(`http://127.0.0.1:${port}/doc`)
}
const state = reactive({
    data:[]
})
const router = useRouter()
const route = useRoute()
const refresh = ()=>{
    let port = route.query.port
    console.log(port)
    getDoc(port).then(res=>{
        console.log(res)
        state.data = res.data.map(item=>({name:item.name,method:item.method.toUpperCase(),path:`http://127.0.0.1:${port}${item.path}`}))
    })
}
onMounted(()=>{
    refresh()
})
const jump = (path)=>{
    window.utools.shellOpenExternal(path)
}
</script>
<style scoped>
.link{
    cursor: pointer;
    color: rgb(29, 29, 255);
}
.link:hover{
    text-decoration: underline;
}
</style>