/**
* @Description:    上传视频组件
* @Author:         TSY
* @CreateDate:     2018/7/12 16:03
*/
<template>
    <span class="video_body">
        <div v-if="videoImg.length > 0" class="preview_img">
            <i class="iconfont icon-cha" @click="deleteVideoImg"></i>
            <div class="preview_img_div" @click="previewVideo">
                <img class="preview_img_img" :src="videoImg">
            </div>
        </div>
        <label v-else for="upload_video">
            <img class="add_img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACcCAIAAAAF2lUaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU4MTVEQ0YxRDQwNDExRTdBRUZDQjhFQjg5NTcxNzdDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU4MTVEQ0YyRDQwNDExRTdBRUZDQjhFQjg5NTcxNzdDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTgxNURDRUZENDA0MTFFN0FFRkNCOEVCODk1NzE3N0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTgxNURDRjBENDA0MTFFN0FFRkNCOEVCODk1NzE3N0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4OR4r/AAANaklEQVR42uyd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">
        </label>
        <video :src="videoURL" controls="controls" v-show="false" @loadeddata="createVideoIMG"
               ref="videoView"></video>
        <input class="upload_file" id="upload_video" type="file" accept="video/*"
               @change="videoChange" ref="videoInput">
    </span>
</template>

<script>
    import * as api from '../../constant/api'

    export default {
        name: "UploadVideo",
        data() {
            return {
                videoURL: '',//视频url地址
                videoImg: '',//视频预览图
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            videoChange() {//上传视频控件
                let videoFile = this.$refs.videoInput.files;

                //获取视频地址
                if (videoFile && videoFile[0]) {
                    let windowURL = window.URL || window.webkitURL;
                    this.videoURL = windowURL.createObjectURL(videoFile[0]);
                }
                this.uploadVideo(this.$refs.videoInput.files[0]);
            },
            createVideoIMG() {//预览视频截图
                let scale = 0.25,
                    video = this.$refs.videoView,
                    canvas = document.createElement("canvas"),
                    canvasFill = canvas.getContext('2d');
                canvas.width = video.videoWidth * scale;
                canvas.height = video.videoHeight * scale;
                canvasFill.drawImage(video, 0, 0, canvas.width, canvas.height);

                this.videoImg = canvas.toDataURL("image/jpeg");
                this.uploadVideoImg();//上传截图
            },
            deleteVideoImg() {//删除视频
                this.videoImg = '';
            },
            previewVideo() {//播放视频
                this.$router.push({name: 'imageVideoPreview', params: {'videoURL': this.videoURL}});
            },
            uploadVideo(file) {//上传视频
                this.$indicator.open();
                let params = {
                    'filename': file,
                    'webHost': this.user.baseURL
                };
                this.$axiosUpload(api.UPLOAD_VIDEO, params, (res) => {
                    if (res.status == 1) {
                        this.$emit('successVideo', res.url);
                        this.$bottomToast('视频上传成功');
                    } else {
                        this.$bottomToast('视频上传失败')
                    }
                })
            },
            uploadVideoImg(){ //上传视频接图
                let params = {
                    'img': this.videoImg,
                    'webHost': this.user.baseURL
                }
                this.$axios('',api.UPLOAD_DANGER_IMG,params,(res)=>{
                    this.$emit('successImg', res.msg);
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .video_body {
        position relative
    }

    .preview_img {
        display inline-block
        position relative
        width 22%
        margin 1%
    }

    .preview_img_div {
        width 100%
        height 80px
        overflow hidden
    }

    .icon-cha {
        position absolute
        top -15%
        right -15%
        z-index 100
        color main-color
        fontSize(50px)
    }

    .preview_img_img {
        width 150%
    }

    .add_img {
        width 22%
        margin 1%
    }

    .upload_file {
        position absolute
        left -99999px
        top 0
    }
</style>