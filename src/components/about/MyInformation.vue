/**
* @Description:    我的资料
* @Author:         TSY
* @CreateDate:     2018/10/25 14:29
*/
<template>
    <div>
        <div class="head" @click="changeHead">
            <div class="head_text">头像</div>
            <div class="head_content">
                <img class="head_img"
                     :src="showHeadImg == '' ? require('../../assets/mine/head_default.png') : showHeadImg"
                     ref="headImg">
                <input type="file" accept="image/*" @change="imgChange" ref="imgInput">
                <img class="next" src="../../assets/specialCheck/btn_more_small.png">
            </div>
        </div>
        <danger-dispose-time :selectData="itemData" :isShowSelect="isShowSelect"
                             @listenSelect="confirmChange"></danger-dispose-time>
        <div class="border">
            <input-selector label="昵称" v-model="user.userName" text-align="right" :disable='disable'></input-selector>
        </div>
        <label-text label="性别" :text="user.sex == '' ? '未知' : user.sex"></label-text>
        <label-text label="职务" :text="user.job == '' ? '无职称' : user.job"></label-text>
        <label-text label="账号" :text="user.loginName"></label-text>
        <div class="button_bg">
            <div class="confirm click_item" @click="confirm">确定</div>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import InputSelector from "../common/InputSelector";
    import LabelText from "../common/LabelText";
    import FillBox from "../common/FillBox";
    import Exif from 'exif-js'
    import {imgPreview} from '../../utils/util'
    import DangerDisposeTime from "../common/DangerDisposeTime";

    export default {
        name: "MyInformation",
        components: {DangerDisposeTime, FillBox, LabelText, InputSelector},
        data() {
            return {
                disable: false,
                isShowSelect: false,
                showHeadImg: '',//用户头像
                itemData: ['更换头像', '取消'],
            }
        },
        mounted() {
            this.showHeadImg = this.user.headImg || [];
            this.$refs.headImg.onerror = () => {
                this.showHeadImg = require('../../assets/mine/head_default.png');
                this.$refs.headImg.onerror = null;
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            confirm() {
                this.$bottomToast('修改成功');
                this.user.headImg = this.showHeadImg;
                this.$router.back();
            },
            changeHead() {//点击头像
                this.isShowSelect = true;
            },
            confirmChange(index) {//修改头像
                this.isShowSelect = false;
                if (index == -1) {
                    return
                }
                if (index == 0) {
                    this.$refs.imgInput.click()
                }
            },
            imgChange() {//监听图片变化
                let imgFile = this.$refs.imgInput.files;
                this.isShowSelect = false;
                if (imgFile && imgFile[0]) {
                    //打开loading
                    this.$indicator.open({spinnerType: 'fading-circle'});
                    // 预览图片
                    imgPreview(Exif, imgFile[0], (res) => {
                        this.showHeadImg = res.data
                        this.$indicator.close();
                        let params = {
                            'img': res.data,
                            'webHost': this.user.baseURL
                        }
                        this.$refs.imgInput.value = '';//清空file值，避免无法上传同一张图片
                        this.$axios('',api.UPLOAD_DANGER_IMG,params,(res)=>{
                            if (res.status == 1) {
                                console.log('头像上传成功');
                            } else {
                                console.log('头像上传失败');
                            }
                        })
                    });
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .head {
        display flex
        align-items center
        justify-content space-between
        paddingAround()
    }

    .head_content {
        display flex
        align-items center
    }

    .head_content input {
        display none
    }

    .head_img {
        width 22vw
        height 22vw
        border-radius 50%
        margin-right px2vw(20px)
    }

    .next {
        width 2vw
    }

    .border {
        borderBottom()
    }

    .button_bg {
        background bg-color
        padding-top px2vw(150px)
    }

    .confirm {
        width 94%
        margin-left 3%
        text-align center
        background white
        border-radius 5px
        paddingSmall()
    }
</style>