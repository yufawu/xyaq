/**
* @Description:    联系人详细信息
* @Author:         TSY
* @CreateDate:     2018/9/29 17:39
*/
<template>
    <div>
        <div class="head">
            <div class="head-img"></div>
            <div class="head-txt">{{ userInfo.userName }}</div>
        </div>
        <div class="content">
            <label-text label="性别" :text="userInfo.sex"></label-text>
            <label-text label="职务" :text="userInfo.job"></label-text>
            <label-text label="手机" :text="userInfo.mobilePhone"></label-text>
            <label-text label="邮箱" :text="userInfo.email"></label-text>
            <label-text label="座机" :text="userInfo.phone"></label-text>
        </div>
        <fill-box></fill-box>
        <footer-button text="拨打电话" @click="callPhone"></footer-button>
    </div>
</template>

<script>
    import LabelText from "../common/LabelText";
    import FillBox from "../common/FillBox";
    import FooterButton from "../common/FooterButton";

    export default {
        name: "userInfo",
        components: {FooterButton, FillBox, LabelText},
        data() {
            return {
                userInfo: {
                    'userName': '刘主任',
                    'phone': '0755-86719755',
                    'sex': '男',
                    'job': '安全主任',
                    'mobilePhone': '13566458972',
                    'email': '2546854126@qq.com'
                }
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            callPhone() {//拨打电话
                window.location.href = "tel:10086";
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .head {
        display flex
        align-items center
        justify-content center
        flex-direction column
        paddingAround()
        bottomLine()
    }

    .head-img {
        width px2vw(200px)
        height px2vw(200px)
        margin px2vw(30px) 0
        border-radius 50%
        background-color main-color
    }

    .head-txt {
        fontSize(38px)
    }

</style>