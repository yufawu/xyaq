/**
* @Description:    上传图片（base64专用）
* @Author:         TSY
* @CreateDate:     2018/7/2 17:36
*/
<template>
    <span class="upload_body">
        <div :key="index" class="preview_img" v-for="(src,index) in uploadImg">
            <i class="iconfont icon-cha" @click="deleteImg(index)"></i>
            <div class="preview_img_div" @click="previewImg(index)">
                <img class="preview_img_img" :src="src">
            </div>
        </div>
        <label for="upload_img" v-if="uploadImg.length<maxLength">
            <img class="add_img" src="../../assets/specialCheck/add_picture.png">
        </label>
        <input class="upload_file" id="upload_img" type="file" :readonly="readonly" :disabled="readonly" accept="image/*"
               @change="imgChange" ref="imgInput">
    </span>
</template>

<script>
    import * as api from '../../constant/api'
    import Exif from 'exif-js'
    import {imgPreview} from '../../utils/util'

    export default {
        name: "UploadImg",
        props: {
            readonly: {
                type: Boolean,
                default: false
            },
            maxLength: {//最大图片数
                type: [Number, String],
                default: 3
            }
        },
        data(){
            return{
                uploadImg: [],//待上传图片地址
                backImg:[],//返回图片路径
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            imgChange() {//监听图片变化
                let imgFile = this.$refs.imgInput.files;

                if (imgFile && imgFile[0]) {
                    //打开loading
                    this.$indicator.open({spinnerType: 'fading-circle'});
                    // 预览图片
                    imgPreview(Exif, imgFile[0], (res) => {
                        this.uploadImg.push(res.data);
                        this.$indicator.close();
                        let params = {
                            'img': res.data,
                            'webHost': this.user.baseURL
                        }
                        this.$axios('',api.UPLOAD_DANGER_IMG,params,(res)=>{
                            this.backImg.push(res.msg)
                            this.$emit('imgChange',this.backImg)
                        })
                    });
                }
            },
            deleteImg(index) {//删除照片
                this.uploadImg.splice(index, 1);
                this.backImg.splice(index, 1);
                this.$emit('imgChange',this.backImg);
            },
            previewImg(index) {//查看大图
                this.$router.push({name: 'imageVideoPreview', params: {'imgURL': this.uploadImg[index]}});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .upload_body{
        position relative
        display flex
    }

    .upload_body label {
        width 22%
        margin 1%
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
        width 100%
    }

    .upload_file {
        position absolute
        left -99999px
        top 0
    }
</style>