/**
* @Description:    视频监控列表
* @Author:         TSY(界面)  巫瑜发（接口）
* @CreateDate:     2018/9/17 10:42
*/
<template>
    <div>
        <input-selector v-if="user.type == 1" :label="schoolName" @listenSelect="intoSelectSchool"></input-selector>
        <no-data-tips :data="monitorList"></no-data-tips>
        <div class="content">
            <ul>
                <li class="area" v-for="(item,index) in monitorList" :key="index">
                    <p  class="area_title" @click="checkItem(index)">{{ item.group_name + '('+(item.list?item.list.length:'0')+'个视频)' }}
                        <i class="iconfont " :class="{'icon-right-copy': !isActive[index],'icon-down-copy': isActive[index] }"></i>
                    </p>
                    <ul v-show="isOpenItem[index]">
                        <li class="monitor click_item" v-for="(monitor,i) in item.list" :key="i" @click="playVideo(monitor)">
                            <p class="monitor_title">{{monitor.channelName}}</p>
                            <!--<p class="monitor_subtitle">设备状态：{{monitor.status}}</p>-->
                        </li>
                    </ul>
                </li>
            </ul>
            <fill-box></fill-box>
        </div>
    </div>
</template>

<script>
    import * as types from '../../constant/types'
    import * as api from '../../constant/api'
    import InputSelector from "../common/InputSelector";
    import FillBox from "../common/FillBox";
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "MonitorList",
        components: {NoDataTips, FillBox, InputSelector},
        data() {
            return {
                schoolName: '请选择学校',//被选中的学校名字
                isMonitorShow:true,//隐藏或隐藏视频列表
                monitorListData:[],//存储获取的原始数据
                monitorList: [],//视频监控列表
                isOpenItem: [],//控制每项的面板打开与折叠
                isActive:[],
            }
        },
        mounted() {
            if (this.selectedSchool.AccountName) {
                this.schoolName = this.selectedSchool.AccountName;
            }
            this.getMonitorList();
        },
        computed: {
            selectedSchool() {//获取选择的学校
                return this.$store.getters.monitorSchoolItem;
            },
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getMonitorList() { //获取视频监控列表
                let params = {
                    'account_id': this.selectedSchool && this.selectedSchool.AccountID || this.user.accountID || '',
                }
                if (this.user.type == 2) {
                    params = {
                        'account_id': this.user.accountID || this.$route.query.account_id,
                    }
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_VIDEO_MONITOR, params, (res) => {
                    if (res.status == 1) {
                        this.monitorList = res.data;
                        for (let i in this.monitorList) {
                            this.isOpenItem[i] = false;
                            this.isActive[i] =false;
                        }
                    } else {
                        this.$bottomToast(res.msg);
                        this.monitorList = [];
                    }
                })

            },
            playVideo(monitor) { //播放视频
                this.$store.dispatch(types.SAVE_MONITOR_ITEM, monitor);
                this.$router.push({name: "monitorPlayer"});
            },
            intoSelectSchool() { //进入选择学校页
                this.$router.push({name: 'monitorSchoolList'})
            },
            checkItem(index) {//展开或折叠面板
                this.isOpenItem.splice(index, 1, !this.isOpenItem[index]);
                this.isActive.splice(index, 1, !this.isActive[index]);
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .area_title {
        paddingAround()
        fontSize(28px)
        background bg-color
        margin-bottom:1px;
    }

    .monitor {
        paddingAround()
        borderBottom()
    }

    .monitor_title {
        fontSize(34px)
    }

    .monitor_subtitle {
        fontSize(28px)
        color vice-font-color
    }
    .iconfont{
        float:right;
    }
</style>