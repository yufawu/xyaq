/**
* @Description:
* @Author:         yufawu
* @CreateDate:     2018/9/5 8:59
*/
<template>
    <div>
        <div class="detail_header">
            <p class="title">{{data.task_title}}</p>
            <p class="subtitle">{{data.create_user}}
                <span class="time">{{data.create_time}}</span>
            </p>
        </div>
        <div class="notice_con" v-html="data.task_desc">

        </div>
    </div>
</template>

<script>
    export default {
        name: "noticeDetail",
        data() {
            return {
                data:{
                    "edu_task_id": "1",
                    "task_title": "关于校鸽平台在我校试运行的通知",
                    "task_desc": "根据学校数字化校园建设的总体部署数字化校园平台校鸽将在我校试运行，请各位老师积极安装！",
                    "status": "1",
                    "create_time": "2018-08-24 13:49:00",
                    "create_user": "罗小勇",
                    "finish_data": "120",
                },
            }
        },
        mounted() {

        },
        computed: {},
        methods: {}
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    .detail_header {
        text-align: center
        .title {
            line-height: px2vw(80px)
            color: lightBlack-color
            font-size: px2vw(36px)
            font-weight: bold
        }
        .subtitle {
            color: gray2-color
            margin-bottom: px2vw(30px)
            .time {
                margin-left: 5%
            }
        }
    }


</style>
