/**
* @Description:    日常巡查（安全巡查）
* @Author:         TSY
* @CreateDate:     2018/9/21 9:18
*/
<template>
    <div>
        <search-box @click="searchBoxClick"></search-box>
        <div class="area">
            <ul>
                <li v-for="(item,index) in areaSchool" :key="index">
                    <p class="area_title">{{ item.areaName }}（共{{ item.schoolList.length }}所学校）</p>
                    <ul class="area_school">
                        <li v-if="index<5" v-for="(school,index) in item.schoolList" :key="index" @click="checkDetail(school)">{{ school.school }}</li>
                        <li v-if="item.schoolList.length>6" class="look_more" @click="lookMore(index)">查看更多</li>
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
    import * as types from "../../constant/types"

    export default {
        name: "EverydayCheck",
        components: {FillBox, SearchBox},
        data() {
            return {
                areaSchool: [
                    {
                        'areaName': '张搓片区',
                        'schoolList': [{'school':'上朗幼儿园'},{'school':'实验学校中学部'},{'school':'保利香槟幼儿园'},{'school':'实验学校中学部'},{'school':'张搓中学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'schoolList': [{'school':'张搓中学'},{'school':'上朗幼儿园'},{'school':'绑窑小学部'},{'school':'实验学校中学部'},{'school':'保利香槟幼儿园'},{'school':'实验学校中学部'},{'school':'张搓中学'}]
                    },
                    {
                        'areaName': '张搓片区',
                        'schoolList': [{'school':'张搓中学'},{'school':'上朗幼儿园'},{'school':'实验学校中学部'},{'school':'张搓中学'}]
                    }
                ],//区域学校
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            checkDetail(school) {//学校日常检查统计详细信息
                this.$store.dispatch(types.SAVE_EVERYDAY_SCHOOL_ITEM,school)
                this.$router.push({name: 'everydayCheckDetail'});
            },
            lookMore(index) {//查看更多学校
                this.$store.dispatch(types.SAVE_EVERYDAY_SCHOOL_LIST,this.areaSchool[index].schoolList);
                this.$router.push({name: 'everydaySchoolList'});
            },
            searchBoxClick() {//点击搜索框，进入搜索页
                let schoolList = [];
                for (let i in this.areaSchool) {
                    schoolList = schoolList.concat(this.areaSchool[i].schoolList);
                }
                this.$store.dispatch(types.SAVE_EVERYDAY_SCHOOL_LIST,schoolList);
                this.$router.push({name: 'everydaySchoolList', query: {search: true}});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .area {
        width 100%
    }

    .area_title {
        background bg-color
        padding px2vw(26px) px2vw(34px)
    }

    .area_school {
        display flex
        flex-wrap wrap
    }

    .area_school li {
        width 50%
        paddingAround()
        borderRight()
        borderBottom()
        textOverflow()
    }

    .look_more {
        color main-color
    }
</style>