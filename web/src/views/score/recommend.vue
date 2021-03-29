<template>
  <base-box type="primary" title="曲谱推荐" :headerBorder= false>
    <template v-slot:title-addon>
      <div class="search-model">
        <el-input class="search-info" placeholder="请输入搜索内容" v-model="info">
          <el-button class="search-button" @click="search" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </template>
    <div class="search-list" v-if="this.result">
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
      result: false,
      scores: [
        {
          id: '1',
          name: '像我这样的人',
          poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
          keys: 'C'
        },
        {
          id: '2',
          name: '一千个伤心的理由',
          poster: 'http://www.jitaba.cn/upimg/allimg/2103/1-2103220U511T6.jpg',
          keys: 'G'
        },
        {
          id: '3',
          name: '像我这样的人',
          poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
          keys: 'C'
        },
        {
          id: '4',
          name: '像我这样的人',
          poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
          keys: 'C'
        },
        {
          id: '5',
          name: '像我这样的人',
          poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
          keys: 'C'
        }
      ],
      info: ''
    }
  },
  // async created () {
  //   try {
  //     const response = await ScoreService.getAll()
  //     this.scores = response.data.scores
  //   } catch (error) {
  //     this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
  //   }
  // },
  methods: {
    async search (genre, event) {
      // TODO: search
      if (this.info) {
        this.result = true
      } else {
        this.$message({
          message: '搜索内容为空，请重新输入',
          type: 'warning',
          duration: 1500
        })
      }
    },
    async filterByGenre (genre, event) {
      // console.log(event.target)
      let query = `genre=${genre}`
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
.search-model {
  margin: auto;
  width: 500px;
  margin-top: 50px;
  margin-bottom: 50px;
  .search-info{
    border-right:none !important;
  }
  .search-button{
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
