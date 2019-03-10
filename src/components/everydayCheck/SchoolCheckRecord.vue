/**
* @Description:    巡查记录（学校）
* @Author:         TSY
* @CreateDate:     2018/10/15 11:39
*/
<template>
    <div>
        <top-button-group :operateBtn="operateBtn" :select-index="selectIndex" @click="changeBtn"></top-button-group>
        <select-area :area-list="countType" flex="true" @listenSelect="changeType"></select-area>
        <div class="record">
            <ul>
                <li class="record_item" v-for="(item,index) in showRecordData" :key="index">
                    <input-selector :label="selectCountIndex == 0 ? item[0].insp_name : item[0].user_name" v-model="item.length" text-align="right"
                                    @listenSelect="recordDetail(item)"></input-selector>
                </li>
            </ul>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import TopButtonGroup from "../common/TopButtonGroup";
    import SelectArea from "../common/SelectArea";
    import InputSelector from "../common/InputSelector";
    import FillBox from "../common/FillBox";
    import {formatDate, setDocumentTitle} from "../../utils/util";

    export default {
        name: "SchoolCheckRecord",
        components: {FillBox, InputSelector, SelectArea, TopButtonGroup},
        data() {
            return {
                selectIndex: 0,//当前选择的巡查状态
                selectCountIndex: 0,//当前选择的统计类型
                operateBtn: [{'name': '待巡查'}, {'name': '已巡查'}, {'name': '未巡查'}],//巡查状态
                countType: [{'areaName': '按地点统计'}, {'areaName': '按人员统计'}],//统计类型
                recordData: [],//所有巡查记录
                showRecordData: [],//显示的巡查记录
            }
        },
        mounted() {
            this.selectIndex = this.$route.query.status;
            this.getCheckRecord();

            //设置页面标题
            let documentTitle = this.checkDate.showDate || formatDate(new Date(), 'YY年MM月DD日');
            setDocumentTitle('巡查记录（' + documentTitle + '）')
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
            changeBtn(data) {//切换巡查状态
                this.selectIndex = data.index;
                this.getCheckRecord();
            },
            changeType(index) {//切换统计类型
                this.selectCountIndex = index;
                this.setShowRecordData();
            },
            recordDetail(data) {//查看详情
                this.$store.dispatch(types.SAVE_EVERYDAY_CHECK_RECORD, {'data': data, 'state': this.selectIndex})
                this.$router.push({name: 'schoolCheckRecordDetail'});
            },
            getCheckRecord() {//获取巡查记录
                let params = {
                    'is_lead': this.user.isLeader,
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'static_date': this.checkDate.date || '',
                    'status': this.selectIndex
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_RECORD, params, (res) => {
                    this.recordData = [];
                    if (res.status == 1) {
                        this.recordData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                    this.setShowRecordData();
                })
            },
            setShowRecordData() {//筛选显示的记录
                this.showRecordData = [];
                let idArr = [], nameArr = [];
                for (let i in this.recordData) {
                    idArr.push(this.recordData[i].insp_id);
                    nameArr.push(this.recordData[i].user_name);
                }
                if (this.selectCountIndex == 0) {//按地点统计
                    idArr = [...new Set(idArr)];
                    for (let i in idArr) {
                        let childArr = [];
                        for (let j in this.recordData) {
                            if (idArr[i] == this.recordData[j].insp_id) {
                                childArr.push(this.recordData[j]);
                            }
                        }
                        this.showRecordData.push(childArr);
                    }
                } else {
                    nameArr = [...new Set(nameArr)];
                    for (let i in nameArr) {
                        let childArr = [];
                        for (let j in this.recordData) {
                            if (nameArr[i] == this.recordData[j].user_name) {
                                childArr.push(this.recordData[j]);
                            }
                        }
                        this.showRecordData.push(childArr);
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

</style>