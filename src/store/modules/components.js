const state = {
  /**
   * MesKanban.vue 中显示的组件列表
   */
  kanbanComponents: [
    {
      name: "MRBGroupScrap",
      componentId: 54001,
      componentName: "MRB制程群组报废资料查询",
    },
    {
      name: "MRBPartNumScrap",
      componentId: 54002,
      componentName: "MRB料号报废资料查询",
    },
    {
      name: "MRBPartNumList",
      componentId: 54003,
      componentName: "MRB料号资料列表查询",
    },
    {
      name: "MRBProdClass",
      componentId: 54004,
      componentName: "MRB产品类别报废查询",
    },
  ],
  kanbanFilteredComponents: [],
  /**
   * ERP.vue 中显示的组件列表
   */
  erpComponents: [
    {
      name: "ResetUserPwd",
      componentId: 54005,
      componentName: "密码重置作业",
    },
    {
      name: "ChangeUserPwd",
      componentId: 54006,
      componentName: "使用者密码修改"
    },
  ],
  erpFilteredComponents: [],
  
};

const mutations = {
  /**
   * 过滤MesKanban.vue 中显示的组件列表
   * @param {Object} state vuex.store
   * @param {Object} components state 中的 组件列表
   */
  SET_KANBAN_FILTERED_COMPONENTS(state, components) {
    state.kanbanFilteredComponents = components;
  },
  /**
   * 过滤ERP.vue 中显示的组件列表
   * @param {Object} state vuex.state
   * @param {Object} components state 中的 组件列表
   */
  SET_ERP_FILTERED_COMPONENTS(state, components) {
    state.erpFilteredComponents = components;
  },
  
};

const actions = {
  /*
   MesKanban.vue
   */
  initKanbanFilteredComponents({ commit, state }) {
    commit("SET_KANBAN_FILTERED_COMPONENTS", state.kanbanComponents);
  },
  /*
   ERP.vue
   */
  initErpFilteredComponents({ commit, state }) {
    commit("SET_ERP_FILTERED_COMPONENTS", state.erpComponents);
  },
  
  filterComponents({ commit, state }, { routePath, searchValue }) {
    if (routePath === "/home/erp") {
      const filtered = state.erpComponents.filter(
        (component) =>
          component.componentId.toString().includes(searchValue) ||
          component.componentName.includes(searchValue)
      );
      commit("SET_ERP_FILTERED_COMPONENTS", filtered.length ? filtered : state.erpComponents);
    }
    if (routePath === "/home/kanban") {
      const filtered = state.kanbanComponents.filter(
        (component) =>
          component.componentId.toString().includes(searchValue) ||
          component.componentName.includes(searchValue)
      );
      commit("SET_KANBAN_FILTERED_COMPONENTS", filtered.length ? filtered : state.kanbanComponents);
    }
    
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
