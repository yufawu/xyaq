/**
* @Description:    首页-我的
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/

<template>
    <div class="mine_container">
        <div class="user_item">
            <img :src="isLogin ? user.headImg : require('../../assets/mine/head_default.png')" alt="用户头像" ref="headImg"
                 @click="intoUser" class="user_head">
            <p class="user_name">{{ isLogin ? (user.userName || '请登录') : '请登录' }}</p>
            <p class="user_title">{{ isLogin ? (userJob || '******') : '******' }}</p>
        </div>
        <div class="safe click_item" @click="userInfo">
            <img src="../../assets/mine/icon_account_safe.png" class="icon">
            <span class="safe_text">我的资料</span>
            <img class="next" src="../../assets/home/next.png">
        </div>
        <div class="list_item click_item" @click="feedBack">
            <img src="../../assets/mine/icon_feedback.png" class="icon">
            <span class="safe_text">反馈和建议</span>
            <img class="next" src="../../assets/home/next.png">
        </div>
        <div class="list_item click_item" @click="share">
            <img src="../../assets/mine/icon_share.png" class="icon">
            <span class="safe_text">推荐给朋友</span>
            <img class="next" src="../../assets/home/next.png">
        </div>
        <div class="list_item click_item" @click="about">
            <img src="../../assets/mine/icon_about.png" class="icon">
            <span class="safe_text">关于校鸽</span>
            <img class="next" src="../../assets/home/next.png">
        </div>
        <div v-if="isShowShare" class="share mask" @click="closeShare">
            <img src="../../assets/about/share.png" alt="">
        </div>
        <!--退出登录弹窗-->
        <danger-dispose-time :selectData="itemData" :isShowSelect="isShowSelect"
                             @listenSelect="confirm"></danger-dispose-time>
        <!-- 数据不足一屏时，填充背景色 -->
        <fill-box></fill-box>
    </div>
</template>

<script>
    import {changeJob2String} from '../../utils/util'
    import * as types from '../../constant/types'
    import FillBox from "../common/FillBox";
    import DangerDisposeTime from "../common/DangerDisposeTime";

    export default {
        name: 'homeMine',
        components: {DangerDisposeTime, FillBox},
        data() {
            return {
                userJob: '',//职务
                itemData: ['退出登录', '取消'],//点击头像后弹窗显示的文字
                isShowSelect: false,//是否显示退出登录弹窗
                isShowShare: false,//是否显示分享弹窗
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            isLogin() {
                return this.$store.getters.isLogin;
            }
        },
        mounted() {
            this.userJob = changeJob2String(this.user.job);
            this.$refs.headImg.onerror = () => {
                this.user.headImg = require('../../assets/mine/head_default.png');
                this.$refs.headImg.onerror = null;
            }
        },
        methods: {
            logout() {
                this.$store.dispatch(types.SET_USER_INFO, {});//清空用户信息
            },
            intoUser() {
                if (this.isLogin) {
                    this.isShowSelect = true;
                    return
                } else {
                    this.$router.push({'name': 'login'});//进入登录页
                }
            },
            userInfo() {//我的资料
                this.$router.push({name: 'myInformation'});
            },
            feedBack() {//意见反馈
                this.$router.push({name: 'feedBack'});
            },
            confirm(index) {
                this.isShowSelect = false;
                if (index == -1) {
                    return
                }
                if (index == 0) {
                    this.logout()
                }
            },
            closeShare() {
                this.isShowShare = false;
            },
            share() {
                this.isShowShare = true;
            },
            about() {
                this.$router.push({name: 'about'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .user_item {
        background -webkit-linear-gradient(top, #2ca1ea, #1c71fb)
        background -o-linear-gradient(bottom, #2ca1ea, #1c71fb) /* Opera 11.1 - 12.0 */
        background -moz-linear-gradient(bottom, #2ca1ea, #1c71fb) /* Firefox 3.6 - 15 */
        background linear-gradient(to bottom, #2ca1ea, #1c71fb) /* 标准的语法 */
        display flex
        flex-direction column
        align-items center
        padding-top px2vw(80px)
        padding-bottom px2vw(50px)
    }

    .user {
        display flex
        align-items center
        background white
        paddingAround()
    }

    .user_head {
        width 22vw
        height 22vw
        border-radius 50%
    }

    .user_info {
        width 70%
        margin-left 5%
    }

    .user_name {
        fontSize(36px)
        font-weight bold
        color white
        margin-top px2vw(30px)
        margin-bottom px2vw(20px)
    }

    .user_title {
        fontSize(28px)
        color white
    }

    .next {
        width 4%
    }

    .safe {
        @extend .user
        margin 3% 0
    }

    .icon {
        width 7%
    }

    .safe_text {
        width 84%
        margin-left 5%
        font-size 4.5vw
    }

    .list_item {
        @extend .user
        borderBottom()
    }

    .logout {
        width 100%
        text-align center
        background white
        padding 3% 0
        margin-top 3%
        color main-font-color
        font-size 4.5vw
    }

    .share {
        text-align right
        padding-right px2vw(50px)
    }

    .share img {
        width 73%
    }
</style>