/**
* @Description:    专项检查学校列表
* @Author:         TSY
* @CreateDate:     2018/6/19 17:30
*/
<template>
    <div>
        <div class="header">
            <div class="check_state">
                <button class="checking" v-for="(check,index) in checkList" :key="index"
                        :class="{ check_select: clickCheckIndex == index, first_select: index==0,last_select: index == checkList.length-1 }"
                        @click="selectCheck(index)">{{ check }}
                </button>
            </div>
            <select-area :areaList="areaList" @listenSelect="selectArea"></select-area>
        </div>
        <div class="school_list">
            <no-data-tips :data="currentSchoolList"></no-data-tips>
            <div class="school_list_item" v-for="(item,index) in currentSchoolList" :key="index"
                 @click="intoCheckDetail(item)">
                <div class="school_list_name">{{ item.school_name }}</div>
                <div v-if="item.status==0" class="school_list_state" style="color: #f60a0a">未检查</div>
                <div v-else-if="item.status==1" class="school_list_state" style="color: #e57e05">待审核</div>
                <div v-else-if="item.status==2" class="school_list_state" style="color: #42bd56">小组长已审核</div>
                <div v-else class="school_list_state" style="color: #1c71fb">检查完成</div>
                <img src="../../assets/specialCheck/btn_more_small.png">
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import {setDocumentTitle} from '../../utils/util'
    import SelectArea from "../common/SelectArea";
    import NoDataTips from "../common/NoDataTips";

    let _ = require('lodash');

    export default {
        name: "specialSchoolList",
        components: {NoDataTips, SelectArea},
        data() {
            return {
                isCheckDoing: true,//是否选中正在检查
                taskID: 0,//任务ID
                schoolList: [],//学校列表
                currentSchoolList: [],//当前选中的学校列表
                clickCheckIndex: 0,//当前选中选项的index
                checkList: [],//选项列表
                clickAreaIndex: 0,//当前选中区域的index
                areaList: [//区域列表
                    // {'areaID': '440604001', 'areaName': '祖庙街道'},
                    // {'areaID': '440604002', 'areaName': '张槎街道'},
                    // {'areaID': '440604003', 'areaName': '石湾街道'},
                    // {'areaID': '440604004', 'areaName': '南庄镇'}
                ],
            }
        },
        mounted() {
            this.taskID = this.checkTaskItem.taskID;//获取任务ID

            //设置页面标题
            let documentTitle = this.checkTaskItem.taskTitle;
            setDocumentTitle(documentTitle)

            let isLeader = this.checkTaskItem.taskIsLeader;
            if (isLeader == 1) {
                this.checkList = ['正在检查', '检查完成', '我的'];
            } else {
                this.checkList = ['正在检查', '检查完成'];
            }
            this.getStreetList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            checkTaskItem() {
                return this.$store.getters.checkTaskItem;
            }
        },
        methods: {
            getStreetList() {
                let params = {
                    'account_id': this.user.accountID,
                    'ent_type': this.user.type
                };
                this.http(this, this.user.baseURL + api.GET_SPECIAL_CHECK_STREET_LIST, params, (res) => {
                    this.areaList = [];
                    if (res.status == 1) {
                        for (let i in res.data)
                            this.areaList.push({'areaID': res.data[i].street_code, 'areaName': res.data[i].name});
                        this.getSchoolList(this.checkTaskItem.taskIsLeader);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getSchoolList(isLeader) {//获取学校列表
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'job': this.user.job,
                    'is_leader': isLeader,
                    'supervision_task_id': this.taskID
                };
                this.http(this, this.user.baseURL + api.GET_SPECIAL_CHECK_SCHOOL_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.schoolList = res.data;
                        this.refreshSchoolList();
                    } else {
                        this.$bottomToast(res.msg);
                    }
                });
            },
            selectCheck(index) {//点击选项列表
                this.clickCheckIndex = index;
                this.refreshSchoolList();
            },
            selectArea(index) {//选择区域
                this.clickAreaIndex = index;
                this.refreshSchoolList();
            },
            refreshSchoolList() {//刷新学校列表数据
                let schoolList = [];
                this.currentSchoolList = [];
                if (this.clickCheckIndex == 0) {
                    schoolList = this.schoolList.doing_list;
                } else if (this.clickCheckIndex == 1) {
                    schoolList = this.schoolList.finish_list;
                } else {
                    schoolList = this.schoolList.my_list;
                }
                if (!schoolList || schoolList.length <= 0 || this.areaList.length == 0) {
                    return;
                }
                //筛选出当前选中区域的学校列表
                this.currentSchoolList = schoolList.filter((itemFilter) => {
                    return itemFilter.street_id == this.areaList[this.clickAreaIndex].areaID;
                });
                //按审核状态排序
                this.currentSchoolList = _.sortBy(this.currentSchoolList, (item) => {
                    return item.status;
                })
            },
            intoCheckDetail(item) {//进入详情页
                let schoolItemData = {
                    'taskID': this.taskID,
                    'accountID': item.account_id,
                    'title': item.school_name,
                    'isLeader': this.checkTaskItem.taskIsLeader,
                    'taskTitle': this.checkTaskItem.taskTitle
                };
                this.$store.dispatch(types.SET_CHECK_SCHOOL_ITEM, schoolItemData);
                this.$router.push({name: 'specialCheckDetail'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .header {
        position fixed
        width 100%
        top 0
        left 0
        background white
    }

    .check_state {
        display flex
        align-items center
        width 92%
        margin 4%
        border-radius 6px
        solidBorder(main-color)
    }

    .checking {
        width 0
        flex-grow 1
        text-align center
        background white
        padding 1% 0
    }

    .first_select {
        border-radius 5px 0 0 5px
    }

    .last_select {
        border-radius 0 5px 5px 0
    }

    .check_select {
        background main-color
        color white
    }

    .school_list {
        margin-top 26%
    }

    .school_list_item {
        display flex
        align-items center
        padding 4%
        fontSize(32px)
        borderBottom()
    }

    .school_list_name {
        width 68%
        textOverflow()
    }

    .school_list_state {
        width 26%
        text-align right
        fontSize(28px)
    }

    .school_list_item img {
        width 2%
        margin-left 3%
    }

</style>