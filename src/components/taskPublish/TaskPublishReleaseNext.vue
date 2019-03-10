/**
* @Description: 选择职务(进行排序),选择学校
* @Author:         yufawu
* @CreateDate:     2018/8/29 11:50
*/
<template>
    <div class="publish_task">
        <p class="title">{{taskTitle}}</p>
        <div class="selector" @click="openSelectDialog()">
            <input-selector label="接收人职务"></input-selector>
        </div>
        <ul class="job_select">
            <li class="select_item" v-for="(item,index) in job_list_sort" :key="index">
                {{item.dutie_name}}<img @click="jobListDelete(index)"
                                                       src="../../assets/taskPublish/btn_cha.png"/></li>
        </ul>
        <p class="select_title">接受学校：<span @click="selectSchool">选择学校</span></p>
        <ul class="select">
            <li class="select_item" v-for="(item,index) in school_list" :key="index">
                {{school_list[index].AccountName}}<img @click="schoolListDelete(index)"
                                                       src="../../assets/taskPublish/btn_cha.png"/></li>
        </ul>
        <div v-show="isShowSelectArea" class="mask">
            <div class="mask_content">
                <div class="mask_close" @click="closeSelectDialog()">
                    <i class="iconfont icon-guanbi"></i>
                </div>
                <div class="mask_title"></div>
                <div class="mask_job_list">
                    <no-data-tips :data="jobList"></no-data-tips>
                            <div class="item">
                                <div class="checkGroup" @click="checkAll()" @click.stop>
                                    <i class="iconfont"
                                       :class="{'icon-gouxuan':isSelectAll,'icon-checkboxround0':!isSelectAll}"></i>
                                </div>
                                全部
                            </div>
                            <ul class="item_second">
                                <li v-for="(school,i) in jobList" :key="i" >
                                    <label :for="'check'+i">
                                        <input @click="stateChanged(i)" type="checkbox" name="school" :id="'check'+i" v-model="selectJob"
                                               :value="school">{{school.dutie_name}}
                                    </label>
                                </li>
                            </ul>
                </div>
            </div>
            <footer-button @click="confirm()" text="确定"></footer-button>
        </div>
        <fill-box></fill-box>
        <footer-button @click="taskPublish" text="发布任务"></footer-button>
    </div>

</template>

