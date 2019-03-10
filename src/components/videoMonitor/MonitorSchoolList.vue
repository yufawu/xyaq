/**
* @Description:    选择学校列表     --（视频监控）
* @Author:         yufawu
* @CreateDate:     2018/10/8 17:19
*/
<template>
    <div class="body">
        <search-box v-model="searchText"></search-box>
        <div class="selector" @click="openSelectDialog()">
            <input-selector label="按行政区域选择学校"></input-selector>
        </div>
        <p class="list_text">学校列表</p>
        <div v-show="isShowSchoolList" class="school_list" v-for="(school,index) in showSchoolList" :key="index">
            <p class="school_letter">{{ index }} </p>
            <p v-for="(item,i) in school" class="school_item" :key="i" @click="selectedSchool(item)">{{ item.AccountName }}</p>
        </div>
        <div v-show="!isShowSchoolList" class="school_list" v-for="item in showSchoolList" :key="item.AccountID">
            <p class="school_item" @click="selectedSchool(item)">{{ item.AccountName }}</p>
        </div>
        <div v-show="isShowSelectArea" class="mask">
            <div class="mask_content">
                <div class="mask_close" @click="closeSelectDialog()">
                    <i class="iconfont icon-guanbi"></i>
                </div>
                <div class="mask_title">选择街道</div>
                <p class="mask_subtitle">已选择</p>
                <div class="mask_area_list">
                    <ul>
                        <li v-for="(item,index) in areaListSelect" :key="index">{{ item }}
                        <li v-for="(item,index) in areaList" :key="index" :class="{ area_selected: item == '请选择' }">{{ item }}
                        </li>
                    </ul>
                </div>
                <div class="mask_school_list">
                    <no-data-tips :data="areaDataList"></no-data-tips>
                    <ul>
                        <li v-if="isShowStreet" class="mask_school_item" v-for="(area,index) in areaDataList"
                            @click="selectArea(index)"
                            :key="index">{{ area.name }}
                        </li>
                        <li  class="mask_school_item" v-for="(item,index) in schoolSelect"
                             @click="selectedSchool(item)"
                             :key="index">{{ item.AccountName }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as types from '../../constant/types'
    import * as api from '../../constant/api'
    import InputSelector from "../common/InputSelector";
    import NoDataTips from "../common/NoDataTips";
    import SearchBox from "../common/SearchBox";

    export default {
        name: "MonitorSchoolList",
        components: {SearchBox, NoDataTips, InputSelector},
        data() {
            return {
                searchText: '',//搜索文字
                streetSchoolList: [],//所有街道和学校列表
                streetList: [],//所有街道列表
                schoolList: [], //所有的学校列表
                Arrs:[],//将所有的学校列表以数组形式保存
                schoolListArr:[],//将所有的学校列表以数组形式保存
                schoolSelect:[],//存放按街道选择后的学校
                showSchoolList: [],// 筛选/排序 后的数据
                areaList: ['请选择'],
                areaListSelect:[],//区域选择列表
                isShowSelectArea: false,//是否显示选择弹窗
                isShowStreet:true,//默认显示街道
                isShowSchoolList:true,//默认显示搜索前的列表
                areaDataList: [],//当前显示的街道数据
            }
        },
        mounted() {
            this.getSchoolList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        watch: {
            searchText(val) { //根据搜索框内容筛选数据
                if (this.schoolList.length == 0) {
                    return;
                }

                this.showSchoolList = this.schoolListArr.filter(function (item) {
                    return item.AccountName.indexOf(val) != -1
                });
                this.isShowSchoolList = false
            }
        },
        methods: {

            getSchoolList() { //获取所有街道和学校
                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_VIDEO_SCHOOL_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.streetSchoolList = res.data;
                        this.schoolList = this.streetSchoolList.school_list;
                        this.showSchoolList = this.streetSchoolList.school_list
                        this.areaDataList = this.streetSchoolList.street_list;
                        for (let k in this.schoolList) {
                            for (let i in this.schoolList[k]) {
                                this.schoolListArr.push(this.schoolList[k][i]);
                            }
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            selectArea(index) {
                this.areaListSelect.push(this.areaDataList[index].name);
                for (let i in this.areaDataList[index].schools) {
                    this.schoolSelect.push(this.areaDataList[index].schools[i]);
                }
                this.isShowStreet =false;
            },
            selectedSchool(school) { //确认选择学校
                this.$router.back();
                this.$store.dispatch(types.SAVE_MONITOR_SCHOOL, school);
            },
            openSelectDialog() { //打开选择弹窗
                this.isShowSelectArea = true;
            },
            closeSelectDialog() {//关闭选择弹窗
                this.isShowSelectArea = false;
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        background bg-color
    }

    .selector {
        background white
        margin-top px2vw(16px)
    }

    .list_text {
        padding 2% 4%
        color vice-font-color
    }

    .school_list {
        position relative
        background white
    }

    .school_letter {
        position absolute
        top 0
        left 0
        padding 4% 4%
        color vice-font-color
    }

    .school_item {
        padding 3% 10%
        borderBottom()
        fontSize(32px)
    }

    .mask_content {
        position absolute
        width 100%
        bottom 0
        left 0
        background white
    }

    .mask_close {
        width 100%
        text-align right
        padding px2vw(15px) px2vw(30px)
    }

    .icon-guanbi {
        color vice-font-color
        fontSize(24px)
    }

    .mask_title {
        width 100%
        text-align center
        fontSize(32px)
    }

    .mask_subtitle {
        color vice-font-color
        padding px2vw(15px) px2vw(30px)
    }

    .mask_area_list {
        background bg-color
        padding px2vw(15px) px2vw(30px)
    }

    .mask_area_list ul {
        display flex
    }

    .mask_area_list ul li {
        width: 20%;
        text-align center
        padding px2vw(5px) 0
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
    }

    .area_selected {
        color main-color
        border-bottom 2px solid main-color
    }

    .mask_school_list {
        background white
        height 50vh
        overflow-y auto
    }

    .mask_school_item {
        padding 3% 6%
        borderBottom()
    }


</style>