**
* @Description:    任务下发、任务列表页
* @Author:         yufawu
* @CreateDate:     2018/8/25 14:20
*/
<template>
    <div class="page_body">
        <div class="nav">
            <div class="nav_left" @click="taskType">
                {{selectType}}
                <i class="iconfont " :class="{'icon-sanjiaoxia': !isActive,'icon-triangle-up': isActive }"></i>
            </div>
            <div></div>
            <div class="nav_right" @click="taskState">
                {{selectState}}
                <i class="iconfont " :class="{'icon-sanjiaoxia':!isTaskState,'icon-triangle-up':isTaskState,  }"></i>
            </div>
            <div class=" mask mask_view" v-show="isTaskType">
                <ul class="mask_view_public type" v-for="(item,index) in publicTaskType" :key="index">
                    <li @click="changeType(index)">{{item}}</li>
                </ul>
            </div>
            <div class=" mask mask_view" v-show="isTaskState">
                <ul class="mask_view_public state">
                    <li @click="changeState(index)" v-for="(item,index) in taskPublishState" :key="index">
                        {{item.state}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="task_item" v-for="(item,index) in data" :key="index">
            <!--教育局任务列表-->
            <div @click="reviewTaskDetail(item)" v-if="user.type ==1 ">
                <p class="title">{{item.task_title}}</p>
                <p class="subtitle">{{item.create_user}}<span class="time">{{item.create_time}}</span></p>
                <div class="text_wrapper">
                    <p class="text text_gray">{{removeSpace[index]}}</p>
                </div>
            </div>
            <!--学校任务列表-->
            <div @click="reviewTaskDetail(item)" v-if="user.type != 1 ">
                <p class="title">{{item.edu_task_title}}</p>
                <p class="subtitle">{{item.create_user}}<span class="time">{{item.create_time}}</span></p>
                <div class="text_wrapper">
                    <p class="text">
                        任务时间：
                        <span :class="{
                        'text_blue':item.is_over == 0 && (item.status == 1 || item.status != 3),
                        'text_gray':item.status == 2,
                        'text_red':item.is_over ==1 && item.status<2}">
                            {{item.begin_time}}至{{item.end_time}}
                            <span v-show="item.is_over == 1 && (item.status<2 || item.status==3)">(过期)</span>
                        </span>
                    </p>
                    <p class="text text_gray">{{removeSpace[index]}}</p>
                </div>
            </div>
            <!--教育局操作按钮-->
            <div class="item_footer" v-if="user.type == 1 && item.status == 1 && item.is_over == 1">
                <span @click="reviewComplete(item.edu_task_id,item.task_title)">完成情况：{{item.finish_data}}</span>
                <span class="text_gray">任务已结束</span>
            </div>
            <div class="item_footer" v-if="user.type == 1 && item.status == 1 && item.is_over== 0">
                <span @click="reviewComplete(item.edu_task_id,item.task_title)">完成情况：{{item.finish_data}}</span>
                <span class="text_green">任务进行中</span>
            </div>
            <div class="item_footer" v-if="user.type == 1 && item.status == 0">
                <span></span>
                <span class="text_red" @click="reviewTaskDetail(item)">未发布</span>
            </div>
            <!--学校操作按钮-->
            <!--未过期任务-->
            <div class="item_footer" v-if="user.type != 1 && item.status == 0 && item.is_over == 0">
                <span @click="taskSubmit(item.status,item.create_user,item.school_task_id)">提交</span>
                <span @click="taskWrite(item.school_task_id,item.create_user,1)">填报</span>
            </div>
            <div class="item_footer" v-if="user.type != 1 && item.status == 1 && item.is_over == 0">
                <span @click="taskSubmit(item.status,item.create_user,item.school_task_id)">提交</span>
                <span class="text-gray" @click="taskWrite(item.school_task_id,item.create_user, 2)">已填报</span>
            </div>
            <div class="item_footer" v-if="user.type != 1 && item.status ==2 && item.is_over == 0">
                <span class="text_gray">已提交</span>
                <span @click="reviewDetail(item.school_task_id,item.create_user,3)">查看</span>
            </div>
            <!--过期任务-->
            <div class="item_footer" v-if="user.type != 1 && item.status == 0 && item.is_over == 1">
                <span class="text_gray">补交</span>
                <span class="right" @click="taskWrite(item.school_task_id,item.create_user,1)">填报</span>
            </div>
            <div class="item_footer" v-if="user.type != 1 &&  item.status ==1  && item.is_over == 1">
                <span class="text_red" @click="taskSubmit(item.status,item.create_user,item.school_task_id)">补交</span>
                <span class="right" @click="taskWrite(item.school_task_id,item.create_user,2)">已填报</span>
            </div>
            <div class="item_footer" v-if="user.type != 1 &&  item.status ==3  && item.is_over == 1">
                <span class="text_gray">已补交</span>
                <span class="right" @click="taskWrite(item.school_task_id,item.create_user,3)">查看</span>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'

    export default {
        name: "taskPublish",
        data() {
            return {
                isTaskType: false,  //任务类型控制显示隐藏
                isTaskState: false,//任务状态控制显示隐藏
                isActive: false,    //任务类型按钮状态切换
                data: [],
                allData: [],
                createUser: '',//任务创建人
                currentStatus: '',//任务状态
                selectType: '任务类型',
                selectState: '任务状态',
                taskPublishState: [],//任务状态切换的内容
                taskPublishStatus: '',//教育局任务下发状态
                eduTaskState: [     //教育局任务状态切换的内容
                    {state: '未发布'},
                    {state: '任务进行中'},
                    {state: '任务已结束'}
                ],
                schoolTaskState: [    //学校任务状态切换的内容
                    {state: '已提交'},
                    {state: '未提交'},
                    {state: '已超时，未提交'},
                    {state: '已补交'}
                ],
                publicTaskType: ['一次性任务','周任务','月任务'],//学校与教育局任务类型切换的内容
                removeSpace: [], //存放去除空格后的数据
                status_submit: true,
            }
        },
        mounted() {
            this.getTaskPublishList();
            if (this.user.type == 1) { //任务状态切换
                this.taskPublishState = this.eduTaskState
            }
            if (this.user.type != 1) {
                this.taskPublishState = this.schoolTaskState
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            taskID() {
                return this.$store.getters.taskPublishListID;
            }
        },
        methods: {
            reviewDetail(id, createUser, doType) {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskWrite'})
                } else {
                    this.$router.push({
                        name: 'taskWrite',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
                this.$store.dispatch(types.SET_TASK_PUBLISH_ID, id);
                this.$store.dispatch(types.SET_TASK_PUBLISH_TITLE, doType);
                this.$store.dispatch(types.SET_TASK_PUBLISH_CREATE_USER, createUser);
            },
            reviewTaskDetail(item) {
                if (this.user.type == 1) {
                    this.$store.dispatch(types.SET_TASK_PUBLISH_ID, item.edu_task_id);
                    this.$store.dispatch(types.SET_TASK_PUBLISH_TITLE, 1);
                } else {
                    this.$store.dispatch(types.SET_TASK_PUBLISH_ID, item.school_task_id);
                    this.$store.dispatch(types.SET_TASK_PUBLISH_TITLE, 1);
                }
                if (this.user.accountID) {
                    this.$router.push({name: 'taskNotice'});
                } else {
                    this.$router.push({
                        name: 'taskNotice',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            reviewComplete(id, title) {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskReviewComplete'});
                } else {
                    this.$router.push({
                        name: 'taskReviewComplete',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
                this.$store.dispatch(types.SET_TASK_PUBLISH_ID, id);
                this.$store.dispatch(types.SET_TASK_PUBLISH_TITLE, title)
            },
            unPublish() {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskNotice'})
                } else {
                    this.$router.push({
                        name: 'taskNotice',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            taskType() {
                this.isTaskType = !this.isTaskType;
                this.isActive = !this.isActive;
                this.isTaskState = false; //点击任务类型，关闭任务状态
                this.isActiveState = false;
            },
            taskState() {
                this.isTaskState = !this.isTaskState;
                this.isActiveState = !this.isActiveState;
                this.isTaskType = false; //点击任务状态，关闭任务类型
                this.isActive = false
            },
            // 学校
            taskSubmit(status, createUser, taskID) {
                this.currentStatus = status;
                this.createUser = createUser;
                //使用mint-ui确认框
                this.$messagebox.confirm('提交任务后，任务不可再修改！', '提交任务').then(action => {
                    if (action == 'confirm') {
                        this.taskSubmitConfirm(taskID);
                    }
                }).catch(e => {
                    console.log(e)
                });
            },
            taskWrite(id, createUser, doType) {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskWrite'})
                } else {
                    this.$router.push({
                        name: 'taskWrite',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
                this.$store.dispatch(types.SET_TASK_PUBLISH_ID, id);
                this.$store.dispatch(types.SET_TASK_PUBLISH_TITLE, doType);
                this.$store.dispatch(types.SET_TASK_PUBLISH_CREATE_USER, createUser);
            },
            taskSubmitConfirm(taskID) { //提交任务
                let params = {
                    'school_task_id': taskID,
                    'create_user': this.createUser
                }
                if (this.currentStatus == 0) {
                    this.$bottomToast('请先填报再提交！');
                    return
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_SUBMITINFO, params, (res) => {
                    this.$bottomToast(res.msg)
                    this.getTaskPublishList();
                })
            },
            changeState(index) { //状态改变的切换
                this.taskPublishStatus = index + 1
                this.isTaskState = false;
                this.getTaskPublishList();
                if (this.user.type != 1) {
                    this.selectState = this.schoolTaskState[index].state;
                }
                if (this.user.type == 1) {
                    this.selectState = this.eduTaskState[index].state;
                }
            },
            changeType(index) {//类型改变的切换
                this.selectType = this.publicTaskType[index];
                this.isTaskType = false;
                if (this.allData.length === 0) {
                    this.data = [];
                    return
                }
                this.data = this.allData.filter((item)=>{
                    return item.task_type == index+1;
                })
            },
            getTaskPublishList() { //获取任务列表
                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'pid': this.user.PID || this.$route.query.pid,
                    'status': this.taskPublishStatus
                }
                if (this.user.type == 1) {
                    this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_TASK_PUBLISH_LIST, params, (res) => {
                        if (res.status == 1) {
                            this.data = res.data;
                            this.allData = JSON.parse(JSON.stringify(res.data));
                            let len = this.data.length;
                            for (let i = 0; i < len; i++) {
                                let str = this.data[i].task_desc
                                let re = new RegExp("&nbsp;", "g"); //定义正则表达式--全局替换所有的空格
                                let noSpace = str.replace(re, "");
                                this.removeSpace.push(noSpace);
                            }
                        } else {
                            this.$bottomToast(res.msg);
                            this.data = [];
                        }
                    })
                }
                if (this.user.type != 1) {
                    this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_LIST, params, (res) => {
                        if (res.status == 1) {
                            this.data = res.data
                            this.allData = JSON.parse(JSON.stringify(res.data));
                            let len = this.data.length;
                            for (let i = 0; i < len; i++) {
                                let str = this.data[i].task_desc
                                let re = new RegExp("&nbsp;", "g"); //定义正则表达式--这样回替换掉字符串中所有的</br>,string_need_replace.replace('</br>','\n');只会替换掉字符串中第一个</br>
                                let noSpace = str.replace(re, "");
                                this.removeSpace.push(noSpace);
                            }
                        } else {
                            this.$bottomToast(res.msg);
                            this.data = [];
                        }
                    })
                }

            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"

    .page_body {
        background: bg-color
    }

    .nav
        display: flex
        height: px2vw(90px)
        line-height: px2vw(90px)
        borderBottom(border-color)
        background: #fff
        .icon-triangle-up {
            color: main-color
        }
        & > div
            flex: 1
            text-align: center
        .mask_view {
            position: fixed
            top: 7vh
            left: 0
            width: 100%
            height: 100%
            background: #000000 aa
            z-index: 999
            .mask_view_public {
                width: 100%
                font-size: px2vw(36px)
                z-index: 1000
                background: bg-color
                li {
                    line-height: px2vw(80px)
                    padding: 0 px2vw(100px)
                    text-align: left
                    borderBottom(bg-color)
                    background: #ffffff
                }
            }
            .state li {
                text-align: right
            }
        }

    .task_item
        font-size: px2vw(28px)
        padding-left: 5%
        borderBottom(border-color)
        background: #fff
        margin-bottom: 2%
        .title
            line-height: px2vw(80px)
            color: lightBlack-color
            font-size: px2vw(36px)
            text-align: left
            font-weight: bold
        .subtitle
            color: gray-color
            margin-bottom: px2vw(15px)
            .time
                margin-left: 5%
        .text_wrapper
            height: px2vw(100px)
            .text
                textOverflow()
                margin-top: px2vw(15px)

        .item_footer
            height: px2vw(90px)
            line-height: px2vw(90px)
            color: blue-color
            span:last-of-type {
                float: right
                padding-right: 5%
            }


</style>