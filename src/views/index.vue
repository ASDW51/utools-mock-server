<template>
  <div class="container">
    <div class="header">
      <Header :options="projectOption" 
        v-model:projectId="projectId" 
        v-model:port="port" 
        @createProject="createProject"
        @createServer="createServer"
        @closeServer="closeServer"
        @restartServer="restartServer"
        :loading="loading"
        :serverListening="serverListening"
        />
    </div>
    <div class="mid-content">
      <div class="left-content">
        <el-tree 
          :data="dir" 
          :props="defaultProps" 
          :highlight-current="true" 
          v-if="Object.keys(menu.menu).length !==0" 
          default-expand-all
          ref="tree" 
          node-key="id"
          @node-click="nodeClick"
           >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="!data.editable">
                <span style="pointer:none" v-if="data.type=='item'" @dblclick="dbclick(data)">{{ node.label }}</span>
                <span style="pointer:none" v-else>{{ node.label }}</span>
              </span>
              <span style="pointer:none" v-else>
                <el-input 
                  v-model="data.name" 
                  size="small"
                  :placeholder="data.type=='dir'?'请输入目录名称':'请输入接口名称'" 
                  @input="changeName(data)"
                  @change="finishInput(data)"
                  @blur="blur(data)"
                  ref="input"
                ></el-input>
              </span>
              <span v-if="data.type=='root'" style="display:flex;justify-content:space-around;align-items:center;flex:1">
                 <el-icon :size="16" color="#000000" @click="addFolder(data,node,$event)" :class="{'disable':item.type=='item'}">
                     <i-ep-folder-add />
                 </el-icon>
                 <el-icon :size="16" color="#000000" @click="addItem(data,node,$event)" :class="{'disable':item.type=='item'}">
                     <IEpPlus />
                 </el-icon>
                 <el-icon :size="16" color="#000000" @click="Del(data,node,$event)">
                      <IEpDelete />
                 </el-icon>
              </span>
              

            </span>
          </template>
        </el-tree>
        <div v-else style="height:100%;display:flex;justify-content:center;align-items:center">
          
          <el-button round size="large" style="width:60%;" @click="createProject">
            <template #icon>
               <IEpPlus color="#000000"/>
            </template>
            创建项目
          </el-button>
        </div>
      </div>
      <div class="right-content">
        <router-view :active="item" @save="save" @blur="editorBlur" @saveM="saveMenu"></router-view>
      </div>
    </div>
    <el-dialog 
            v-model="showAddProject"
            title="创建项目"
            show-close
            >
              <div class="column">
                <el-row align="middle">
                  <el-col class="desc-title" :span="6">
                    项目名称
                  </el-col>
                  <el-col :span="18">
                    <el-input class="input-shadow" placeholder="输入项目名称" v-model="projectName"></el-input>
                  </el-col>
                </el-row>
                 <el-row align="middle">
                  <el-col class="desc-title" :span="6">
                    根路径
                  </el-col>
                  <el-col :span="18">
                    <el-input class="input-shadow" placeholder="/" v-model="rootPath"></el-input>
                  </el-col>
                </el-row>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="showAddProject = false">取消</el-button>
                  <el-button type="primary" @click="confirm"
                    >创建</el-button
                  >
                </span>
              </template>
          </el-dialog>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, computed, toRefs, onMounted, watch } from "vue";
