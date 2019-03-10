/**
* @Description:    预览图片、视频、音频
* @Author:         TSY
* @CreateDate:     2018/6/26 9:34
*/
<template>
    <div>
        <video v-if="videoURL" class="view" :src="videoURL" controls="controls"></video>
        <audio v-else-if="audioURL" :src="audioURL" controls="controls"></audio>
        <div v-else-if="otherTypeURL" class="otherType">
            暂不支持打开该类型的文件
        </div>
        <div v-else class="viewImg" @click="back">
            <img :src="imgURL">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'imageVideoPreview',
        data() {
            return {
                videoURL: '',//视频地址
                audioURL: '',//音频地址
                imgURL: '',  //图片地址
                otherTypeURL: '',  //其它类型的文件
                src:'',      //存储链接地址
            }
        },
        mounted() {
            this.src = this.matchType(this.$route.query.src);
            if(this.src !=''){ //后台查看视频，音频，图片
                if (this.src == 'video') {
                    this.videoURL = this.$route.query.src;
                }
                if (this.src == 'audio') {
                    this.audioURL = this.$route.query.src;
                }
                if (this.src == 'image') {
                    this.imgURL = this.$route.query.src;
                }else{//其它类型的文件的提示信息
                    this.otherTypeURL = this.$route.query.src;
                }
            }else{//微信端查看视频，音频，图片
                this.videoURL = this.$route.params.videoURL;
                this.audioURL = this.$route.params.audioURL;
                this.imgURL = this.$route.params.imgURL;
            }

        },
        methods: {
            back() {
                this.$router.back();
            },
            matchType(fileName) {
                // 后缀获取
                let suffix = '';
                // 获取类型结果
                let result = '';
                try {
                    let flieArr = fileName.split('.');
                    suffix = flieArr[flieArr.length - 1];
                } catch (err) {
                    suffix = '';
                }
                // fileName无后缀返回 false
                if (!suffix) {
                    result = false;
                    return result;
                }
                // 图片格式
                let imglist = ['png', 'jpg', 'jpeg',];
                // 进行图片匹配
                result = imglist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'image';
                    return result;
                }
                // 匹配txt
                let txtlist = ['txt'];
                result = txtlist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'txt';
                    return result;
                }

                // 匹配 excel
                let excelist = ['xls', 'xlsx'];
                result = excelist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'excel';
                    return result;
                }

                // 匹配 word
                let wordlist = ['doc', 'docx'];
                result = wordlist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'word';
                    return result;
                }
                // 匹配 pdf
                let pdflist = ['pdf'];
                result = pdflist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'pdf';
                    return result;
                }
                // 匹配 ppt
                let pptlist = ['ppt'];
                result = pptlist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'ppt';
                    return result;
                }
                // 匹配 视频
                let videolist = ['mp4', 'm2v', 'mkv'];
                result = videolist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'video';
                    return result;
                }
                // 匹配 音频
                let audiolist = ['mp3', 'wav', 'wmv'];
                result = audiolist.some(function (item) {
                    return item == suffix;
                })
                if (result) {
                    result = 'audio';
                    return result;
                }
                // 其他 文件类型
                result = 'other';
                return result;
            },
        }
    }
</script>

<style lang="stylus" scoped>
    .view {
        width 100%
    }
    .viewImg{
        display flex
        justify-content center
        align-items center
        width 100%
        min-height 100vh
        background #000000
    }
    .otherType{
        margin-top 50%;
        text-align center;
    }
</style>