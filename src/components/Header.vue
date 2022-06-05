<template>
    <div class="c-header">
        <div class="c-header-left">
            <div class="left-top">
                <el-select placeholder="显示当前项目" class="input-shadow">

                </el-select>
                <div class="port-div">
                    <span class="desc-text">端口</span>
                    <el-input style="width:90px;" class="input-shadow"></el-input>
                </div>
            </div>
            <div class="left-bottom">
                <el-button type="primary">创建服务</el-button>
                <el-button type="danger">关闭服务</el-button>
                <el-button type="warning">重启服务</el-button>
                <el-button type="success">导出配置</el-button>
            </div>
        </div>
        <div class="c-header-right">
            sss
        </div>
    </div>
</template>
<script>
export default {
    
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
    flex:1.5;
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
</style>