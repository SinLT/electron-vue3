<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div>当前文件路径: {{ getExternPath("t.txt") }}</div>
      <button @click="toAbout">关于</button>
      <button @click="test">弹个框</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, watch} from "vue";
import Head from "../components/Head.vue";
import {argsState, messageData} from "@/renderer/store";
import {createWindow} from "@/renderer/utils/ipc";
import {getExternPath} from "@/lib";

export default defineComponent({
  components: {
    Head
  },
  name: "Home",
  setup() {
    const args = argsState();
    let watchTest = watch(() => messageData["test"], (n, o) => { // n 为新赋值 o为旧值
      console.log(n, o)
    });
    const test = () => {
      createWindow({
        route: "/message",
        parentId: args.id,
        data: {text: "key不能为空"},
      });
    }
    const toAbout = () => {
      createWindow({
        route: "/about",
        width: 300,
        height: 300,
        isMainWin: true
      });
    }

    onMounted(async () => {
    })

    onUnmounted(() => {
      watchTest()
    })

    return {
      getExternPath,
      test,
      toAbout
    }
  }
});
</script>

<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;
}
</style>
