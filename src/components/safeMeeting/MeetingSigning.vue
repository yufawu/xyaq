/**
* @Description:    会议签到
* @Author:         TSY
* @CreateDate:     2018/8/20 17:26
*/
<template>
    <div class="body">
        <div class="top" @click="meetingDetail()">
            <img src="../../assets/safeMeeting/icon_meeting.png">
            <div class="top_content">
                <p class="title">{{ meetingData.title == '' ? '无' : meetingData.title }}</p>
                <p class="time"><span>{{ meetingData.begin_time }}</span></p>
            </div>
        </div>
        <div class="content">
            <div class="content_header">
                <div class="content_header_left">
                    <div class="line"></div>
                    <div>
                        <p class="content_title">学校/教育局参会</p>
                        <p class="content_subtitle">请校方/教育局参会人员填写信息</p>
                    </div>
                </div>
                <input type="radio" name="item" value="school" v-model="showSelect">
            </div>
            <div v-show="showSelect == 'school'">
                <input-selector label="学校/教育局名称：" placeholder="点击选择" text-align="right"
                                v-model="schoolName" @listenSelect="selectSchool()"></input-selector>
                <label-input label="姓名：" placeholder="请填写姓名" text-align="right" v-model="userName"></label-input>
                <label-input label="手机号：" placeholder="请填写手机号" text-align="right" v-model="userPhone"></label-input>
            </div>
        </div>
        <div class="content">
            <div class="content_header">
                <div class="content_header_left">
                    <div class="line"></div>
                    <div>
                        <p class="content_title">其他单位</p>
                        <p class="content_subtitle">请非学校机构参会者填写信息</p>
                    </div>
                </div>
                <input type="radio" name="item" value="company" v-model="showSelect">
            </div>
            <div v-show="showSelect == 'company'">
                <label-input label="单位名称：" placeholder="请填写单位名称" text-align="right" v-model="companyName"></label-input>
                <label-input label="姓名：" placeholder="请填写姓名" text-align="right" v-model="userName"></label-input>
                <label-input label="手机号：" placeholder="请填写手机号" text-align="right" v-model="userPhone"></label-input>
            </div>
        </div>
        <div class="sign" @click="sign">立刻签到</div>
        <div v-show="isShowSignDialog" class="mask" @click="closeDialog()">
            <img :src="signDialogImg">
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as types from '../../constant/types'
    import * as api from '../../constant/api'
    import InputSelector from "../common/InputSelector";
    import LabelInput from "../common/LabelInput";
    import FillBox from "../common/FillBox";

    export default {
        name: "MeetingSigning",
        components: {FillBox, LabelInput, InputSelector},
        data() {
            return {
                meetingData: {},//标题
                showSelect: 'school',//标记选中的哪一项（默认学校）
                isShowSignDialog: false,//是否显示签到弹窗
                signDialogImg: require('../../assets/safeMeeting/sign_success.png'),//签到弹窗图片（默认签到成功图）
                schoolName: '',//学校名称
                companyName: '',//单位名称
                userName: '',//姓名
                userPhone: '',//手机号
            }
        },
        mounted() {
            if (this.selectedSchool.school) {
                this.schoolName = this.selectedSchool.school;
            }
            this.getMeetingDetail();
        },
        computed: {
            selectedSchool() {//获取选择的学校
                return this.$store.getters.safeMeetingSchoolItem;
            },
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            selectSchool() {//进入选择学校列表页
                this.$router.push({name: 'meetingSchoolList', query: {'meeting_id': this.$route.query.meeting_id}});
            },
            sign() {//会议签到
                if ((this.showSelect == 'school' && this.schoolName == '')
                    || (this.showSelect == 'company' && this.companyName == '')
                    || this.userName == '' || this.userPhone == '') {
                    this.$bottomToast('请填写完整信息再签到！');
                    return
                }
                let accountName = this.schoolName, accountID = this.selectedSchool.accountID;
                if (this.showSelect == 'company') {
                    accountName = this.companyName;
                    accountID = '';
                }
                let params = {
                    'account_id': accountID,
                    'account_name': accountName,
                    'meeting_id': this.$route.query.meeting_id,
                    'user_name': this.userName,
                    'user_iphone': this.userPhone
                }
                this.http(this, (this.user.baseURL || '/') + api.SAFE_MEETING_SINGING, params, (res) => {
                    if (res.status == 1) {
                        this.signDialogImg = require('../../assets/safeMeeting/sign_success.png')
                        this.isShowSignDialog = true;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getMeetingDetail() { //获取会议详情
                let params = {
                    'meeting_id': this.$route.query.meeting_id
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_MEETING_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.meetingData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            closeDialog() {//关闭签到提示弹窗
                this.isShowSignDialog = false;
            },
            meetingDetail() {//进入会议详情页
                this.$router.push({name: "meetingDetail", query: {meeting_id: this.$route.query.meeting_id}});
                this.$store.dispatch(types.SET_SAFE_MEETING_ID, this.$route.query.meeting_id);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        background bg-color
    }

    .top {
        display flex
        align-items center
        padding px2vw(30px) px2vw(34px)
        background white
    }

    .top img {
        width px2vw(150px)
    }

    .top_content {
        margin-left px2vw(28px)
    }

    .title {
        font-size px2vw(34px)
        font-weight bold
    }

    .time {
        margin-top px2vw(15px)
        color vice-font-color
    }

    input[type='radio'] {
        width: 20px;
        height: 20px;
        -webkit-appearance: none;
        background: url("../../assets/safeMeeting/icon_checkbox_check.png") no-repeat center;
        background-size 20px 20px
        outline: none;
    }

    input[type='radio']:checked {
        background: url("../../assets/safeMeeting/icon_checkbox_checked.png") no-repeat center;
        background-size 20px 20px
    }

    .content {
        background white
        margin-top px2vw(16px)
    }

    .content_header {
        display flex
        align-items center
        justify-content space-between
        padding px2vw(30px) px2vw(34px)
    }

    .content_header_left {
        display flex
        align-items center
    }

    .line {
        width px2vw(8px)
        height px2vw(80px)
        margin-right px2vw(20px)
        background main-color
    }

    .content_title {
        fontSize(34px)
    }

    .content_subtitle {
        fontSize(28px)
        color vice-font-color
    }

    .sign {
        width 90%
        margin-left 5%
        margin-top px2vw(160px)
        background main-color
        color white
        padding px2vw(20px) 0
        text-align center
        fontSize(34px)
        border-radius 6px
    }

    .mask img {
        width 80%
        margin-left 10%
        margin-top 45%
    }

</style>