<template>
  <el-container>
    <el-header height="50px" class="bg-primary" style=" position: sticky; top: 0; z-index: 999;">
      <div class="header">
        <h1 @click="$router.push('/')">吉他曲谱爬取搜索与推荐系统</h1>
        <div>
          <template v-if="!$store.state.isUserLogin">
            <span @click="$router.push({name: 'login'})">登录</span>&nbsp;|
            <span @click="$router.push({name: 'register'})">注册</span>
          </template>
          <el-dropdown @command="handleCommand" v-else>
            <span class="el-dropdown-link text-white"><i class="el-icon-menu" style="margin-right: 3px"></i>更多功能</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
              <el-dropdown-item command="score-list">曲谱列表</el-dropdown-item>
              <el-dropdown-item command="score-create">新增曲谱</el-dropdown-item>
              <el-dropdown-item command="score-search">曲谱搜索</el-dropdown-item>
              <el-dropdown-item command="score-recommend">曲谱推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <router-view class="container"></router-view>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'setUser',
      'setToken'
    ]),
    handleCommand (routeName) {
      if (routeName === 'logout') {
        this.logout()
      } else {
        this.$router.push({ name: routeName })
      }
    },
    logout () {
      this.setUser(null)
      this.setToken('')
      this.$router.push({ name: 'score-list' })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  color: white;
  align-items: center;
  justify-content:space-between;
  h1 {
    font-size: 1.3rem;
    cursor: pointer;
  }
  .el-dropdown-link{
    font-size: 1.2rem;
    margin-right: 30px;
  }
  span {
    cursor: pointer;
  }
}
.container {
  width: 1020px;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
