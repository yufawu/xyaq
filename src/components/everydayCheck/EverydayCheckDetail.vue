/**
* @Description:    日常巡查统计详情
* @Author:         TSY
* @CreateDate:     2018/9/26 9:41
*/
<template>
    <div>
        <top-button-group :operateBtn="operateBtn" @click="changeBtn"></top-button-group>
        <div class="content">
            <div class="content_time">2018年09月26日</div>
            <div id="chart">

            </div>
        </div>
    </div>
</template>

<script>
    import {setDocumentTitle} from "../../utils/util";
    import TopButtonGroup from "../common/TopButtonGroup";

    export default {
        name: "EverydayCheckDetail",
        components: {TopButtonGroup},
        data() {
            return {
                operateBtn: [{'name': '日统计'},{'name': '月统计'}],//操作按钮
            }
        },
        mounted() {
            if (this.everydaySchoolItem.school) {
                setDocumentTitle(this.everydaySchoolItem.school);
            }
        },
        computed: {
            everydaySchoolItem() { //获取学校信息
                return this.$store.getters.everydaySchoolItem;
            }
        },
        methods: {
            changeBtn() {//切换日统计/月统计

            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"


</style>