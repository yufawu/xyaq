<!--/**-->
<!--* @Description:    问卷统计-->
<!--* @Author:         TSY-->
<!--* @CreateDate:     2018/6/9 13:28-->
<!--*/-->

<template>
    <div>
        <p class="end_time">统计截止时间：{{ endTime }}</p>
        <p class="title">{{ questionnaire.title }}</p>
        <div class="commit_state">
            <span class="commit_yes">已提交问卷：{{ questionnaire.commitYes }}</span>
            <span class="commit_no">未提交问卷：{{ questionnaire.commitNo }}</span>
        </div>
        <!--问题详情-->
        <div class="ques_item">
            <div class="ques_item_title" v-html="ques.title">
                <span v-if="ques.necessary" class="ques_item_necessary">*</span>
            </div>
            <div class="ques_item_content">
                <div v-if="ques.type=='radio'||ques.type=='checkbox'" class="ques_item_content_selector"
                     v-for="(choice,i) in ques.choices" :key="i">
                    <input disabled="false" :type="ques.type" :value="choice">{{ choice }}
                </div>
                <div v-else-if="ques.type=='text'" class="ques_item_content_selector">
                    <textarea rows="5" maxlength="180"></textarea>
                </div>
                <div v-else-if="ques.type=='file'" class="ques_item_content_selector">
                    <label :for="'file'+i">
                        <img class="ques_item_upload_img" src="../../assets/img_upload.png">
                    </label>
                </div>
            </div>
        </div>
        <div class="chart_item">
            <div v-if="isShowNoData" class="chart_nodata">
                <div class="nodata_circle">暂无数据</div>
            </div>
            <div class="chart" id="chart" ref="chart"></div>
        </div>
        <div class="chart_desc_group">
            <div class="chart_desc" v-for="(item,index) in legendData" :key="index">
                <span class="chart_desc_color" :style="{ 'background': colors[index] }"></span>
                <span>{{ item }}</span>
            </div>
        </div>
        <div class="bottom">
            <button class="click_item" @click="jumpTo">跳转至</button>
            <button class="click_item" @click="nextQuestion">下一题</button>
            <button class="click_item" @click="sendStatus">报送状态</button>
        </div>
        <!--问题跳转弹窗-->
        <div class="ques_select" :class="selectAnimation" v-show="isShowSelect">
            <p class="ques_select_item" v-for="(item,index) in questionnaire.quesList" :key="index"
               @click="selectQuesItem(index)">{{ item.title }}</p>
        </div>
        <!--报送状态弹窗-->
        <div class="ques_select" :class="selectAnimation" v-show="isShowSchool">
            <select-area :class="{'select_area': isShowFixedClass}" :areaList="areaList"
                         @listenSelect="selectArea"></select-area>
            <div :class="{'school_list': isShowFixedClass}">
                <div class="school_select_item" v-for="(item,index) in currentSchoolList" :key="index">
                    <p>{{ item.AccountName }}</p>
                    <p v-if="item.is_commit==1" class="school_has_commit">已报送</p>
                    <p v-else class="school_not_commit">未报送</p>
                </div>
            </div>
        </div>
        <!--灰色遮罩层-->
        <div class="mask" v-show="isShowSelect || isShowSchool" @click="closeSelect" @touchmove.prevent></div>
    </div>
</template>

