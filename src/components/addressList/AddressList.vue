/**
* @Description:    通讯录
* @Author:         TSY
* @CreateDate:     2018/9/26 14:52
*/
<template>
    <div>
        <search-box placeholder="搜索"></search-box>
        <div class="area-group">
            <ul>
                <li v-for="(item,index) in addressList" :key="index">
                    <div class="area-title" @click="clickArea(index)">
                        <div class="area-left">
                            <i class="iconfont"
                               :class="{'icon-down-copy': listOpenState[index] && listOpenState[index].group, 'icon-right-copy': listOpenState[index] && !listOpenState[index].group}"></i>
                            <span class="flex-text">{{ item.areaName }}</span>
                        </div>
                        <span class="area-right">(16)</span>
                    </div>
                    <ul v-show="listOpenState[index] && listOpenState[index].group">
                        <li v-for="(school,i) in addressList[index].areaSchool" :key="i">
                            <div class="area-title" @click="clickSchool(index, i)">
                                <div class="area-left">
                                    <i class="school-pull iconfont"
                                       :class="{'icon-down-copy': listOpenState[index] && listOpenState[index].child[i], 'icon-right-copy': listOpenState[index] && !listOpenState[index].child[i]}"></i>
                                    <span class="flex-text">{{ school.schoolName }}</span>
                                </div>
                                <span class="area-right">(16)</span>
                            </div>
                            <ul v-show="listOpenState[index] && listOpenState[index].child[i]">
                                <li class="user-info" @click="userInfoDetail">
                                    <user-info-item job="安全员" user-name="黄二虎"></user-info-item>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import SearchBox from "../common/SearchBox";
    import FillBox from "../common/FillBox";
    import UserInfoItem from "../common/UserInfoItem";

    export default {
        name: "AddressList",
        components: {UserInfoItem, FillBox, SearchBox},
        data() {
            return {
                listOpenState: [],//列表的展开/折叠状态   true: 展开   false：折叠
                addressList: [
                    {
                        'areaName': '张搓片区',
                        'areaSchool': [{'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'areaSchool': [{'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'areaSchool': [{'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'areaSchool': [{'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'areaSchool': [{'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}, {'schoolName': '哈哈哈哈哈小学'}]
                    }
                ]
            }
        },
        mounted() {
            for (let i in this.addressList) {//给每个可折叠的li添加一个初始状态，默认折叠状态
                this.listOpenState.push([]);
                this.$set(this.listOpenState[i], 'group', false);
                this.$set(this.listOpenState[i], 'child', []);
                for (let j = 0, len = this.addressList[i].areaSchool.length; j < len; j++) {
                    this.listOpenState[i].child.push(false);
                }
            }
        },
        computed: {},
        methods: {
            clickArea(index) {//点击区域名称，让该区域展开/折叠
                this.$set(this.listOpenState[index], 'group', !this.listOpenState[index].group);
            },
            clickSchool(areaIndex, schoolIndex) {//点击学校名称，让该学校展开/折叠
                this.$set(this.listOpenState[areaIndex].child, schoolIndex, !this.listOpenState[areaIndex].child[schoolIndex]);
            },
            userInfoDetail() {//查看人员信息详情
                this.$router.push({name: 'userInfo'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .area-group {
        topLine()
    }

    .area-title {
        display flex
        justify-content space-between
        align-items center
        paddingAround()
        borderTop()
        fontSize(34px)
    }

    .area-left {
        display flex
        align-items center
    }

    .iconfont {
        fontSize(42px)
        color vice-font-color
        margin-right px2vw(20px)
    }

    .school-pull {
        margin-left px2vw(50px)
    }

    .user-info {
        paddingAround()
        borderTop()
    }

    .area-left {
        display flex
        width 0
        flex 1
    }

    .flex-text {
        width 0
        flex 1
        textOverflow()
    }
</style>