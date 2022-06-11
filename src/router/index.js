import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {
        path:"/",
        component:()=>import("../views/index.vue"),
        children:[
            {
                path:"detail",
                component:()=>import("../components/ItemDetail.vue")
            },
            {
                path:"folder",
                component:()=>import("../components/FolderEdit.vue")
            }
        ]
    }
]

export default  createRouter({
    history:createWebHashHistory(),
    routes
})