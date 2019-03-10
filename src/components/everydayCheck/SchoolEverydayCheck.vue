/**
* @Description:    日常巡查---学校端
* @Author:         TSY
* @CreateDate:     2018/10/11 17:59
*/
<template>
    <div>
        <div class="top">
            <div class="top_content">
                <p class="top_title">{{ currentDate }}<img @click="changeDate"
                                                           src="../../assets/everydayCheck/icon-calendar.png"></p>
                <p class="top_count">今天有{{ taskAllCount }}个巡查任务！</p>
                <p class="top_tips">虽然很辛苦，但是要继续加油哦！</p>
            </div>
            <img src="../../assets/everydayCheck/bg.png">
        </div>
        <div class="content">
            <div class="count">
                <div class="count_item" @click="checkRecord(0)">
                    <span class="count_item_number">{{ taskAllCount }}</span>
                    <span class="count_item_text">待巡查</span>
                </div>
                <div class="count_item" @click="checkRecord(1)">
                    <span class="count_item_number">{{ hasCheck }}</span>
                    <span class="count_item_text">已巡查</span>
                </div>
                <div class="count_item" @click="checkRecord(2)">
                    <span class="count_item_number">{{ notCheck }}</span>
                    <span class="count_item_text">未巡查</span>
                </div>
            </div>
            <div class="record" @click="checkCount">记录统计</div>
        </div>
        <scan-code @scanSuccess="scanCodeResult" >
            <div class="scan">
                <img src="../../assets/everydayCheck/icon-scan.png">
            </div>
        </scan-code>
        <mt-datetime-picker
                v-model="pickerDate"
                ref="picker"
                type="date"
                @confirm="dateConfirm"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import {formatDate, getQueryString} from "../../utils/util";
    import ScanCode from "../common/ScanCode";

    export default {
        name: "SchoolEverydayCheck",
        components: {ScanCode},
        data() {
            return {
                currentDate: formatDate(new Date, 'YY年MM月DD日'),//当前时间
                pickerDate: new Date,
                taskAllCount: 0,//今天任务总数
                hasCheck: 0,//已巡查
                notCheck: 0,//未巡查
            }
        },
        mounted() {
            this.getCheckData();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getCheckData() {//获取巡查数据
                let params = {
                    'is_lead': this.user.isLeader,
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'static_date': formatDate(this.pickerDate, 'YY-MM-DD')
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_INDEX, params, (res) => {
                    if (res.status == 1) {
                        this.taskAllCount = res.data.unspected || 0;
                        this.hasCheck = res.data.inspected || 0;
                        this.notCheck = res.data.leave || 0;
                    } else {
                        this.taskAllCount = 0;
                        this.hasCheck = 0;
                        this.notCheck = 0;
                        this.$bottomToast(res.msg);
                    }
                })
            },
            scanCodeResult(data) { //扫码
                let inspID = getQueryString('insp_id', data);
                this.$router.push({name: 'schoolCheckDetail', query: {insp_id: inspID}});
            },
            checkRecord(index) {//查看巡查记录
                this.$router.push({name: 'schoolCheckRecord', query: {'status': index}});
                this.$store.dispatch(types.SAVE_EVERYDAY_CHECK_DATE, {
                    'date': formatDate(this.pickerDate, 'YY-MM-DD'),
                    'showDate': this.currentDate
                })
            },
            checkCount() {//查看巡查记录统计
                this.$router.push({name: 'schoolRecordCount'});
            },
            changeDate() {
                this.$refs.picker.open();
            },
            dateConfirm() {
                this.getCheckData();
                this.currentDate = formatDate(this.pickerDate, 'YY年MM月DD日')
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top {
        position relative
    }

    .top_content {
        position absolute
        width 100%
        top px2vw(100px)
        left px2vw(80px)
        color white
    }

    .top_title {
        fontSize(52px)
        display flex
        align-items center
    }

    .top_title img {
        width 7%
        margin-left px2vw(10px)
    }

    .top_count {
        fontSize(46px)
        margin-top px2vw(20px)
        margin-bottom px2vw(10px)
    }

    .top_tips {
        fontSize(32px)
    }

    .content {
        position relative
        width 90%
        margin-left 5%
        background white
        border-radius 8px
        box-shadow 0px 2px 4px #aaa
        margin-top px2vw(-150px)
        paddingAround()
        z-index 1
    }

    .count {
        display flex
        align-items center
        justify-content space-around
    }

    .count_item {
        display flex
        flex-direction column
        align-items center
        fontSize(28px)
    }

    .count_item_number {
        color main-color
        fontSize(60px)
    }

    .record {
        fontSize(34px)
        borderTop()
        margin-top px2vw(30px)
        padding-top px2vw(30px)
        color main-color
        text-align center
    }

    .scan {
        width 100%
        text-align center
        margin-top px2vw(150px)
    }

    .scan img {
        width 40%
    }
</style>