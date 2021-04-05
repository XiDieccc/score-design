<template>
  <base-box type="primary" title="曲谱列表">
    <template v-slot:title-addon>
      <div class="filter">
        <label @click="orderBy('views', $event)">热门</label>
        <label @click="orderBy('rating', $event)">高分</label>
        <label @click="filterByKeys('C')">C调</label>
        <label @click="filterByKeys('G')">G调</label>
      </div>
      <div class="text-success" style="margin-left: auto; cursor: pointer"
        @click="$router.push({name: 'score-create'})" v-if="$store.state.isUserLogin">
        <i class="el-icon-plus"></i> 新增曲谱
      </div>
    </template>
    <div class="score-list">
      <a
        class="score-item"
        @click="$router.push({name: 'score-detail', params: {id: score.id}})"
        v-for="score in scores"
        :key="score.id">
        <img :src="score.poster" :alt="score.name" />
        <p><strong class="name">{{ score. name }} </strong>
        <strong class="keys">{{ score.keys }}</strong></p>
      </a>
    </div>
  </base-box>

</template>

<script>
import ScoreService from 'services/ScoreService'
export default {
  data () {
    return {
      scores: [
        // {
        //   id: '1',
        //   name: '像我这样的人',
        //   poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
        //   keys: 'C'
        // },
        // {
        //   id: '2',
        //   name: '一千个伤心的理由',
        //   poster: 'http://www.jitaba.cn/upimg/allimg/2103/1-2103220U511T6.jpg',
        //   keys: 'G'
        // },
        // {
        //   id: '3',
        //   name: '像我这样的人',
        //   poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
        //   keys: 'C'
        // },
        // {
        //   id: '4',
        //   name: '像我这样的人',
        //   poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
        //   keys: 'C'
        // },
        // {
        //   id: '5',
        //   name: '像我这样的人',
        //   poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
        //   keys: 'C'
        // }
      ]
    }
  },
  async created () {
    try {
      const response = await ScoreService.getAll()
      this.scores = response.data.scores
    } catch (error) {
      this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
    }
  },
  methods: {
    async orderBy (field, event) {
      // console.log(event.target)
      let query = `orderby=${field}`
      try {
        const response = await ScoreService.getAll(query)
        this.scores = response.data.scores
      } catch (error) {
        this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
      }
    },
    async filterByKeys (keys, event) {
      // console.log(event.target)
      let query = `keys=${keys}`
      try {
        const response = await ScoreService.getAll(query)
        this.scores = response.data.scores
      } catch (error) {
        this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  margin-left: 10px;
  label {
    margin-right: 10px;
    color: #9b9b9b;
    font-size: 13px;
    cursor: pointer;
    &.active {
      color: #000000;
    }
  }
}
.score-list {
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
      .name{
        font-size: 13px;
      }
      .keys {
        color: #e09015;
      }
    }
  }
}
</style>
