/**
* @Description:    日常巡查详情（学校）
* @Author:         TSY
* @CreateDate:     2018/10/15 9:40
*/
<template>
    <div>
        <div class="body">
            <div v-if="isRecard" class="record">这是您第{{ recardTimes }}次补卡，查看补卡记录。</div>
            <div class="title">
                <p class="title_txt">{{ checkPlace }}</p>
                <div class="subtitle">
                    <span>{{ checkTime }}</span>
                    <span>{{ checkUserName }}</span>
                </div>
            </div>
            <div class="check_item_text">
                <span>检查项</span>
                <span>不符合/符合</span>
            </div>
            <div class="check_item_child" v-for="(item,i) in checkData" :key="i">
                <div class="left">
                    <p class="check_item_child_title">{{ item.name }}</p>
                    <p v-show="item.is_check == 0" class="danger_upload" @click="dangerUpload">上报隐患</p>
                </div>
                <el-switch class="check_switch" v-model="item.is_check" :disabled="!isCommit"></el-switch>
            </div>
            <div class="upload">
                <label-input label="巡查照片:" :disabled="true"></label-input>
                <upload-img class="upload_img" :readonly="!isCommit"></upload-img>
                <label-input label="巡查备注：" placeholder="请填写巡查备注" v-model="remark"></label-input>
            </div>
            <footer-button v-if="isRecard" text="确定补卡" @click="reCard"></footer-button>
            <footer-button v-if="isCommit" text="提交" @click="commit"></footer-button>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import FooterButton from "../common/FooterButton";
    import {formatDate} from "../../utils/util";
    import LabelText from "../common/LabelText";
    import LabelInput from "../common/LabelInput";
    import UploadImg from "../common/UploadImg";

    export default {
        name: "SchoolCheckDetail",
        components: {UploadImg, LabelInput, LabelText, FooterButton},
        data() {
            return {
                isRecard: false,//是否为补卡
                recardTimes: 1, //补卡次数
                checkTime: '',
                checkUserName: '',
                checkPlace: '',
                remark: '',
                checkData: [],
                uploadImg: [],
                isCommit: false,
                inspID: '',//url传过来的id
            }
        },
        mounted() {
            if (this.checkRecordData && this.checkRecordData.state == 2) {
                this.isRecard = true;
            }

            this.inspID = this.$route.query.insp_id;
            if (this.inspID) {
                this.getCodeCheckData();
            } else {
                this.checkTime = this.checkRecordData.data.start_time + '-' + this.checkRecordData.data.end_time;
                this.checkUserName = this.checkRecordData.data.user_name;
                this.checkPlace = this.checkRecordData.data.task_title;
                this.inspID = this.checkRecordData.data.insp_id;
                this.getCheckDataDetail();
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            checkRecordData() {
                return this.$store.getters.everydayCheckRecordItem;
            }
        },
        methods: {
            dangerUpload() {//上报隐患
                this.$router.push({name: 'dangerUpload'});
            },
            getCheckDataDetail() {
                let params = {
                    'insp_id': this.insp_id,
                    'flow_id': this.checkRecordData.data.flow_id
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.checkData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getCodeCheckData() {//获取二维码上的巡查数据
                let params = {
                    'insp_id': this.inspID,
                    'account_id': this.user.accountID,
                    'pid': this.user.PID
                }
                this.http(this, this.user.baseURL + api.GET_SAFE_CHECK_CODE_DATA, params, (res) => {
                    this.checkData = [];
                    if (res.status == 1) {
                        this.checkTime = res.data.check_time;
                        this.checkUserName = res.data.check_usernames;
                        this.checkPlace = res.data.insp_name;
                        for (let i in res.data.items) {
                            this.checkData.push({
                                'name': res.data.items[i].name,
                                'item_id': res.data.items[i].item_id,
                                'is_check': true
                            })
                        }
                        this.isCommit = true;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            commit() {//提交
                let idArr = [];
                for (let i in this.checkData) {
                    if (this.checkData[i].is_check) {
                        idArr.push(this.checkData[i].item_id);
                    }
                }
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'insp_id': this.inspID,
                    'itemids_arr': idArr,
                    'latitude': '',
                    'longitude': '',
                    'position': '',
                    'img1': this.uploadImg[0] || '',
                    'img2': this.uploadImg[1] || '',
                    'img3': this.uploadImg[2] || '',
                    'remark': this.remark
                }
                this.http(this, this.user.baseURL + api.COMMIT_SAFE_CHECK, params, (res) => {
                    if (res.status == 1) {
                        this.getCodeCheckData();
                    }
                    this.$bottomToast(res.msg);
                })
            },
            reCard() {//补卡
                let params = {
                    'account_id': this.user.accountID,
                    'flow_id': this.checkRecordData.data.flow_id,
                    'sub_remark': '',
                    'check_day': formatDate(new Date(), 'YY-MM-DD')
                }
                this.http(this, this.user.baseURL + api.SAFE_CHECK_REPAIR, params, (res) => {
                    if (res.status == 1) {
                        this.isRecard = false;
                    }
                    this.$bottomToast(res.msg);
                })
            },
            uploadImgChange(res) {//待上传的图片data
                this.uploadImg = res || [];
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        padding-bottom px2vw(120px)
    }

    .title {
        paddingAround()
    }

    .title_txt {
        fontSize(36px)
        font-weight bold
    }

    .subtitle {
        color vice-font-color
        margin-top px2vw(10px)
        fontSize(28px)
    }

    .subtitle span {
        margin-right px2vw(50px)
    }

    .check_item_text {
        display flex
        justify-content space-between
        background bg-color
        fontSize(28px)
        paddingSmall()
    }

    .check_item_child {
        display flex
        align-items center
        justify-content space-between
        background white
        paddingAround()
        borderBottom()
    }

    .danger_upload {
        color main-color
        margin-top px2vw(15px)
    }

    .record {
        @extends .check_item_text
    }

    .upload {
        topLine()
    }

    .upload_img {
        margin-left px2vw(20px)
    }
</style>