/**
* @Description:    文件上传
* @Author:         TSY
* @CreateDate:     2018/9/7 11:35
*/
<template>
    <div>
        <input :disabled="disable" :id="'file'+index" type="file"
               accept="image/*,text/*,*.xlsx,*.csv,*.doc"
               @change="fileChange(index)" :ref="'input'+index">
    </div>
</template>

<script>
    import Exif from 'exif-js'
    import {imgPreview} from "../../utils/util";
    export default {
        name: "UploadFile",
        props: {
            index: {
                type: Number,
                default: 0
            },
            disable: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            fileChange(index) {
                let inputDOM = this.$refs['input' + index];
                let file = inputDOM.files[0];

                if (file) {
                    let fileName = file.name;
                    if (/^image/.test(file.type)) {
                        //图片压缩过程，打开loading
                        this.$indicator.open();
                    }
                    // 预览图片
                    imgPreview(Exif, file, (res) => {
                        let file = res.data;
                        if (res.type == 'outOfSize') {
                            this.$toast('上传文件大小不得大于10M');
                            return;
                        }
                        if (res.type == 'other') {
                            this.$toast('不支持上传该格式的文件');
                            return;
                        }
                        if (res.type == 'image') {
                            this.$indicator.close();
                            file = this.getBlobBydataURI(file, 'image/png')
                        }
                        this.$emit('complete',file, fileName, index, res.type);
                    });
                }
            },
            getBlobBydataURI(dataURI, type) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: type});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    input {
        position absolute
        left -99999px
        top 0
    }
</style>