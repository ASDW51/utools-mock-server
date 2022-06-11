<template>
  <div class="item-detail">
    <div class="item-detail-top">
      <div class="title">Request</div>
      <div class="top-content">
        <div>
          <el-input
            v-model="active.path"
            placeholder="Please input"
            class="input-with-select"
          >
            <template #prepend>
              <el-select placeholder="Select" style="width: 115px" v-model="active.method">
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
          @blur="blur"
        ></b-ace-editor>
        <b-ace-editor
          v-model="mock_res"
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
import { computed, reactive, ref, toRefs, watch } from 'vue';

import {debounce} from "../util/index"

import Mock from "mockjs"
export default {
  props:{
    active:{
      type:Object,
      default:null
    }
  },
  components: { [Editor.name]:Editor },
  setup(props,{emit}) {
    console.log('item,active',props.active)
    let val = typeof props.active.format == 'object'?JSON.stringify(props.active.format,null,2):props.active.format
    let jsonStr = ref(val)
    let mock = typeof props.active.format == 'object'?JSON.stringify(Mock.mock(props.active.format),null,2):props.active.format
    let mock_res = ref(mock)
    console.log("mock_res",mock)
    watch(()=>props.active.format,(newval,oldval)=>{
        console.log("watch jsonStr change",newval,oldval)
        newval && (jsonStr.value = (newval?typeof newval=='string'?newval: JSON.stringify(newval,null,2):'{}'))
        newval && (mock_res.value = (newval?JSON.stringify(Mock.mock(newval),null,2):"{}"))
        console.log(typeof newval,newval)
        console.log("mock_res",Mock.mock(newval))
        
    })
    const options = reactive({
        readOnly:true,
        showLineNumbers:false,
        showGutter:false,
        highlightActiveLine:false,
        cursorStyle:"none"
    })
    const change = debounce(()=>{
          console.log("save",jsonStr)
          emit("save",{format:jsonStr})
    },1500)
    const blur = ()=>{
      emit("blur")
    }
    return {
        options,
        jsonStr,
        change,
        mock_res,
        blur,
        ...toRefs(props)
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