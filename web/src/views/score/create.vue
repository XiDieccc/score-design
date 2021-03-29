<template>
  <div>
    <base-box type="primary" title="新增信息">
      <el-form ref="score-form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="歌曲名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入歌曲名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曲谱类别" prop="genre">
              <el-input v-model="form.genre" placeholder="请输入曲谱类别"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演唱歌手" prop="singer">
              <el-input v-model="form.singer" placeholder="请输入歌手名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曲谱调号" prop="keys">
              <el-input v-model="form.key" placeholder="请输入曲谱调号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曲谱海报" prop="poster">
              <el-input v-model="form.poster" placeholder="请输入曲谱海报地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曲谱评分" prop="rating">
              <el-input v-model="form.rating" placeholder="请输入曲谱评分，默认为3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="曲谱简介" prop="description">
              <el-input type="textarea" :rows="6" v-model="form.description" placeholder="请输入曲谱简介"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: center">
            <el-button :loading="loading" type="primary" native-type="submit" @click.prevent="submit('score-form')">保存</el-button>
            <el-button type="warning" @click="reset('score-form')">重置</el-button>
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
      isEdit: false,
      form: {
        name: '',
        genre: '',
        singer: '',
        keys: '',
        poster: '',
        rating: '',
        description: ''
      },
      rules: {
        name: { required: true, message: '请输入歌曲名称', trigger: 'blur' },
        genre: { required: true, message: '请输入曲谱类别', trigger: 'blur' },
        singer: { required: true, message: '请输入歌手名称', trigger: 'blur' },
        keys: { required: true, message: '请输入曲谱调号', trigger: 'blur' },
        poster: { required: true, message: '请输入曲谱海报地址', trigger: 'blur' },
        rating: { required: true, message: '请输入曲谱评分，初始为3', trigger: 'blur' },
        description: { required: true, message: '请输入曲谱简介', trigger: 'blur' }
      }
    }
  },
  async created () {
    if (this.$route.query.id) {
      this.isEdit = true
      try {
        const response = await ScoreService.getById(this.$route.query.id)
        this.form = response.data.score
      } catch (error) {
        this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
      }
    } else {
      this.isEdit = false
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
