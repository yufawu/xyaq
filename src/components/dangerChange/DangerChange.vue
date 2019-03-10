/**
* @Description:    隐患整改列表
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/
<template>
    <div class="danger_change">
        <no-data-tips :data="dangerData"></no-data-tips>
        <div class="danger_change_header">
            <div class="header" v-if="user.type == 1">
                <button class="all" @click="clickItem(0)" :class="{ select: selectIndex == 0 }">全部</button>
                <button
                        @click="clickItem(1)"
                        :class="{ select: selectIndex == 1 }">整改中<span v-if="dangerNum.changing">({{ dangerNum.changing }})</span>
                </button>
                <button
                        @click="clickItem(2)"
                        :class="{ select: selectIndex == 2 }">已整改<span v-show="dangerNum.changed">({{ dangerNum.changed }})</span>
                </button>
                <button class="no_change"
                        @click="clickItem(3)"
                        :class="{ select: selectIndex == 3 }">逾期未整改<span v-show="dangerNum.noChange">({{ dangerNum.noChange }})</span>
                </button>
            </div>
            <div class="header" v-else>
                <button class="changer_first" @click="clickItem(0)"
                        :class="{ select: selectIndex == 0 }">新上报<span v-if="dangerNum.reportNum">({{ dangerNum.reportNum }})</span>
                </button>
                <button
                        @click="clickItem(1)"
                        :class="{ select: selectIndex == 1 }">未处理<span v-if="dangerNum.undoNum">({{ dangerNum.undoNum }})</span>
                </button>
                <button
                        @click="clickItem(3)"
                        :class="{ select: selectIndex == 3 }">已处理<span v-show="dangerNum.doneNum">({{ dangerNum.doneNum }})</span>
                </button>
                <button class="changer_last"
                        @click="clickItem(6)"
                        :class="{ select: selectIndex == 6 }">已验收<span v-show="dangerNum.acceptanceNum">({{ dangerNum.acceptanceNum }})</span>
                </button>
            </div>
        </div>
        <vue-better-scroll ref="wrapper" class="item_group"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadUp" @pullingUp="loadBottom">
            <ul>
                <li class="item" v-for="(item,index) in dangerData" :key="index" @click="intoDangerDetail(item.id)">
                    <div class="item_top">
                        <img v-if="item.avatar" :src="item.avatar"/>
                        <div v-else class="item_head_bg" :style="{ background: item.headColor }">
                            <div v-if="item.reportusername" class="item_head_content">
                                {{ item.reportusername.substring(item.reportusername.length - 2,
                                item.reportusername.length) }}
                            </div>
                            <div v-else class="item_head_content">
                                {{ item.name == '' ? '用户' : item.name.substring(item.name.length - 2, item.name.length) }}
                            </div>
                        </div>
                        <div v-if="user.type == 1" class="item_user">
                            <p class="item_title">{{ item.account_name }}</p>
                            <p class="item_vice">{{ item.reportusername }}上报</p>
                        </div>
                        <div v-else class="item_user">
                            <p class="item_title">{{ item.name == '' ? '用户' : item.name }}</p>
                            <p class="item_vice">暂无职称</p>
                        </div>
                        <div class="item_info" @click.stop>
                            <span v-if="item.is_reform != 0" class="item_action click_item" @click="remind(item.id)">整改通知书</span>
                            <p class="item_time">{{ item.reporttime }}</p>
                        </div>
                    </div>
                    <div class="item_body">
                        <img v-if="item.status == 0 && user.PID == item.chargepid"
                             src="../../assets/dangerChange/danger_need_assign.png"
                             class="item_body_img">
                        <img v-if="item.status == 1 && user.PID == item.acceptpid"
                             src="../../assets/dangerChange/danger_need_dispose.png"
                             class="item_body_img">
                        <img v-if="item.status == 3 && user.PID == item.chargepid"
                             src="../../assets/dangerChange/danger_need_check.png"
                             class="item_body_img">
                        <p class="item_content">{{ item.description }}</p>
                        <p class="item_state">
                            <span v-if="item.status == 0">已上报；</span>
                            <span v-else-if="item.status == 1">已指派；</span>
                            <span v-else-if="item.status == 3">已处理；</span>
                            <span v-else-if="item.status == 5">已撤销；</span>
                            <span v-else-if="item.status == 6">已验收；</span>
                            <span v-if="item.type_name">类别：{{ item.type_name }}；</span>
                            <span v-if="item.do_time != 0">要求处理时间：{{ item.do_time > 0 ? item.do_time + '小时' : '无' }}；</span>
                        </p>
                        <show-img-list :img1="item.img" :img2="item.img2" :img3="item.img3" :videoImg="item.video_img"
                                       :videoURL="item.video_url"></show-img-list>
                    </div>
                </li>
            </ul>
            <!-- 数据不足一屏时，填充背景色 -->
            <fill-box color="#fff"></fill-box>
        </vue-better-scroll>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import ShowImgList from '../common/ShowImgList'
    import NoDataTips from '../common/NoDataTips'
    import FillBox from '../common/FillBox'

    export default ({
        name: 'dangerChange',
        components: {
            ShowImgList,
            FillBox,
            NoDataTips
        },
        data() {
            return {
                selectIndex: 0,//当前选中标签的index
                dangerNum: {'changing': 0, 'changed': 0, 'noChange': 0},//数据
                dangerData: [],//隐患数据
                headColor: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'],//待选颜色
                schoolNewUpload: [],//新上报数据   学校端
                schoolNotDispose: [],//未处理数据   学校端
                schoolHasDispose: [],//已处理数据   学校端
                schoolHasAccept: [],//已验收数据   学校端
                clickNoticeIndex: -1,//记录当前点击的哪个notice
                oldClickNoticeIndex: -1,//记录上一次点击的哪个notice
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

        },
        activated() {
            if (!this.$route.meta.isBack) {//当前操作不是返回的时候，调用方法获取数据，否则使用meta中keepAlive属性设置的路由缓存数据
                this.dangerNum = {};
                this.getDangerList();
            }
            this.$route.meta.isBack = false;//每次都重置该值，避免返回之后isBack一直为true，后续无法加载数据
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'imageVideoPreview' || from.name == 'dangerDetail') {
                to.meta.isBack = true;
            }
            next();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            clickItem(index) {
                this.page = 1;
                this.selectIndex = index;
                this.getDangerList();
            },
            getDangerList() {//获取全部隐患列表
                let params = {}, apiStr = '';
                if (this.user.type == 1) {//教育局
                    params = {
                        'pid': this.user.PID,
                        'account_id': this.user.accountID,
                        'page': this.page,
                        'status': this.selectIndex + 1
                    }
                    apiStr = api.GET_DANGER_LIST;
                } else {//学校
                    params = {
                        'pid': this.user.PID,
                        'account_id': this.user.accountID,
                        'page': this.page,
                        'is_lead': this.user.isLeader
                    }
                    switch (this.selectIndex) {//根据点击的隐患状态获取数据
                        case 0:  //新上报
                            apiStr = api.GET_SCHOOL_DANGER_REPORT_LIST;
                            break;
                        case 1:  //未处理
                            apiStr = api.GET_SCHOOL_DANGER_UNDO_LIST;
                            break;
                        case 3:  //已处理
                            apiStr = api.GET_SCHOOL_DANGER_DONE_LIST;
                            break;
                        case 6:  //已验收
                            apiStr = api.GET_SCHOOL_DANGER_ACCEPT_LIST;
                            break;
                    }
                }
                this.http(this, this.user.baseURL + apiStr, params, (res) => {
                    if (res.status == 1) {
                        if (this.page == 1) {
                            if (this.user.type == 1) {
                                this.dangerData = res.data.data_arr;
                            } else {
                                this.dangerData = res.data;
                            }
                        } else {
                            if (this.user.type == 1) {
                                this.dangerData = this.dangerData.concat(res.data.data_arr);
                            } else {
                                this.dangerData = this.dangerData.concat(res.data);
                            }
                        }
                        //设置头像背景颜色
                        this.setHeadColor(this.dangerData);
                        //设置每个状态的数据个数
                        if (this.user.type == 1) {
                            this.setDangerNum(res.data.num_arr);
                        } else {
                            if (this.selectIndex == 0) { // 只有新上报的接口会返回总数
                                this.dangerNum = {
                                    'reportNum': res.reportNum,
                                    'undoNum': res.undoNum,
                                    'doneNum': res.doneNum,
                                    'acceptanceNum': res.acceptanceNum
                                }
                            }
                        }
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true);
                    } else {
                        if (this.page == 1) {
                            this.dangerData = [];
                        }
                        this.$bottomToast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false);
                    }
                })
            },
            loadUp() {
                this.page = 1;
                this.getDangerList();
            },
            loadBottom() {
                this.page++;
                this.getDangerList();
            },
            setDangerNum(data) {//设置每个状态的数据个数
                for (let i in data) {
                    if (data[i].status == 2) {
                        this.dangerNum.changing = data[i].number;
                    } else if (data[i].status == 3) {
                        this.dangerNum.changed = data[i].number;
                    } else if (data[i].status == 4) {
                        this.dangerNum.noChange = data[i].number;
                    }
                }
            },
            setHeadColor(data) {//设置头像背景颜色
                let length = this.headColor.length;
                for (let i in data) {
                    //添加headColor属性
                    this.$set(this.dangerData[i], 'headColor', this.headColor[Math.floor(Math.random() * length)]);
                }
            },
            openNotice(index) {//打开通知弹窗
                if (this.oldClickNoticeIndex == index) {//如果当前点击的跟上次点击的是同一个，则关闭弹窗
                    this.resetClickNoticeIndex();
                    return;
                }
                this.clickNoticeIndex = index;
                this.oldClickNoticeIndex = index;
            },
            resetClickNoticeIndex() {//重置index,避免下次点击失效
                this.clickNoticeIndex = -1;
                this.oldClickNoticeIndex = -1;
            },
            notice(url) {//查看隐患通知
                window.location.href = url;
            },
            remind(id) {//进入整改通知书   http://testweb.paxy365.com/api/dangerreform/viewreform.html?id=51
                window.location.href = this.user.baseURL + 'api/dangerreform/viewreform.html?danger_id=' + id;
                // this.$router.push({name: 'dangerNotice',query: {'account_id': this.user.accountID, 'danger_id': id}})
            },
            intoDangerDetail(id) {//进入隐患详情
                this.$store.dispatch(types.SET_DANGER_ID, id);
                this.$router.push({name: 'dangerDetail'});
            }
        }
    })
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .danger_change_header {
        position fixed
        width 100%
        background white
        padding 4% 3%
        borderBottom()
        z-index 100
    }

    .header {
        display flex
        align-items stretch
        solidBorder(main-color)
        border-radius 50px
    }

    button {
        display flex
        align-items center
        justify-content center
        width 0
        flex-grow 1
        background white
        color main-color
        text-align center
        padding 1% 0%
    }

    .all {
        flex-grow 0.6
        border-radius 50px 0 0 50px
    }

    .no_change {
        flex-grow 1.4
        border-radius 0 50px 50px 0
    }

    .changer_first {
        border-radius 50px 0 0 50px
    }

    .changer_last {
        border-radius 0 50px 50px 0
    }

    .select {
        background main-color
        color white
    }

    .item_group {
        padding-top 16%
        height 100vh
    }

    .item {
        padding 3%
        borderBottom()
    }

    .item_body {
        position relative
    }

    .item_body_img {
        position absolute
        right 0
        top 0
        width 23%
    }

    .item_top {
        display flex
        align-items center
    }

    .item_top img {
        width 13%
        border-radius 50%
    }

    .item_head_bg {
        display flex
        position relative
        justify-content center
        align-items center
        color white
        width 13%
        padding-top 13%
        border-radius 50%
    }

    .item_head_content {
        display flex
        justify-content center
        align-items center
        position absolute
        top 0
        left 0
        width 100%
        height 100%
    }

    .item_user {
        width 47%
        margin-left 3%
    }

    .item_title {
        width 100%
        textOverflow()
        fontSize(30px)
        font-weight bold
    }

    .icon-more {
        margin-right 2%
        color main-color
        fontSize(42px)
    }

    .item_vice {
        width 100%
        textOverflow()
        color vice-font-color
        margin-top 3%
        fontSize(24px)
    }

    .item_info {
        text-align right
    }

    .item_notice {
        position relative
    }

    .notice_dialog {
        position absolute
        width 70%
        right 0
        top 115%
        z-index 10
    }

    .notice_body:before {
        content ""
        position absolute
        top -8px
        right 8%
        width 1px
        border-bottom 8px solid bg-color
        border-right 8px solid transparent
        border-left 8px solid transparent
    }

    .notice_body:after {
        content ""
        position absolute
        top -6px
        right 8%
        width 1px
        border-bottom 8px solid #fff
        border-right 8px solid transparent
        border-left 8px solid transparent
    }

    .notice_body {
        width 100%
        background white
        color main-color
        solidBorder()
        padding 0 12%
    }

    .notice_body p {
        padding 15% 0
        borderBottom()
    }

    .item_action {
        solidBorder(main-color)
        padding 1% 5%
        color main-color
        border-radius 3px
    }

    .item_time {
        @extend .item_vice
        margin-top 8%
    }

    .item_content {
        fontSize(30px)
        padding 3% 0
    }

    .item_state {

    }
</style>