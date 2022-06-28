<template>
    <div class="c-header">
        <div class="c-header-left">
            <div class="left-top">
                <el-select placeholder="显示当前项目" class="input-shadow" :model-value="val" @change="changeOption" ref="select" :disabled="loading || serverListening">
                    <el-option 
                         v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                    <el-option disabled value="">
                      <el-row justify="center" align="middle" style="height:100%">
                            <el-button round size="small" @click="createProject">
                                <template #icon>
                                <IEpPlus color="#000000"/>
                                </template>
                                创建项目
                            </el-button>
                      </el-row>
                    </el-option>
                </el-select>
                <div class="port-div">
                    <span class="desc-text">端口</span>
                    <el-input type="number" style="width:90px;" class="input-shadow" v-model="bindPort" @input="portChange" :disabled="loading || serverListening"></el-input>
                </div>
            </div>
            <div class="left-bottom">
                <el-button type="primary" @click="createServer" :disabled="loading || serverListening">创建服务</el-button>
                <el-button type="danger" 
                    :disabled="loading || !serverListening"
                    @click="closeServer"
                    >关闭服务</el-button>
                <el-button type="warning" 
                    :disabled="loading || !serverListening"
                    @click="restartServer"
                >重启服务</el-button>
                <el-button type="success" @click="openApiMsg" :disabled="loading || !serverListening">api信息</el-button>
                <el-button type="info" @click="exportJS" :disabled="loading || !serverListening">生成mock代码</el-button>
                <!-- <el-button type="success" :disabled="true">导出配置</el-button> -->
            </div>
        </div>
        <div class="c-header-right">
            
        </div>
    </div>
</template>
<script>
import { computed,ref, watch, toRefs } from 'vue'
import { debounce } from '../util'
import axios from "axios"
export default {
    props:{
        options:{
            type:Array,
            default:()=>[]
        },
        projectId:{
            type:String,
            default:""
        },
        port:{
            type:[String,Number],
            default:''
        },
        loading:{
            type:Boolean,
            default:false
        },
        serverListening:{
            type:Boolean,
            default:false
        }
    },
    setup(props,{emit}){
        const getPath = ()=>{
            let path = utools.dbStorage.getItem("saveFilePath") 
            return path?path:utools.getPath('downloads') + '/mock.js'
        }
        const savePath = (path)=>{
            utools.dbStorage.setItem("saveFilePath",path)
        }
        console.log(props.projectId)
        let val = computed(()=>{
            return props.projectId
        })
        let bindPort = ref(props.port)
        watch(()=>props.port,(newval,oldval)=>{
            console.log("watch prots change",newval,oldval)
            bindPort.value = newval
        })
        console.log('props',props)
        let select = ref(null)
        const changeOption = (value)=>{
            emit("update:projectId",value)
        }
        const createProject = ()=>{
            console.log("createProject")
            console.log(select)
            // ref调用close
            select.value.handleClose()
            emit("createProject")
        }
        const portChange = debounce((val)=>{
            emit("update:port",val)
        },1000)

        const createServer = ()=>{
            console.log("createServer")
            emit("createServer")
        }
        const closeServer = ()=>{
            console.log("closeServer")
            emit("closeServer")
        }
        const restartServer = ()=>{
            console.log("restartServer")
            emit("restartServer")
        }
        const openApiMsg = ()=>{
            console.log("open","http://127.0.0.1:"+bindPort.value+'/doc')
            window.utools.shellOpenExternal("http://127.0.0.1:"+bindPort.value+'/doc')
        }
        const downloadFile = (data,filename="unknow")=>{
            let res = utools.showSaveDialog({ 
                title: '导出Mockjs文件', 
                defaultPath: getPath(),
                buttonLabel: '保存'
            })
            if(!res)return
            savePath(res)
            window.writeFile(res,data)
            console.log("save",res)
            utools.shellShowItemInFolder(res)
            return
        }
        const exportJS = ()=>{
            axios.get(`http://127.0.0.1:${bindPort.value}/mock-export`).then(res=>{
                // let blob = new Blob([res.data],{
                //     type:"text/plain"
                // })
                downloadFile(res.data,'mock.js')
            })
        }
        return {
            val,
            select,
            changeOption,
            createProject,
            bindPort,
            portChange,
            createServer,
            closeServer,
            restartServer,
            openApiMsg,
            exportJS,
        }
    }
}
</script>

<style scoped>
.c-header{
    display: flex;
    height: 100%;
}
.c-header .c-header-left{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex:3;
}
.c-header .c-header-right{
    flex: 1;
}
.c-header .c-header-left .left-top{
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
}
.port-div{
    display: flex;
    align-items: center;
    margin-left: 50px;
}

/* 取消下拉框最后一个选项hover效果 */
.c-header .c-header-left .left-top >>> .el-select-dropdown__item.hover, .el-select-dropdown__item:last-child:hover{
    background-color:#fff;
}
</style>