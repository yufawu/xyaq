/**
* @Description:    教育局/学校 通过部门筛选人员
* @Author:         TSY
* @CreateDate:     2018/10/21 22:24
*/
<template>
    <div>
        <div class="top" v-if="user.type == 1">
            <input-selector :label="currentEduName" @listenSelect="changeEdu"></input-selector>
        </div>
        <div :class="{margin: user.type != 1}">
            <school-list :show-school-list="showPeopleList" @confirm="selectPeopleClick"></school-list>
        </div>
        <danger-dispose-time :selectData="eduSelectList" :isShowSelect="isShowSelect"
        @listenSelect="eduConfirm"></danger-dispose-time>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import InputSelector from "../common/InputSelector.vue";
    import SchoolList from "./SchoolList.vue";
    import DangerDisposeTime from "../common/DangerDisposeTime.vue";
    import FillBox from "../common/FillBox";

    export default {
        components: {
            FillBox,
            DangerDisposeTime,
            SchoolList,
            InputSelector
        },
        name: "noticeSelectEduPeople",
        data() {
            return {
                currentEduName: '',//当前选择的教育局
                eduList: [],//所有教育局列表
                eduSelectList: [],//显示在选择层的教育局列表
                showPeopleList: [],//当前显示的人员列表
                isShowSelect: false//是否显示教育局选择列表
            }
        },
        mounted() {
            if (this.user.type == 1) {
                this.getEduList();
            }
            this.getPeopleList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getEduList() {//获取教育局列表
                let params = {
                    'account_id': this.user.accountID,
                    'enter_type': this.user.type
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_EDU_LIST, params, (res)=>{
                    if (res.status == 1) {
                        this.eduList = res.data;
                        for (let i in this.eduList) {
                            this.eduSelectList.push(this.eduList[i].AccountName)
                            if (this.eduList[i].AccountID == this.user.accountID) {
                                this.currentEduName = this.eduList[i].AccountName;
                            }
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getPeopleList(accountID) {//获取部门人员列表
                let params = {
                    'account_id': accountID || this.user.accountID
                }
                this.showPeopleList = [];
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_DEPARTMENT_LIST, params, (res)=>{
                    if (res.status == 1) {
                        let data = res.data || [];
                        for (let i in data) {
                            this.showPeopleList.push({'AccountName': '', 'user_list': ''});
                            this.$set(this.showPeopleList[i],'AccountName',data[i].dept_name);
                            this.$set(this.showPeopleList[i],'user_list',data[i].users);
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            eduConfirm(index) { //教育局确认选择
                this.isShowSelect = false;
                if (index == -1) {
                    return;
                }
                this.currentEduName = this.eduList[index].AccountName;
                this.getPeopleList(this.eduList[index].AccountID)
            },
            selectPeopleClick(ids) {//确认选择人员
                let people = [];//被选中的人员信息
                for (let i in ids) {
                    for (let j in this.showPeopleList) {
                        for (let k in this.showPeopleList[j].user_list) {
                            if (ids[i] == this.showPeopleList[j].user_list[k].PID) {
                                people.push(this.showPeopleList[j].user_list[k]);
                            }
                        }
                    }
                }
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS, ids);
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE, people);
                this.$router.back();
            },
            changeEdu(){
                this.isShowSelect = true;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top {
        background white
        borderBottom()
        fixedTop()
    }

    .margin {
        margin-top px2vw(-90px)
    }
</style>