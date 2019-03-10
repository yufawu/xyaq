/**
* @Description:    会议签到统计
* @Author:         TSY
* @CreateDate:     2018/8/29 14:13
*/
<template>
    <div>
        <div class="count">
            <div class="chart_item">
                <div v-if="isShowNoData" class="chart_nodata">
                    <div class="nodata_circle">暂无数据</div>
                </div>
                <div v-else class="data_circle">
                    <div class="data_percent">{{ signPercent }}</div>
                    <div class="data_text">学校签到率</div>
                </div>
                <div class="chart" id="chart" ref="chart"></div>
            </div>
            <div class="count_content">
                <p>考勤学校：{{totalSchool}}所</p>
                <p>签到学校数：{{signSchool}}所</p>
                <p>签到人员数：{{signPerson}}人</p>
            </div>
        </div>
        <multilevel-list :dataGroup="schoolList" text-align="right" number="2"></multilevel-list>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    //引入基本模板
    import MultilevelList from "../common/MultilevelList";

    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/pie')

    export default {
        name: "MeetingCount",
        components: {MultilevelList},
        data() {
            return {
                totalSchool: 0,//考勤学校
                signSchool: 0,//签到学校数
                signPerson: 0,//签到人员数
                isShowNoData: false,//显示或隐藏无数据提示
                signPercent: '0%',//学校签到率
                chartData: [],//饼图数据
                schoolList: [],//学校列表
                eduName: '',
                eduCount: 0,
            }
        },
        mounted() {
            this.getMeetingData();
        },
        computed: {
            meetingID() {
                return this.$store.getters.safeMeetingID;
            },
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getMeetingData() { //获取签到统计数据
                let params = {
                    'meeting_id': this.meetingID,
                    'pid': this.user.PID
                }
                this.http(this, this.user.baseURL + api.GET_MEETING_SINGING_COUNT, params, (res) => {
                    if (res.status == 1) {
                        this.totalSchool = res.data.all_school;
                        this.signSchool = res.data.all_sign_in_school;
                        this.signPerson = res.data.all_sign_in_user;
                        this.eduName = res.data.jyj_signInInfo.jyj_signInInfo;
                        this.eduCount = res.data.jyj_signInInfo.jyj_signInInfo_count;
                        this.signPercent = this.totalSchool == 0 ? 0 + '%' : (this.signSchool / this.totalSchool).toFixed(2) * 100 + '%';
                        this.chartData.push({
                            value: this.totalSchool - this.signSchool,
                            name: '未签到学校数'
                        }, {value: this.signSchool, name: '签到学校数'});
                        this.setPieChart();
                        this.setSchoolList(res.data.all_stree_user);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            setSchoolList(data) { // 设置学校数据
                this.schoolList = [];
                for (let k in data.all_school) {
                    let item = [];
                    for (let i in data.all_school[k]) {
                        item.push({
                            'name': data.all_school[k][i].AccountName,
                            'rule': data.all_school[k][i].status == 0 ? '未签到' : '已签到（' + data.all_school[k][i].signin_user_count + '人）',
                            'status': data.all_school[k][i].status != 0 ? 1 : 2    // 1：已签到（绿色）2：未签到（红色） 有些签到学校不存在status字段，所以也赋值为1
                        });
                    }
                    this.schoolList.push({
                        'name': k + '（已签到' + data.school_count[k].signin_count + '所/共' + data.school_count[k].school_count + '所）',
                        'child_arr': JSON.parse(JSON.stringify(item))
                    });
                }
                this.schoolList.unshift({'name': '教育局', 'child_arr': [{'name': this.eduName, 'rule': this.eduCount == 0 ? '未签到' : '已签到（' + this.eduCount + '人）', 'status': this.eduCount != 0 ? 1 : 2}]})
            },
            setPieChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(this.$refs.chart);
                myChart.setOption({
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['60%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.chartData,
                            color: ['#ccc', '#1c71fb']
                        }
                    ]
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .count {
        display flex
        align-items center
        width 100%
        bottomLine()
    }

    .chart {
        height px2vw(300px)
    }

    .chart_item {
        position relative
        width 50vw
    }

    .chart_nodata {
        position absolute
        width 100%
        top 0
        height px2vw(300px)
        display flex
        justify-content center
        align-items center
        z-index 1
    }

    .nodata_circle {
        display flex
        justify-content center
        align-items center
        width px2vw(250px)
        height px2vw(250px)
        border-radius 50%
        border px2vw(30px) solid bg-color
    }

    .data_circle {
        position absolute
        width 100%
        top 0
        height px2vw(300px)
        display flex
        flex-direction column
        justify-content center
        align-items center
        z-index 1
        color main-color
    }

    .data_percent {
        fontSize(60px)
    }

    .data_text {
        fontSize(26px)
    }

    .count_content p {
        margin px2vw(15px) 0
        font-weight bold
        fontSize(32px)
    }

</style>