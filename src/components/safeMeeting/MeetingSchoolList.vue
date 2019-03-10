/**
* @Description:    选择学校列表     --（会议签到）
* @Author:         TSY
* @CreateDate:     2018/8/21 17:19
*/
<template>
    <div class="body">
        <search-box v-model="searchText"></search-box>
        <div class="selector" @click="openSelectDialog()">
            <input-selector label="按行政区域选择学校/教育局"></input-selector>
        </div>
        <p class="list_text">学校/教育局列表</p>
        <div class="school_list" v-for="(school,index) in showSchoolList" :key="index">
            <p class="school_letter">{{ school.letter }}</p>
            <p v-for="(item,i) in school.data" class="school_item" :key="i" @click="selectedSchool(item)">{{ item }}</p>
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
                        <!--后续要要加省市区选择是，加上该事件@click="changeArea(index)"-->
                        <li v-for="(item,index) in areaList" :key="index" :class="{ area_selected: item == '请选择' }">{{ item }}
                        </li>
                    </ul>
                </div>
                <div class="mask_school_list">
                    <no-data-tips :data="areaDataList"></no-data-tips>
                    <ul>
                        <li class="mask_school_item" v-for="(area,index) in areaDataList"
                            @click="selectArea(area,index)"
                            :key="index">{{ area }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import area from '../../constant/area'
    import * as types from '../../constant/types'
    import * as api from '../../constant/api'
    import {pySort} from "../../utils/util";
    import InputSelector from "../common/InputSelector";
    import NoDataTips from "../common/NoDataTips";
    import SearchBox from "../common/SearchBox";

    export default {
        name: "MeetingSchoolList",
        components: {SearchBox, NoDataTips, InputSelector},
        data() {
            return {
                searchText: '',//搜索文字
                streetSchoolList: [],//所有街道和学校列表
                streetList: [],//所有街道列表
                schoolNameAndID: [],//所有学校名字和ID
                schoolList: [],
                showSchoolList: [],// 筛选/排序 后的数据
                areaList: ['请选择'],
                isShowSelectArea: false,//是否显示选择弹窗
                codeList: [100000],//点击过的code列表
                // areaDataList: area[100000] || [],//当前显示的地区数据（默认省）
                areaDataList: [],//当前显示的地区数据（默认省）
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
                this.showSchoolList = this.schoolList.filter(function (item) {
                    return item.indexOf(val) != -1
                });
                //筛选完按拼音首字母排序
                this.showSchoolList = pySort(this.showSchoolList);
            }
        },
        methods: {
            getSchoolList() { //获取所有街道和学校
                let params = {
                    'meeting_id': this.$route.query.meeting_id
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_MEETING_STREET_SCHOOL, params, (res) => {
                    if (res.status == 1) {
                        this.streetSchoolList = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                    this.setSchoolList();
                })
            },
            setSchoolList() { //把所有学校提取出来
                this.schoolList = [];
                for (let k in this.streetSchoolList) {
                    this.streetList.push(k);
                    for (let i in this.streetSchoolList[k]) {
                        this.schoolList.push(this.streetSchoolList[k][i].AccountName);
                        this.schoolNameAndID[this.streetSchoolList[k][i].AccountName] = this.streetSchoolList[k][i].AccountID;//把学校和对应的ID用键值对保存起来
                    }
                }
                this.areaDataList = this.streetList;
                this.showSchoolList = pySort(this.schoolList);//按拼音首字母排序
            },
            selectArea(item) {                                                                            // index等于键值
                this.schoolList = [];
                for (let i in this.streetSchoolList[item]) {
                    this.schoolList.push(this.streetSchoolList[item][i].AccountName);
                }
                this.showSchoolList = pySort(this.schoolList);//按拼音首字母排序
                this.isShowSelectArea = false;
                // this.areaList.splice(this.areaList.length - 1, 0, item);//设置标题
                // this.areaDataList = area[index] || [];
                // this.codeList.push(index);
            },
            changeArea(index) {//修改地区
                this.areaDataList = area[this.codeList[index]] || [];
                //按点击位置删除多余的code
                this.codeList.splice(index + 1, this.codeList.length - index + 1);
                //按点击位置删除多余的区域
                this.areaList.splice(index, this.areaList.length - index - 1);
            },
            selectedSchool(school) { //确认选择学校
                this.$router.back();
                let accountID = this.findIdByName(school);
                this.$store.dispatch(types.SET_SAFE_MEETING_SCHOOL, {'school': school, 'accountID': accountID});
            },
            openSelectDialog() { //打开选择弹窗
                this.isShowSelectArea = true;
            },
            closeSelectDialog() {//关闭选择弹窗
                this.isShowSelectArea = false;
            },
            findIdByName(name) { // 通过名字查找ID
                return this.schoolNameAndID[name];
            }
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