/**
* @Description:    会议详情
* @Author:         TSY
* @CreateDate:     2018/8/22 17:47
*/
<template>
    <div class="body">
        <div class="title">{{ meetingData.title }}</div>
        <div class="label">会议时间：</div>
        <p class="text">{{ meetingData.begin_time }}</p>
        <div class="label">会议地点：</div>
        <p class="text">{{ meetingData.position }}</p>
        <div class="label">参加人员：</div>
        <p class="text">{{ meetingData.charge_name }}</p>
        <div class="label">会议内容：</div>
        <p class="text">{{ meetingData.remark }}</p>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    export default {
        name: "MeetingDetail",
        data() {
            return {
                meetingData:{}//会议详情数据
            }
        },
        mounted() {
            this.getMeetingDetail();
        },
        computed: {
            meetingID() {
                return this.$store.getters.safeMeetingID;
            },
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getMeetingDetail() { //获取会议详情
                let params = {
                    'meeting_id': this.meetingID || this.$route.query.meeting_id
                }
                this.http(this, this.user.baseURL + api.GET_MEETING_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.meetingData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        padding px2vw(30px) px2vw(34px)
        font-size px2vw(32px)
    }

    .title {
        font-size px2vw(36px)
        font-weight bold
        text-align center
        padding-bottom px2vw(36px)
    }

    .label {
        margin-top px2vw(30px)
        margin-bottom px2vw(10px)
        font-weight bold
    }
</style>