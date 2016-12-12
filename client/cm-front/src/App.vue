<template>
  <div id="app">
    <el-card>
        <div slot="header">
          <span style="line-height: 36px;" class="header-title">客户</span>
          <el-button
            style="float: right;margin-left: 10px;"
            type="primary"
            @click="handleSelDelete"
          >删除选中</el-button>
          <el-button
            style="float: right;"
            type="primary"
            @click="handleCreate"
          >创建</el-button>
        </div>
      <el-table
        v-loading.body="loading"
        :data="clients"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          label="生日"
          width="120">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :context="_self"
          inline-template
          label="操作">
          <div>
            <el-button
              size="small"
              @click="handleEdit($index, row)">
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete($index, row)">
              删除
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close="cancelDialog">
      <el-form :model="client" :rules="clientRules" ref="clientForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="client.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth" prop="birthDay">
          <el-date-picker type="date" placeholder="选择出生日期" v-model="client.birthDay" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="client.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="client.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="client.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import BaseResource from './model/BaseResource'
let clientRes = new BaseResource('clients{/id}{/type}')
export default {
  name: 'app',
  data() {
    return {
      clients:[],
      multipleSelection: [],
      loading:true,
      dialogTitle:'',
      dialogFormVisible:true,
      formLabelWidth: '120px',
      client:{
        name:'',
        birthDay:'',
        phone:'',
        email:'',
        description:'',
        id:'',
        index:''
      },
      clientRules: {
        name:[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        birthDay:[
          { type:'date', required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { type:'email', required: true, message: '请输入电子邮箱', trigger: 'blur' }
        ],
        description: [
          {required: false}
        ]
      }
    }
  },
  components: {

  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑客户'
      this.dialogFormVisible = true
      let editClient = Object.assign({index:index}, row, {birthDay:new Date(row.birthDay), phone: `${row.phone}`})
      this.client = editClient
    },
    handleDelete(index, row) {
      this.$confirm('要删除该客户吗?', '删除客户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
            await clientRes.delete(row.id)
            this.clients.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
        } catch (err) {
            console.log(err)
        }
      })
    },
    handleCreate() {
      this.dialogTitle = '创建客户'
      this.dialogFormVisible = true
    },
    handleSelDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('要删除该客户吗?', '删除客户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            try {
              await clientRes.delete(this.multipleSelection.map((item) => {
                return item.id
              }))
              this.multipleSelection.forEach((item) => {
                let index = this.clients.indexOf(item)
                this.clients.splice(index, 1)
              })
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } catch (err) {
                console.log(err)
            }
        })
      } else {
        this.$alert('未选中客户', '删除客户', {
          confirmButtonText: '确定'
        })
      }
    },
    cancelDialog() {
      this.dialogFormVisible = false
      this.$refs.clientForm.resetFields()
    },
    confirmDialog() {
      this.$refs.clientForm.validate(async (valid) => {
        if (valid) {
          if (this.dialogTitle.indexOf('编辑') >= 0) {
              try {
                  let client = await clientRes.update(this.client.id, this.client)
                  this.dialogFormVisible = false
                  Vue.set(this.clients, this.client.index, client)
                  this.$refs.clientForm.resetFields()
              } catch (err) {
                  console.log(err)
              }
          } else {
              try {
                  let client = await clientRes.save(this.client)
                  this.dialogFormVisible = false
                  this.clients.push(client)
                  this.$refs.clientForm.resetFields()
              } catch(err) {
                  console.log(result.error)
              }
          }
        } else {
          console.log('表单验证没有通过')
          return false
        }
      })
    },
    dateFormat(row) {
      let date = new Date(row.birthDay)
      return `${date.getUTCFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
    }
  },
  async mounted() {
    this.dialogFormVisible = false
    try {
      let clientList = await clientRes.get()
      this.clients = clientList
      this.loading = false
    } catch (err) {
        console.log(err)
    }
  }
}
</script>

<style lang="scss">
  .header-title {
    font-family: "Microsoft YaHei";
    font-size: 20px;
  }
</style>
