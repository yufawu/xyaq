/**
* @Description:    事故管理列表
* @Author:         TSY
* @CreateDate:     2018/8/9 16:22
*/
<template>
    <div class="body">
        <div class="header" ref="header">
            <div class="selector" v-for="(item,index) in selector" :key="index" @click="selectItem(index)">
                <div class="selector_text" :class="{ text_changed: item != selectorText[index] }">{{ item }}</div>
                <div class="triangle" :class="{ triangle_selected: (selectIndex == index && isShowSelector) }"></div>
            </div>
        </div>
        <div v-show="isShowSelector" class="drop mask" @click="closeDrop" :style="{'top': dropDownTop}">
            <ul class="drop_down">
                <li v-for="(item,index) in selectorItem" :key="index"
                    @click="dropItemClick(index)" @click.stop>
                    <label class="drop_down_item" :for="'input'+index">
                        <span>{{ item.name }}</span>
                        <input type="checkbox" :id="'input'+index" :name="'type'+selectIndex"
                               :checked="selectItemChecked[selectIndex][index]"
                               v-model="selectData[selectIndex]" :value="item">
                    </label>
                </li>
            </ul>
        </div>
        <no-data-tips :data="dangerListData"></no-data-tips>
        <vue-better-scroll ref="wrapper" class="content_group"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadUp" @pullingUp="loadBottom" :style="{'padding-bottom': marginBottom}">
            <ul :style="{'margin-top': marginTop, 'margin-bottom': marginBottom}">
                <li class="click_item" v-for="(item,index) in dangerListData" :key="index"
                    @click="intoDangerDetail(item,index)">
                    <img class="content_img" :src="dangerGradeImg[item.grade - 1]">
                    <p class="content_title">{{ item.accident_name }}</p>
                    <p class="content_text">事故填报学校：{{ item.account_name }}</p>
                    <p class="content_text">事故发生地点：{{ item.place }}</p>
                    <p class="content_text">事故发生时间：{{ item.happen_time }}</p>
                    <p class="content_text">死亡人数：{{ item.death }}人</p>
                    <p class="content_text">受伤人数：{{ item.injure }}人</p>
                    <p class="content_text">事故严重等级：{{ dangerGrade[index] }}</p>
                    <p class="content_text">事故分类：{{ dangerType[index] }}</p>
                    <p class="content_text">事故现状态：{{ dangerStatus[index] }}</p>
                    <div class="content_text content_detail">
                        <span>详情</span>
                        <img src="../../assets/specialCheck/btn_more_small.png">
                    </div>
                </li>
            </ul>
            <fill-box></fill-box>
        </vue-better-scroll>
        <footer-button v-if="user.type != 1" text="上报事故" @click="uploadDanger()"></footer-button>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import {checkPlatform, isWeixin, isIphoneX, change2type, change2grade, change2status} from "../../utils/util";
    import FillBox from "../common/FillBox";
    import NoDataTips from "../common/NoDataTips";
    import FooterButton from "../common/FooterButton";

    export default {
        name: "DangerManagerList",
        components: {FooterButton, NoDataTips, FillBox},
        data() {
            return {
                selectorText: ['事故分类', '事故性质', '事故等级'],//事故选项
                selector: ['事故分类', '事故性质', '事故等级'],//选项
                dangerGradeImg: [
                    require('../../assets/dangerManager/danger_grade1.png'),
                    require('../../assets/dangerManager/danger_grade2.png'),
                    require('../../assets/dangerManager/danger_grade3.png'),
                    require('../../assets/dangerManager/danger_grade4.png')
                ],
                selectorGroup: {//所有选项
                    '事故分类': [
                        {'id': 0, 'name': '全部'}, {'id': 1, 'name': '交通事故'}, {'id': 2, 'name': '踩踏事故'},
                        {'id': 3, 'name': '溺水事故'}, {'id': 4, 'name': '火灾事故'}, {'id': 5, 'name': '触电事故'},
                        {'id': 6, 'name': '校园事故'}, {'id': 7, 'name': '其他'}
                    ],
                    '事故性质': [
                        {'id': 0, 'name': '全部'}, {'id': 1, 'name': '责任事故'}, {'id': 2, 'name': '自然事故'},
                        {'id': 3, 'name': '技术事故'}, {'id': 4, 'name': '其他'}
                    ],
                    '事故等级': [
                        {'id': 0, 'name': '全部'}, {'id': 1, 'name': '特大事故'}, {'id': 2, 'name': '重大事故'},
                        {'id': 3, 'name': '较大事故'}, {'id': 4, 'name': '一般事故'}
                    ]
                },
                selectorItem: [],//当前下拉选项
                selectData: [],//被勾选的选项
                selectItemChecked: [],//被勾选的选项   true/false
                selectIndex: -1,//当前被选中的筛选条目index
                isShowSelector: false,//是否显示下拉选项
                headerHeight: 0,//header的高度
                dangerListData: [],//事故列表
                dangerListFalseData: [
                    {
                        "accident_id": "18",
                        "account_id": "3",
                        "accident_name": "地方",
                        "happen_time": "2017-11-22",
                        "type": "1",            //1交通事故,2踩踏事故,3溺水事故,4火灾事故,5触电事故,6校园伤害,7其他
                        "nature": "1",            //1责任事故,2自然事故,3技术事故,4其他
                        "grade": "2",            //1特大重大事故,2重大事故,3较大事故,4一般事故
                        "money_loss": "1",        //损失金钱（元）
                        "death": "1",            //死亡人数
                        "injure": "1",            //受伤人数
                        "place": "第三方发",    //事故地点
                        "details": "你说的话",    //事故详情
                        "status": "5",            //1新填报未批示,2处理中未批示,3已结案未批示,4处理中已批示,5已结案已批示,6异常
                        "create_time": "2017-11-23 10:54:41",
                        "update_time": "0000-00-00 00:00:00",
                        "create_userid": "1",
                        "create_user": "校鸽-校鸽管理员",
                        "account_name": "仙葫小学",
                        "instruct": "干的漂亮！干圈起来 要考",        //批示信息
                        "close": "没错 我就是这么厉害",              //结案信息
                        "process": "第三方的说法都是"               //处理信息
                    },
                    {
                        "accident_id": "19",
                        "account_id": "3",
                        "accident_name": "三口组被小学生欺负事故",
                        "happen_time": "2017-11-22",
                        "type": "3",
                        "nature": "3",
                        "grade": "2",
                        "money_loss": "10000",
                        "death": "10",
                        "injure": "20",
                        "place": "在不知名的一个地方",
                        "details": "很好的一件事情",
                        "status": "5",
                        "create_time": "2017-11-28 17:15:49",
                        "update_time": "0000-00-00 00:00:00",
                        "create_userid": "17",
                        "create_user": "仙葫学校-小胖",
                        "account_name": "仙葫学校",
                        "instruct": "好的 知道了",
                        "close": "完成了 不负大家的众望",
                        "process": ""
                    }
                ],//事故列表(测试用)
                dangerType: [],//事故类型
                dangerGrade: [],//事故等级
                dangerStatus: [],//事故状态
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
                top: '0',
                bottom: '0',
                isIphoneBack: false,//判断是否为iPhone返回，兼容下拉刷新控件
                isIphoneIn: false,//判断是否为iPhone进入，兼容下拉刷新控件
            }
        },
        mounted() {
            //根据分类初始化被勾选项数组
            for (let i = 0; i < this.selector.length; i++) {
                this.selectData.push([]);
                this.selectItemChecked.push([]);
            }
            this.$nextTick(function () {
                this.headerHeight = this.$refs.header.offsetHeight + 'px';
            })
            this.getDangerListData();
            //适配兼容IOSAPP下拉刷新控件 【微信浏览器正常显示，无需兼容】
            if (!isWeixin()) {
                setTimeout(() => {
                    if (this.isIphoneBack) {
                        if (isIphoneX()) {
                            this.top = 80;
                        } else {
                            this.top = 60;
                        }
                    }
                    if (this.isIphoneIn) {
                        if (isIphoneX()) {
                            this.bottom = 20;
                        }
                    }
                }, 60)
            }
        },
        beforeRouteEnter(to, from, next) {
            if ((from.name == 'dangerManagerDetail' || from.name == 'dangerManagerUpload') && checkPlatform() == 2) {
                next(vm => {
                    vm.isIphoneBack = true;
                });
            } else if (from.name != 'dangerManagerDetail' && from.name != 'dangerManagerUpload' && checkPlatform() == 2) {
                next(vm => {
                    vm.isIphoneIn = true;
                });
            } else {
                next();
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            dropDownTop() {//下拉选项位置
                return this.headerHeight;
            },
            marginTop() {
                return this.top + 'px'
            },
            marginBottom() {
                return this.bottom + 'px'
            }
        },
        methods: {
            selectItem(index) { //点击筛选条目
                if (this.isShowSelector) { //关闭时调用接口显示数据
                    this.page = 1;
                    this.getDangerListData();
                }
                if (this.selectIndex == index) {
                    //点击同一项，让其显示或隐藏
                    this.isShowSelector = !this.isShowSelector;
                    //如果有筛选数据，则替换标题，否则给初始值（取消所有选择也给初始值）
                    if (this.selectData[index].length > 0) {
                        //用选择的第一项替换选项标题
                        this.selector.splice(index, 1, this.selectData[index][0].name);
                    } else {
                        //赋值初始值
                        this.selector.splice(index, 1, this.selectorText[index]);
                    }
                } else {
                    if (this.selectIndex != -1) {
                        //如果这次与上一次点击的不是同一项，则把上次的数据赋值给上个选项
                        if (this.selectData[this.selectIndex].length > 0) {
                            this.selector.splice(this.selectIndex, 1, this.selectData[this.selectIndex][0].name);
                        } else {
                            this.selector.splice(this.selectIndex, 1, this.selectorText[this.selectIndex]);
                        }
                    }
                    this.isShowSelector = true;
                }
                this.selectIndex = index;
                this.selectorItem = this.selectorGroup[this.selectorText[index]];
            },
            getDangerListData() { //获取事故列表
                let typeArr = [],
                    types = '',
                    natureArr = [],
                    natures = '',
                    gradeArr = [],
                    grades = '';
                //把ID提取出来，拼接成逗号分隔形式传给后台
                if (this.selectData[0].length > 0) {
                    for (let i in this.selectData[0]) {
                        typeArr.push(this.selectData[0][i].id)
                    }
                    types = typeArr.join(',');
                    if (types.indexOf('0') > -1) {//如果包含0，代表选择全部，传空值
                        types = ''
                    }
                }
                if (this.selectData[1].length > 0) {
                    for (let i in this.selectData[1]) {
                        natureArr.push(this.selectData[1][i].id);
                    }
                    natures = natureArr.join(',');
                    if (natures.indexOf('0') > -1) {//如果包含0，代表选择全部，传空值
                        natures = '';
                    }
                }
                if (this.selectData[2].length > 0) {
                    for (let i in this.selectData[2]) {
                        gradeArr.push(this.selectData[2][i].id);
                    }
                    grades = gradeArr.join(',');
                    if (grades.indexOf('0') > -1) {//如果包含0，代表选择全部，传空值
                        grades = ''
                    }
                }

                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'page': this.page,
                    'type': types,
                    'nature': natures,
                    'grade': grades
                };
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_DANGER_MANAGER_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.dangerType = [];
                        this.dangerGrade = [];
                        this.dangerStatus = [];
                        if (this.page == 1) {
                            this.dangerListData = res.data || [];
                        } else {
                            this.dangerListData = this.dangerListData.concat(res.data || []);
                        }
                        let len = this.dangerListData.length;
                        for (let i = 0; i < len; i++) {
                            this.dangerType.push(change2type(this.dangerListData[i].type));
                            this.dangerGrade.push(change2grade(this.dangerListData[i].grade));
                            this.dangerStatus.push(change2status(this.dangerListData[i].status));
                        }
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true)
                    } else {
                        if (this.page == 1) {
                            this.dangerListData = [];
                        }
                        this.$bottomToast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false)
                    }
                })
            },
            loadUp() {//下拉刷新
                this.page = 1;
                this.getDangerListData();
            },
            loadBottom() {//上拉加载
                this.page++;
                this.getDangerListData();
            },
            dropItemClick(index) { //点击下拉面板中的选项
                this.selectItemChecked[this.selectIndex][index] = !this.selectItemChecked[this.selectIndex][index];
            },
            closeDrop() { //关闭下拉面板
                this.selectItem(this.selectIndex);
            },
            uploadDanger() { //上报事故
                if (this.user.accountID) {
                    this.$router.push({name: 'dangerManagerUpload'});
                } else {
                    this.$router.push({
                        name: 'dangerManagerUpload',
                        query: {
                            account_id: this.$route.query.account_id,
                            pid: this.$route.query.pid,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            intoDangerDetail(item) { //进入事故详情页
                if (this.user.accountID) {
                    this.$router.push({name: 'dangerManagerDetail',query: {accident_id: item.accident_id}});
                } else {
                    this.$router.push({
                        name: 'dangerManagerDetail',
                        query: {
                            accident_id: item.accident_id,
                            account_id: this.$route.query.account_id,
                            user_name: this.$route.query.user_name,
                            host: this.$route.query.host
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        background bg-color
    }

    .header {
        position fixed
        top 0
        left 0
        width 100%
        display flex
        align-items center
        justify-content space-around
        background #fff
        padding px2vw(24px) 0
        z-index 1
        borderBottom()
    }

    .selector {
        display flex
        align-items center
        justify-content center
        width 0
        flex-grow 1
    }

    .text_changed {
        color main-color
    }

    .triangle {
        width px2vw(26px)
        height px2vw(26px)
        margin-top px2vw(13px)
        margin-left px2vw(10px)
        border-width px2vw(13px)
        border-style solid
        border-color vice-font-color #fff #fff #fff
    }

    .triangle_selected {
        border-color main-color #fff #fff #fff
    }

    .drop {
        position fixed
        top 0
        left 0
        width 100vw
    }

    .drop_down {
        background #fff
        padding 0 px2vw(30px)
        borderTop()
        z-index 1000
    }

    .drop_down_item li {
        width 100%
    }

    .drop_down_item {
        display flex
        align-items center
        justify-content space-between
        padding px2vw(24px) 0
        borderBottom()
    }

    .drop_down_item input {
        -webkit-appearance checkbox
        width px2vw(30px)
        height px2vw(30px)
    }

    .content_group {
        background bg-color
        height 100vh
        padding-top px2vw(90px)
    }

    .content_group ul {
        padding-bottom px2vw(100px)
    }

    .content_group li {
        position relative
        margin px2vw(30px)
        padding px2vw(30px)
        background #fff
    }

    .content_img {
        position absolute
        top 4%
        right 5%
        width 30%
    }

    .content_title {
        fontSize(36px)
        font-weight bold
    }

    .content_text {
        width 100%
        margin-top px2vw(24px)
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
    }

    .content_detail {
        display flex
        align-items center
        justify-content space-between
        padding-top px2vw(24px)
        borderTop()
    }

    .content_detail img {
        width 2%
    }

</style>