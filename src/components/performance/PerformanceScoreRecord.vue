/**
* @Description:    绩效考核--加/减分记录
* @Author:         TSY
* @CreateDate:     2018/8/24 16:25
*/
<template>
    <div>
        <ul>
            <li class="record_item" v-for="(item,index) in recordData" :key="index">
                <label-text label="操作人姓名：" :text="item.user_name"></label-text>
                <label-text label="操作时间：" :text="item.create_time"></label-text>
                <label-text label="加/减分总分：" :text="item.sum_score + '分'"></label-text>
                <div class="score_detail" @click="checkItem(index)">
                    <span>加/减分详细内容</span>
                    <img v-show="!isOpenItem[index]" class="check_img_up"
                         src="../../assets/specialCheck/btn_more_small.png">
                    <img v-show="isOpenItem[index]" class="check_img_down"
                         src="../../assets/specialCheck/btn_more_small_down.png">
                </div>
                <ul v-show="isOpenItem[index]">
                    <li v-for="rule in item.rule_arr" :key="rule.record_item_id">
                        <label-text label="选择考核指标类型" :text="rule.second_name"></label-text>
                        <label-text label="选择考核指标内容" :text="rule.trid_name"></label-text>
                        <label-text label="加/减分填写" :text="rule.edu_score + '分'"></label-text>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import LabelText from "../common/LabelText";

    export default {
        name: "PerformanceScoreRecord",
        components: {LabelText},
        data() {
            return {
                recordData: [],//操作记录
                isOpenItem: [],//控制每项的面板打开与折叠
            }
        },
        mounted() {
            this.getScoreRecord();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            schoolItem() {
                return this.$store.getters.performanceSchoolItem;
            }
        },
        methods: {
            checkItem(index) {//展开或折叠面板
                this.isOpenItem.splice(index, 1, !this.isOpenItem[index])
            },
            getScoreRecord() { // 获取加减分操作记录
                let params = {
                    'account_id': this.user.accountID,
                    'static_month': this.schoolItem.month,
                    'school_id': this.schoolItem.id
                }
                this.http(this, this.user.baseURL + api.GET_PERFORMANCE_SCORE_RECORD, params, (res) => {
                    if (res.status == 1) {
                        this.recordData = res.data.recordData;
                        for (let i in this.recordData) {
                            this.isOpenItem[i] = false;
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .record_item{
        border-bottom px2vw(16px) solid bg-color
    }

    .score_detail{
        display flex
        align-items center
        justify-content space-between
        paddingAround()
        borderBottom()
    }

    .check_img_up {
        width 3%
    }

    .check_img_down {
        width 5%
    }
</style>