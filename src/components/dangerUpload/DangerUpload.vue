/**
* @Description:    隐患上报
* @Author:         TSY
* @CreateDate:     2018/6/26 9:34
*/
<template>
    <div>
        <div class="header">
            <textarea class="danger_desc" cols="30" rows="4" v-model="dangerDesc" placeholder="描述下你发现的安全隐患"
                      maxlength="100">
            </textarea>
            <div class="upload">
                <!--上传图片-->
                <upload-img @imgChange="uploadImgChange"></upload-img>
            </div>
        </div>
        <label-input label="隐患地点：" placeholder="填写发现隐患的地点" text-align="right" v-model="dangerLocation"></label-input>
        <input-selector label="要求隐患处理时间：" placeholder="隐患处理时间" text-align="right" v-model="dangerTime"
                        @listenSelect="pickTime"></input-selector>
        <danger-dispose-time :selectData="itemData" :isShowSelect="isShowSelect"
                             @listenSelect="dateConfirm"></danger-dispose-time>
        <div class="upload_data" @click="sendData">立即上报</div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import UploadImg from "../common/UploadImg";
    import InputSelector from "../common/InputSelector";
    import LabelInput from "../common/LabelInput";
    import DangerDisposeTime from "../common/DangerDisposeTime";
    import UploadVideo from "../common/UploadVideo";

    export default {
        name: "dangerUpload",
        components: {UploadVideo, DangerDisposeTime, LabelInput, InputSelector, UploadImg},
        data() {
            return {
                itemData: ['1小时', '2小时', '5小时', '8小时', '12小时', '24小时', '48小时', '72小时'],//备选时间
                dangerDesc: '',//隐患内容描述
                dangerLocation: '',//隐患地点
                dangerTime: '',//发现隐患的时间
                uploadImg: [],//待上传图片地址
                videoImg: '',//视频预览图
                videoUrl: '',//视频链接地址
                isShowSelect: false,//是否显示选择弹窗
                dangerPersonList: [],//隐患处理人列表
            }
        },
        mounted() {
            this.getCheckTeam();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getCheckTeam() {//获取隐患处理人列表
                let params = {
                    'account_id': this.user.accountID
                }
                this.http(this, this.user.baseURL + api.GET_DANGER_PERSON_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.dangerPersonList = res.teamarr;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            sendData() {//立即上报数据
                if (this.dangerLocation == '') {
                    this.$bottomToast('请输入隐患地点');
                    return
                }
                if (this.dangerDesc == '') {
                    this.$bottomToast('请输入详细描述隐患信息');
                    return
                }
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'position': this.dangerLocation,
                    'description': this.dangerDesc,
                    'danger_degree': '1',
                    'status': '0',
                    'img': this.uploadImg[0] || '',
                    'img2': this.uploadImg[1] || '',
                    'img3': this.uploadImg[2] || '',
                    'video_img': this.videoImg,
                    'video_url': this.videoUrl,
                    'chargepid': this.dangerPersonList[0].leader_id,
                    'chargeusername': this.dangerPersonList[0].leader_name
                };
                this.http(this, this.user.baseURL + api.UPLOAD_DANGER, params, (res) => {
                    if (res.status == 1) {
                        this.$router.back(-1);
                    }
                    this.$bottomToast(res.msg)
                });
            },
            pickTime() {//选择时间
                this.isShowSelect = true;
            },
            dateConfirm(index) {//确认选择时间
                this.isShowSelect = false;
                if (index == -1) {
                    return;
                }
                this.dangerTime = this.itemData[index];
            },
            videoSuccess(url) { //视频上传成功回调
                this.videoUrl = url;
            },
            videoImgSuccess(img) { //视频截图上传成功回调
                this.videoImg = img;
            },
            uploadImgChange(res) {//待上传的图片data
                this.uploadImg = res;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .header {
        padding 4%
        border-bottom 8px solid bg-color
    }

    .danger_desc {
        border none
        width 100%
        fontSize(32px)
    }

    .upload_data {
        position fixed
        bottom 0
        left 0
        width 100%
        text-align center
        color white
        background main-color
        padding 3%
        fontSize(36px)
    }
</style>