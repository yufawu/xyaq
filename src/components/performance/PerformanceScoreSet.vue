/**
* @Description:    加/减分设置
* @Author:         TSY
* @CreateDate:     2018/8/28 10:03
*/
<template>
    <div>
        <div class="score_item" v-for="(item,index) in scoreData" :key="index" @touchstart="showDeleteButton(index)"
             @touchend="clearLoop">
            <input-selector label="选择考核指标类型" placeholder="点击选择" text-align="right"
                            v-model="item.type" @listenSelect="selector(index, 'type')"></input-selector>
            <input-selector label="选择考核指标内容" placeholder="点击选择" text-align="right"
                            v-model="item.content" @listenSelect="selector(index, 'content')"></input-selector>
            <label-input label="加/减分填写" placeholder="请填写数字" type="number" text-align="right"
                         v-model="item.score"></label-input>
        </div>
        <div class="desc">
            <p>加/减分说明：</p>
            <textarea rows="5" v-model="scoreDesc"></textarea>
        </div>
        <div class="footer">
            <button class="footer_add" @click="addItem()">新增</button>
            <div class="footer_right">
                <button class="footer_save" @click="saveScore">保存</button>
                <p class="footer_record" @click="intoScoreRecord()">查看加/减分记录</p>
            </div>
        </div>
        <danger-dispose-time :select-data="selectedData" :isShowSelect="isShowSelect"
                             @listenSelect="areaSelect"></danger-dispose-time>
        <div v-show="isDeleting" class="del mask" @click="closeDelDialog">
            <button class="del_btn click_item" @click="delItem">删除</button>
        </div>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import InputSelector from "../common/InputSelector";
    import LabelInput from "../common/LabelInput";
    import DangerDisposeTime from "../common/DangerDisposeTime";

    export default {
        name: "PerformanceScoreSet",
        components: {DangerDisposeTime, LabelInput, InputSelector},
        data() {
            return {
                scoreData: [{'type': '', 'content': '', 'score': ''}],// 所有加/减分数据（默认一条空数据）
                minRange: -10,//最小范围
                maxRange: 10,//最大范围
                ruleGroup: [],//评分规则项
                selectType: [],//所有的考核类型
                selectedData: [],//选择层当前显示的数据
                selectedType: 'type',//选择层的数据类型   type: 考核类型数据   content:考核内容数据
                isShowSelect: false,//是否显示区域选择层
                selectItemIndex: 0,//当前操作的是哪一项评分设置
                typeDataIndex: [-1],//记录每一项考核类型选择的index
                contentDataIndex: [-1],//记录每一项考核内容选择的index
                isDeleting: false,//是否显示删除按钮
                delIndex: -1,//记录要删除的考核项index
                scoreDesc: '',//加减分说明
            }
        },
        mounted() {
            this.getScoreItem();
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
            getScoreItem() {//获取评分项
                let params = {
                    'account_id': this.user.accountID,
                    'static_month': this.schoolItem.month,
                    'school_id': this.schoolItem.id
                }
                this.http(this, this.user.baseURL + api.GET_PERFORMANCE_SCORE_ITEM, params, (res) => {
                    if (res.status == 1) {
                        this.minRange = res.data.min_range;
                        this.max_range = res.data.max_range;
                        this.ruleGroup = res.data.ruleGroup;
                        for (let i in this.ruleGroup) {
                            this.selectType.push(this.ruleGroup[i].name);
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            addItem() {//增添  加/减分设置项
                this.scoreData.push({'type': '', 'content': '', 'score': ''});
                this.typeDataIndex.push(-1);
                this.contentDataIndex.push(-1);
            },
            intoScoreRecord() {
                this.$router.push({name: 'performanceScoreRecord'})
            },
            selector(index, type) { // 选择考核类型|内容   type--[类型：type  内容: content]
                if (type == 'content') {
                    if (this.typeDataIndex[index] == -1) {
                        this.$bottomToast('请先选择指标类型！');
                        return
                    }
                    let arr = [];
                    for (let i in this.ruleGroup[this.typeDataIndex[index]].child_arr) {
                        arr.push(this.ruleGroup[this.typeDataIndex[index]].child_arr[i].name);
                    }
                    this.selectedData = arr;
                } else {
                    this.selectedData = this.selectType;
                }
                this.isShowSelect = true;
                this.selectedType = type;
                this.selectItemIndex = index;
            },
            areaSelect(index) {//弹出层--确认选择
                this.isShowSelect = false;
                if (index == -1) { //关闭了
                    return
                }
                if (this.selectedType == 'type') {
                    this.typeDataIndex[this.selectItemIndex] = index;
                    this.scoreData[this.selectItemIndex].type = this.ruleGroup[index].name;
                    this.scoreData[this.selectItemIndex].content = '';
                    this.contentDataIndex[this.selectItemIndex] = -1;
                } else {
                    this.scoreData[this.selectItemIndex].content = this.ruleGroup[this.typeDataIndex[this.selectItemIndex]].child_arr[index].name;
                    this.contentDataIndex[this.selectItemIndex] = index;
                }
            },
            showDeleteButton(index) { //长按显示删除按钮
                clearInterval(this.looper);//再次清空定时器，防止重复注册定时器
                this.looper = setTimeout(() => {
                    this.isDeleting = true;
                    this.delIndex = index
                }, 1000);
            },
            clearLoop() {//清除定时器
                clearInterval(this.looper);
            },
            closeDelDialog() {//关闭删除弹窗
                this.isDeleting = false;
            },
            delItem() {//删除考评项
                if (this.contentDataIndex.length < 2) {
                    this.$bottomToast('请至少保留一项');
                    return
                }
                this.contentDataIndex.splice(this.delIndex, 1);
                this.typeDataIndex.splice(this.delIndex, 1);
                this.scoreData.splice(this.delIndex, 1);
                this.$bottomToast('删除成功');
            },
            saveScore() {// 提交|保存评分设置
                if (!this.checkScoreNull()) {
                    return
                }
                let saveScoreData = [];
                for (let i in this.typeDataIndex) {
                    saveScoreData.push({
                        'record_item_id': this.ruleGroup[this.typeDataIndex[i]].child_arr[this.contentDataIndex[i]].record_item_id,
                        'edu_score': this.scoreData[i].score,
                        'score': this.ruleGroup[this.typeDataIndex[i]].child_arr[this.contentDataIndex[i]].system_score,
                        'init_edu_score': this.ruleGroup[this.typeDataIndex[i]].child_arr[this.contentDataIndex[i]].edu_score,
                        'second_name': this.scoreData[i].type,
                        'trid_name': this.scoreData[i].content
                    })
                }
                let params = {
                    'remark': this.scoreDesc,
                    'account_id': this.user.accountID,
                    'user_name': this.user.userName,
                    'user_id': this.user.PID,
                    'school_id': this.schoolItem.id,
                    'data': JSON.stringify(saveScoreData)
                }
                this.http(this, this.user.baseURL + api.SUBMIT_PERFORMANCE_SCORE_ITEM, params, (res) => {
                    this.$bottomToast(res.msg);
                    if (res.status == 1) { //提交成功后重置数据
                        this.scoreData = [{'type': '', 'content': '', 'score': ''}];
                        this.typeDataIndex = [-1];
                        this.contentDataIndex = [-1];
                        this.scoreDesc = '';
                    }
                })
            },
            checkScoreNull() { //检查数据空值，并给出相应的提示
                let tips = '';
                for (let i = 0, len = this.scoreData.length; i < len; i++) {
                    if (i > 0) {
                        tips = '，若无需该项，请长按删除';
                    }
                    if (this.typeDataIndex[i] == -1) {
                        this.$bottomToast('第' + (i + 1) + '项考核指标类型不能为空' + tips);
                        return false
                    }
                    if (this.contentDataIndex[i] == -1) {
                        this.$bottomToast('第' + (i + 1) + '项考核指标内容不能为空' + tips);
                        return false
                    }
                    if (this.scoreData[i].score == '') {
                        this.$bottomToast('第' + (i + 1) + '项加/减分不能为空' + tips);
                        return false
                    }
                    if (isNaN(parseInt(this.scoreData[i].score))){
                        this.$bottomToast('第' + (i + 1) + '项加/减分请填写数字');
                        return false
                    }
                    if (parseInt(this.scoreData[i].score) < this.minRange || parseInt(this.scoreData[i].score) > this.maxRange) {
                        this.$bottomToast('第' + (i + 1) + '项加/减分填写需在'+this.minRange+'至' + this.maxRange +'范围之内');
                        return false
                    }
                }
                if (this.scoreDesc == '') {
                    this.$bottomToast('加/减分说明不能为空');
                    return false
                }
                return true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .score_item {
        border-bottom px2vw(16px) solid bg-color
    }

    .desc {
        margin-bottom px2vw(180px)
        paddingAround()
    }

    .desc p {
        width 100%
    }

    .desc textarea {
        width 100%
        margin-top px2vw(16px)
    }

    .footer {
        position fixed
        display flex
        align-items flex-start
        width 100%
        bottom 0
        left 0
        background white
        paddingAround()
    }

    .footer button {
        background main-color
        color white
        border none
        border-radius 8px
        padding px2vw(16px) px2vw(16px)
    }

    .footer_add {
        width 0
        flex 1
    }

    .footer_right {
        width 0
        flex 3
        margin-left px2vw(26px)
        text-align center
    }

    .footer_save {
        width 100%
    }

    .footer_record {
        color main-color
        margin-top px2vw(16px)
    }

    .del {
        display flex
        align-items center
        justify-content center
    }

    .del_btn {
        width 60vw
        border-radius 10px
        paddingAround()
    }
</style>