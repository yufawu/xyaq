/**
* @Description:    安全知识库首页
* @Author:         TSY
* @CreateDate:     2018/8/28 9:23
*/
<template>
    <div class="body">
        <div class="top">
            <div class="type">
                <div class="type_item" v-for="(item,index) in menuList" :key="index"
                     :class="{type_select: clickIndex == index}" @click="clickItem(index)">{{ item.name }}
                </div>
            </div>
            <i class="iconfont icon-add" @click="openSelector"></i>
        </div>
        <div class="knowledge">
            <no-data-tips :data="knowledgeList"></no-data-tips>
            <ul>
                <li v-for="(item,index) in knowledgeList" :key="index" @click="intoKnowledgeDetail(item.link)">
                    <img class="knowledge_item_icon" :src="item.image" :onerror="errorImg">
                    <div class="knowledge_item_content">
                        <p class="manager_item_title">{{ item.title }}</p>
                        <p class="knowledge_item_time">{{ item.content }}</p>
                        <div class="knowledge_star">★★★★☆</div>
                        <p class="knowledge_item_time">{{ item.createtime }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div v-show="isShowSelector" class="menu_list mask" @click="closeSelector">
            <div class="menu_close">
                <i class="iconfont icon-guanbi"></i>
            </div>
            <div class="menu_group" @click.stop>
                <div class="menu_item" v-for="(item,index) in selectMenuList"
                     :class="{menu_item_selected: isSelectItem[index]}" :key="index" @click="clickGroupItem(index)">{{ item.name }}
                </div>
            </div>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import {delHtmlTag} from "../../utils/util";
    import SelectArea from "../common/SelectArea";
    import FillBox from "../common/FillBox";
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "safeKnowledge",
        components: {NoDataTips, FillBox, SelectArea},
        data() {
            return {
                clickIndex: 0,//当前点击菜单的index
                menuList: [],//菜单列表
                knowledgeList: [],//知识列表
                isShowSelector: false,// 是否显示弹窗
                isSelectItem: [false],//弹窗菜单的选中情况
                selectMenuList: [],//弹窗菜单列表
                errorImg: 'this.src="' + require('../../assets/load_fail.png') + '"',//加载失败显示默认图片
            }
        },
        mounted() {
            this.getTypeList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            clickItem(index) {//点击分类菜单
                this.clickIndex = index;
                this.getSecondTypeList(this.menuList[index].id);
            },
            getTypeList() {//获取分类列表
                this.http(this, this.user.baseURL + api.GET_KNOWLEDGE_TYPE, '', (res) => {
                    if (res.status == 1) {
                        let result = res.data.kbmCategory;
                        for (let i in result) {
                            this.menuList.push({'name': result[i].name, 'id': result[i].id, 'selected': false});
                            this.isSelectItem.push(false);
                        }
                        this.selectMenuList = JSON.parse(JSON.stringify(this.menuList));
                        this.selectMenuList.splice(0, 0, {'name': '全部'})
                        this.getSecondTypeList(this.menuList[0].id);//默认展示第一项的数据
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getSecondTypeList(id) {//获取二级分类列表
                let params = {
                    'id': id
                }
                let idArray = [], ids = '';
                this.http(this, this.user.baseURL + api.GET_KNOWLEDGE_SECOND_TYPE, params, (res) => {
                    if (res.status == 1) {
                        for (let i in res.data) {
                            idArray.push(res.data[i].id);
                        }
                        ids = idArray.join(',');
                        this.getKnowledgeList(ids);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getKnowledgeList(ids) {//获取安全知识列表
                this.knowledgeList = [];
                let params = {
                    'id': ids
                }
                this.http(this, this.user.baseURL + api.GET_KNOWLEDGE_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.knowledgeList = res.data;
                        let len = this.knowledgeList.length;
                        let re = new RegExp("&nbsp;", "g"); //定义正则表达式--全局替换所有的空格
                        for (let i = 0; i < len; i++) {
                            //把html标签删除后再显示
                            this.knowledgeList[i].content = delHtmlTag(this.knowledgeList[i].content).replace(re, "");
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            intoKnowledgeDetail(link) {//进入安全知识详情
                link = link.replace('http://', 'https://');
                window.location.href = link;
            },
            clickGroupItem(index) { //弹窗筛选列表选中效果
                this.isSelectItem.splice(index, 1, !this.isSelectItem[index]);
                if (index == 0) {
                    if (this.isSelectItem[0]) {
                        this.isSelectItem = [];
                        for (let i = 0, len = this.selectMenuList.length; i < len; i++) {
                            this.isSelectItem.push(true);
                        }
                    } else {
                        this.isSelectItem = [];
                        for (let i = 0, len = this.selectMenuList.length; i < len; i++) {
                            this.isSelectItem.push(false);
                        }
                        return
                    }
                }
                let idArr = [], ids = '';
                for (let i in this.isSelectItem) {
                    if (i > 0 && this.isSelectItem[i]) {
                        idArr.push(this.menuList[i - 1].id);
                    }
                }
                if (idArr.length < this.menuList.length) { //如果没有全部选中，取消 【全部】 按钮的选中效果
                    this.isSelectItem.splice(0, 1, false);
                } else {
                    this.isSelectItem.splice(0, 1, true);
                }
                ids = idArr.join(',');
                this.getSecondTypeList(ids);
            },
            openSelector(){ // 打开弹窗
                this.isShowSelector = true;
            },
            closeSelector(){ // 关闭弹窗
                this.isShowSelector = false;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        background bg-color
    }

    .top {
        display flex
        align-items center
        border-bottom px2vw(16px) solid bg-color
        background white
        fixedTop()
    }

    .type {
        white-space nowrap
        overflow-x auto
        paddingAround()
        &::-webkit-scrollbar {
            display none
        }
    }

    .type_item {
        display inline-block
        min-width 20vw
        text-align center
    }

    .type_select {
        color main-color
    }

    .icon-add {
        fontSize(54px)
        margin-right px2vw(12px)
        color vice-font-color
    }

    .knowledge {
        position relative
        width 100%
        display inline-block
        background #ffffff
        border-radius 5px
        z-index 1
        padding-top px2vw(120px)
    }

    .knowledge li {
        display flex
        align-items center
        paddingAround()
        borderBottom()
    }

    .knowledge_item_icon {
        width 0
        flex-grow 1
        max-height px2vw(150px)
    }

    .knowledge_item_content {
        width 0
        flex-grow 2
        display flex
        flex-wrap wrap
        align-items center
        justify-content space-between
        margin-left 5%
    }

    .knowledge_item_title {
        textOverflow()
        width 100%
    }

    .knowledge_item_time {
        textOverflow()
        width 100%
        color vice-font-color
    }

    .knowledge_star {
        color main-color
    }

    .menu_close {
        width 100%
        text-align right
        paddingAround()
        background white
        borderBottom()
    }

    .menu_group {
        display flex
        align-items center
        flex-wrap wrap
        width 100%
        paddingAround()
        background white
    }

    .menu_item {
        width 25vw
        margin px2vw(15px)
        padding px2vw(10px) 0
        text-align center
        border 1px solid #ccc
        border-radius 100px
        fontSize(28px)
        background bg-color
    }

    .menu_item_selected {
        color white
        border 1px solid main-color
        background main-color
    }
</style>