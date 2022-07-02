<template>
    <div class="setting-container" v-loading='loading' element-loading-background="rgba(122, 122, 122, 0.8)">
        <div class="header">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="danger" @click="dialog = true">查看JSON格式</el-button>
        </div>
        <div class="editor-container">
            <Editor v-model="allMenu" height="calc(100vh - 100px)"></Editor>
        </div>
        <el-dialog title="JSON格式说明" v-model="dialog" width="70%" top="20px">
            <Editor v-model="jsonFormat"></Editor>
        </el-dialog>
    </div>
   
</template>
<script setup>
import Editor from "bin-editor-next";
import * as ace from "brace";
import "brace/ext/emmet";
import "brace/ext/language_tools";
import "brace/mode/json";
import "brace/snippets/json";
import "brace/theme/chrome";
import { onMounted, ref } from "vue";
import {useRoute, useRouter} from "vue-router"
import axios from "axios"

const router = useRouter()
const route = useRoute()
const allMenu = ref("")
const loading = ref(false)
const dialog = ref(false)
const jsonFormat = ref("")
const format = {
    "项目1根目录ID": [
        {
            "id": "项目1根目录ID",
            "name": "项目名称",
            "path": "/",
            "editable": false,
            "type": "root",
            "port": 8003,
            "params": {}
        },
        {
            "id": "父级目录ID",
            "name": "父级目录",
            "path": "parent",
            "editable": false,
            "type": "dir",
            "pid": "项目1根目录ID"
        },
        {
            "id": "ad580ba1-acd3-4ce0-b475-adb28a1720f4",
            "name": "子级目录",
            "path": "child",
            "editable": true,
            "type": "dir",
            "pid": "父级目录ID"
        },
        {
            "id": "1d1a7cca-15f5-47af-b4ee-2bb6fa0e34a4",
            "name": "子级接口",
            "path": "api",
            "editable": false,
            "type": "item",
            "method": "get",
            "params": {},
            "format": {
                "data|2": "Mockjs语法"
            },
            "pid": "父级目录ID"
        }
    ],
    "项目2根目录ID": [
        {
            "id": "项目2根目录ID",
            "name": "项目名称",
            "path": "/",
            "editable": false,
            "type": "root",
            "port": 8003,
            "params": {}
        },
        {
            "id": "父级目录ID",
            "name": "父级目录",
            "path": "parent",
            "editable": false,
            "type": "dir",
            "pid": "项目2根目录ID"
        },
        {
            "id": "ad580ba1-acd3-4ce0-b475-adb28a1720f4",
            "name": "子级目录",
            "path": "child",
            "editable": true,
            "type": "dir",
            "pid": "父级目录ID"
        },
        {
            "id": "1d1a7cca-15f5-47af-b4ee-2bb6fa0e34a4",
            "name": "子级接口",
            "path": "api",
            "editable": false,
            "type": "item",
            "method": "get",
            "params": {},
            "format": {
                "data|2": "Mockjs语法"
            },
            "pid": "父级目录ID"
        }
    ]
}
jsonFormat.value = JSON.stringify(format,null,4)
const request = async (ip)=>{
    return axios.get(`http://${ip}/mock-import`,{timeout:5000})
}
const init = async ()=>{
    let mode = route.query.mode
    console.log("mode",mode)
    if(route.query.mode == 'import'){
        //ip 导入
        let address = route.query.address
        loading.value = true
        try{
            let res = await request(address)
            console.log(res)
            allMenu.value = JSON.stringify(res.data,null,4)
            ElMessage({message:`已导入${address}的数据，请及时保存！`,type:"warning"})
            loading.value = false
        }catch(e){
            console.log(e)
            ElMessage({message:address+'---'+e.message,type:"warning"})
            loading.value = false
        }
    }else{
        //默认是编辑
        let menu = utools.dbStorage.getItem("menu")
        console.log(menu)
        allMenu.value = JSON.stringify(menu,null,4)
    }
}
const save = ()=>{
    console.log(allMenu.value)
    utools.dbStorage.setItem("menu",JSON.parse(allMenu.value))
    ElMessage({message:`保存成功！`,type:"success"})
}
onMounted(()=>{
    init()
    console.log(allMenu)
})
</script>
<style scoped>
.setting-container{
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.header{
    height: 50px;
}
.editor-container{
    flex: 1;
}
>>>.el-overlay-dialog{
    overflow: hidden;
}
</style>