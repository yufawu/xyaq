/**
 * @Description:    专项检查流水记录
 * @Author:         TSY
 * @CreateDate:     2018/6/26 9:35
 */
<template>
    <div>
        <p class="title">{{ checkRecordData.taskTitle }}</p>
        <p class="text">流水记录</p>
        <div class="record">
            <no-data-tips :data="checkRecordData.data"></no-data-tips>
            <timeline>
                <timeline-item v-if="index == 0" style="color: #1c71fb" color="#1c71fb" v-for="(item,index) in checkRecordData.data" :key="index">
                    <p class="record_title">{{ item.status_msg }}</p>
                    <p class="record_time">{{ item.create_time }}</p>
                </timeline-item>
                <timeline-item v-if="index != 0" style="color: #aaa" v-for="(item,index) in checkRecordData.data" :key="index">
                    <p class="record_title">{{ item.status_msg }}</p>
                    <p class="record_time">{{ item.create_time }}</p>
                </timeline-item>
            </timeline>
        </div>
    </div>
</template>

<script>
    import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "specialCheckRecord",
        components: {
            NoDataTips,
            Timeline,
            TimelineItem,
            TimelineTitle
        },
        computed: {
            checkRecordData(){
                return this.$store.getters.checkRecordData;
            }
        }
    }
</script>

<style>
    .timeline:nth-child(1)>.timeline-item:nth-child(1)>.timeline-circle {
        left: -36px;
        width: 15px;
        height: 15px;
    }
</style>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .title{
        padding 4%
        font-weight bold
    }

    .text{
        background bg-color
        color vice-font-color
        padding 2% 4%
        fontSize(28px)
    }

    .record_time{
        margin-top 2%
    }

</style>