/**
* @Description:    会议列表
* @Author:         TSY
* @CreateDate:     2018/8/29 10:47
*/
<template>
    <div>
        <div class="menu">
            <div class="menu_item" v-for="(item,index) in menuList" :class="{menu_select: selectIndex == index}"
                 :key="index" @click="changeMenu(index)">{{ item }}
            </div>
        </div>
        <no-data-tips :data="meetingList"></no-data-tips>
        <vue-better-scroll ref="wrapper" class="meeting"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadUp" @pullingUp="loadBottom">
            <ul>
                <li class="meeting_item" v-for="(item,index) in meetingList" :key="index">
                    <div @click="intoDetail(item.meeting_id)">
                        <p class="meeting_title">{{ item.title }}</p>
                        <p class="meeting_date">会议时间：{{ item.begin_time }}</p>
                        <p class="meeting_date">会议地点：{{ item.position }}</p>
                    </div>
                    <p class="meeting_count" @click="intoCount(item.meeting_id)">查看签到统计>></p>
                </li>
            </ul>
            <fill-box></fill-box>
        </vue-better-scroll>
        <footer-button text="会议扫码" @click="getScanSignPackage"></footer-button>
        <!--会议签到弹窗-->
        <meeting-signing-dialog :showConfirmDialog="isShowSignConfirmDialog" :showResultDialog="isShowSignDialog"
                                :resultImg="signDialogImg" :position="meetingPosition" :time="signTime"
                                @confirm="signConfirm"></meeting-signing-dialog>
    </div>
</template>

