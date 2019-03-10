/**
* @Description:    通知公告列表
* @Author:         yufawu
* @CreateDate:     2018/9/5 8:57
*/
<template>
    <div class="body">
        <no-data-tips :data="noticeList"></no-data-tips>
        <div class="nav">
            <div class="nav_left" :class="{'active':isActive,}" @click="unitPublish">本单位发布</div>
            <div class="nav_right" :class="{'active':!isActive,}" @click="myPublish">{{user.type == 1 ? '我的收件箱' : '上级发布'}}</div>
        </div>
        <vue-better-scroll ref="wrapper" class="notice-body"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="parseInt(startY)"
                           @pullingDown="loadUp" @pullingUp="loadBottom">
            <ul>
                <li class="notice_item" v-for="(item ,index) in noticeList" :key="index">
                    <div @click="reviewDetail(item.link)">
                        <p class="title">{{item.title}}</p>
                        <p class="subtitle">{{item.username}}<span class="time">{{item.created_at}}</span></p>
                        <div class="text_wrapper">
                            <p class="text text_gray">{{item.content.substring(0,52)}}{{ item.content.length>55 ? '...' : '' }}</p>
                        </div>
                    </div>
                    <div class="item_footer">
                        <span @click="reviewComplete(item.notice_id)">{{item.view_count}}人已阅</span>
                        <span @click="reviewDetail(item.link)">查看详情</span>
                    </div>
                </li>
            </ul>
            <fill-box></fill-box>
        </vue-better-scroll>
        <footer-button text="发布公告" @click.native="publishNotice"></footer-button>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import FooterButton from "../common/FooterButton"
    import NoDataTips from "../common/NoDataTips";
    import FillBox from "../common/FillBox";

    export default {
        components: {
            FillBox,
            NoDataTips,
            FooterButton
        },
        name: "notice",
        data() {
            return {
                isActive: false,//顶部导航的切换
                noticeList: [],//通知列表
                getNoticeType: 0,//获取通知公告的类型   1 学校端-本单位发布 2 学校端-上级发布 3 教育局端-本单位发布 4 教育局端-我的收件箱
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
            if (this.user.type == 2) {
                this.getNoticeType = 2;
            } else {
                this.getNoticeType = 4;
            }
            this.getNoticeList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            unitPublish() { // 本单位发布
                this.isActive = true;
                this.page = 1;
                if (this.user.type == 2) {
                    this.getNoticeType = 1;
                } else {
                    this.getNoticeType = 3;
                }
                this.getNoticeList();
            },
            myPublish() { // 上级发布
                this.page = 1;
                this.isActive = false;
                if (this.user.type == 2) {
                    this.getNoticeType = 2;
                } else {
                    this.getNoticeType = 4;
                }
                this.getNoticeList();
            },
            getNoticeList() {
                let params = {
                    'uid': this.user.PID,
                    'account_id': this.user.accountID,
                    'type': this.getNoticeType,
                    'page': this.page
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_LIST, params, (res)=>{
                    if (res.status == 1) {
                        if (this.page == 1) {
                            this.noticeList = res.data || [];
                        } else {
                            this.noticeList = this.noticeList.concat(res.data);
                        }
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true);
                    } else {
                        if (this.page == 1) {
                            this.noticeList = [];
                        }
                        this.$bottomToast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false);
                    }
                })
            },
            reviewDetail(url) {
                window.location.href = url;
            },
            reviewComplete(id) {
                this.$store.dispatch(types.SAVE_NOTICE_ID,id)
                this.$router.push({name: 'noticeReviewComplete'});
            },
            publishNotice() {
                this.$router.push({name: 'noticeWrite'});
            },
            loadUp() {//下拉刷新
                this.page = 1;
                this.getNoticeList();
            },
            loadBottom() {//上拉加载
                this.page++;
                this.getNoticeList();
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"

    .body {
        padding-bottom px2vw(90px)
    }

    .nav {
        display: flex
        fixedTop()
        background white
        width: 100%
        height: px2vw(90px)
        line-height: px2vw(90px)
        fontSize(30px)
        borderBottom()
        & > div {
            flex: 1
            text-align: center
        }
        .active {
            fontSize(32px)
            color: main-color
            border-bottom: 1px solid main-color
        }
    }

    .notice-body {
        padding-top: px2vw(90px)
        height 100vh
        background bg-color
    }

    .notice-body ul {
        padding-bottom: px2vw(90px)
    }

    .notice_item {
        font-size: px2vw(28px)
        padding-left: 5%
        padding-top: px2vw(18px)
        borderBottom()
        background: #fff
        .title {
            line-height: px2vw(80px)
            font-size: px2vw(34px)
            text-align: left
        }
        .subtitle {
            color: vice-font-color
            margin-bottom: px2vw(15px)
            .time {
                margin-left: 5%
            }
        }
        .text_wrapper {
            .text {
                text-indent 2em
                margin-top: px2vw(15px)
            }
        }
        .item_footer {
            height: px2vw(90px)
            margin-top px2vw(20px)
            line-height: px2vw(90px)
            color: main-color
            span:last-of-type {
                float: right
                padding-right: 5%
            }
        }
    }
</style>
