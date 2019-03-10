/**
* @Description:    巡查记录统计（学校）
* @Author:         TSY
* @CreateDate:     2018/10/24 11:17
*/
<template>
    <div>
        <div class="user_info">
            <user-info-item :user-name="user.userName" :job="user.job"></user-info-item>
            <div class="date" @click="changeDate">{{ currentDate }}<i class="iconfont icon-right-copy"></i></div>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item,index) in pageData" :key="index">
                    <div class="title">{{ item.title }}</div>
                    <ul>
                        <li v-for="(parent,i) in item.child" :key="index+i">
                            <label-text :label="parent.title" :text="parent.number+'次'" :is-parent="parent.isParent"
                                        :is-click="parent.isClick" @click="intoRepair">
                                <ul>
                                    <li v-for="(child,j) in parent.child" :key="index+i+j">
                                        <label-text :label="child.title" :text="child.number+'次'"
                                                    :is-click="child.isClick"
                                                    @click="intoCheckRecord(child)"></label-text>
                                    </li>
                                </ul>
                            </label-text>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <my-picker
                :show="isShowPicker"
                :columns="2"
                :defaultData="defaultDate"
                :selectData="pickerData"
                @cancel="closePicker"
                @confirm="timeConfirm"></my-picker>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import UserInfoItem from "../common/UserInfoItem";
    import {formatDate, getWeekFromDateString} from "../../utils/util";
    import LabelText from "../common/LabelText";
    import InputSelector from "../common/InputSelector";
    import FillBox from "../common/FillBox";
    import MyPicker from "../common/MyPicker";

    export default {
        name: "SchoolRecordCount",
        components: {MyPicker, FillBox, InputSelector, LabelText, UserInfoItem},
        data() {
            return {
                currentDate: formatDate(new Date, 'YY年MM月'),//当前时间
                date: formatDate(new Date, 'YY-MM'),
                pageData: [],
                isShowPicker: false,//是否打开时间选择功能
                pickerData: {},//日期选择器数据
                defaultDate: [],//时间选择器默认时间
                yearRange: 10,//年 选择前后范围
            }
        },
        mounted() {
            this.setPickerData();
            this.getRecordCount();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            changeDate() {
                this.isShowPicker = true;
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
                this.date = val.select1.text + '-' + val.select2.text;
                this.currentDate = val.select1.text + '年' + val.select2.text + '月';
                this.getRecordCount();
            },
            closePicker() { //取消选择时间
                this.isShowPicker = false;
            },
            intoRepair() {//进入查看补卡记录
                this.$router.push({name: 'schoolCheckRepairRecord'});
                this.$store.dispatch(types.SAVE_EVERYDAY_CHECK_DATE, {
                    'date': this.date,
                    'showDate': this.currentDate
                })
            },
            getRecordCount() {
                let params = {
                    'uid': this.user.PID,
                    'date': this.date
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_COUNT, params, (res) => {
                    if (res.status == 1) {
                        this.setPageData(res.data);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            setPageData(data) { //组合页面数据
                let doList = [], expireList = [], resubmitList = [], undoList = [];
                this.pageData = [];
                for (let i in data.doList) {
                    doList.push({
                        state: 1,
                        'isClick': true,
                        'title': data.doList[i].day + '（' + getWeekFromDateString(data.doList[i].day) + '）',
                        'number': data.doList[i].num,
                        'day': data.doList[i].day
                    })
                }
                for (let i in data.expireList) {
                    expireList.push({
                        state: 2,
                        'isClick': true,
                        'title': data.expireList[i].day + '（' + getWeekFromDateString(data.expireList[i].day) + '）',
                        'number': data.expireList[i].num,
                        'day': data.expireList[i].day
                    })
                }
                for (let i in data.resubmitList) {
                    resubmitList.push({
                        state: 3,
                        'isClick': true,
                        'title': data.resubmitList[i].day + '（' + getWeekFromDateString(data.resubmitList[i].day) + '）',
                        'number': data.resubmitList[i].num,
                        'day': data.resubmitList[i].day
                    })
                }
                for (let i in data.undoList) {
                    undoList.push({
                        state: 0,
                        'isClick': true,
                        'title': data.undoList[i].day + '（' + getWeekFromDateString(data.undoList[i].day) + '）',
                        'number': data.undoList[i].num,
                        'day': data.undoList[i].day
                    })
                }
                this.pageData.push(
                    {
                        'title': '巡查月度汇总', 'child': [
                            {'title': '待巡查', 'number': data.undoNum || 0, 'isParent': true, 'child': undoList},
                            {'title': '已巡查', 'number': data.doNum || 0, 'isParent': true, 'child': doList},
                            {'title': '未巡查', 'number': data.expireNum || 0, 'isParent': true, 'child': expireList},
                            {
                                'title': '已补卡',
                                'number': data.resubmitNum || 0,
                                'isParent': true,
                                'isClick': true,
                                'child': resubmitList
                            }
                        ]
                    },
                    {
                        'title': '日任务月度汇总',
                        'child': [{'title': '已巡查', 'number': data.dayDoNum}, {
                            'title': '待巡查',
                            'number': data.dayUndoNum
                        }]
                    },
                    {
                        'title': '周任务月度汇总',
                        'child': [{'title': '已巡查', 'number': data.weekDoNum}, {
                            'title': '待巡查',
                            'number': data.weekUndoNum
                        }]
                    },
                    {
                        'title': '月任务月度汇总',
                        'child': [{'title': '已巡查', 'number': data.monthDoNum}, {
                            'title': '待巡查',
                            'number': data.monthUndoNum
                        }]
                    },
                )
            },
            intoCheckRecord(data) {
                let showDate = data.day.split('-')[0] + '年' + data.day.split('-')[1] + '月' + data.day.split('-')[2] + '日'
                this.$store.dispatch(types.SAVE_EVERYDAY_CHECK_DATE, {
                    'date': data.day,
                    'showDate': showDate
                })
                this.$router.push({name: 'schoolCheckRecord', query: {'status': data.state}});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .user_info {
        display flex
        align-items center
        paddingAround()
        borderBottom()
    }

    .date {
        width px2vw(350px)
        color vice-font-color
        text-align right
    }

    .title {
        background bg-color
        fontSize(28px)
        color vice-font-color
        paddingSmall()
    }
</style>