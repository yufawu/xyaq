/**
* @Description:    会议签到弹窗
* @Author:         TSY
* @CreateDate:     2018/10/10 9:42
*/
<template>
    <div>
        <div v-if="isShowSignConfirmDialog" class="sign_confirm_dialog mask" @click="closeSignConfirmDialog">
            <div class="sign_confirm_content">
                <div class="sign_title">签到确认</div>
                <div class="sign_position">{{ position }}</div>
                <div class="sign_time">{{ time }}</div>
                <button class="sign_btn" @click="signConfirm">签到</button>
            </div>
        </div>
        <div v-if="isShowSignDialog" class="sign_confirm_result mask" @click="closeSignResultDialog">
            <img :src="resultImg">
        </div>
    </div>
</template>

<script>
    import {isMiniProgram} from "../../utils/util";
    import wx from "weixin-js-sdk"

    export default {
        name: "MeetingSigningDialog",
        props: ['position', 'time', 'showConfirmDialog', 'showResultDialog', 'resultImg'],
        data(){
            return {
                isShowSignConfirmDialog: false,
                isShowSignDialog: false
            }
        },
        watch: {
            showConfirmDialog(val){
                this.isShowSignConfirmDialog = val;
            },
            showResultDialog(val){
                this.isShowSignDialog = val;
            }
        },
        methods: {
            closeSignConfirmDialog() {//关闭学校会议签到确认框
                this.isShowSignConfirmDialog = false;
            },
            signConfirm() {//学校会议签到确认
                this.$emit('confirm')
            },
            closeSignResultDialog() {//关闭签到提示弹窗
                this.isShowSignDialog = false;
                isMiniProgram(wx, (res)=>{
                    if (res) {// 如果是小程序环境，则需要清除扫码返回的参数
                        let href = window.location.href.split('&')[0];
                        window.location.href = href;
                    }
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"


    .sign_confirm_dialog {
        display flex
        align-items center
        justify-content center
    }

    .sign_confirm_content {
        display flex
        align-items center
        justify-content center
        flex-direction column
        width 80%
        background white
        border-radius 10px
    }

    .sign_title {
        width 100%
        text-align center
        padding px2vw(28px) 0
        background main-color
        fontSize(32px)
        color white
        border-radius 10px 10px 0 0
    }

    .sign_position {
        width 100%
        text-align center
        paddingAround()
        borderBottom()
    }

    .sign_time {
        paddingAround()
    }

    .sign_btn {
        width 90%
        padding px2vw(24px) 0
        border 1px solid main-color
        background none
        border-radius 10px
        color main-color
        margin px2vw(24px) 0
    }

    .sign_confirm_result {
        display flex
        align-items center
        justify-content center
    }

    .sign_confirm_result img {
        width 80%
    }
</style>