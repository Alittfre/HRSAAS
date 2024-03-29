<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
              >
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            :formatter="formatEmployment"
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="obj">
              {{ obj.row.timeOfEntry | formData }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" :disabled="!checkPermission('POINT-USER-UPDATE')" @click="$router.push(`/employees/detail/${obj.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- sync修饰符 子修改父 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import assignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: { addEmployee, assignRole },
  data() {
    return {
      EmployeeEnum,
      list: [],
      page: {
        page: 1,
        size: 5,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      treeData: [],
      showTree: false,
      userId: null,
      showRoleDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formatEmployment(cellValue) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除此员工？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (e) {
        this.$message.error(e)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    }
  },
  showQrCode(url) {
    // url存在的情况下 才弹出层
    if (url) {
      this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
      // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
      this.$nextTick(() => {
        // 此时可以确认已经有ref对象了
        QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
      })
    } else {
      this.$message.warning('该用户还未上传头像')
    }
  },
  async editRole(id) {
    this.userId = id
    await this.$refs.assignRole.getUserDetailById(id)
    this.showRoleDialog = true
  }
}
</script>

<style>
</style>
