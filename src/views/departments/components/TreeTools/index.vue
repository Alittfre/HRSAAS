<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col><span>{{ treeNode.name }}</span></el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col><el-dropdown @command="operateDepts">
          <span>操作<i class="el-icon-arrow-down el-icon--right" /> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item
              v-if="!isRoot"
              command="edit"
            >编辑部门</el-dropdown-item>
            <el-dropdown-item
              v-if="!isRoot"
              command="del"
            >删除部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown></el-col>
      </el-row></el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('editDept', this.treeNode)
      } else {
        this.$confirm('确定删除？')
          .then(() => {
            console.log(this.treeNode.id)
            return delDepartments(this.treeNode.id)
          })
          .then(() => {
            this.$emit('delDept')
            this.$message.success('删除成功')
          })
      }
    }
  }
}
</script>

<style>
</style>
