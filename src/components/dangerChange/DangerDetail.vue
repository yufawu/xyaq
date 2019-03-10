/**
* @Description:    隐患整改详情
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/
<template>
    <div class="danger_detail">
        <div class="danger_top">
            <p class="danger_desc">{{ dangerData.description }}</p>
            <show-img-list :img1="dangerData.img" :img2="dangerData.img2" :img3="dangerData.img3"
                           :videoImg="dangerData.video_img" :videoURL="dangerData.video_url"></show-img-list>
        </div>
        <label-text v-if="dangerData.status != 0" label="隐患类别：" :text="dangerData.category_name"></label-text>
        <label-text label="隐患地点：" :text="dangerData.position"></label-text>
        <label-text label="现隐患状态：" :text="dangerStates[dangerData.status]"></label-text>
        <label-text v-if="dangerData.status != 0" label="要求隐患处置完成时间："
                    :text="dangerData.do_time == ''? '未指定' : dangerData.do_time + '小时'"></label-text>
        <div v-if="dangerData.status != 0 && dangerData.status != 7 && !(dangerData.status == 3 && dangerData.zgimg == '') && !(dangerData.status == 5 && dangerData.zgimg == '') && !(dangerData.status == 6 && dangerData.zgimg == '')"
             class="change_img">
            <div class="change_img_title">整改图片：</div>
            <show-img-list v-if="dangerData.status == 3 || dangerData.status == 5 || dangerData.status == 6"
                           :img1="dangerData.zgimg" :img2="dangerData.zgimg2" :img3="dangerData.zgimg3"></show-img-list>
            <upload-img v-if="dangerData.status == 1" class="upload_img" :readonly="readonly"
                        @imgChange="uploadImgChange"></upload-img>
        </div>
        <label-text v-else-if="dangerData.status == 3 || dangerData.status == 5 || dangerData.status == 6" label="整改图片："
                    text="无"></label-text>
        <input-selector v-if="dangerData.status == 0" class="danger_type" label="隐患类别：" placeholder="选择该隐患的类别"
                        :readonly="readonly" v-model="dangerType"
                        @listenSelect="pickType"></input-selector>
        <input-selector v-if="dangerData.status == 0" label="隐患指派：" placeholder="选择该隐患的处理人" v-model="dangerUser"
                        :readonly="readonly" @listenSelect="pickUser"></input-selector>
        <input-selector v-if="dangerData.status == 0" label="要求隐患处理完成时间：" placeholder="隐患所需时间" v-model="dangerTime"
                        :readonly="readonly" @listenSelect="pickTime"></input-selector>
        <danger-dispose-time :selectData="selectData" :isShowSelect="isShowSelect"
                             @listenSelect="selectConfirm"></danger-dispose-time>
        <label-text v-if="dangerData.status == 3 || dangerData.status == 6" label="整改备注："
                    :text="dangerData.remark || '无'"></label-text>
        <input-selector class="cancel_reason" v-if="dangerData.status == 7" label="撤销原因：" placeholder="选择撤销该隐患的原因"
                        v-model="dangerCancelType"
                        @listenSelect="pickCancel"></input-selector>
        <div v-if="dangerData.status != 5 && dangerData.status != 6" class="mark">
            <div v-if="dangerData.status == 3" class="danger_label">验收备注：</div>
            <div v-else-if="dangerData.status == 0" class="danger_label">指派整改备注：</div>
            <div v-else-if="dangerData.status == 1" class="danger_label">整改备注：</div>
            <div v-else-if="dangerData.status == 7" class="danger_label">撤销备注：</div>
            <textarea v-if="dangerData.status == 3" class="mark_content" rows="5" maxlength="150" v-model="dangerMark"
                      :readonly="readonly" placeholder="填写验收的意见或建议"></textarea>
            <textarea v-else-if="dangerData.status == 7" class="mark_content" rows="5" maxlength="150"
                      :readonly="readonly" v-model="dangerMark"
                      placeholder="填写撤销隐患的意见或建议"></textarea>
            <textarea v-else-if="dangerData.status == 0 || dangerData.status == 1" class="mark_content" rows="5"
                      :readonly="readonly" maxlength="150" v-model="dangerMark"
                      placeholder="填写整改的意见或建议"></textarea>
        </div>
        <div class="record">
            <div class="record_title">隐患流水：</div>
            <timeline>
                <timeline-item v-if="index == 0" style="color: #1c71fb" color="#1c71fb"
                               v-for="(item,index) in recodeData" :key="index">
                    <p>{{ item.content }}</p>
                    <p class="record_time">{{ item.create_time }}</p>
                    <p v-if="item.remark == ''" class="record_time">处理备注：无</p>
                    <p v-else class="record_time">处理备注：{{ item.remark }}</p>
                </timeline-item>
                <timeline-item v-if="index != 0" style="color: #aaa" v-for="(item,index) in recodeData" :key="index">
                    <p>{{ item.content }}</p>
                    <p class="record_time">{{ item.create_time }}</p>
                    <p v-if="item.remark == ''" class="record_time">处理备注：无</p>
                    <p v-else class="record_time">处理备注：{{ item.remark }}</p>
                </timeline-item>
            </timeline>
        </div>
        <div class="footer" :style="{'bottom': footerBottomStyle}">
            <div class="footer_item" v-if="dangerData.status == 0 && user.PID == dangerData.chargepid"
                 @click="dangerAssign">指派隐患
            </div>
            <div class="footer_item" v-if="dangerData.status == 1 && user.PID == dangerData.chargepid"
                 @click="dangerDispose">处理隐患
            </div>
            <div class="footer_item" v-if="dangerData.status == 3 && user.PID == dangerData.acceptpid"
                 @click="dangerCheck">验收隐患
            </div>
            <div class="footer_item"
                 v-if="dangerData.status != 5 && dangerData.status != 6 && dangerData.status != 7 && user.PID == dangerData.chargepid"
                 @click="dangerCancel">撤销隐患
            </div>
            <div class="footer_item" v-if="dangerData.status == 7" @click="dangerCancelConfirm">我要撤销</div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import ShowImgList from '../common/ShowImgList'
    import UploadImg from '../common/UploadImg'
    import LabelText from '../common/LabelText'
    import InputSelector from '../common/InputSelector'
    import DangerDisposeTime from '../common/DangerDisposeTime'
    import {Timeline, TimelineItem, TimelineTitle} from 'vue-cute-timeline'
    import {checkPlatform, isMiniProgram} from "../../utils/util";
    import wx from 'weixin-js-sdk'

    export default ({
        name: 'dangerDetail',
        components: {
            ShowImgList,
            UploadImg,
            LabelText,
            InputSelector,
            DangerDisposeTime,
            Timeline,
            TimelineItem,
            TimelineTitle
        },
        data() {
            return {
                dangerData: {},//隐患数据
                dangerTime: '',//隐患处理时间
                dangerItemData: ['1小时', '2小时', '5小时', '8小时', '12小时', '24小时', '48小时', '72小时'],//备选时间
                cancelItemData: ['重复上报', '非隐患', '处理不了', '其他'],//隐患撤销类别
                dangerCancelType: '',//隐患撤销类别
                dangerType: '',//隐患类别
                dangerTypeID: -1,//隐患类别ID
                dangerUser: '',//指派隐患处理人
                dangerUserID: -1,//指派隐患处理人ID
                dangerStates: ['已上报，待指派', '已指派，待处理', '', '已处理，待验收', '', '已撤销', '已验收'],//隐患状态
                typeData: [],//分类列表
                recodeData: [],//流水记录
                userListData: [],//可以指派的用户列表
                uploadImg: [],//隐患整改图片
                dangerMark: '',//整改备注
                isShowSelect: false,//是否弹窗选择层
                selectType: 'dangerType',//选择层的类型
                selectData: [],//选择层的数据
                isCheckPass: 0,//是否验收通过 1通过 0不通过
                readonly: false,//是否只读
                footerBottom: '0',//适配安卓手机小程序中图片上传完成后，底部按钮被遮挡的问题
            }
        },
        mounted() {
            // this.getDangerDetail();
        },
        activated() {
            if (!this.$route.meta.isBack) {//当前操作不是返回的时候，调用方法获取数据，否则使用meta中keepAlive属性设置的路由缓存数据
                this.getDangerDetail();
                if (this.user.type == 1) {
                    this.readonly = true;
                } else {
                    this.readonly = false;
                }
                //防止页面缓存数据，给所有变量重新赋值
                this.uploadImg = [];
                this.dangerType = '';//隐患类别
                this.dangerTypeID = -1;//隐患类别ID
                this.dangerUser = '';//指派隐患处理人
                this.dangerUserID = -1;//指派隐患处理人ID
                this.dangerTime = '';
                this.dangerMark = '';
                this.footerBottom = '0'
            }
            this.$route.meta.isBack = false;//每次都重置该值，避免返回之后isBack一直为true，后续无法加载数据
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            dangerID() {
                return this.$store.getters.dangerID;
            },
            footerBottomStyle() {
                return this.footerBottom;
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'imageVideoPreview') {
                to.meta.isBack = true;
            }
            next();
        },
        methods: {
            getDangerDetail() {//获取隐患详情
                let params = {
                    'pid': this.user.PID,
                    'id': this.dangerID
                };
                this.http(this, this.user.baseURL + api.GET_DANGER_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.recodeData = [];
                        this.dangerData = res.data.dangerinfo;
                        this.typeData = res.data.categoryarr;
                        let recode = res.data.flowarr.reverse();
                        this.recodeData = this.recodeData.concat(recode[0]);
                        this.recodeData = this.recodeData.concat(recode[1].reverse());
                        this.recodeData.push(recode[2]);
                        this.userListData = res.data.teamarr;
                    } else {
                        this.$bottomToast(res.msg)
                    }
                })
            },
            dangerDispose() {//处理隐患
                if (this.uploadImg.length == 0) {
                    this.$bottomToast('请上传整改图片！');
                    return
                }
                let params = {
                    'id': this.dangerData.id,
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'zgimg': this.uploadImg[0] || '',
                    'zgimg2': this.uploadImg[1] || '',
                    'zgimg3': this.uploadImg[2] || '',
                    'remark': this.dangerMark
                };
                this.http(this, this.user.baseURL + api.DANGER_DISPOSE, params, (res) => {
                    if (res.status == 1) {
                        this.getDangerDetail();//重新获取数据（刷新页面）
                    }
                    this.$bottomToast(res.msg);
                })
            },
            dangerAssign() {//指派隐患
                if (this.dangerUserID == -1) {
                    this.$bottomToast('请选择隐患处理人后指派');
                    return;
                }
                if (this.dangerTypeID == -1) {
                    this.$bottomToast('请选择隐患类型后指派');
                    return;
                }
                let params = {
                    'id': this.dangerData.id,
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'acceptpid': this.dangerUserID,
                    'category': this.dangerTypeID,
                    'do_time': this.dangerTime,
                    'remark': this.dangerMark
                };
                this.http(this, this.user.baseURL + api.DANGER_ASSIGN, params, (res) => {
                    if (res.status == 1) {
                        this.getDangerDetail();//重新获取数据（刷新页面）
                    }
                    this.$bottomToast(res.msg);
                });
            },
            dangerCancel() {//撤销隐患
                this.dangerStates.push(this.dangerStates[this.dangerData.status]);
                this.dangerData.status = 7;
            },
            dangerCancelConfirm() {
                if (this.dangerCancelType == '') {
                    this.$bottomToast('请选择撤销隐患原因');
                    return;
                }
                let params = {
                    'id': this.dangerData.id,
                    'status': this.user.PID,
                    'cancel_stat': this.dangerCancelType,
                    'text': this.dangerMark
                }
                this.http(this, this.user.baseURL + api.DANGER_CANCEL, params, (res) => {
                    if (res.status == 1) {
                        this.getDangerDetail();//重新获取数据（刷新页面）
                    }
                    this.$bottomToast(res.msg);
                })
            },
            dangerCheck() {//验收隐患
                let params = {
                    'id': this.dangerData.id,
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'flag': this.isCheckPass,
                    'remark': this.dangerMark
                };
                this.http(this, this.user.baseURL + api.DANGER_CHECK, params, (res) => {
                    if (res.status == 1) {
                        this.getDangerDetail();//重新获取数据（刷新页面）
                    }
                    this.$bottomToast(res.msg);
                })
            },
            pickType() {//选择隐患类型
                this.selectData = [];
                this.selectType = 'dangerType';
                for (let i = 0, len = this.typeData.length; i < len; i++) {
                    this.selectData.push(this.typeData[i].name);
                }
                this.isShowSelect = true;
            },
            pickUser() {//选择隐患处理人
                this.selectData = [];
                this.selectType = 'dangerUser';
                for (let i = 0, len = this.userListData.length; i < len; i++) {
                    this.selectData.push(this.userListData[i].acceptusername);
                }
                this.isShowSelect = true;
            },
            pickTime() {//选择隐患处理时间
                this.selectData = [];
                this.selectType = 'dangerTime';
                this.selectData = this.selectData.concat(this.dangerItemData);
                this.isShowSelect = true;
            },
            pickCancel() {//选择撤销隐患原因
                this.selectData = [];
                this.selectType = 'dangerCancel';
                this.selectData = this.selectData.concat(this.cancelItemData);
                this.isShowSelect = true;
            },
            selectConfirm(index) {//确认选择
                this.isShowSelect = false;
                if (index == -1) {
                    return;
                }
                //处理返回数据
                if (this.selectType == 'dangerType') {
                    this.dangerType = this.typeData[index].name;
                    this.dangerTypeID = this.typeData[index].id;
                } else if (this.selectType == 'dangerUser') {
                    this.dangerUser = this.userListData[index].acceptusername;
                    this.dangerUserID = this.userListData[index].acceptpid;
                } else if (this.selectType == 'dangerTime') {
                    this.dangerTime = this.dangerItemData[index];
                } else if (this.selectType == 'dangerCancel') {
                    this.dangerCancelType = this.cancelItemData[index];
                }
            },
            uploadImgChange(res) {//待上传的图片data
                let platform = checkPlatform();
                isMiniProgram(wx, (res)=>{//适配安卓手机小程序中图片上传完成后，底部按钮被遮挡的问题
                    if (res && platform == 1) {//小程序环境且安卓环境才会出现的BUG
                        this.footerBottom = '3.5%';
                    }
                })
                this.uploadImg = res || [];
            }
        }
    })
</script>

<style>

</style>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    .timeline:nth-child(1) > .timeline-item:nth-child(1) > .timeline-circle {
        left: -36px;
        width: 15px;
        height: 15px;
    }

    .danger_detail {
        padding-bottom 11%
    }

    .danger_desc {
        min-height 70px
        width 100%
        fontSize(32px)
    }

    .danger_top {
        padding 3% 4%
        borderBottom()
    }

    .danger_item {
        @extend .danger_top
        display flex
        justify-content space-between
    }

    .danger_content {
        color vice-font-color
    }

    .change_img {
        @extend .danger_top
        border-top 6px solid bg-color
    }

    .change_img_title {
        margin-bottom 3%
    }

    .danger_type {
        border-top 5px solid bg-color
    }

    .record {
        @extends .danger_type
    }

    .record_title {
        margin-top 3%
        margin-left 4%
    }

    .mark {
        padding 3% 4%
        borderTop()
        display flex
    }

    .mark_content {
        flex 1
        border none
    }

    .footer {
        position fixed
        display flex
        width 100%
        bottom 0
        left 0
        background main-color
        color white
        z-index 10
    }

    .record_time {
        margin-top px2vw(10px)
        fontSize(20px)
    }

    .cancel_reason {
        border-top 5px solid bg-color
    }

    .footer_item {
        width 0
        flex-grow 1
        text-align center
        padding 3% 0
        fontSize(34px)
        borderRight(#ccc)
    }
</style>