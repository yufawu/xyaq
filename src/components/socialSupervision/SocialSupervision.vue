/**
* @Description:    社会督查
* @Author:         TSY
* @CreateDate:     2018/8/3 10:31
*/
<template>
    <div class="body">
        <no-data-tips :data="supervisionData"></no-data-tips>
        <div class="header">
            <div class="menu">
                <button v-for="(item,index) in menuGroup" :key="index" @click="clickItem(index)"
                        :class="{ select: selectIndex == index, first_select: index==0,last_select: index == menuGroup.length-1 }">
                    {{ item.name }}({{ item.number }})
                </button>
            </div>
        </div>
        <vue-better-scroll ref="wrapper" class="group"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadUp" @pullingUp="loadBottom">
            <ul>
                <li class="content" v-for="(item,index) in supervisionData" :key="index" @click="intoDetail(item)">
                    <div class="title">{{ item.pat_content }}</div>
                    <div class="sub_title">
                        <span v-if="item.status == 1" class="status">已分派给{{ item.account_name }}；</span>
                        <span v-if="item.status == 2" class="status" style="color: #f31a38">未分派；</span>
                        <span class="time">{{ item.create_time }}</span>
                    </div>
                    <show-img-list :img1="item.pat_img1" :img2="item.pat_img2" :img3="item.pat_img3"
                                   :videoImg="item.video_img"
                                   :videoURL="item.video_url"></show-img-list>
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
    import ShowImgList from "../common/ShowImgList";
    import NoDataTips from "../common/NoDataTips";
    import FillBox from "../common/FillBox";

    export default {
        name: "SocialSupervision",
        components: {FillBox, NoDataTips, ShowImgList},
        data() {
            return {
                menuGroup: [//菜单按钮组
                    {'name': '已分派', 'number': 0},
                    {'name': '未分派', 'number': 0}
                ],
                selectIndex: 0,//当前选择的菜单index
                supervisionData: [],//督查数据
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
            if (!this.$route.meta.isBack || this.isRouterBack) {//当前操作不是按键返回或者通过路由返回的时候，调用方法获取数据，否则使用meta中keepAlive属性设置的路由缓存数据
                this.initData();
                this.$store.dispatch(types.SET_SUPERVISION_BACK, false);
            }
            this.$route.meta.isBack = false;//每次都重置该值，避免返回之后isBack一直为true，后续无法加载数据
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'imageVideoPreview' || from.name == 'supervisionDetail') {
                to.meta.isBack = true;
            }
            next();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            isRouterBack() {
                return this.$store.getters.supervisionBack;
            }
        },
        methods: {
            clickItem(index) {//切换菜单
                if (this.selectIndex == index) {
                    return;
                }
                this.selectIndex = index;
                this.initData();
            },
            initData() { // 重新获取数据
                this.page = 1;
                this.supervisionData = [];
                this.getSupervisionList();
                this.getSupervisionNumber();
            },
            getSupervisionNumber() {//获取社会督查未分派和已分派的数量
                let params = {
                    'account_id': this.user.accountID
                };
                this.http(this, this.user.baseURL + api.GET_SOCIAL_SUPERVISION_NUMBER, params, (res) => {
                    if (res.status == 1) {
                        this.menuGroup = [];
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].status == 1) {
                                this.menuGroup.push({'name': '已分派', 'number': res.data[i].num});
                            } else {
                                this.menuGroup.push({'name': '未分派', 'number': res.data[i].num});
                            }
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getSupervisionList() {//获取社会督查列表
                let params = {
                    'pid': this.user.PID,
                    'account_id': this.user.accountID,
                    'status': this.selectIndex + 1,
                    'page': this.page
                };
                this.http(this, this.user.baseURL + api.GET_SOCIAL_SUPERVISION_LIST, params, (res) => {
                    if (res.status == 1) {
                        if (this.page == 1) {
                            this.supervisionData = res.data;
                        } else {
                            this.supervisionData = this.supervisionData.concat(res.data);
                        }
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true);
                    } else {
                        if (this.page == 1) {
                            this.supervisionData = [];
                        }
                        this.$bottomToast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false);
                    }
                })
            },
            loadUp() {//下拉刷新
                this.page = 1;
                this.getSupervisionList();
            },
            loadBottom() {//上拉加载
                this.page++;
                this.getSupervisionList();
            },
            intoDetail(item) {//进入详情页
                this.$router.push({name: 'supervisionDetail'});
                this.$store.dispatch(types.SET_SUPERVISION_ITEM, item)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .header {
        position fixed
        top 0
        left 0
        width 100%
        background white
        z-index 999
    }

    .menu {
        display flex
        align-items stretch
        solidBorder(main-color)
        border-radius 6px
        margin px2vw(30px) px2vw(20px)
    }

    .menu button {
        display flex
        align-items center
        justify-content center
        width 0
        flex-grow 1
        background white
        color main-color
        text-align center
        padding px2vw(15px) 0
    }

    .menu .select {
        background main-color
        color white
    }

    .menu .first_select {
        border-radius 5px 0 0 5px
    }

    .menu .last_select {
        border-radius 0 5px 5px 0
    }

    .group {
        padding-top 18%
        height 100vh
    }

    .content {
        padding px2vw(36px) px2vw(34px)
        border-top px2vw(16px) solid bg-color
    }

    .title {
        fontSize(34px)
    }

    .sub_title {
        display flex
        justify-content space-between
        align-items flex-start
        margin px2vw(26px) 0
    }

    .sub_title span {
        fontSize(28px)
    }

    .status {
        flex 1
        color #42bd56
    }

    .time {
        color #a3a3a3
    }
</style>