import {cloneDeep, debounce} from "lodash-es"
import {flatPath,transformPath, delItem} from "../util/index.js"
export default {
  setup() {

    //var
    const getMenu = ()=>{
      let menu = localStorage.getItem("menu")
      return menu?JSON.parse(menu):{}
    }
    let activeItem = reactive({
      item:{}
    });
    let showAddProject = ref(false)
    let projectName = ref("")
    let rootPath = ref("")
    //ref
    const tree = ref(null)
    const input = ref(null)
    let loading = ref(false)
    let serverListening = ref(false)
    //router
    const router = useRouter();
    const route = useRoute();
    const defaultProps = {
      label: "name",
      children: "children",
    };
    let initMenu = reactive(getMenu())
    let keys = Object.keys(initMenu)
    let projectId = ref(keys.length>0?keys[0]:'')
    let menu = reactive({menu:projectId.value?initMenu[projectId.value]:[]})
    watch(initMenu,(newval,oldval)=>{
      console.log("watch initmenu change",newval)
      let keys = Object.keys(initMenu)
      // 创建第一个项目时需要指定选择
      keys.length > 0 && (!projectId.value?projectId.value = keys[keys.length-1]:'')
    },{deep:true})
    watch(projectId,(newval,oldval)=>{
      console.log("watch projectid change",newval,oldval)
      menu.menu = initMenu[newval]
      console.log(menu)

      //需要把activeItem 清掉
      activeItem.item = {}
    })
    //computed
    const dir = computed(() => {
      let menu2 = cloneDeep(menu.menu)
      let temp = {};
      let res = []
      console.log("meun",menu2)
      for(let value of menu2){
        temp[value.id] = value
      }
      console.log(temp)
      for(let value of Object.values(temp)){
        console.log('val',value)
        if(value){
          if(value.pid){
            if(!temp[value.pid].children){
              temp[value.pid].children = []
            }
            temp[value.pid].children.push(value)
          }else{
            res.push(value)
          }
        }
      }
      return res
    });
    const projectOption = computed(()=>{
      if(Object.values(initMenu).length==0){
        return []
      }
      return Object.values(initMenu).map(item=>{
        let root = item.find(child=>child.type == 'root')
          if(root){
            return {
            label:root.name,
            value:root.id
          }
        }
        
      })
    })
    const port = computed({
      get:()=>{
        console.log('port',initMenu)
        if(Object.keys(initMenu).length == 0) return ''
        console.log(projectId)
        return initMenu[projectId.value].find(item=>item.type == 'root').port
      },
      set:(val)=>{
        console.log("set Port",val)
        initMenu[projectId.value].find(item=>item.type == 'root').port = val
      }
    })
    const ports = computed(()=>{
      if(Object.keys(initMenu).length == 0)return [7999]
      let arr = Object.values(initMenu).map(item=>{
        return item.find(child=>child.type == 'root')
      }).map(item=>item.port?Number(item.port):8000)
      return [...new Set(arr)]
    })
    //method
    const nodeClick = (data,node) => {
      console.log(data,node)
      activeItem.item =menu.menu.find(item=>item.id==data.id);
      activeItem.node = node
      if(data.type == 'item'){
          router.push({
              path:"/detail"
          })
      }else{
          console.log("folder")
          router.push({
            path:"/folder"
          })
      }
      console.log("nodeclick")
      // 点击内容时 不收起
      node.expanded = true
    };
    const save = (data)=>{
      // activeItem.item.method = data.method.value
      // activeItem.item.path = data.path.value
      console.log("idex save",activeItem.item.type)
      if(activeItem.item.type !== "item")return
      try{
        console.log(data.format.value,JSON.parse(data.format.value))
        activeItem.item.format = JSON.parse( data.format.value)
      }catch{
        activeItem.item.format = data.format.value
      }
    }
    const createProject = ()=>{
      showAddProject.value = true
    }
    const saveMenu = ()=>{
      console.log("saveMenu",initMenu)
      localStorage.setItem("menu",JSON.stringify(initMenu))
    }
    
    const confirm = ()=>{
      console.log(ports.value[ports.value.length-1]+1)
      if(!projectName.value){
        ElMessage({message:"项目名称不能为空",type:"warning"})
        return
      }
      let obj = {
        id:uuidv4(),
        name: projectName.value,
        path: rootPath.value?rootPath.value:"/",
        editable: false,
        type: "root",
        port: ports.value[ports.value.length-1]+1,
        params: {},
      }
      !initMenu[obj.id] && (initMenu[obj.id] = [])
      initMenu[obj.id].push(obj)
      // menu.push(obj)
      saveMenu()
      // 跳到新建的项目去
      projectId.value = obj.id
      showAddProject.value = false

    }
    const addFolder = (data,node,e)=>{
      console.log(node)
      console.log(tree)
      console.log("addfolder",data,e)
      let {id,path} = data
      let newFolder = {
          id:uuidv4(),
          name: '',
          path: '',
          editable: true,
          type: "dir",
          pid:activeItem.item.id??id
        }
      menu.menu.push(newFolder)
      console.log(input)
      tree.value.store.defaultExpandAll = true
      setTimeout(()=>{
        input.value.focus()
      },0)
      activeItem.item = newFolder
      e.stopPropagation()
      
    }
    const addItem = (data,node,e)=>{
      console.log("addItem",data,e)
      let {id,path} = data
      // id:'2',
      //   name: "用户",
      //   path: "user",
      //   editable: false,
      //   type: "item",
      //   method:"get",
      //   params: {},
      //   format: {},
      //   pid:1
      let newItem = {
          id:uuidv4(),
          name: '',
          path: '',
          editable: true,
          type: "item",
          method:"get",
          params:{},
          format:{},
          pid:activeItem.item.id??id
        }
      menu.menu.push(newItem)
      console.log(input)
      tree.value.store.defaultExpandAll = true
      setTimeout(()=>{
        input.value.focus()
      },0)
      activeItem.item = newItem
      e.stopPropagation()
    }
    const changeName = debounce((data)=>{
       console.log("changeName",data)
      if(/^[A-Za-z]+$/g.test(data.name)){
        console.log("英文")
        !data.path && (data.path = data.name)
      }else{
        !data.path && (data.path = '')
      }
      let {id} = data
        // menu[index] = data
      for(let key in data){
        activeItem.item[key] = data[key]
      }
    },1000)
    const dbclick = (data)=>{
      console.log("dbclick")
      data.editable = true
      setTimeout(()=>{
        input.value.focus()
      },0)
    }
    const blur = (data)=>{
      console.log('blur')
      if(data.name == '' || !data.name){
        ElMessage({message:"名称不能为空",type:"warning"})
        input.value.focus()
        return
      }
      data.editable = false
     
    }
    const Del = (data,node,e)=>{
      console.log("Del",data,e)
      if(activeItem.item.type == 'root'){
         ElMessageBox.confirm('将删除整个项目？',
          '',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(res=>{
          menu.menu = []
          delete initMenu[projectId.value]
          saveMenu()
        })
      }else if(activeItem.item.type == 'dir'){
        let id = activeItem.item.id
        ElMessageBox.confirm('将删除整个整个目录？',
          '',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(res=>{
          let ids = [id]
          delItem(menu.menu,id,ids)
          console.log(ids,id)
          menu.menu = menu.menu.filter(item=>ids.findIndex(it=>it==item.id)==-1)
          initMenu[projectId.value] = menu.menu
          setTimeout(()=>{
            saveMenu()
          },1000)
        })
      }else{
          ElMessageBox.confirm('确定删除吗？',
          '',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(res=>{
            let index = menu.menu.findIndex(item=>item.id == activeItem.item.id)
            menu.menu.splice(index,1)
            activeItem.item = menu.menu.find(item=>item.type=='root')
            saveMenu()
          })
      }

        e.stopPropagation()
      
    }

    //输入完成会执行
    const finishInput = (data)=>{
      console.log("0000000000000000000000-finishinput")
      console.log(data)
      if(!data.name){
        // 无效输入 ， 删掉
      }else{
        data.editable = false
        setTimeout(()=>{
          saveMenu()
        },1000)
        let p = data.type == 'item' ? '/detail' : '/folder'
        console.log(p)
        router.push({
          path:p
        })
      }
    }
    const editorBlur = ()=>{
      setTimeout(()=>{
        saveMenu()
      },1500)
    }
    //header click group
    const createServer = ()=>{
      loading.value = true
      let arr = []
      flatPath(dir?.value[0],'/',arr)
      arr = arr.map(item=>({...item,path:transformPath(item.path)}))
      console.log(arr)
      window.createServer(port.value,arr,(obj)=>{
        console.log(obj)
        ElMessage(obj.msg,'',{
          type:"warning"
        })
        port.value = obj.port
        serverListening.value = true
        loading.value = false
      })
    }
    const closeServer = (restart=false)=>{
      loading.value = true
      window.closeServer((...data)=>{
        console.log(data)
        serverListening.value = false
        loading.value = false
        restart && createServer()
      })
    }
    const restartServer = ()=>{
      closeServer(true)
    }
    return {
      dir,
      defaultProps,
      nodeClick,
      menu,
      activeItem,
      save,
      saveMenu,
      ...toRefs(activeItem),
      showAddProject,
      createProject,
      confirm,
      projectName,
      rootPath,
      addFolder,
      addItem,
      Del,
      tree,
      projectId,
      initMenu,
      changeName,
      projectOption,
      port,
      ports,
      input,
      finishInput,
      blur,
      editorBlur,
      createServer,
      dbclick,
      loading,
      serverListening,
      closeServer,
      restartServer
    };
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.container .header {
  height: 100px;
  background-image: linear-gradient(45deg, #8ec5fc 0%, #e0c3fc 99%);
  padding: 12px 20px;
}
.container .mid-content {
  display: flex;
  flex: 1;
}
.container .mid-content .left-content {
  flex: 1;
  /* background-color: green; */
  padding: 12px;
  border-right: 1px solid #E6E6E6;
  max-width:30%
}
.container .mid-content .right-content {
  flex: 3;
  /* background-color: red; */
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-row{
  margin-bottom: 20px;
}
.container :deep(.el-tree-node__content){
  height: 30px;
}


.disable{
  color: #888;
  cursor:not-allowed;
  pointer-events: none;

}
</style>