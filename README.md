# MES 看板查询平台

前端样式定调为像素风，灵感来源于 ERP。

## 实现功能

- [x] 登录校验
- [x] 跨域代理
- [x] MRB 制程群组报废资料查询
- [x] 版本管理

## 开发须知

- 项目根目录下`package.json`文件中的`version`为项目版本号
- 黄信忠主任所谓的“小程序”就是`src/components/`下的 vue 文件，这些 vue 作为动态组件，在`scr/views/modulesView.vue`中被引入
  ```html
  <el-row :gutter="24">
    <el-col v-for="component in filteredComponents" :key="component.componentId" :span="6">
      <div class="pixel-card">
        <CommonComponent
          :componentId="component.componentId"
          :componentName="component.componentName"
          @click="handleComponentClick(component)"
        >
          <component
            :ref="component.name"
            :is="component.name"
            :componentId="component.componentId"
            :componentName="component.componentName"
          />
        </CommonComponent>
      </div>
    </el-col>
  </el-row>
  ```
- 本项目中使用的图标来自 iconfont，采用 symbol 样式

  - 目前已有的几个图标名分别是：
    1. `icon-calculator`
    2. `icon-signOut`
    3. `icon-signIn`
    4. `icon-kanban`
    5. `icon-settings`
    6. `icon-search`
    7. `icon-user`
    8. `icon-lock`
    9. `icon-menu`
    10. `icon-no`
    11. `icon-yes`
    12. `icon-delete`

  使用方式：

  ```html
  <svg aria-hidden="true">
    <!--icon-signIn为图标名称，可在`src/assets/iconfont/iconfont.js`中找到-->
    <use xlink:href="#icon-signIn"></use>
  </svg>
  ```

- 更新版本的更新信息暂时写在了`App.vue`中的`updateMessage`