<script>
    import SelectArea from "../common/SelectArea";
    import * as api from "../../constant/api"
    import {formatDate} from "../../utils/util";

    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/pie')

    export default {
        name: "questionnaireCount",
        components: {SelectArea},
        data() {
            return {
                isShowSelect: false,//是否显示选择弹窗
                isShowSchool: false,//是否显示报送状态
                isShowFixedClass: false,//是否固定区域选择栏
                isShowSelectClass: false,//控制开关弹窗动画
                clickAreaIndex: 0,//当前选中区域的index
                areaList: [],//区域列表
                schoolList: [],//学校列表
                currentSchoolList: [],//当前选中区域的学校列表
                endTime: formatDate(new Date),//统计截止时间（当前时间）
                questionnaire: {},//问卷统计数据
                ques: {},//当前浏览问题的统计
                currentQuesIndex: 0,//当前问题的index
                isShowNoData: true,//是否显示无数据提示
                legendData: [],//饼图说明文字
                colors: ['#5495ff', '#f9c804', '#f26a55', '#b6a2df', '#ffb880', '#2fc973']
            }
        },
        mounted() {
            //获取路由参数
            this.questionnaireID = this.$route.params.id;

            this.getQuestionnaireCountData();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            selectAnimation() {
                return this.isShowSelectClass ? 'selectOpenAnimation' : 'selectCloseAnimation'
            }
        },
        methods: {
            getQuestionnaireCountData() {
                let params = {
                    'id': this.questionnaireID,
                    'account_id': this.user.accountID || this.$route.query.account_id
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_QUESTIONNAIRE_COUNT, params, (res) => {
                    if (res.status == 1) {
                        this.questionnaire = res.data;
                        //默认第一个
                        this.ques = this.questionnaire.quesList[this.currentQuesIndex];
                        this.showChart();
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            jumpTo() {//跳转至
                this.isShowSelect = true;
                this.isShowSelectClass = true;
            },
            selectQuesItem(index) {//选择问题并跳到该问题
                this.currentQuesIndex = index;
                this.showCurrentQues();
                this.closeSelect();
            },
            nextQuestion() {//下一题
                this.currentQuesIndex++;
                if (this.currentQuesIndex >= this.questionnaire.quesList.length) {
                    this.$bottomToast('已经是最后一题了');
                    return;
                }
                this.showCurrentQues();
            },
            sendStatus() {//查看报送状态
                this.isShowSchool = true;
                this.isShowSelectClass = true;
                setTimeout(() => this.isShowFixedClass = true, 500)
                this.getSubmitStatus();
            },
            getSubmitStatus() {
                if (this.schoolList.length > 0) {
                    return;
                }
                let params = {
                    'question_id': this.questionnaire.ID,
                    'account_id': this.user.accountID
                };
                //获取报送状态数据
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_QUESTIONNAIRE_SUBMIT_STATUS, params, (res) => {
                    this.schoolList = res.data;
                    for (let i in this.schoolList) {
                        this.areaList.push({
                            'areaName': this.schoolList[i].name,
                            'code': this.schoolList[i].street_code
                        });
                    }
                    this.refreshSchoolList();
                })
            },
            selectArea(index) {//区域选择
                this.clickAreaIndex = index;
                this.refreshSchoolList();
            },
            refreshSchoolList() {
                if (this.schoolList.length == 0) {
                    return;
                }
                this.currentSchoolList = this.schoolList[this.clickAreaIndex].son;
            },
            showCurrentQues() {//刷新当前问题数据
                this.ques = this.questionnaire.quesList[this.currentQuesIndex];
                this.showChart();
            },
            closeSelect() {//关闭选择弹窗
                this.isShowSelectClass = false;
                this.isShowFixedClass = false;
                setTimeout(() => {
                    this.isShowSchool = false;
                    this.isShowSelect = false;
                }, 300);
            },
            showChart() {
                //格式化数据
                this.legendData = [];
                let optionData = this.ques.optionData;
                let total = 0;
                for (let j in optionData) {
                    total += optionData[j].value
                }
                for (let i in optionData) {
                    if (optionData[i].value > 0) {//只要其中一个数据大于0，【无数据提示】不显示
                        this.isShowNoData = false;
                    }
                    let percent = Math.round(((optionData[i].value / total).toFixed(2)) * 100);
                    percent = isNaN(percent - percent) ? 0 : percent;
                    this.legendData.push(optionData[i].name + '：' + optionData[i].value + '人  占比：' + percent + '%');
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(this.$refs.chart);
                myChart.setOption({
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '60%'],
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
                            data: optionData,
                            color: this.colors
                        }
                    ],
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .end_time {
        width 100%
        padding 3% 0
        background bg-color
        text-align center
        fontSize(28px)
    }

    .title {
        width 100%
        text-align center
        fontSize(36px)
        font-weight bold
        margin 3% 0
    }

    .commit_state {
        width 100%
        text-align center
        fontSize(28px)
    }

    .commit_no {
        margin-left 8%
    }

    input[type='radio'] {
        appearance: radio
    }

    input[type='checkbox'] {
        appearance: checkbox
    }

    .ques_item {
        padding 3%
    }

    .ques_item_necessary {
        color red
    }

    .ques_item_title {
        padding 3%
        fontSize(34px)
        border-radius 5px
    }

    .ques_item_content {
        padding 0% 10%
    }

    .ques_item_content_selector {
        position relative
        margin 3% 0
    }

    .ques_item_content_selector textarea {
        width 100%
    }

    .ques_item_upload_file {
        position absolute
        left -99999px
        top 0
    }

    .ques_item_upload_img {
        width 40%
    }

    .chart {
        width 100%
        height px2vw(500px)
    }

    .chart_item {
        position relative
    }

    .chart_nodata {
        position absolute
        width 100%
        height px2vw(500px)
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
        border 20px solid bg-color
    }

    .chart_desc_group {
        width 100%
        margin-bottom px2vw(150px)
    }

    .chart_desc {
        width 100%
    }

    .chart_desc_color {
        display inline-block
        width 3vw
        height 3vw
        margin-right px2vw(24px)
        margin-left 30vw
    }

    .bottom {
        display flex
        position fixed
        align-items center
        width 100%
        bottom 0
        left 0
    }

    .bottom button {
        width 0
        flex-grow 1
        padding 5%
        background #f9f9f9
        fontSize(32px)
        color main-color
    }

    .ques_select {
        position fixed
        height 50vh
        background white
        width 100%
        left 0
        bottom 0
        overflow-y scroll
        z-index 1000
    }

    .ques_select_item {
        padding 4% 6%
        borderBottom(bg-color)
        fontSize(34px)
    }

    .select_area {
        position fixed
        top 50vh
        left 0
        width 100%
        background white
    }

    .school_list {
        margin-top 10%
    }

    .school_select_item {
        display flex
        align-items center
        justify-content space-between
        padding 2% 4%
        borderBottom(bg-color)
    }

    .school_has_commit {
        width 18%
        text-align right
        color #09c64b
    }

    .school_not_commit {
        @extend .school_has_commit
        color #ed0f0f
    }

    .selectOpenAnimation {
        animation selectOpenAnimation 0.5s
        bottom 0
    }

    .selectCloseAnimation {
        animation selectCloseAnimation 0.5s
        bottom -50vh
    }

    @keyframes selectOpenAnimation {
        0% {
            bottom -50vh
        }

        100% {
            bottom 0
        }
    }

    @keyframes selectCloseAnimation {
        0% {
            bottom 0px
        }

        100% {
            bottom -50vh
        }
    }

</style>