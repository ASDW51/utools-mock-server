<template>
  <div class="container">
    <div class="header">
      <Header />
    </div>
    <div class="mid-content">
      <div class="left-content">
        <el-tree :data="dir" :props="defaultProps" @node-click="nodeClick">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span >{{ node.label }}</span>
              <span v-if="data.type=='root'" style="display:flex;justify-content:space-around;align-items:center;flex:1">
                 <el-icon :size="16" color="#000000">
                     <i-ep-folder-add />
                 </el-icon>
                 <el-icon :size="16" color="#000000">
                     <IEpPlus />
                 </el-icon>
                 <el-icon :size="16" color="#000000">
                      <IEpDelete />
                 </el-icon>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="right-content">
        <router-view :active="item" @save="save"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, computed, toRefs } from "vue";
export default {
  setup() {
    console.log(uuidv4())
    let activeItem = reactive({
      item:{}
    });

    const router = useRouter();
    const route = useRoute();
    const defaultProps = {
      label: "name",
      children: "children",
    };
    const menu = reactive({
      test1: {
        name: "测试项目",
        path: "/",
        editable: false,
        type: "root",
        port: "",
        params: {},
        children: [
          {
            name: "用户",
            path: "user",
            editable: false,
            type: "item",
            method:"get",
            params: {},
            format: {},
          },
        ],
      },
    });
    const dir = computed(() => {
      let arr = [];
      for (let m of Object.values(menu)) {
        arr.push(m);
      }
      return arr;
    });
    console.log("setup")
    const nodeClick = (data,node) => {
      console.log(data,node)
      activeItem.item =data;
      if(data.type == 'item'){
          router.push({
              path:"/detail"
          })
      }
    };
    const save = (data)=>{
      activeItem.item.method = data.method.value
      activeItem.item.path = data.path.value
      activeItem.item.format = data.format.value
    }
    // ---------------------------
   
    const change = () => {};
    return {
      change,
      dir,
      defaultProps,
      nodeClick,
      menu,
      activeItem,
      save,
      ...toRefs(activeItem)
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
</style>