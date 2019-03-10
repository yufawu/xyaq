/**
* @Description:    专项检查详情页
* @Author:         TSY
* @CreateDate:     2018/6/26 9:35
*/
<template>
    <div>
        <div class="check_list">
            <div class="check_item" v-for="(item,index) in checkData" :key="index">
                <div class="check_title" @click="checkItem(index)">
                    <p class="check_title_text">{{ item.item_title }}</p>
                    <img v-show="!isOpenItem[index]" class="check_img_up"
                         src="../../assets/specialCheck/btn_more_small.png">
                    <img v-show="isOpenItem[index]" class="check_img_down"
                         src="../../assets/specialCheck/btn_more_small_down.png">
                </div>
                <div v-show="isOpenItem[index]" class="check_item_content">
                    <div class="check_item_text">
                        <span>检查项</span>
                        <span>不符合/符合</span>
                    </div>
                    <div class="check_item_child" v-for="(child,i) in item.childitem" :key="i">
                        <p class="check_item_child_title">{{ child.item_title }}</p>
                        <el-switch class="check_switch" v-model="child.status"></el-switch>
                    </div>
                </div>
            </div>
        </div>
        <div class="other">
            <div class="other_content">
                <p class="other_text">存在问题：</p>
                <textarea class="other_input" cols="30" rows="6" maxlength="500" v-model="otherData"></textarea>
            </div>
        </div>
        <fill-box></fill-box>
        <div class="footer">
            <!-- 任务当前状态，0未处理，1已处理，2小组长审核，3教育局审核 -->
            <div class="footer_item" v-if="taskData.task_status != 0" @click="intoCreateTable">生成表单</div>
            <div class="footer_item" v-if="user.type == 2 && taskData.task_status == 0" @click="taskSubmit">提交</div>
            <div class="footer_item"
                 v-if="((taskData.task_status == 2 && user.type == 1 && taskData.is_group_leader == 1) || (taskData.task_status == 1 && checkSchoolItem.isLeader == 1))" @click="taskCheck">审核
            </div>
            <div class="footer_item" @click="intoCheckRecord">流水记录</div>
            <!--<div class="footer_item" v-if="user.type == 2 && taskData.task_status == 0" @click="intoDangerUpload">上报隐患</div>-->
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import {setDocumentTitle} from "../../utils/util";
    import FillBox from "../common/FillBox";

    export default {
        name: "SpecialCheckDetail",
        components: {FillBox},
        data() {
            return {
                isOpenItem: [],//控制每项的面板打开与折叠
                checkData: [],//检查内容
                recordData: [],//巡查记录
                taskData: [],//任务内容
                otherData: '',//其他问题
            }
        },
        mounted() {
            this.getCheckDetail();

            //设置页面标题
            let documentTitle = this.checkSchoolItem.title;
            if (this.user.type == 2) {
                documentTitle = this.checkTaskItem.taskTitle;
            }
            setDocumentTitle(documentTitle)
        },
        computed: {
            user() {//用户信息
                return this.$store.getters.userInfo;
            },
            checkSchoolItem() {
                return this.$store.getters.checkSchoolItem;
            },
            checkTaskItem() {
                return this.$store.getters.checkTaskItem;
            }
        },
        methods: {
            getCheckDetail() {//获取任务详情
                let accountID = this.user.accountID;
                if (this.user.type == 1) {
                    accountID = this.checkSchoolItem.accountID;
                }
                let params = {
                    'pid': this.user.PID,
                    'account_id': accountID,
                    'supervision_task_id': this.checkTaskItem.taskID
                };
                this.http(this, this.user.baseURL + api.GET_SPECIAL_CHECK_SCHOOL_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.checkData = res.data.itemdata;

                        //添加数据，控制折叠面板的显示或隐藏（默认展开）
                        for (let i in this.checkData) {
                            this.$set(this.isOpenItem, i, true);
                        }

                        //选项开关数据,把状态0/1改成true/false
                        for (let i in this.checkData) {
                            for (let j in this.checkData[i].childitem) {
                                this.checkData[i].childitem[j].status = this.checkData[i].childitem[j].status == 1 ? true : false;
                            }
                        }

                        this.recordData = res.data.flowdata;
                        this.taskData = res.data.taskdata;
                    } else {
                        this.$bottomToast(res.msg)
                    }
                })
            },
            checkItem(index) {//展开或折叠面板
                this.isOpenItem.splice(index, 1, !this.isOpenItem[index])
            },
            intoCreateTable() {//进入生成表单
                // this.$store.dispatch(types.SET_CHECK_SCHOOL_RECORD_ID,this.taskData.supervision_record_id);
                // this.$router.push({name: 'specialCreateTable'})
                window.location.href = this.user.baseURL + 'Api/SafetySupervision/create_table.html?supervision_record_id=' + this.taskData.supervision_record_id;
            },
            intoDangerUpload() {//进入上报隐患
                this.$router.push({name: 'dangerUpload'})
            },
            intoCheckRecord() {//进入流水记录
                let checkRecordData = {};
                checkRecordData.data = this.recordData;
                checkRecordData.taskTitle = this.checkSchoolItem.taskTitle;

                this.$store.dispatch(types.SET_CHECK_SCHOOL_RECORD, checkRecordData);
                this.$router.push({name: 'specialCheckRecord'});
            },
            taskSubmit() {//提交检查任务
                let ids = this.checkSelect();
                let params = {
                    'supervision_record_id': this.taskData.supervision_record_id,
                    'pid': this.user.PID,
                    'user_name': this.user.userName,
                    'remark': this.otherData,
                    'pass_itemids': ids
                }
                this.http(this, this.user.baseURL + api.SPECIAL_CHECK_SUBMIT, params, (res) => {
                    if (res.status == 1) {
                        this.getCheckDetail();
                    }
                    this.$bottomToast(res.msg)
                })
            },
            taskCheck() { //任务审核
                let ids = this.checkSelect();
                let params = {
                    'supervision_record_id': this.taskData.supervision_record_id,
                    'pid': this.user.PID,
                    'user_name': this.user.userName,
                    'task_status': this.taskData.task_status,
                    'pass_itemids': ids
                }
                this.http(this, this.user.baseURL + api.SPECIAL_TASK_CHECK, params, (res) => {
                    if (res.status == 1) {
                        this.getCheckDetail();
                    }
                    this.$bottomToast(res.msg)
                })
            },
            checkSelect() { // 勾选了哪些符合项的ID
                let idArr = [], ids = '';
                for (let i = 0, len = this.checkData.length; i < len; i++) {
                    for (let j = 0, ilen = this.checkData[i].childitem.length; j < ilen; j++) {
                        if (this.checkData[i].childitem[j].status) {
                            idArr.push(this.checkData[i].childitem[j].item_id);
                        }
                    }
                }
                ids = idArr.join(',');
                return ids
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .check_title {
        display flex
        align-items center
        justify-content space-between
        padding 4%
        background white
        borderBottom()
    }

    .check_title_text {
        fontSize(34px)
    }

    .check_img_up {
        width 3%
    }

    .check_img_down {
        width 6%
    }

    .check_item_child {
        @extend .check_title
        padding 2% 5%
    }

    .check_item_text {
        display flex
        justify-content space-between
        padding 1% 3%
        margin-left 4%
        background bg-color
        color vice-font-color
    }

    .check_item_content {
        -vendor-animation-duration: 0.5s;
        -vendor-animation-delay: 0.5s;
    }

    .other {
        topLine()
        padding-bottom 5%
        background white
        margin-bottom 10%
    }

    .other_content {
        background white
    }

    .other_text {
        padding 2% 4%
        font-weight bold
        fontSize(32px)
    }

    .other_input {
        width 80%
        margin-left 4%
        padding 2%
    }

    .footer {
        position fixed
        display flex
        width 100%
        bottom 0
        left 0
        background main-color
        color white
    }

    .footer_item {
        width 0
        flex-grow 1
        text-align center
        padding 3% 0
        fontSize(34px)
        borderRight(#ccc)
    }
</style>