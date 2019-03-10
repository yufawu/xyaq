/**
* @Description:    搜索框
* @Author:         TSY
* @CreateDate:     2018/8/24 17:56
*/
<template>
    <div class="head">
        <div class="search" :class="{ search_focus: isSearchFocusOn }">
            <i class="iconfont icon-search"></i>
            <input type="search" :placeholder="placeholder" @input="updateVal" v-model="searchText"
                   @focus="searchFocus($event)" @blur="searchBlur" ref="searchInput" @click="searchBoxClick">
            <i v-show="searchText.length>0" class="iconfont icon-cha" @click="clearText()"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchBox",
        props: {
            isSearchFocus: {//搜索框是否获取焦点
                type: Boolean,
                default: false
            },
            placeholder: {//搜索框是否获取焦点
                type: String,
                default: '输入学校名称搜索'
            }
        },
        data() {
            return {
                searchText: '',//搜索框输入的内容
                isSearchFocusOn: false,//搜索框是否获取焦点
            }
        },
        mounted() {

        },
        computed: {},
        watch: {
            isSearchFocus(val) {
                this.isSearchFocusOn = val;
                if (val) {
                    this.$refs.searchInput.focus()
                }
            }
        },
        methods: {
            updateVal(event){
                let val = event.target.value;
                this.searchText = val;
                this.$emit('input', val);
            },
            searchFocus(event) {//搜索框获取焦点
                this.isSearchFocusOn = true;
                event.currentTarget.select();
            },
            searchBlur() {//搜索框失去焦点
                this.isSearchFocusOn = false;
            },
            clearText() {//清除搜索框文字
                this.searchText = '';
                this.$emit('input', '');
            },
            searchBoxClick() {//触发点击事件
                this.$emit('click','')
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .head {
        padding px2vw(40px) px2vw(34px)
        background white
    }

    .search {
        display flex
        align-items center
        border 1px solid bg-color
        padding px2vw(10px) px2vw(20px)
        border-radius 50px
    }

    .search input {
        border none
        padding px2vw(10px)
        flex 1
    }

    .search_focus {
        border-color main-color
    }

    .icon-search {
        color vice-font-color
    }

    .icon-cha {
        color vice-font-color
    }

    input[type=search]::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }
</style>