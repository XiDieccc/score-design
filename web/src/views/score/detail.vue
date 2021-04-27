<template>
  <base-box title="" type="primary" :headerBorder="false">
    <template v-slot:title-addon>
      <div
        class="text-primary"
        style="margin-left: auto; cursor: pointer"
        @click="
          $router.push({
            path: '/scores/edit',
            query: { id: $route.params.id }
          })
        "
        v-if="$store.state.isUserLogin"
      >
        <i class="el-icon-edit"></i> 编辑曲谱
      </div>
    </template>
    <div class="score-item">
      <h2 style="text-align: center">{{ score.name }}</h2>
      <img :src="score.poster" :alt="score.name" class="score-poster" />
      <ul class="score-meta">
        <li><label class="text-info">曲谱标题：</label> {{ score.title }}</li>
        <li><label class="text-info">演唱歌手：</label> {{ score.singer }}</li>
        <li><label class="text-info">演奏指法：</label> {{ score.keys }}</li>
        <li>
          <label class="text-info">浏览量<i class="el-icon-view"></i>：</label
          >{{ score.views }}
        </li>
        <li>
          <label class="text-info">评分：</label>
          <el-rate
            :value="Number(score.rating)"
            disabled
            style="display: inline-block"
          ></el-rate>
          <span style="color: #ff9900">{{ score.rating }}</span>
        </li>
        <li>
          <label class="text-info">标签：</label>
          <span v-for="(type, index) in score.tags" :key="index"
            >{{ type }};
          </span>
        </li>
        <li>
          <label class="text-success">简介: </label>
          <p>{{ score.description }}</p>
        </li>
      </ul>
      <div class="rating-model">
        <div class="rating-info">
          <p class="text-primary">你的评分</p>
          <el-button
            native-type="submit"
            class="rating-button"
            @click="updateRating()"
            >提交评分</el-button
          >
        </div>
        <el-rate :change="setRating(rating)" v-model="rating" show-score>
        </el-rate>
      </div>

      <div class="spectrum-pic">
        <img
          v-for="(pic, index) in score.spectrum"
          :key="index"
          :src="pic"
          :alt="score.name"
        />
      </div>
      <div class="pic-scroll">
        <el-slider
          id="scroll-slider"
          v-model="value"
          vertical
          height="200px"
          @change="autoScroll(value)"
        >
        </el-slider>
      </div>
    </div>
  </base-box>
</template>

<script>
import ScoreService from "services/ScoreService";
import UserService from "services/UserService";
import store from "../../store";

export default {
  name: "ScoreDetail",
  data() {
    return {
      score: {},
      value: 0,
      rating: 0
    };
  },
  methods: {
    autoScroll(value) {
      // 页面全部高度
      const allHeight = document.body.scrollHeight;
      // 当前高度
      const _currentHeight = document.documentElement.scrollTop;
      // 速率
      const speed = Math.ceil(value / 10);
      let target = _currentHeight;
      const animation = setInterval(() => {
        target += speed;
        window.scrollTo(0, target);
        if (target >= allHeight) {
          clearInterval(animation);
          window.scrollTo(0, 0);
        }
      }, 50);
    },

    setRating(rating) {
      this.rating = rating;
    },

    async updateRating() {
      try {
        const response = await UserService.updateRating(
          this.$route.params.id,
          store.state.user.id,
          { rating: this.rating }
        );
        
        // 更新本地的user信息
        this.$store.dispatch("setUser", response.data.user);
      } catch (error) {
        this.$message.error(`[${error}]，评分更新异常请稍后再试`);
      }
    }
  },
  async created() {
    // 曲谱的id
    let id = this.$route.params.id;

    // 查询用户对该曲谱的评分
    let user = store.state.user;

    if (user && user.ratings) {
      let ratingsArr = user.ratings.split(";");
      ratingsArr.pop();
      for (let i = 0; i < ratingsArr.length; i++) {
        let temp = ratingsArr[i].split(",");
        let scoreId = Number(temp[0]);
        let rating = Number(temp[1]);
        if (id === scoreId) {
          this.rating = rating;
        }
      }
      // 若遍历到最后没有评分，依然是0
    }

    try {
      const response = await ScoreService.getById(id);
      this.score = response.data.score;
      this.score.spectrum = this.score.spectrum.split("; ");

      // TODO:  曲谱数组的校验 jpg png 去除海报
      if (
        this.score.spectrum.length >= 2 &&
        this.score.spectrum[0].includes("jpg") &&
        this.score.spectrum[1].includes("png")
      ) {
        this.score.spectrum.shift();
      }

      this.score.tags = this.score.tags.split("; ");
    } catch (error) {
      this.$message.error(`[${error}]，数据查询异常请稍后再试`);
    }
  }
};
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
      line-height: 1.4;
      label {
        width: 72px;
        display: inline-block;
      }
    }
  }
  .rating-model {
    text-align: center;
    margin-top: 30px;
    font-size: 20px;
    height: 100px;
    .rating-info {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .rating-button {
        height: 40px;
        font-size: 20px;
        background-color: #409eff;
      }
    }
    ::v-deep .el-rate__icon {
      font-size: 30px;
    }
    ::v-deep .el-rate__text {
      font-size: 30px;
      color: #409eff !important;
    }
  }
  .spectrum-pic {
    margin-top: 30px;
    img {
      display: block;
      max-width: 1000px;
      height: auto;
    }
  }
  .pic-scroll {
    position: fixed;
    top: 300px;
    right: 100px;
  }
}
</style>
