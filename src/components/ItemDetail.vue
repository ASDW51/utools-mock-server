<template>
  <div class="item-detail">
    <div class="item-detail-top">
      <div class="title">Request</div>
      <div class="top-content">
        <div>
          <el-input
            v-model="path"
            placeholder="Please input"
            class="input-with-select"
          >
            <template #prepend>
              <el-select placeholder="Select" style="width: 115px" v-model="method">
                <el-option label="GET" value="get" />
                <el-option label="POST" value="post" />
                <el-option label="PUT" value="put" />
                <el-option label="DELETE" value="delete" />
              </el-select>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="item-detail-bottom">
      <div class="title">Response Mock</div>
      <div class="editor">
        <b-ace-editor
          v-model="jsonStr"
          lang="json"
          width="50%"
          height="98%"
          @change="change"
        ></b-ace-editor>
        <b-ace-editor
          v-model="jsonStr"
          lang="json"
          width="50%"
          height="98%"
          :options="options"
        ></b-ace-editor>
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "bin-editor-next";
import * as ace from "brace";
import "brace/ext/emmet";
import "brace/ext/language_tools";
import "brace/mode/json";
import "brace/snippets/json";
import "brace/theme/chrome";
import { computed, reactive, ref, watch } from 'vue';

import {debounce} from "../util/index"
export default {
  props:{
    active:{
      type:Object,
      default:null
    }
  },
  components: { [Editor.name]:Editor },
  setup(props,{emit}) {
    let active = props.active
    let path = ref(active.path)
    let method = ref(active.method)
    const jsonStr = ref(JSON.stringify(active.format,null,2))
    console.log(props.active)
    const options = reactive({
        readOnly:true,
        showLineNumbers:false,
        showGutter:false,
        highlightActiveLine:false,
        cursorStyle:"none"
    })
    const change = debounce(()=>{
          emit("save",{path,method,format:jsonStr})
    },1000)
    return {
        options,
        jsonStr,
        path,
        method,
        change
    }
  },
};
</script>
<style scoped>
.item-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.item-detail-top {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.item-detail-top .top-content {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
}
.item-detail-bottom {
  flex: 2;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e6e6e6;
}
.item-detail-bottom .editor{
    flex: 1;
    display: flex;
}
.title {
  color: #606266;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  border-bottom: 1px solid #e6e6e6;
}
.title::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 100%;
  background-image: linear-gradient(45deg, #fbab7e 0%, #f7ce68 100%);
  left: 0;
  top: 0;
}
</style>