/**
* @Description:    巡查记录详情（学校）
* @Author:         TSY
* @CreateDate:     2018/10/15 15:25
*/
<template>
    <div>
        <ul>
            <li v-for="item in checkRecordData.data" :key="item.flow_id" @click="intoCheckDetail(item)">
                <div class="left">
                    <p class="left_title">{{ item.task_title }}</p>
                    <p class="left_subtitle">
                        <span>{{ item.start_time + '-' + item.end_time }}</span>
                        <span class="left_subtitle_place">{{ item.insp_name }}</span>
                        <span>{{ item.user_name }}</span>
                    </p>
                </div>
                <div class="right" :style="{ 'color': checkRecordData.state == 0 ? '#1b70fa' : checkRecordData.state == 1 ? '#42bd56' : '#fa0824'  }">{{ checkRecordData.state == 0 ? '待巡查' : checkRecordData.state == 1 ? '已巡查' : '未巡查,去补卡' }}</div>
            </li>
        </ul>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as types from '../../constant/types'
    import FillBox from "../common/FillBox";
    export default {
        name: "SchoolCheckRecordDetail",
        components: {FillBox},
        data() {
            return {}
        },
        mounted() {

        },
        computed: {
            checkRecordData() {//巡查数据列表
                return this.$store.getters.everydayCheckRecord;
            }
        },
        methods: {
            intoCheckDetail(data) {
                this.$store.dispatch(types.SAVE_EVERYDAY_CHECK_RECORD_ITEM, {'data': data, 'state': this.checkRecordData.state})
                this.$router.push({name: 'schoolCheckDetail'})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    li {
        display flex
        width 100%
        align-items center
        paddingAround()
        borderBottom()
    }

    .left {
        width 0
        flex 1
        display flex
        flex-direction column
    }

    .left_title {
        width 100%
        textOverflow()
    }

    .left_subtitle {
        fontSize(28px)
    }

    .left_subtitle_place {
        display inline-block
        margin 0 px2vw(15px)
    }

    .right {
        text-align right
        width px2vw(200px)
        fontSize(28px)
    }
</style>