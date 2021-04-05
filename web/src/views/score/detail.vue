<template>
  <base-box title="" type="primary" :headerBorder= false>
    <template v-slot:title-addon>
      <div
        class="text-primary"
        style="margin-left: auto; cursor: pointer"
        @click="$router.push({path: '/scores/edit', query: {id: $route.params.id}})"
        v-if="$store.state.isUserLogin">
        <i class="el-icon-edit"></i> 编辑曲谱
      </div>
    </template>
    名称name | 标签tags | 调号keys | 演唱歌手singer | 海报poster | 简介description | 评分rating | 浏览量views（？）| 谱子spectrum
    <div class="score-item" >
      <h2 style="text-align: center">{{ score.name }}</h2>
      <img :src="score.poster" :alt="score.name" class="score-poster">
      <ul class="score-meta">
        <li><label class="text-info">演唱歌手：</label> {{ score.singer }}</li>
        <li><label class="text-info">演奏指法：</label> {{ score.keys }}</li>
        <li><label class="text-info">浏览量<i class="el-icon-view"></i>：</label>{{ score.views }}</li>
        <li><label class="text-info">评分：</label>
          <el-rate
            :value="score.rating/2"
            disabled
            style="display: inline-block"
          ></el-rate>
          <span style="color: #ff9900">{{ score.rating }}</span>
        </li>
         <li><label class="text-info">标签：</label>
          <span v-for="(type, index) in score.tags" :key="index">{{ type }}; </span>
        </li>
        <li><label class="text-success">简介: </label><p>{{ score.description }}</p></li>
      </ul>
      <div class="spectrum-pic">
        <img v-for="(pic, index) in score.spectrum" :key="index" :src="pic" :alt="score.name">
      </div>
      <div class="pic-scroll">
        <el-slider
          id="scroll-slider" v-model="value" vertical height="200px" @change="autoScroll(value)">
        </el-slider>
      </div>
    </div>
  </base-box>
</template>

<script>
import ScoreService from 'services/ScoreService'

export default {
  name: 'ScoreDetail',
  data () {
    return {
      score: {
        // id: '1',
        // name: '像我这样的人',
        // keys: 'C',
        // singer: '毛不易',
        // poster: 'https://www.jitatang.com/wp-content/uploads/2020/05/2021030307201688.jpg?x-oss-process=image/resize,m_fill,limit_0,h_200,w_300',
        // tags: [
        //   '毛不易',
        //   '才华横溢',
        //   '非常好听',
        //   '民谣',
        //   '明日之子',
        //   '单曲',
        //   '难过',
        //   '华语音乐',
        //   '毛不易',
        //   '才华横溢',
        //   '非常好听',
        //   '民谣',
        //   '明日之子',
        //   '单曲',
        //   '难过',
        //   '华语音乐'
        // ],
        // rating: 8.2,
        // views: 10,
        // description: `《像我这样的人》是首由毛不易作词、作曲并演唱的歌曲
        // 在毛不易面临大学毕业时，他试图逃离现状，又不知去往何处。2016年，毛不易在杭州地方医院实习时，他开始提笔写歌，他把这样的自己写进了歌曲《像我这样的人》中，这首歌唱出来很多人的真实写照，所以一瞬间火便全网。`,
        // spectrum: [
        //   'https://www.jitatang.com/wp-content/uploads/2020/05/2020052608563114.jpg',
        //   'https://www.jitatang.com/wp-content/uploads/2020/05/202005260857566.jpg'
        // ]
      },
      value: 0
    }
  },
  methods: {
    autoScroll (value) {
      // 页面全部高度
      const allHeight = document.body.scrollHeight
      // 当前高度
      const _currentHeight = document.documentElement.scrollTop
      // 速率
      const speed = Math.ceil(value / 10)
      let target = _currentHeight
      const animation = setInterval(() => {
        target += speed
        window.scrollTo(0, target)
        if (target >= allHeight) {
          clearInterval(animation)
          window.scrollTo(0, 0)
        }
      }, 50)
    }
  },
  async created () {
    let id = this.$route.params.id
    try {
      const response = await ScoreService.getById(id)
      this.score = response.data.score
      this.score.spectrum = this.score.spectrum.split('; ')
      this.score.tags = this.score.tags.split('; ')
    } catch (error) {
      this.$message.error(`[${error.response.status}]，数据查询异常请稍后再试`)
    }
  }
}
</script>

<style lang="scss" scoped>
.score-item {
  padding: 0 10px;
  .score-poster {
      display: block;
      height: 200px;
      width: 360px;
      border-radius: 3px;
      float: left;
  }
  .score-meta {
    list-style: none;
    margin-left: 340px;
    font-size: 14px;
    li {
      line-height: 1.4 ;
      label {
        width: 72px;
        display: inline-block;
      }
    }
  }
  .spectrum-pic{
    margin-top: 30px;
    img{
      display: block;
      max-width: 1000px;
      height: auto;
    }
  }
  .pic-scroll{
    position: fixed;
    top: 300px;
    right: 100px;
  }
}
</style>
