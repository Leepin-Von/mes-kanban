# 资服系统

前端样式定调为像素风，灵感来源于 ERP。

## 项目结构

```
mes-kanban/
├── src/
│   ├── components/         # 通用组件
│   │   ├── CommonComponent.vue    # 看板通用容器组件
│   │   ├── MRBGroupScrape.vue    # MRB制程群组报废查询组件
│   │   ├── MRBPartNumList.vue    # MRB料号资料列表查询组件
│   │   └── MRBPartNumScrape.vue  # MRB料号报废查询组件
│   ├── http/
│   │   └── api.js         # Axios 配置与请求封装
│   ├── modules/
│   │   └── MesKanban.vue  # 看板主模块
│   ├── router/            # 路由配置
│   ├── services/
│   │   └── api.service.js # API 服务层
│   ├── store/             # Vuex 状态管理
│   └── views/             # 页面视图
├── public/                # 静态资源
└── package.json          # 项目配置
```

## 功能特性

- 统一的像素风格UI设计
- 响应式布局适配
- 组件权限控制
- 集中的API调用管理
- 数据状态统一管理
- 用户登录控制

## 更新日志

### 2025-02-08
- 改进 API 服务缓存机制
  - 缓存有效期与用户登录状态(token)绑定
  - token 失效时自动清空缓存
  - 点击刷新按钮时清空缓存
  - 优化数据请求性能

### 2025-02-07
- 新增统一 API 服务管理
  - 抽取重复的接口调用逻辑到公共服务
  - 统一处理接口请求和错误
  - 新增公共接口:
    - getProdClass: 获取产品类别
    - getCustomerList: 获取客户代码列表 
    - getSuperOrgList: 获取课级单位列表
    - getOrgList: 获取组级单位列表

- 重构组件使用统一 API 服务
  - 优化代码结构
  - 提高可维护性

## 开发须知

- 项目根目录下`package.json`文件中的`version`为项目版本号
- 组件开发规范：
  - 所有功能组件统一放在 `src/components/` 目录下
  - 组件使用 Vuex 进行状态管理
  - 公共 API 调用统一使用 `services/api.service.js`
  - 组件命名采用 PascalCase 格式

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
    13. `icon-back`

  使用方式：
  ```html
  <svg aria-hidden="true">
    <!--icon-signIn为图标名称，可在`src/assets/iconfont/iconfont.js`中找到-->
    <use xlink:href="#icon-signIn"></use>
  </svg>
  ```

- 更新版本的更新信息暂时写在了`App.vue`中的`updateMessage`
