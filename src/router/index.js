import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {
        path:"/index",
        component:()=>import("../views/index.vue"),
        children:[
            {
                path:"detail",
                component:()=>import("../components/ItemDetail.vue")
            },
            {
                path:"folder",
                component:()=>import("../components/FolderEdit.vue")
            },
            {
                path:"api",
                component:()=>import("../views/api.vue")
            }
        ]
    },
    {
        path:"/setting",
        component:()=>import("../views/setting.vue")
    }
]

export default  createRouter({
    history:createWebHashHistory(),
    routes
})