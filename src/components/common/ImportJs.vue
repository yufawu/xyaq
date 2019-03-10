/**
* @Description:    导入远程/外部JS文件
* @Author:         TSY
* @CreateDate:     2018/10/17 10:42
*/
<template>
    <remote-js :src="this.jsUrl" @load-js-finish="this.jsLoadCallBack"></remote-js>
</template>

<script>
    export default {
        components: {
            'remote-js': {
                render (createElement) {
                    var self = this
                    return createElement('script', {
                        attrs: { type: 'text/javascript', src: this.src },
                        on: {
                            load: function () {
                                self.$emit('load-js-finish')
                            }
                        }
                    })
                },
                props: {
                    src: { type: String, required: true }
                }
            }
        },
        props: {
            jsUrl: { type: String, required: true },// 需要加载的外部url
            jsLoadCallBack: Function// 外部js加载完成回调
        }
    }
</script>