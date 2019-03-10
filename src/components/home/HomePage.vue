/**
* @Description:    首页-主页
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/

<template>
    <div>
        <div v-if="isLogin" class="banner">
            <div class="banner_hello">
                <p class="banner_hello_name">Hi,{{ user.userName }}</p>
                <p class="banner_hello_text">欢迎使用校园安全综合管控云平台</p>
            </div>
            <img src="../../assets/home/banner_has_login.png"/>
        </div>
        <swiper v-else class="banner" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item,index) in bannerData" :key="index">
                <div class="banner_text">
                    <p class="banner_title">{{ item.title }}</p>
                    <p class="banner_vice_title">{{ item.viceTitle }}</p>
                </div>
                <img :src="item.src"/>
            </swiper-slide>
        </swiper>
        <!--通知公告和代办事项-->
        <div v-if="isLogin" class="todo">
            <div class="notice" @click="clickOperation('notice')">
                <i class="iconfont icon-xiaoxi"></i>
                <div class="notice_text" v-if="noticeData.length == 0">暂未收到通知</div>
                <marquee v-else class="notice_text">{{ noticeData[0].title }}</marquee>
            </div>
            <div class="todo_content" @click="clickOperation('')">
                <img src="../../assets/home/icon_todo.png" class="todo_icon">
                <ul class="todo_container">
                    <transition-group
                            enter-active-class="animated flipInX"
                            leave-active-class="animated flipOutX">
                        <li v-show="isShowFirstNotice" class="todo_container_item" :key="1">
                            <i class="iconfont icon-dian"></i>
                            <span class="todo_container_title">暂无待办事项</span>
                            <span class="todo_container_time">刚刚</span>
                        </li>
                        <li v-show="isShowFirstNotice" class="todo_container_item" :key="2">
                            <i class="iconfont icon-dian"></i>
                            <span class="todo_container_title">暂无待办事项</span>
                            <span class="todo_container_time">刚刚</span>
                        </li>
                    </transition-group>
                </ul>
                <img class="next" src="../../assets/home/next.png">
            </div>
        </div>
        <!--安全管理-->
        <div v-else class="manager">
            <p class="manager_title">安全管理</p>
            <div class="manager_items">
                <ul>
                    <li v-for="(item,index) in safeManagerData" :key="index" class="click_item"
                        @click="intoSafeManager(index)">
                        <img class="manager_item_icon" :src="item.img">
                        <div class="manager_item_content">
                            <p class="manager_item_title"><span>{{ item.preTitle }}</span>{{ item.title }}</p>
                            <p class="manager_item_vice_title">{{ item.viceTitle }}</p>
                        </div>
                        <img class="manager_item_next" src="../../assets/home/next.png">
                    </li>
                </ul>
            </div>
        </div>
        <!--模块入口按钮-->
        <div v-if="isLogin" class="operation">
            <div class="operation_item click_item" v-for="(item, index) in showOperationItem" :key="index"
                 @click="clickOperation(item.name)">
                <img :src="item.img">
                <p class="operation_item_text">{{ item.text }}</p>
            </div>
            <div v-if="reallyOperationItem.length > 8" class="more_operation" @click="lookMore">
                <i v-if="isShowMoreOperation" class="iconfont icon-up"></i>
                <i v-if="!isShowMoreOperation" class="iconfont icon-down-copy"></i>
            </div>
        </div>
        <!--安全知识库-->
        <div class="knowledge" :class="{ login_width: isLogin }">
            <p class="manager_title">安全知识</p>
            <div class="knowledge_items">
                <ul>
                    <li v-for="(item,index) in safeKnowledgeData" :key="index" @click="intoKnowledgeDetail(item.link)">
                        <img class="knowledge_item_icon" :src="item.image" :onerror="errorImg">
                        <div class="knowledge_item_content">
                            <p class="manager_item_title">{{ item.title }}</p>
                            <p class="knowledge_item_vice_title">{{ item.content }}</p>
                            <div class="knowledge_star">★★★★☆</div>
                        </div>
                    </li>
                </ul>
                <div v-if="safeKnowledgeData.length == 0" class="knowledge_nodata">暂无安全知识</div>
            </div>
            <div class="more" @click="clickOperation('safeKnowledge')">查看更多资源</div>
        </div>
        <!--学校会议签到弹窗-->
        <meeting-signing-dialog :showConfirmDialog="isShowSignConfirmDialog" :showResultDialog="isShowSignDialog"
                                :resultImg="signDialogImg" :position="meetingPosition" :time="signTime"
                                @confirm="signConfirm"></meeting-signing-dialog>
        <div v-if="user.isExperience" class="business" @click="business"><span>商务</span><span>合作</span></div>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import * as types from '../../constant/types'
    import {delHtmlTag, formatDate, getQueryString, isMiniProgram} from "../../utils/util";
    import wx from "weixin-js-sdk"
    import MeetingSigningDialog from "../common/MeetingSigningDialog";

    export default {
        name: 'homePage',
        components: {MeetingSigningDialog},
        data() {
            return {
                isShowSignConfirmDialog: false,//是否显示会议签到确认弹窗
                meetingPosition: '',//会议签到地点
                meetingID: '',//会议签到ID
                signTime: '',//会议签到时间
                isShowSignDialog: false,//是否显示签到结果弹窗
                signDialogImg: require('../../assets/safeMeeting/sign_success.png'),//签到结果弹窗图片（默认签到成功图）
                //banner数据
                bannerData: [
                    {
                        'title': '安全数据管控',
                        'viceTitle': '痕迹化、可视化',
                        'src': require('../../assets/home/banner_hardware.png')
                    },
                    {'title': '安全督办巡查', 'viceTitle': '日常化、体系化', 'src': require('../../assets/home/banner_manager.png')},
                    {
                        'title': '安全教育知识',
                        'viceTitle': '专业化、体系化',
                        'src': require('../../assets/home/banner_knowledge.png')
                    }],
                //安全管理数据
                safeManagerData: [
                    {
                        'img': require('../../assets/home/icon_change.png'),
                        'preTitle': '隐患整改',
                        'title': '·排除安全隐患',
                        'viceTitle': '随时随地上报，安全问题早预防'
                    },
                    {
                        'img': require('../../assets/home/icon_everyday_check.png'),
                        'preTitle': '巡查管理',
                        'title': '·定时定点巡查',
                        'viceTitle': '固定地点巡查，从源头遏制安全事故'
                    }
                ],
                //安全知识数据
                safeKnowledgeData: [],
                swiperOption: {//swiper参数配置
                    autoplay: true,//自动滑动
                    loop: true//循环滚动
                },
                operationItem: [//模块操作按钮  img:图标路径  text：显示的模块名字   name：对呀的路由名字   schoolAuth：学校是否有权限查看   eduAuth：教育局是否有权限查看
                    {
                        'img': require('../../assets/home/icon_special.png'),
                        'text': '专项检查',
                        'name': 'specialCheck',
                        'schoolAuth': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_everyday_check.png'),
                        'text': '日常巡查',
                        'name': 'schoolEverydayCheck',
                        'schoolAuth': true,
                        'experience': true,
                        'eduAuth': false
                    },
                    {
                        'img': require('../../assets/home/icon_renwuxiafa.png'),
                        'text': '工作任务',
                        'name': 'taskPublish',
                        'schoolAuth': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_change.png'),
                        'text': '隐患管理',
                        'name': 'dangerChange',
                        'schoolAuth': true,
                        'experience': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_supervision.png'),
                        'text': '社会监督',
                        'name': 'socialSupervision',
                        'schoolAuth': false,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_anquanhuiyi.png'),
                        'text': '安全会议',
                        'name': 'meetingList',
                        'schoolAuth': false,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_anquanhuiyi.png'),
                        'text': '安全会议',
                        'name': 'meetingSigning',
                        'schoolAuth': true,
                        'eduAuth': false
                    },
                    {
                        'img': require('../../assets/home/icon_performance.png'),
                        'text': '绩效考核',
                        'name': 'performance',
                        'schoolAuth': false,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_upload.png'),
                        'text': '问卷调查',
                        'name': 'uploadMaterial',
                        'schoolAuth': true,
                        'experience': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_danger_manager.png'),
                        'text': '事故管理',
                        'name': 'dangerManagerList',
                        'schoolAuth': true,
                        'experience': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_contact.png'),
                        'text': '通讯录',
                        'name': 'addressList',
                        'schoolAuth': false,
                        'experience': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_knowledge.png'),
                        'text': '安全教育',
                        'name': 'safeKnowledge',
                        'schoolAuth': false,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/icon_spjk.png'),
                        'text': '视频监控',
                        'name': 'monitorList',
                        'schoolAuth': true,
                        'eduAuth': true
                    },
                    {
                        'img': require('../../assets/home/web_icon_genduo.png'),
                        'text': '期待更多',
                        'name': 'waitingMore',
                        'schoolAuth': false,
                        'experience': true,
                        'eduAuth': true
                    },
                ],
                isShowFirstNotice: true,//通过控制 显示/隐藏 来执行第一条通知的动画
                errorImg: 'this.src="' + require('../../assets/load_fail.png') + '"',//加载失败显示默认图片
                reallyOperationItem: [],//当前账号所有的模块入口按钮
                showOperationItem: [],//页面显示的模块入口按钮
                isShowMoreOperation: false,//是否显示当前账号所有的模块入口按钮（默认8个）
                noticeData: [],//通知公告数据
            }
        },
        mounted() {
            //如果是小程序扫码返回，则处理扫码数据
            this.isMiniScanBack();
            //控制首页显示的模块入口按钮
            this.setOperationItem();
            //通知公告动画
            this.firstNoticeAnimation();
            //获取安全知识库数据
            if (!this.homeSafeKnowledgeData || this.homeSafeKnowledgeData.length == 0) { //如果没有缓存数据，则从后台获取
                this.getTypeList();
            } else {
                this.safeKnowledgeData = this.homeSafeKnowledgeData;
            }
            //获取通知公告数据
            if (this.isLogin) {
                this.getNoticeList();
            }
        },
        computed: {
            isLogin() {
                return this.$store.getters.isLogin;
            },
            user() {
                return this.$store.getters.userInfo;
            },
            homeSafeKnowledgeData() {
                return this.$store.getters.homeSafeKnowledge;
            }
        },
        methods: {
            setOperationItem() {//控制首页显示的模块入口按钮
                if (this.user.isExperience) {// 筛选出体验账号模块
                    this.reallyOperationItem = this.operationItem.filter((item) => {
                        return item.experience;
                    })
                } else {
                    if (this.user.type == 1) { // 筛选出教育局模块
                        this.reallyOperationItem = this.operationItem.filter((item) => {
                            return item.eduAuth;
                        })
                    } else {// 筛选出学校模块
                        this.reallyOperationItem = this.operationItem.filter((item) => {
                            return item.schoolAuth;
                        })
                    }
                }
                //默认展示8个
                this.showOperationItem = this.reallyOperationItem.slice(0, 8);
            },
            lookMore() { //查看更多
                this.isShowMoreOperation = !this.isShowMoreOperation;
                if (this.isShowMoreOperation) {//显示全部
                    this.showOperationItem = this.reallyOperationItem
                } else {//显示八个
                    this.showOperationItem = this.reallyOperationItem.slice(0, 8);
                }
            },
            //进入安全管理
            intoSafeManager(index) {
                if (index == 0) {
                    this.navigate('dangerChange');
                } else {
                    this.navigate('schoolEverydayCheck');
                }
            },
            //页面跳转处理
            clickOperation(modelName) {
                if (modelName === '') {
                    this.$bottomToast('该模块正在开发中！');
                    return
                }
                if (modelName == 'meetingSigning') { //学校会议签到
                    this.getScanSignPackage();
                    return
                }
                if (modelName === 'waitingMore') {
                    if (this.user.isExperience) {
                        this.$messagebox({
                            title: '温馨提示',
                            message: '当前为体验账户，更多功能请登录正式账号',
                            showCancelButton: true,
                            confirmButtonText: '登录',
                            cancelButtonText: '申请账号'
                        }).then(action=>{
                            if (action === 'confirm') {
                                this.$router.push({name: 'login'});
                            } else {
                                this.$router.push({name: 'business'});
                            }
                        }).catch(e=>{
                            this.$router.push({name: 'login'});
                            console.log(e);
                        });
                        return;
                    }
                    this.$bottomToast('更多功能，敬请期待！');
                    return;
                }
                this.navigate(modelName);
            },
            navigate(modelName) { //控制页面跳转---小程序、公众号、非微信跳转方式
                let _this = this;
                isMiniProgram(wx, (res) => {
                    if (res) {
                        wx.miniProgram.navigateTo({url: '../webview/webview?url=https://login.paxy365.com/new_weixin/#/' + modelName});
                    } else {
                        _this.$router.push({name: modelName});
                    }
                })
            },
            firstNoticeAnimation() {//通过控制 显示/隐藏 来执行第一条通知的动画
                this.isShowFirstNotice = !this.isShowFirstNotice;
                setTimeout(() => {
                    this.firstNoticeAnimation();
                }, 1500);
            },
            getTypeList() {//获取分类列表
                this.http(this, (this.user.baseURL || '/') + api.GET_KNOWLEDGE_TYPE, '', (res) => {
                    if (res.status == 1) {
                        let result = res.data.kbmCategory
                        this.getSecondTypeList(result[0].id);//默认展示第一项的数据
                    } else {
                        this.$bottomToast(res.msg);
                    }
                }, false)
            },
            getSecondTypeList(id) {//获取安全知识二级分类列表
                let params = {
                    'id': id
                }
                let idArray = [], ids = '';
                this.http(this, (this.user.baseURL || '/') + api.GET_KNOWLEDGE_SECOND_TYPE, params, (res) => {
                    if (res.status == 1) {
                        for (let i in res.data) {
                            idArray.push(res.data[i].id);
                        }
                        ids = idArray.join(',');
                        this.getKnowledgeList(ids);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                }, false)
            },
            getKnowledgeList(ids) {//获取安全知识列表
                let params = {
                    'id': ids
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_KNOWLEDGE_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.safeKnowledgeData = res.data;
                        let len = this.safeKnowledgeData.length;
                        if (len > 3) { //首页只显示三条数据
                            this.safeKnowledgeData.splice(3, len - 3)
                            len = 3;
                        }
                        let re = new RegExp("&nbsp;", "g"); //定义正则表达式--全局替换所有的空格
                        for (let i = 0; i < len; i++) {
                            //把html标签删除并去掉空格标识符后再显示
                            this.safeKnowledgeData[i].content = delHtmlTag(this.safeKnowledgeData[i].content).replace(re, "");
                        }
                        //将数据缓存起来，避免每次返回首页都从后台获取数据
                        this.$store.dispatch(types.SAVE_HOME_SAFE_KNOWLEDGE, this.safeKnowledgeData);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                }, false)
            },
            intoKnowledgeDetail(link) {//进入安全知识详情
                link = link.replace('http://', 'https://');
                isMiniProgram(wx, (res) => {
                    if (res) {
                        wx.miniProgram.navigateTo({url: '../webview/webview?url=' + link});
                    } else {
                        window.location.href = link;
                    }
                })
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
                this.http(this, (this.user.baseURL || "/") + api.SAFE_MEETING_SCAN_SINGING, {}, (res) => {
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
            },
            getNoticeList() {//获取通知公告数据
                let type = 2;
                if (this.user.type == 1) {
                    type = 4
                }
                let params = {
                    'uid': this.user.PID,
                    'account_id': this.user.accountID,
                    'type': type,
                    'page': 1
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_LIST, params, (res) => {
                    let noticeDataList = [];
                    this.noticeData = [];
                    if (res.status == 1) {
                        noticeDataList = res.data || [];
                        if (noticeDataList.length > 0) {
                            this.noticeData.push(noticeDataList[0]);
                        }
                    }
                }, false)
            },
            business() {
                this.$router.push({name: 'business'})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/homePage.styl"

</style>