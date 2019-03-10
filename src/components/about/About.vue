/**
* @Description:    关于校鸽
* @Author:         TSY
* @CreateDate:     2018/10/26 14:06
*/
<template>
    <div class="container">
        <img class="logo" src="../../assets/about/logo.png" alt="logo">
        <p class="slogan">校鸽在手&nbsp;&nbsp;&nbsp;&nbsp;安全我有</p>
        <p>深圳安捷互联有限公司</p>
        <p>安捷互联&nbsp;&nbsp;&nbsp;&nbsp;版权所有</p>
        <p>Copyright  2016-2020</p>
    </div>
</template>

<script>
    export default {
        name: "About"
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .container {
        display flex
        width 100%
        align-items center
        flex-direction column
        font-weight bold
    }

    .logo {
        width 28%
        margin-top px2vw(300px)
    }

    .slogan {
        color main-color
        fontSize(36px)
        margin px2vw(30px) 0
    }

    p {
        margin px2vw(10px) 0
    }
</style>