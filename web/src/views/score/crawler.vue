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
            <el-button
              type="primary"
              @click="showChart()"
              :disabled="chartLoading"
              >数据分析</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <div class="crawler-page" v-show="!chartLoading">
        <h2 class="text-success">数据分析</h2>
        <div class="crawler-text">
          <p><span class="text-info">爬虫总耗时：</span><b ref="totalTime">0</b> ms</p>
          <p><span class="text-info">共爬取数量：</span><b ref="totalQuantity">0</b></p>
          <p><span class="text-info">平均耗时：</span><b ref="averageTime">0</b> ms</p>
        </div>
        <div id="crawler-main" style="width:100%;height: 600px"></div>
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
      },
      chartLoading: true,
      AanlysisData: [],

      option: {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center",
          text: "爬虫数据分析"
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          name: '数量',
          boundaryGap: false,
          // data: date
          data: [],
            axisLabel:{
              fontSize: 13,
                  interval: 1,
                  width: 50,
                  overflow: "truncate",
                   ellipsis: '...'

                }
        },
        yAxis: {
          type: "value",
          name: "耗时/ms",
          max: 1600,
          minInterval: 100
          // boundaryGap: [0, "100%"]
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: "耗时",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(255, 70, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#F56C6C"
                },
                {
                  offset: 1,
                  color: "#409EFF"
                }
              ])
            },
            // data: data
            data: []
          }
        ]
      }
    };
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
              onClose: () => {
                this.chartLoading = false;
              }
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
            this.chartLoading = false;
          }
        } else {
          this.loading = false;
          return false;
        }
      });
    },

    async showChart() {
      let chartDom = document.getElementById("crawler-main");
      let myChart = echarts.init(chartDom);

      this.$refs.totalTime.innerHTML = this.AanlysisData.data.time
      this.$refs.totalQuantity.innerHTML = this.AanlysisData.data.scoreArr.length
      this.$refs.averageTime.innerHTML = this.AanlysisData.data.time / this.AanlysisData.data.scoreArr.length
      await this.AanlysisData.data.scoreArr.forEach(async (score, index) => {
        await this.option.xAxis.data.push(`${(index + 1)} ${score.title}`);
        await this.option.series[0].data.push(Number(score.crawlerTime));
      });
      

      
      // 设置y轴最大值为 时间最大值的1.5倍
      this.option.yAxis.max =
        this.option.yAxis.minInterval *
        Math.ceil(
          (1.5 * Math.max(...this.option.series[0].data)) /
            this.option.yAxis.minInterval
        );

      this.option && myChart.setOption(this.option);

    }

  }
};
</script>

<style>
#main {
  margin-top: 10px;
  padding-bottom: 30px;
}
.crawler-text{
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 10px;
}
</style>