<script>
    import * as api from '../../constant/api';
    import * as types from '../../constant/types';
    import FillBox from "../common/FillBox";
    import FooterButton from "../common/FooterButton";
    import InputSelector from "../common/InputSelector";
    import NoDataTips from "../common/NoDataTips";
    import {sortKey} from '../../utils/util'

    export default {
        name: "taskPublishRelease",
        components: {
            NoDataTips,
            InputSelector,
            FillBox,
            FooterButton
        },
        data() {
            return {
                school_list: this.$store.getters.taskPublishSchoolList, //用户选择后返回的学校列表信息
                job_list:[],//用户选择后返回的职务列表信息，然后进行排序
                jobList:[],//后台获取的职务列表信息
                selectJob:this.$store.getters.taskPublishJobList,//点击确定后，保存选择的职务。
                selectJobIds:[],//保存选择的职务的id。判断是否全选
                isShowSelectArea:false,//遮罩的显示隐藏
                isSelectAll:false, //是否选择全部职务
            }
        },
        mounted() {
            this.getJobList();
        },
        computed: {
            job_list_sort() {//用户选择后返回的职务列表信息，进行排序
                this.job_list =this.$store.getters.taskPublishJobList;
                return sortKey(this.job_list,'dutie_id')
            },
            taskTitle() {
                return this.$store.getters.taskPublishListTitle;
            },
            user() {
                return this.$store.getters.userInfo;
            },
            taskID() {
                return this.$store.getters.taskPublishListID;
            },
        },
        methods: {
            //选择职务
            openSelectDialog () {
                this.isShowSelectArea  = true;
            },
            closeSelectDialog () {
                this.isShowSelectArea = false;
            },
            confirm () {
                this.job_list = this.selectJob;
                this.isShowSelectArea = false;
                this.$store.dispatch(types.SET_TASK_PUBLISH_JOB_LIST, this.selectJob);
            },
            // 获取职务列表
            getJobList() {

                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                }
                if(this.user.type == 1){
                    this.http(this, (this.user.baseURL || this.$route.query.host) + api.EDU_TASK_DUTY, params, (res) => {
                        if (res.status == 1) {
                            this.jobList = res.data
                            this.initFirstLevelChecked();
                            this.setFirstLevelChecked();
                        }else {
                            this.$bottomToast(res.msg);
                        }
                    })
                }
            },
            jobListDelete(index) {
                this.job_list.splice(index, 1)
            },
            //选择职务
            checkAll() {
                this.isSelectAll = !this.isSelectAll;
                if (!this.isSelectAll) {
                    this.selectJob = []
                } else if (this.isSelectAll) {
                    this.selectJob = this.jobList
                }
            },
            stateChanged( i) {//改变人员选中状态的时候，动态修改父级的选中状态
                if (this.selectJobIds.includes(this.jobList[i].dutie_id)) {//点击之前为选中状态
                    this.isSelectAll= false;//改变父级按钮的选中状态为非选中状态
                }
            },

            initFirstLevelChecked (){//初始化第一级的选中状态
                for (let k in this.selectJob){//在初始化时循环已选职务列表，取出id
                    this.selectJobIds.push(this.selectJob[k].dutie_id)
                }
                for (let i in this.jobList){
                    if(!this.selectJobIds.includes(this.jobList[i].dutie_id)){//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                        this.isSelectAll=false//改变第一级按钮的选中状态为非选中状态
                        return
                    }
                }
                this.isSelectAll = true;//改变第一级按钮的选中状态为选中状态
            },
            setFirstLevelChecked(data) {//给第一级添加选中状态
                for (let i in this.jobList) {
                    if (!this.selectJobIds.includes(this.jobList[i].dutie_id) && data != this.jobList[i].dutie_id) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                        return false
                    }
                }
                this.isSelectAll == true//改变第一级按钮的选中状态为选中状态
            },
            //选择学校
            selectSchool() {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskSelectSchool'});
                } else {
                    this.$router.push({
                        name: 'taskSelectSchool',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            schoolListDelete(index) {
                this.school_list.splice(index, 1)
            },
            taskPublish() { //发布任务
                //学校id
                let idArray = [], ids = '';
                for (let i in this.school_list) {
                    idArray.push(this.school_list[i].AccountID);
                }
                ids = idArray.join(',');
                //职务id
                let idArrayJob = [], idsJob = '';
                for (let i in this.job_list) {
                idArrayJob.push(this.job_list[i].dutie_id);
                }
                idsJob = idArrayJob.join(',');
                if(idsJob ==''){//如果没有选择职务，默认是校长（1），副校长（3），安全主任（4）。
                    idsJob ='1,3,4'
                }
                let params = {
                    'edu_task_id': this.taskID,
                    'user_name': this.user.userName,
                    'school_ids': ids,
                    'duties_ids': idsJob,
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.EDU_TASK_RELEASEINFO, params, (res) => {
                    this.$bottomToast(res.msg);
                    if (res.status == 1) { //发布成功，则返回列表页
                        if (this.user.accountID) {
                            this.$router.replace({name: 'taskPublish'});
                        } else {
                            this.$router.replace({
                                name: 'taskPublish',
                                query: {
                                    account_id: this.$route.query.account_id,
                                    host: this.$route.query.host
                                }
                            });
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"
    .publish_task {
        font-size: px2vw(34px)
        color: black-color
    }

    .title {
        padding: 0 3%
        margin-top: 1%
        line-height: px2vw(80px)
        height: px2vw(80px)
        borderBottom(bg-color)
    }

    .select_title {
        padding: 0 3%
        margin-top 4%
        span {
            float: right
            font-size: px2vw(28px)
            color: blue-color
        }
    }
    .job_select{
        padding:0 3%;
        display: flex
        flex-wrap: wrap
    }
    .select {
        padding: 3%
        margin-bottom: 40%
        display: flex
        flex-wrap: wrap
    }
    .select_item {
        background: white-color
        padding: px2vw(16px) px2vw(40px)
        margin: 2% 4% 2% 0
        position: relative
        border-radius: px2vw(35px)
        img {
            position: absolute
            top: 0
            right: -5%
            height: 45%
            width: auto
        }
    }
    .mask_content {
        position absolute
        width 100%
        bottom 0
        left 0
        background white
    }

    .mask_close {
        width 100%
        text-align right
        padding px2vw(15px) px2vw(30px)
    }

    .icon-guanbi {
        color vice-font-color
        fontSize(24px)
    }

    .mask_job_list {
        background bg-color
        padding px2vw(15px) px2vw(30px)
    }

    .mask_job_list {
        background white
        height 50vh
        overflow-y auto
    }

    .item_second li {
        padding: 0 15%
        position: relative
        line-height: px2vw(60px)
        borderBottom(bg-color)
    }
    .item_second li {
        display flex
    }

    .item_second label {
        flex 1
    }

    .icon-gouxuan {
        color: main-color
    }

    .checkGroup {
        width px2vw(40px)
        height px2vw(60px)
        display inline-block
    }

    input[type='checkbox'] {
        width: 20px;
        height: 20px;
        -webkit-appearance: none;
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
        background-size 20px 20px
        outline: none;
        position: absolute
        left: 25px
    }

    input[type='checkbox']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
        background-size 20px 20px
    }

</style>