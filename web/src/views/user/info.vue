<template>
  <base-box type="primary" title="用户信息">
    <div class="user-info">
      <ul class="user-meta">
        <li><label class="text-primary">用户id：</label> {{ user.id }}</li>
        <li><label class="text-primary">用户邮箱：</label> {{ user.email }}</li>
        <li><label class="text-primary">你的评分信息为：</label></li>
      </ul>
    </div>
    <div class="rating-list">
      <a
        class="score-item"
        @click="
          $router.push({ name: 'score-detail', params: { id: res.score.id } })
        "
        v-for="res in scores"
        :key="res.score.id"
      >
        <div v-lazy-container="{ selector: 'img' }">
          <img :data-src="res.score.poster" :alt="res.score.name" />
          <!-- <img :src="score.poster" :alt="score.name" /> -->
        </div>
        <p>
          <strong class="name">{{ res.score.name }} </strong>
          <strong class="keys">{{ res.score.keys }}</strong>
        </p>
        <p>
          <label class="text-info">评分：</label>
          <el-rate
            :value="Number(res.star)"
            disabled
            style="display: inline-block"
          ></el-rate>
          <span style="color: #ff9900">{{ res.star }}</span>
        </p>
      </a>

    </div>
  </base-box>
</template>

<script>
import UserService from "services/UserService";
import store from "../../store";
export default {
  data() {
    return {
      user:{},
      scores:[]
    };
  },
  async created() {
    try {
        const response = await UserService.getInfo(store.state.user.id)
        this.user = response.data.user
        this.scores = response.data.scoreList
        // console.log(response)
    } catch (error) {
      this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info{
  font-size: 20px;
  .user-meta{
    list-style: none;
    li{
      margin-top: 20px;
    }
  }
}
.rating-list {
  .score-item {
    display: block;
    margin: 10px;
    margin-top: 0;
    float: left;
    font-size: 13px;
    width: 230px;
    cursor: pointer;

    img {
      // height: 160px;
      // width: 100%;
      // object-fit: cover;
      display: block;
      height: 142px;
      width: 230px;
      border-radius: 3px;
    }
    p {
      text-align: center;
      .name {
        font-size: 13px;
      }
      .keys {
        color: #e09015;
      }
    }
  }
}
img[lazy=loading] { 
  background-color: #20293a;
}
</style>
