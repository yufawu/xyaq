/**
* @Description     平台介绍页
* @Author:         TSY
* @CreateDate:     2018/10/29 17:03
*/
<template>
    <div>
        <div class="top">
            <div class="top_content">
                <p class="top_title">校园安全</p>
                <p class="top_title">风险防控体系</p>
                <p class="top_subtitle">云平台+APP+智能物联，打造平安校园</p>
            </div>
            <img src="../../assets/home/pic_bg_1.png" alt="">
        </div>
        <div class="content">
            <div class="content_item click_item" v-for="(item,index) in dataList" :key="index">
                <img :src="item.img" alt="">
                <span class="content_item_title">{{ item.title }}</span>
                <span class="content_item_subtitle">{{ item.subtitle }}</span>
            </div>
        </div>
        <div class="business" @click="business">商务合作</div>
    </div>
</template>

<script>
    export default {
        name: "homeBrief",
        data() {
            return {
                dataList: [
                    {img: require("../../assets/home/icon_yhgl.png"), title: '隐患管理', subtitle: '全员参与，将不安因素消除在“萌芽”状态'},
                    {img: require("../../assets/home/icon_aqxc.png"), title: '安全巡查', subtitle: '定人定岗，全程记录，将巡查工作落到实处'},
                    {img: require("../../assets/home/icon_yjgb.png"), title: '应急广播', subtitle: '手机即广播，提高应对突发事件的处置效率'},
                    {img: require("../../assets/home/icon_spyj.png"), title: '视频预警', subtitle: 'AI防控+预警，变事后查证为主动防御'},
                    {img: require("../../assets/home/icon_ktaq.png"), title: '安全课堂', subtitle: '系统、专业、移动式的“安全教育课堂”'},
                    {img: require("../../assets/home/icon_rlsb.png"), title: '人脸识别', subtitle: '识别速度快，准确度高，具有全局报警功能'},
                    {img: require("../../assets/home/icon_aqtz.png"), title: '安全台账', subtitle: '数据自动汇总评比打分，强化学校安全生产管理'},
                    {img: require("../../assets/home/icon_dsj.png"), title: '安全大数据', subtitle: '安全数据量化可见，提高教育机构安全工作水平'}
                ]
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            business() {
                this.$router.push({name: 'business'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top {
        position relative
    }

    .top img {
        display block
    }

    .top_content {
        position absolute
        width 100%
        color white
        padding-top px2vw(150px)
        padding-left px2vw(46px)
    }

    .top_title {
        fontSize(60px)
        font-weight bold
    }

    .top_subtitle {
        margin px2vw(10px) 0
        margin-top px2vw(36px)
    }

    .content {
        display flex
        justify-content space-around
        align-items center
        flex-wrap wrap
        paddingAround()
    }

    .content_item {
        width 45%
        display flex
        flex-direction column
        align-items center
        justify-content center
        background white
        border-radius 5px
        margin-bottom px2vw(30px)
        paddingAround()
    }

    .content_item img {
        width 50%
    }

    .content_item_title {
        margin px2vw(10px) 0
    }

    .content_item_subtitle {
        fontSize(28px)
        color vice-font-color
    }

    .business {
        width 80%
        margin-left 10%
        text-align center
        paddingSmall()
        background main-color
        color white
        border-radius 6px
        margin-bottom px2vw(50px)
    }

    .business:active {
        background (main-color) - 30%
    }
</style>