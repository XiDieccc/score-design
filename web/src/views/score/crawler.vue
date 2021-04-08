<template>
  <div>
    <base-box type="primary" title="数据爬取">
      <el-form ref="crawler-form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="爬取网站" >
              <el-input placeholder="http://www.jitaba.cn" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="爬取曲谱页数" prop="pageNumber">
              <el-input v-model="form.pageNumber" placeholder="请输入爬取曲谱页数，默认为1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: center">
            <el-button :loading="loading" type="primary" native-type="submit" @click.prevent="submit('crawler-form')">开始爬取</el-button>
          </el-col>
        </el-row>
      </el-form>
    </base-box>
  </div>
</template>

<script>
import ScoreService from 'services/ScoreService'

export default {
  data () {
    return {
      loading: false,
      form: {
        pageNumber: 1
        // crawlerUrl: 'http://www.jitaba.cn'
      },
      rules: {
        pageNumber: { required: true, message: '请输入爬取曲谱网站页数', trigger: 'blur' }
        // crawlerUrl
      }
    }
  },

  methods: {
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        this.loading = true
        if (valid) {
          try {
            if (this.isEdit) {
              await ScoreService.update(this.$route.query.id, this.form)
            } else {
              await ScoreService.create(this.form)
            }
            this.$message({
              message: '信息保存成功！页面将在两秒后自动跳转到信息列表页',
              type: 'success',
              duration: 2000,
              onClose: () => {
                this.$router.push({ name: 'score-list' })
              }
            })
          } catch (error) {
            if (typeof error.response.data !== 'undefined' && error.response.data.error) {
              this.$message.error(error.response.data.error)
            } else {
              this.$message.error(`[${error.response.status}]，数据处理异常请稍后再试`)
            }
          } finally {
            this.loading = false
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>

</style>
