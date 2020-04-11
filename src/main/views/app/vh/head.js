'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                d_settings: null,
                d_exitprompt: null
            }
        },
        template: `<div class="head">
        <div>
        <span>{{$util.remote.app.name}} {{$util.remote.app.getVersion()}}</span>
        </div>
        <div>
        <i @click="settings" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {
            async settings() {
                this.$parent.dialogInit(
                    {
                        name: '设置',
                        v: 'dialog-settings',
                        r: 'app-head.d_settings',
                        width: 600,
                        height: 500
                    }
                );
            },
            async system(channel) {
                if (channel !== 'closed') this.$util.ipcRenderer.send(channel);
                else {
                    this.$parent.dialogInit(
                        {
                            name: '提示',
                            v: 'dialog-exitprompt',
                            r: 'app-head.d_exitprompt'
                        }
                    );
                }
            }
        },
        watch: {
            d_settings(v) {
                console.log(v.test);
            }
        }
    }
};