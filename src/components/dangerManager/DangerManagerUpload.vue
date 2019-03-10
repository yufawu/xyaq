/**
* @Description:    事故上报
* @Author:         TSY
* @CreateDate:     2018/8/13 17:44
*/
<template>
    <div>
        <div class="top">
            <label-input label="事故标题：" placeholder="请输入安全事故的标题" v-model="dangerName"></label-input>
            <label-input label="事故发生地点：" placeholder="请输入事故发生地点" v-model="dangerAddress"></label-input>
            <input-selector label="事故发生时间：" placeholder="请选择事故发生时间" v-model="pickerDate"
                            @listenSelect="pickTime"></input-selector>
            <input-selector label="事故分类：" placeholder="请选择事故分类" v-model="dangerType"
                            @listenSelect="pickItem('dangerType')"></input-selector>
            <input-selector label="事故性质：" placeholder="请选择事故性质" v-model="dangerNature"
                            @listenSelect="pickItem('dangerNature')"></input-selector>
            <input-selector label="事故现状态：" placeholder="请选择事故现在的状态" v-model="dangerStatus"
                            @listenSelect="pickItem('dangerStatus')"></input-selector>
        </div>
        <div class="bottom">
            <input-selector label="事故严重等级：" placeholder="请选择事故严重等级" v-model="dangerGrade"
                            @listenSelect="pickItem('dangerGrade')"></input-selector>
            <label-input label="事故直接经济损失：" placeholder="请输入经济损失金额" v-model="dangerMoney" type="number"></label-input>
            <label-input label="死亡人数：" placeholder="请输入事故死亡人数" v-model="dangerDeath" type="number"></label-input>
            <label-input label="受伤人数：" placeholder="请输入事故受伤人数" v-model="dangerInjure" type="number"></label-input>
            <div class="detail">
                <span>事故详情</span>
                <textarea class="area" rows="3" placeholder="请输入事故详情" v-model="dangerDetail"></textarea>
            </div>
            <div v-if="dangerStatus == '已处理'" class="detail">
                <span>处理信息</span>
                <textarea class="area" rows="3" placeholder="请输入事故详细处理过程" v-model="dangerProcess"></textarea>
            </div>
            <div v-if="dangerStatus == '已结案'" class="detail">
                <span>结案信息</span>
                <textarea class="area" rows="3" placeholder="请输入事故结案信息" v-model="dangerReport"></textarea>
            </div>
        </div>
        <div class="upload">
            <!--上传图片-->
            <upload-img max-length="5" @imgChange="uploadImgChange"></upload-img>
        </div>
        <mt-datetime-picker
                ref="timePicker"
                v-model="defaultDate"
                @confirm="timeConfirm"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日">
        </mt-datetime-picker>
        <danger-dispose-time :selectData="selectData" :isShowSelect="isShowSelect"
                             @listenSelect="selectConfirm"></danger-dispose-time>
        <footer-button text="上报" @click="uploadDanger()"></footer-button>
    </div>
</template>

