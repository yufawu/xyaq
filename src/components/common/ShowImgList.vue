/**
* @Description:    显示图片列表
* @Author:         TSY
* @CreateDate:     2018/7/2 14:59
*/
<template>
    <div class="item_files" @click.stop>
        <div v-if="img && img.length>0" class="preview_img" v-for="(item,index) in img" :key="index">
            <div class="preview_img_div">
                <img class="preview_img_img" :src="item" :onerror="errorImg" @click="previewImg(item)">
            </div>
        </div>
        <div v-if="img1" class="preview_img">
            <div class="preview_img_div">
                <img class="preview_img_img" :src="img1" :onerror="errorImg" @click="previewImg(img1)">
            </div>
        </div>
        <div v-if="img2" class="preview_img">
            <div class="preview_img_div">
                <img class="preview_img_img" :src="img2" :onerror="errorImg" @click="previewImg(img2)">
            </div>
        </div>
        <div v-if="img3" class="preview_img">
            <div class="preview_img_div">
                <img class="preview_img_img" :src="img3" :onerror="errorImg" @click="previewImg(img3)">
            </div>
        </div>
        <div v-if="videoImg" class="preview_img" @click="previewVideo(videoURL)">
            <div class="preview_img_div">
                <img class="player_icon" src="../../assets/icon_player.png">
                <img class="preview_img_img" :src="videoImg" :onerror="errorImg">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "showImgList",
        props: ["img", "img1", "img2", 'img3', 'videoImg', 'videoURL'],
        data() {
            return {
                errorImg: 'this.src="' + require('../../assets/load_fail.png') + '"'
            }
        },
        methods: {
            previewImg(url) {//查看大图
                this.$router.push({name: 'imageVideoPreview', params: {'imgURL': url}});
            },
            previewVideo(url) {//播放视频
                this.$router.push({name: 'imageVideoPreview', params: {'videoURL': url}});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .item_files {
        display flex
        align-items center
        margin-top 2%
    }

    .preview_img {
        display inline-block
        position relative
        width 23%
        margin-right 2%
    }

    .preview_img_div {
        position relative
        width 100%
        height 80px
        overflow hidden
    }

    .preview_img_img {
        width 150%
    }

    .player_icon {
        position absolute
        width 40%
        top 30%
        left 30%
    }
</style>