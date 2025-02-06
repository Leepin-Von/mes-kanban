const state = {
  components: [
    {
      name: 'MRBGroupScrap',
      componentId: 54001,
      componentName: 'MRB制程群组报废资料查询'
    },
    {
      name: 'MRBPartNumScrap',
      componentId: 54002,
      componentName: 'MRB料号报废资料查询'
    },
    {
      name: 'MRBPartNumList',
      componentId: 54003,
      componentName: 'MRB料号资料列表查询'
    },
  ],
  filteredComponents: []
}

const mutations = {
  SET_FILTERED_COMPONENTS(state, components) {
    state.filteredComponents = components
  }
}

const actions = {
  initFilteredComponents({ commit, state }) {
    commit('SET_FILTERED_COMPONENTS', state.components)
  },
  filterComponents({ commit, state }, searchValue) {
    const filtered = state.components.filter(component =>
      component.componentId.toString().includes(searchValue) ||
      component.componentName.toLowerCase().includes(searchValue.toLowerCase())
    )
    commit('SET_FILTERED_COMPONENTS', filtered.length ? filtered : state.components)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
