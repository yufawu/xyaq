/**
* @Description:    专项检查
* @Author:         TSY
* @CreateDate:     2018/6/26 9:34
*/
<template>
    <div class="task_list">
        <no-data-tips :data="taskList"></no-data-tips>
        <vue-better-scroll ref="wrapper" class="wrapper"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadTop" @pullingUp="loadBottom">
            <ul class="list-content">
                <li class="task_item click_item" v-for="task in taskList" :key="task.supervision_task_id"
                    @click="intoSchoolList(task)">
                    <p class="task_time">检查时间：{{ task.begin_day }}至{{ task.end_day }}</p>
                    <p class="task_title">{{ task.task_title }}</p>
                    <p class="task_person">负责人：{{ task.charge_names }}</p>
                    <p class="task_num">成员数：{{ task.school_num }}人</p>
                    <div class="item_check">
                        <span class="item_check_num">检查项：{{ task.check_item_num }}</span>
                        <span class="item_check_rule">检查标准：{{ task.check_num }}</span>
                    </div>
                    <div v-if="task.status==1" class="item_state">
                        <img src="../../assets/specialCheck/icon_going.png">
                        <span class="item_state_text">正在督查...</span>
                        <div class="item_state_center"></div>
                        <!--<span v-if="task.is_leader == 1" class="item_state_verify">审核</span>-->
                    </div>
                    <div v-else class="item_state">
                        <img src="../../assets/specialCheck/icon_ok.png">
                        <span class="item_state_text">督查完成</span>
                        <div class="item_state_center"></div>
                        <!--<span v-if="task.is_leader == 1" class="item_state_verify" @click.stop="createTable">生成表单</span>-->
                    </div>
                </li>
            </ul>
            <!-- 数据不足一屏时，填充背景色 -->
            <fill-box></fill-box>
        </vue-better-scroll>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import NoDataTips from "../common/NoDataTips";
    import FillBox from "../common/FillBox";

    export default {
        name: "specialCheck",
        components: {FillBox, NoDataTips},
        data() {
            return {
                taskList: [],//任务列表
                page: 1,//当前加载的页数
                // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
                pullDownRefreshObj: {
                    threshold: 90,
                    stop: 40
                },
                // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
                pullUpLoadObj: {
                    threshold: 0,
                    txt: {
                        more: '加载更多',
                        noMore: '没有更多数据了'
                    }
                },
                startY: 0,  // 纵轴方向初始化位置
            }
        },
        created() {
            this.getTaskList();
        },
        mounted() {

        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getTaskList() {//获取任务列表
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'ent_type': this.user.type,
                    'page': this.page
                };
                this.http(this, this.user.baseURL + api.GET_SPECIAL_CHECK_TASK_LIST, params, (res) => {
                    if (res.status == 1) {
                        if (res.data) {
                            if (this.page == 1) {
                                this.taskList = res.data;
                            } else {
                                this.taskList = this.taskList.concat(res.data);
                            }
                            // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                            this.$refs.wrapper.forceUpdate(true);
                        }
                    } else {
                        this.$bottomToast(res.msg)
                        // 事情做完，需要调用此方法告诉 better-scroll 数据已加载
                        this.$refs.wrapper.forceUpdate(false);
                    }
                });
            },
            loadTop() {//下拉刷新
                this.page = 1;
                this.getTaskList();
            },
            loadBottom() {//上拉加载更多
                this.page++;
                this.getTaskList();
            },
            intoSchoolList(task) {//进入学校列表
                let checkTaskItem = {
                    'taskID': task.supervision_task_id,
                    'taskIsLeader': task.is_leader,
                    'taskTitle': task.task_title
                }
                this.$store.dispatch(types.SET_CHECK_TASK_ITEM, checkTaskItem)
                if (this.user.type == 1 || task.is_leader == 1) {
                    this.$router.push({name: 'specialSchoolList'})
                } else {
                    this.$router.push({name: 'specialCheckDetail'})
                }
            },
            createTable() { //生成表单
                window.location.href = this.user.baseURL + 'Api/SafetySupervision/create_table.html?supervision_record_id=' + this.taskData.supervision_record_id;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .task_list {
        background bg-color
    }

    .wrapper {
        height 100vh
    }

    .task_item {
        padding 4%
        margin-bottom 2%
        background white
    }

    .task_time {
        fontSize(28px)
    }

    .task_title {
        fontSize(34px)
        font-weight bold
        margin 2% 0
    }

    .task_num {
        margin 2% 0
    }

    .item_check_rule {
        margin-left 13%
    }

    .item_state {
        display flex
        align-items center
        padding-top 4%
        margin-top 4%
        borderTop()
        color main-color
    }

    .item_state img {
        width 5%
    }

    .item_state span {
        width 25%
        text-align center
    }

    .item_state_center {
        flex 1
    }

</style>