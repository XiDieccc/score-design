<template>
  <div>
    <base-box type="primary" title="数据爬取">
      <el-form
        ref="crawler-form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="爬取网站">
              <el-input
                placeholder="http://www.jitaba.cn"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="爬取曲谱页数" prop="pageNumber">
              <el-input
                v-model="form.pageNumber"
                placeholder="请输入爬取曲谱页数，默认为1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: center">
            <el-button
              :loading="loading"
              type="primary"
              native-type="submit"
              @click.prevent="submit('crawler-form')"
              >开始爬取</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <div class="crawler-page">
        <h2 class="text-success">数据分析</h2>
        <div id="main" style="width:100%;height: 600px"></div>
      </div>
    </base-box>
  </div>
</template>

<script>
import ScoreService from "services/ScoreService";
import * as echarts from "echarts";

export default {
  data() {
    return {
      loading: false,
      AanlysisData: [
        {
          url: "http://www.jitaba.cn/pic/16842.html",
          crawlerTime: 759
        },
        {
          url: "http://www.jitaba.cn/pic/16841.html",
          crawlerTime: 789
        },
        {
          url: "http://www.jitaba.cn/pic/16840.html",
          crawlerTime: 754
        },
        {
          url: "http://www.jitaba.cn/pic/16839.html",
          crawlerTime: 736
        },
        {
          url: "http://www.jitaba.cn/pic/16838.html",
          crawlerTime: 653
        },
        {
          url: "http://www.jitaba.cn/pic/16837.html",
          crawlerTime: 641
        },
        {
          url: "http://www.jitaba.cn/pic/16836.html",
          crawlerTime: 674
        },
        {
          url: "http://www.jitaba.cn/pic/16835.html",
          crawlerTime: 742
        },
        {
          url: "http://www.jitaba.cn/pic/16834.html",
          crawlerTime: 636
        },
        {
          url: "http://www.jitaba.cn/pic/16833.html",
          crawlerTime: 624
        },
        {
          url: "http://www.jitaba.cn/pic/16832.html",
          crawlerTime: 668
        },
        {
          url: "http://www.jitaba.cn/pic/16831.html",
          crawlerTime: 606
        }
      ],

      form: {
        pageNumber: "1"
        // crawlerUrl: 'http://www.jitaba.cn'
      },
      rules: {
        pageNumber: {
          required: true,
          message: "请输入爬取曲谱网站页数",
          trigger: "blur"
        }
        // crawlerUrl
      }
    };
  },

  mounted() {
    let chartDom = document.getElementById('main')
    console.log(chartDom)
    let myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      legend: {
        data: ["销量"]
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };

    option && myChart.setOption(option);
  },

  methods: {
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        this.loading = true;
        if (valid) {
          try {
            this.AanlysisData = await ScoreService.crawlerBegin(this.form);
            console.log(this.AanlysisData);
            this.$message({
              message: "开始爬虫！爬取页面为" + this.form.pageNumber,
              type: "success",
              duration: 1000,
              onClose: () => {}
            });
          } catch (error) {
            if (
              typeof error.response.data !== "undefined" &&
              error.response.data.error
            ) {
              this.$message.error(error.response.data.error);
            } else {
              this.$message.error(
                `[${error.response.status}]，数据处理异常请稍后再试`
              );
            }
          } finally {
            this.loading = false;
          }
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>

<style>
#main{
  margin-top: 10px;
}
</style>
