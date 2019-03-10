/**
* @Description:    绩效考核
* @Author:         TSY
* @CreateDate:     2018/8/20 14:22
*/
<template>
    <div>
        <div class="menu">
            <div class="menu_item" v-for="(item,index) in menuList" :key="index"
                 :class="{ menu_select: clickMenuIndex == index }" @click="selectMenu(index)">{{ item }}
            </div>
        </div>
        <div class="score">
            <p class="score_rule" @click="intoScoreRule()">评分规则</p>
            <p class="score_text">学校平均分</p>
            <p class="score_number">{{ averageScore }}</p>
            <div class="score_group">
                <div class="score_item" v-for="(item,index) in scoreList" :class="{ borderLeft: index != 0 }"
                     :key="index">
                    <span class="score_item_text">{{ item.text }}</span>
                    <span class="score_item_number">{{ item.number }}</span>
                </div>
            </div>
        </div>
        <div class="rank">
            <div class="rank_title">下属学校绩效排行</div>
            <no-data-tips :data="schoolList"></no-data-tips>
            <rank-list :data="schoolList" @select="intoDetail"></rank-list>
            <div v-show="schoolList.length>=10" class="rank_more" @click="intoSchoolRank()">查看更多排名</div>
        </div>
        <my-picker
                :show="isShowPicker"
                :columns="2"
                :defaultData="defaultDate"
                :selectData="pickerData"
                @cancel="closePicker"
                @confirm="timeConfirm"></my-picker>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import SelectArea from "../common/SelectArea";
    import RankList from "../common/RankList";
    import MyPicker from "../common/MyPicker";
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "performance",
        components: {NoDataTips, MyPicker, RankList, SelectArea},
        data() {
            return {
                menuList: ['实时统计', '按月统计'],//菜单列表
                clickMenuIndex: 0,//当前选中菜单的index
                averageScore: 0,//学校平均分
                scoreList: [
                    {'text': '学校总数', 'number': '0'},
                    {'text': '最优学校得分', 'number': '0'},
                    {'text': '最低学校得分', 'number': '0'}
                ],//分数列表
                schoolList: [],
                isShowPicker: false,//是否打开时间选择功能
                pickerData: {},//日期选择器数据
                pickDate: '',//被选中的日期
                defaultDate: [],//时间选择器默认时间
                yearRange: 10,//年 选择前后范围
            }
        },
        mounted() {
            this.setPickerData();
            this.getPerformanceData();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            selectMenu(index) { //选择菜单
                this.clickMenuIndex = index;
                if (index == 1) { // 选择日期
                    this.isShowPicker = true;
                } else {
                    this.pickDate = "";
                    this.getPerformanceData();
                }
            },
            getPerformanceData() { //获取绩效考核数据
                let params = {
                    'account_id': this.user.accountID,
                    'static_month': this.pickDate
                }
                this.http(this, this.user.baseURL + api.PERFORMANCE_INDEX, params, (res) => {
                    if (res.status == 1) {
                        this.averageScore = res.data.averageScore;
                        this.scoreList = res.data.scoreList;
                        this.schoolList = res.data.schoolList;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            setPickerData() { //设置日期选择器的数据
                let currentYear = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;
                let yearArray = [], monthArray = [];
                this.defaultDate = [
                    {'text': currentYear, 'value': 1},
                    {'text': currentMonth, 'value': 2}
                ];
                //它是通过value来定位默认值
                for (let i = currentYear - this.yearRange; i < currentYear + this.yearRange; i++) {
                    if (i == currentYear) {
                        yearArray.push({'text': i, 'value': 1});
                        continue;
                    }
                    yearArray.push({'text': i})
                }
                for (let i = 1; i < 13; i++) {
                    if (i == currentMonth) {
                        if (i < 10) {
                            monthArray.push({'text': '0' + i, 'value': 2});
                        } else {
                            monthArray.push({'text': i, 'value': 2});
                        }
                        continue;
                    }
                    if (i < 10) {
                        monthArray.push({'text': '0' + i});
                    } else {
                        monthArray.push({'text': i})
                    }
                }
                this.pickerData = {
                    data1: yearArray,
                    data2: monthArray
                }
            },
            timeConfirm(val) { //确认选择时间
                this.isShowPicker = false;
                this.pickDate = val.select1.text + '-' + val.select2.text;
                this.menuList.splice(1, 1, this.pickDate)
                this.getPerformanceData();
            },
            closePicker() { //取消选择时间
                this.isShowPicker = false;
            },
            intoScoreRule() { //进入评分规则
                this.$router.push({name: 'performanceRule'});
                this.$store.dispatch(types.SET_PERFORMANCE_SCHOOL, {'month': this.pickDate,'id': ''})
            },
            intoDetail(item) { //进入考评详情
                this.$router.push({name: 'performanceDetail'});
                this.$store.dispatch(types.SET_PERFORMANCE_SCHOOL, {'month': this.pickDate,'id': item.account_id})
            },
            intoSchoolRank() { //查看学校排行
                this.$router.push({name: 'performanceSchoolRank'});
                this.$store.dispatch(types.SET_PERFORMANCE_SCHOOL, {'month': this.pickDate,'id': ''})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .menu {
        display flex
        justify-content space-around
        background white
        fixedTop()
    }

    .menu_item {
        display inline-block
        min-width 20vw
        text-align center
        paddingAround()
        margin 0 2%
    }

    .menu_select {
        color main-color
        borderBottom(main-color)
    }

    .score {
        background -webkit-linear-gradient(top, #04aef5, #1c71fb)
        background: -o-linear-gradient(bottom, #04aef5, #1c71fb); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(bottom, #04aef5, #1c71fb); /* Firefox 3.6 - 15 */
        background: linear-gradient(to bottom, #04aef5, #1c71fb); /* 标准的语法 */
        color white
        paddingAround()
        padding-left px2vw(60px)
        fontSize(28px)
        margin-top px2vw(100px)
    }

    .score_rule {
        width 100%
        text-align right
    }

    .score_number {
        fontSize(72px)
        margin-top px2vw(20px)
        margin-bottom px2vw(30px)
    }

    .score_group {
        display flex
        align-items center
        margin-left px2vw(-60px)
    }

    .score_item {
        display flex
        flex-direction column
        justify-content center
        align-items center
        width 0
        flex 1
    }

    .score_item_text {
        fontSize(24px)
    }

    .score_item_number {
        fontSize(36px)
        margin-top px2vw(16px)
    }

    .borderLeft {
        border-left 2px solid #ffffffaa
    }

    .rank {
        border-top px2vw(16px) solid bg-color
    }

    .rank_title {
        padding px2vw(24px) px2vw(28px)
        borderBottom()
        fontSize(28px)
    }

    .rank_more {
        display flex
        align-items center
        padding px2vw(24px) px2vw(28px)
        borderBottom()
        color main-color
        justify-content center
        border none
    }

</style>