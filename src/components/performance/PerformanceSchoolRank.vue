/**
* @Description:    绩效考核--学校排行
* @Author:         TSY
* @CreateDate:     2018/8/24 17:41
*/
<template>
    <div>
        <search-box v-model="searchText"></search-box>
        <div class="selector" @click="openSelectDialog()">
            <input-selector label="按行政区域选择学校"></input-selector>
        </div>
        <div class="rank">
            <div class="rank_title">下属学校绩效排行</div>
            <rank-list :data="showSchoolList" @select="intoDetail"></rank-list>
        </div>
        <danger-dispose-time :select-data="selectData" :isShowSelect="isShowSelect"
                             @listenSelect="areaSelect"></danger-dispose-time>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import * as types from '../../constant/types'
    import SearchBox from "../common/SearchBox";
    import InputSelector from "../common/InputSelector";
    import RankList from "../common/RankList";
    import DangerDisposeTime from "../common/DangerDisposeTime";

    export default {
        name: "PerformanceSchoolRank",
        components: {DangerDisposeTime, RankList, InputSelector, SearchBox},
        data() {
            return {
                searchText: '',//搜索框输入的文字
                schoolList: [],
                showSchoolList: [],// 筛选后的数据
                areaSchool: [],//按区域区分学校
                isShowSelect: false,//是否显示区域选择层
                selectData: [],//选择层显示的数据
            }
        },
        mounted() {
            this.getPerformanceSchool();
        },
        watch: {
            searchText(val) { //根据搜索框内容筛选数据
                if (!this.schoolList || this.schoolList.length == 0) {
                    return;
                }
                this.showSchoolList = this.schoolList.filter(function (item) {
                    return item.account_name.indexOf(val) != -1
                });
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            schoolItem() {
                return this.$store.getters.performanceSchoolItem;
            }
        },
        methods: {
            getPerformanceSchool() { //获取学校列表
                let params = {
                    'account_id': this.user.accountID || '',
                    'static_month': this.schoolItem.month || ''
                }
                this.http(this, this.user.baseURL + api.GET_PERFORMANCE_SCHOOL_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.areaSchool = res.data.areaSchool;
                        this.schoolList = res.data.schoolList;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                    for (let i in this.areaSchool) {
                        this.selectData.push(this.areaSchool[i].areName);
                    }
                    this.showSchoolList = this.schoolList;
                })
            },
            openSelectDialog() {
                if (!this.schoolList || this.schoolList.length == 0) {
                    this.$bottomToast('暂无学校可供选择');
                    return
                }
                this.isShowSelect = true;
            },
            areaSelect(index) {
                this.isShowSelect = false;
                if (index == -1) {
                    return
                }
                this.schoolList = this.areaSchool[index].schoolList
                this.showSchoolList = this.schoolList;
            },
            intoDetail(item) { //进入考评详情
                this.$router.push({name: 'performanceDetail'});
                this.$store.dispatch(types.SET_PERFORMANCE_SCHOOL, {
                    'month': this.schoolItem.month,
                    'id': item.account_id
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .selector {
        background white
        border-top px2vw(16px) solid bg-color
    }

    .rank_title {
        background bg-color
        padding px2vw(24px) px2vw(28px)
        fontSize(28px)
    }
</style>