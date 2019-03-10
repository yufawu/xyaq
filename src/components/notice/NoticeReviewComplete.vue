/**
* @Description:    通知公告查看情况
* @Author:         yufawu（界面） TSY（接口）
* @CreateDate:     2018/9/5 9:01
*/
<template>
    <div>
        <div class="top">
            <top-button-group :operateBtn="operateBtn" @click="changeBtn"></top-button-group>
        </div>
        <ul class="item_wrapper">
            <li class="item_first" v-for="(item,index) in userList" :key="index">
                <div class="item" @click="changeOpenState(index)">
                    <div class="item_name">{{item.AccountName + '  (' + (item.have_count == 0 ? '0' : (item.have_count || item.no_count)) + '/' + item.total_count + ')'}}</div>
                    <i class="iconfont" :class="{'icon-right-copy':!isOpenItem[index], 'icon-down-copy':isOpenItem[index]}"></i>
                </div>
                <ul class="item_second" v-show="isOpenItem[index]">
                    <li v-for="people in item.users" :key="people.PID">
                        <user-info-item :avatar="people.avatar" :pid="people.PID" :job="people.dutie_name"
                                        :user-name="people.user_name" :head-color="people.headColor">
                        </user-info-item>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import SelectArea from "../common/SelectArea";
    import TopButtonGroup from "../common/TopButtonGroup";
    import UserInfoItem from "../common/UserInfoItem";

    export default {
        name: "noticeReviewComplete",
        components: {UserInfoItem, TopButtonGroup, SelectArea},
        data() {
            return {
                operateBtn: [{'name': '已查看', 'id': 1}, {'name': '未查看', 'id': 2}],//切换查看状态按钮
                headColor: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'],//待选颜色
                userList: [],//当前显示的用户列表
                allUserList: [],//当前显示的用户列表
                selectID: 1,//当前选中的状态
                isOpenItem: [],//是否打开面板
            }
        },
        mounted() {
            this.getNoticeSelectList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            noticeID() {
                return this.$store.getters.getNoticeID
            }
        },
        methods: {
            changeBtn(res) {
                this.selectID = res.data.id;
                this.currentShowList();
            },
            currentShowList() {//当前显示的列表
                if (this.selectID == 1) {
                    this.userList = this.allUserList.have_read || [];
                } else {
                    this.userList = this.allUserList.not_read || [];
                }
                this.isOpenItem = [];
                this.userList.forEach(()=>{
                    this.isOpenItem.push(true);
                })
                //设置头像背景颜色
                let index = this.userList.length;
                for (let i = 0; i < index; i++) {
                    this.setHeadColor(this.userList[i].users, this.headColor);
                }
            },
            setHeadColor(data, headColor) {//设置头像背景颜色
                let length = headColor.length;
                for (let i in data) {
                    //添加headColor属性
                    this.$set(data[i], 'headColor', headColor[Math.floor(Math.random() * length)])
                }
            },
            changeOpenState(index) {//修改面板打开状态
                this.$set(this.isOpenItem, index, !this.isOpenItem[index])
            },
            getNoticeSelectList() {//后期用来获取接口数据
                let params = {
                    'id': this.noticeID
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_VIEW_STATE, params, (res) => {
                    if (res.status == 1) {
                        this.allUserList = res.data;
                        this.currentShowList();
                    } else {
                        this.$bottomToast(res.msg)
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top {
        background white
        fixedTop()
    }

    .item_wrapper {
        padding-top px2vw(120px)
    }

    .item_first {
        borderBottom(white)
    }

    .item {
        display flex
        align-items center
        fontSize(34px)
        paddingSmall()
        background bg-color
        color vice-font-color
    }

    .item_name {
        flex 1
        textOverflow()
    }

    .item img {
        width 2%
    }

    .item .iconfont {
        fontSize(44px)
    }

    .item_second li {
        borderBottom()
        paddingSmall()
    }

</style>
