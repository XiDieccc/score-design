<template>
  <base-box type="primary" title="曲谱推荐" :headerBorder="false">
    <template v-slot:title-addon> </template>
    <div class="recommend-list" v-if="this.result">
      <p class="cf-info">基于用户的协同过滤算法推荐结果：</p>
      <div class="user-cf">
        <a
          class="score-item"
          @click="
            $router.push({ name: 'score-detail', params: { id: score.id } })
          "
          v-for="score in userCFScores"
          :key="score.id"
        >
          <img :src="score.poster" :alt="score.name" />
          <p>
            <strong class="name">{{ score.name }} </strong>
            <strong class="keys">{{ score.keys }} </strong>
          </p>
          <p>
            <strong class="recommendStar">{{ score.recommendStar }}</strong>
          </p>
        </a>
      </div>
      <p class="cf-info separator">基于项目的协同过滤算法推荐结果：</p>
      <div class="item-cf">
        <a
          class="score-item"
          @click="
            $router.push({ name: 'score-detail', params: { id: score.id } })
          "
          v-for="score in itemCFScores"
          :key="score.id"
        >
          <img :src="score.poster" :alt="score.name" />
          <p>
            <strong class="name">{{ score.name }} </strong>
            <strong class="keys">{{ score.keys }} </strong>
          </p>
          <p>
            <strong class="recommendStar">{{ score.recommendStar }}</strong>
          </p>
        </a>
      </div>
    </div>
  </base-box>
</template>

<script>
import ScoreService from "services/ScoreService";
import store from "../../store";
export default {
  data() {
    return {
      result: true,
      userCFScores: [],
      itemCFScores: []
    };
  },
  async created() {
    try {
      // store.state.user
      const response = await ScoreService.recommend(store.state.user.id);
      this.userCFScores = response.data.UserCF.scores;
      this.itemCFScores = response.data.ItemCF.scores;
      // 添加评分信息
      let ratingInfoUserCF = response.data.UserCF.recommendStarArr;
      let ratingInfoItemCF = response.data.ItemCF.recommendStarArr;
      for (let i = 0; i < this.userCFScores.length; i++) {
        for (let j = 0; j < ratingInfoUserCF.length; j++) {
          if (this.userCFScores[i].id === ratingInfoUserCF[j].id) {
            this.userCFScores[i].recommendStar = ratingInfoUserCF[j].num;
          }
          if (this.itemCFScores[i].id === ratingInfoItemCF[j].id) {
            this.itemCFScores[i].recommendStar = ratingInfoItemCF[j].num;
          }
        }
      }
    } catch (error) {
      this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`);
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend-list {
  .separator{
    padding-top: 25px;
  }
  .cf-info {
    font-size: 30px;
    color: #409eff;
    clear: both;
  }
  // .user-cf{
  //   display: flex;
  //   justify-content: space-between;
  // }
  // .item-cf{
  //   display: flex;
  //   justify-content: space-between;
  // }
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
      height: 150px;
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
      .recommendStar {
        color: #67c23a;
      }
    }
  }
}
</style>
