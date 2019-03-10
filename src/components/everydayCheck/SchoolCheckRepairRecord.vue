/**
* @Description:    巡查补卡记录
* @Author:         TSY
* @CreateDate:     2018/10/25 11:24
*/
<template>
    <div>
        <div class="date">
            <span>{{checkDate.showDate}}</span>
            <i class="iconfont icon-calendar"></i>
        </div>
        <no-data-tips :data="recordData"></no-data-tips>
        <div class="item" v-for="(item,index) in recordData" :key="index">
            <div class="item_head">
                <user-info-item :avatar="item.avatar" :job="item.job" :user-name="item.name"></user-info-item>
                <div class="item_head_time">{{ item.time }}</div>
            </div>
            <p class="item_label">补卡班次：</p>
            <p class="item_label">{{ item.check_day + '，' + item.week + '，' + item.start_end }}</p>
            <p class="item_label">任务地点：</p>
            <p class="item_label">{{ item.position_name }}</p>
            <p class="item_label">补卡理由：</p>
            <p class="item_label">{{ item.sub_remark == '' ? '未填写理由' : item.sub_remark }}</p>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import {formatDate, getWeekFromDateString} from "../../utils/util";
    import UserInfoItem from "../common/UserInfoItem";
    import FillBox from "../common/FillBox";
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "SchoolCheckRepairRecord",
        components: {NoDataTips, FillBox, UserInfoItem},
        data() {
            return {
                currentDate: formatDate(new Date, 'YY年MM月'),//当前时间
                recordData: [],//补卡数据
            }
        },
        mounted() {
            this.gerRepairRecord();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            checkDate() {
                return this.$store.getters.safeCheckDate;
            }
        },
        methods: {
            gerRepairRecord() {//获取补卡记录
                let params = {
                    'uid': this.user.PID,
                    'account_id': this.user.accountID,
                    'isLead': this.user.isLeader,
                    'date': this.checkDate.date || ''
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_REPAIR_RECORD, params, (res) => {
                    if (res.status == 1) {
                        this.recordData = res.data;
                        for (let i in this.recordData) {
                            this.recordData[i].week = getWeekFromDateString(this.recordData[i].check_day);
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

    .date {
        color main-color
        background bg-color
        paddingSmall()
    }

    .item {
        bottomLine()
        paddingAround()
    }

    .item /deep/ .item_img {
        margin-left 0
    }

    .item_head {
        display flex
        width 100%
        margin-bottom px2vw(20px)
    }

    .item_head_time {
        width 70%
        align-self flex-end
        color vice-font-color
    }

    .item_label {
        margin px2vw(10px) 0
    }
</style>