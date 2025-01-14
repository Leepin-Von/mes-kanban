# MES 看板查询平台
前端样式定调为像素风，灵感来源于ERP。

## 实现功能
- [x] 登录校验
- [x] 跨域代理
- [x] MRB制程群组报废资料查询
- [ ] 版本管理（未测试，待部署到服务器后测试）

## 开发须知
- 项目根目录下`package.json`文件中的`version`为项目版本号
- 黄信忠主任所谓的“小程序”就是`src/components/`下的vue文件，这些vue作为子组件，在`scr/views/KanbanView.vue`中被引入
```html
<el-row :gutter="24">
    <el-col :span="6"> <!--一行暂时分为四个div-->
        <div class="pixel-card"> <!--每个被引入的子组件都用这个class为pixel-card的div所包裹-->
            <MRB />
        </div>
    </el-col>
</el-row>
```