<script>
    import {formatDate} from "../../utils/util";
    import * as api from "../../constant/api"
    import LabelInput from "../common/LabelInput";
    import InputSelector from "../common/InputSelector";
    import DangerDisposeTime from "../common/DangerDisposeTime";
    import FooterButton from "../common/FooterButton";
    import UploadImg from "../common/UploadImg";
    import UploadVideo from "../common/UploadVideo";

    export default {
        name: "DangerManagerUpload",
        components: {UploadVideo, UploadImg, FooterButton, DangerDisposeTime, InputSelector, LabelInput},
        data() {
            return {
                uploadImg: [],//待上传图片地址
                videoImg: '',//视频预览图
                videoUrl: '',//视频链接地址
                pickerDate: "",//选择的时间
                defaultDate: new Date,//时间选择器默认时间
                dangerTypeData: ["交通事故", "踩踏事故", "溺水事故", "火灾事故", "触电事故", "校园事故", "其他"],//事故类型
                dangerGradeData: ["特大事故", "重大事故", "较大事故", "一般事故"],//事故等级
                dangerStatusData: ["新填报", "已处理", "已结案"],//事故状态
                dangerNatureData: ["责任事故", "自然事故", "技术事故", "其他"],//事故性质
                dangerType: "",//被选中的事故类型
                dangerGrade: "",//被选中的事故等级
                dangerStatus: "",//被选中的事故状态
                dangerNature: "",//被选中的事故性质
                dangerTypeID: "",//被选中的事故类型ID
                dangerGradeID: "",//被选中的事故等级ID
                dangerStatusID: "",//被选中的事故状态ID
                dangerNatureID: "",//被选中的事故性质ID
                dangerName: "",//事故名称
                dangerMoney: "",//事故损失
                dangerDeath: "0",//死亡人数
                dangerInjure: "0",//受伤人数
                dangerAddress: "",//事故发生地点
                dangerDetail: "",//事故发生详情
                dangerProcess: "",//事故处理信息
                dangerReport: "",//事故结案信息
                isShowSelect: false,//是否弹窗选择层
                selectType: 'dangerType',//选择层的类型
                selectData: [],//选择层的数据
                checkDataTips: {
                    'accident_name': '事故标题',
                    'happen_time': '事故发生的时间',
                    'type': '事故分类',
                    'nature': '事故性质',
                    'grade': '事故严重等级',
                    'money_loss': '事故直接经济损失',
                    'place': '事故发生地点',
                    'details': '事故详情',
                    'status': '事故现状态'
                }//数据校检提示
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            pickTime() { //选择时间
                this.$refs.timePicker.open();
            },
            timeConfirm(val) { //确认选择时间
                this.pickerDate = formatDate(val, 'YY-MM-DD');
            },
            pickItem(type) { //弹出层选择
                this.selectData = [];
                this.selectType = type;
                if (type == 'dangerType') {//选择事故分类
                    this.selectData = this.dangerTypeData;
                } else if (type == 'dangerGrade') {//选择事故等级
                    this.selectData = this.dangerGradeData;
                } else if (type == 'dangerStatus') {//选择事故状态
                    this.selectData = this.dangerStatusData;
                } else if (type == 'dangerNature') {//选择事故性质
                    this.selectData = this.dangerNatureData;
                }
                this.isShowSelect = true;
            },
            selectConfirm(index) { //确认选择时间
                this.isShowSelect = false;
                if (index == -1) {
                    return;
                }
                //处理返回数据
                if (this.selectType == 'dangerType') {
                    this.dangerType = this.dangerTypeData[index];
                    this.dangerTypeID = index + 1;
                } else if (this.selectType == 'dangerGrade') {
                    this.dangerGrade = this.dangerGradeData[index];
                    this.dangerGradeID = index + 1;
                } else if (this.selectType == 'dangerStatus') {
                    this.dangerStatus = this.dangerStatusData[index];
                    this.dangerStatusID = index + 1;
                } else if (this.selectType == 'dangerNature') {
                    this.dangerNature = this.dangerNatureData[index];
                    this.dangerNatureID = index + 1;
                }
            },
            uploadDanger() { //上报事故
                let params = {
                    'accident_name': this.dangerName,
                    'place': this.dangerAddress,
                    'happen_time': this.pickerDate,
                    'type': this.dangerTypeID,
                    'nature': this.dangerNatureID,
                    'status': this.dangerStatusID,
                    'grade': this.dangerGradeID,
                    'money_loss': this.dangerMoney,
                    'death': this.dangerDeath || 0,
                    'injure': this.dangerInjure || 0,
                    'details': this.dangerDetail,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'create_userid': this.user.PID || this.$route.query.pid,
                    'dangerProcess': this.dangerProcess,
                    'dangerReport': this.dangerReport,
                    'img': this.uploadImg || []
                }
                //数据空值校检，并给出提示
                let notCheck = ['dangerProcess', 'dangerReport', 'img'];// 不用检查空值的参数
                for (let key in params) {
                    if (notCheck.includes(key)) {
                        continue
                    }
                    if (params[key] == "") {
                        this.$bottomToast(this.checkDataTips[key] + '不能为空，请填写后再提交!');
                        return
                    }
                }
                if (this.dangerStatus == '已处理' && this.dangerProcess == '') {
                    this.$bottomToast('当前事故状态为处理中，请填写处理信息');
                    return
                }
                if (this.dangerStatus == '已结案' && this.dangerReport == '') {
                    this.$bottomToast('当前事故状态为已结案，请填写结案信息');
                    return
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.UPLOAD_DANGER_MANAGER, params, (res) => {
                    this.$bottomToast(res.msg);
                    if (res.status == 1) {
                        this.$router.back();
                    }
                })
            },
            uploadImgChange(res) {//待上传的图片data
                this.uploadImg = res;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .bottom {
        border-top px2vw(16px) solid bg-color
    }

    .bottom textarea {
        border none
    }

    .detail {
        padding 3% 4%
        fontSize(32px)
        borderTop()
    }

    .area {
        width 100%
        margin-top px2vw(10px)
    }

    .upload {
        margin-bottom px2vw(150px)
        paddingAround()
    }
</style>