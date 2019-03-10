/**
* @Description:    学校列表页搜索学校
* @Author:         TSY
* @CreateDate:     2018/9/26 9:47
*/
<template>
    <div>
        <search-box v-model="searchText" :is-search-focus="isFromIndexSearch"></search-box>
        <div class="school_list">
            <ul>
                <li v-for="(item,index) in showSchoolList" :key="index" @click="checkDetail(item)">{{ item.school }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SearchBox from "../common/SearchBox";
    import * as types from "../../constant/types"

    export default {
        name: "EverydaySchoolList",
        components: {SearchBox},
        data() {
            return {
                searchText: '',//搜索文字
                showSchoolList: [],//页面展示的学校列表
                isFromIndexSearch: false,//是否为首页点击搜索进来的
            }
        },
        mounted() {
            this.showSchoolList = this.everydaySchoolList;
            if (this.$route.query.search){ //能获取到search的值，说明是从首页点击搜索框进来的
                this.isFromIndexSearch = true;
            }
        },
        watch: {
            searchText(val) {
                if (this.isFromIndexSearch && val === '') {
                    this.$router.back();
                    this.isFromIndexSearch = false;
                    return
                }
                if (!this.everydaySchoolList || this.everydaySchoolList.length === 0) {
                    this.$bottomToast('暂时没有学校可供搜索！');
                    return
                }
                this.showSchoolList = this.everydaySchoolList.filter((item)=>{
                    return item.school.includes(val);
                })
            }
        },
        computed: {
            everydaySchoolList() {
                return this.$store.getters.everydaySchoolList
            }
        },
        methods: {
            checkDetail(school) {//学校日常检查统计详细信息
                this.$store.dispatch(types.SAVE_EVERYDAY_SCHOOL_ITEM,school);
                this.$router.push({name: 'everydayCheckDetail'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .school_list {
        topLine()
    }

    .school_list li {
        paddingAround()
        borderBottom()
    }
</style>