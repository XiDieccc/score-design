<template>
  <base-box type="primary" title="曲谱推荐" :headerBorder="false">
    <template v-slot:title-addon>

    </template>
    <div class="search-list" v-if="this.result">
      <a
        class="score-item"
        @click="
          $router.push({ name: 'score-detail', params: { id: score.id } })
        "
        v-for="score in scores"
        :key="score.id"
      >
        <img :src="score.poster" :alt="score.name" />
        <p>
          <strong class="name">{{ score.name }} </strong>
          <strong class="keys">{{ score.keys }} </strong>
          <strong class="recommendStar">{{ score.recommendStar }}</strong>
        </p>
      </a>
    </div>
  </base-box>
</template>

<script>
import ScoreService from "services/ScoreService";
import store from '../../store'
export default {
  data() {
    return {
      result: true,
      scores: []
    };
  },
  async created() {
    try {
      // store.state.user
      const response = await ScoreService.recommend(store.state.user.id)
      this.scores = response.data.scores
      // 添加评分信息
      let ratingInfo = response.data.recommendStarArr
      for (let i = 0; i < this.scores.length; i++) {
        for (let j = 0; j < ratingInfo.length; j++) {
          if (this.scores[i].id === ratingInfo[j].id) {
            this.scores[i].recommendStar = ratingInfo[j].num
          }
        }
      }
    } catch (error) {
      this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
    }
  }

};
</script>

<style lang="scss" scoped>
.search-model {
  margin: auto;
  width: 500px;
  margin-top: 50px;
  margin-bottom: 50px;
  .search-info {
    border-right: none !important;
  }
  .search-button {
    border: none;
    background-color: white;
  }
}
.search-list {
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
      .recommendStar{
        color: #67C23A;
      }
    }
  }
}
</style>
