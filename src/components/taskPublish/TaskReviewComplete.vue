**
* @Description:    任务统计总结
* @Author:         yufawu
* @CreateDate:     2018/8/25 14:20
*/
<template>
    <div>
        <p class="title">{{taskTitle}}</p>
        <p class="tips">请登录电脑端查看任务统计总结</p>
        <div class="item_wrapper">
            <ul class="item_first">
                <li v-for="(item,index) in schoolListComplete" :key="index">
                    <p class="item">{{item.name}}({{count[index]}}/{{item.school_list.length}})</p>
                    <ul class="item_second">
                        <li v-for="(school,index) in item.school_list" :key="index">{{school.AccountName}}
                            <span class="text_green" v-if="school.status >1">（已完成）</span>
                            <span class="text_red" v-if="school.status <=1">（未完成）</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
    import * as api from '../../constant/api'

    export default {
        name: "taskPublishRelease",
        data() {
            return {
                schoolListComplete: [], //获取任务完成情况列表
                count: [] //每项任务完成数
            }
        },
        mounted() {
            this.getTaskComplete();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            taskTitle() {
                return this.$store.getters.taskPublishListTitle;
            },
            taskID() {
                return this.$store.getters.taskPublishListID;
            }
        },
        methods: {
            getTaskComplete() { //获取工作任务完成情况
                let params = {
                    'edu_task_id': this.taskID,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.EDU_TASK_VIEWSUMMARY, params, (res) => {
                    if (res.status == 1) {
                        this.schoolListComplete = res.data;
                        let len = this.schoolListComplete.length;
                        for (let i = 0; i < len; i++) {
                            let slen = this.schoolListComplete[i].school_list.length;
                            let c = 0;
                            for (let j = 0; j < slen; j++) {
                                if (this.schoolListComplete[i].school_list[j].status == 2 || this.schoolListComplete[i].school_list[j].status == 3) {
                                    c++;
                                }
                            }
                            this.count.push(c);
                        }
                    }
                })
            },
        }

    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"
    * {
        color: black-color
    }

    .title {
        padding: 0 4%
        margin-top: 1%
        line-height: px2vw(80px)
        height: px2vw(80px)
    }

    .tips {
        padding: 0 4%
        fontSize(28px)
        color: vice-font-color
        margin-bottom: 3%
    }

    .item {
        margin-bottom: 1%
        padding: 0 4%
        lineHeight(60px)
        fontSize(28px)
        background: bg-color
    }

    .item_first li {
        line-height: px2vw(90px)
        borderBottom(bg-color)
    }

    .item_first .item_second li {
        padding: 0 4%
    }

</style>