<script>
    import {formatDate, getQueryString, isMiniProgram} from "../../utils/util";
    import wx from "weixin-js-sdk"
    import * as types from '../../constant/types'
    import * as api from '../../constant/api'
    import FillBox from "../common/FillBox";
    import NoDataTips from "../common/NoDataTips";
    import FooterButton from "../common/FooterButton";
    import MeetingSigningDialog from "../common/MeetingSigningDialog";

    export default {
        name: "MeetingList",
        components: {MeetingSigningDialog, FooterButton, NoDataTips, FillBox},
        data() {
            return {
                isShowSignConfirmDialog: false,//是否显示会议签到确认弹窗
                meetingPosition: '',//会议签到地点
                meetingID: '',//会议签到ID
                signTime: '',//会议签到时间
                isShowSignDialog: false,//是否显示签到结果弹窗
                signDialogImg: require('../../assets/safeMeeting/sign_success.png'),//签到结果弹窗图片（默认签到成功图）
                menuList: ['全部', '未开始', '已结束'],//菜单列表
                selectIndex: 0,//默认选中的菜单
                meetingList: [],//当前选中的会议列表
                meetingAllList: [],//所有会议列表
                page: 1,//当前加载的页数
                // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
                pullDownRefreshObj: {
                    threshold: 90,
                    stop: 40
                },
                // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
                pullUpLoadObj: {
                    threshold: 0,
                    txt: {
                        more: '加载更多',
                        nomore: '没有更多数据了'
                    }
                },
                startY: 0,//纵轴方向初始化位置
            }
        },
        mounted() {
            this.getMeetingList();
            this.isMiniScanBack();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            changeMenu(index) {//切换菜单
                this.selectIndex = index;
                this.page = 1;
                this.meetingList = [];
                this.getMeetingList();
            },
            intoDetail(id) {//查看会议详情
                this.$router.push({name: "meetingDetail"});
                this.$store.dispatch(types.SET_SAFE_MEETING_ID, id);
            },
            intoCount(id) {//查看签到统计
                this.$router.push({name: "meetingCount"});
                this.$store.dispatch(types.SET_SAFE_MEETING_ID, id);
            },
            getMeetingList() { //获取会议列表
                let params = {
                    'account_id': this.user.accountID,
                    'pid': this.user.PID,
                    'page': this.page
                }
                this.http(this, this.user.baseURL + api.GET_MEETING_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.meetingAllList = res.data;
                        this.setMeetingList();
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true)
                    } else {
                        if (this.page == 1) {
                            this.meetingList = [];
                        }
                        this.$bottomToast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false)
                    }
                })
            },
            setMeetingList() { //设置当前页面显示的数据
                if (this.selectIndex == 0) {
                    if (this.page == 1) {
                        this.meetingList = this.meetingAllList.all_meeting || [];
                    } else {
                        this.meetingList = this.meetingList.concat(this.meetingAllList.all_meeting || []);
                    }
                } else if (this.selectIndex == 1) {
                    if (this.page == 1) {
                        this.meetingList = this.meetingAllList.not_beginning || [];
                    } else {
                        this.meetingList = this.meetingList.concat(this.meetingAllList.not_beginning || []);
                    }
                } else {
                    if (this.page == 1) {
                        this.meetingList = this.meetingAllList.end_meeting || [];
                    } else {
                        this.meetingList = this.meetingList.concat(this.meetingAllList.end_meeting || []);
                    }
                }
            },
            loadUp() {//下拉刷新
                this.page = 1;
                this.getMeetingList();
            },
            loadBottom() {//上拉加载
                this.page++;
                this.getMeetingList();
            },
            isMiniScanBack() {//如果是小程序扫码返回，则处理扫码数据
                isMiniProgram(wx, (res) => {
                    if (res) {
                        let miniType = this.$route.query.miniType;
                        let result = this.$route.query.result;
                        result = decodeURI(result);
                        if (miniType && miniType === 'mini') {
                            this.scanResult(result);
                        }
                    }
                })
            },
            getScanSignPackage() { //获取微信扫一扫签名等参数
                isMiniProgram(wx, (res) => {
                    if (res) {
                        wx.miniProgram.redirectTo({url: '../scanCode/scanCode?redirect=' + window.location.href});
                    } else {
                        this.getScanSignData();
                    }
                })
            },
            getScanSignData() { //获取签名数据
                this.http(this, "/" + api.SAFE_MEETING_SCAN_SINGING, {}, (res) => {
                    if (res.status == 1) {
                        this.wxScan(res.data);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            wxScan(data) {//调用微信扫码
                let _this = this;
                wx.config({
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: data.appId,
                    // 必填，生成签名的时间戳
                    timestamp: "" + data.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: data.nonceStr,
                    // 必填，签名
                    signature: data.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表
                    jsApiList: ['checkJsApi', 'scanQRCode']
                });
                wx.error(function (res) {
                    alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                });
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: ['scanQRCode'],
                        success: function (res) {
                            console.log(res);
                        }
                    });
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            _this.scanResult(res.resultStr);
                        }
                    });
                });
            },
            scanResult(result) {//处理扫码结果
                this.meetingID = getQueryString('meeting_id', result);
                this.meetingPosition = getQueryString('meeting_position', result) || this.$route.query.meeting_position;
                this.signTime = formatDate(new Date());
                this.showSigningConfirm();
            },
            showSigningConfirm() {//打开学校会议签到确认框
                this.isShowSignConfirmDialog = true;
            },
            signConfirm() {//学校会议签到确认
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'meeting_id': this.meetingID
                }
                this.http(this, this.user.baseURL + api.SCHOOL_SAFE_MEETING_SINGING, params, (res) => {
                    if (res.status == 1) {
                        this.signDialogImg = require('../../assets/safeMeeting/sign_success.png')
                        this.isShowSignDialog = true;
                    } else {
                        if (res.msg.indexOf('重复') > -1) {
                            this.signDialogImg = require('../../assets/safeMeeting/sign_repeat.png');
                            this.isShowSignDialog = true;
                        } else {
                            this.$bottomToast(res.msg);
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .menu {
        display flex
        align-items center
        justify-content space-around
        background white
        borderBottom()
        fixedTop()
    }

    .meeting {
        padding-top px2vw(120px)
        height 100vh
        background bg-color
    }

    .meeting ul {
        padding-bottom px2vw(100px)
    }

    .meeting li {
        background white
    }

    .menu_item {
        max-width 25vw
        flex-grow 1
        text-align center
        paddingAround()
    }

    .menu_select {
        color main-color
        borderBottom(main-color)
    }

    .meeting_item {
        border-bottom px2vw(16px) solid bg-color
        paddingAround()
    }

    .meeting_title {
        fontSize(32px)
        font-weight bold
        margin-bottom px2vw(30px)
    }

    .meeting_date {
        color vice-font-color
        margin px2vw(15px) 0
    }

    .meeting_count {
        margin-top px2vw(30px)
        color main-color
        font-weight bold
    }
</style>