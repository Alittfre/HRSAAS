<template>

  <div v-loading="Loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTools :tree-node="company" :is-root="true" @addDept="addDept" />
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <TreeTools
            slot-scope="obj"
            :tree-node="obj.data"
            @delDept="getDepartments"
            @addDept="addDept"
            @editDept="editDept"
          />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDept="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/TreeTools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: null,
      Loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.Loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '')
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.Loading = false
    },
    addDept(node) {
      this.showDialog = true
      this.node = node
    },
    editDept(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
