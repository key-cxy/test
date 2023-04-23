<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'ZhcgDoc',
  data() {
    return {
      url: 'http://www.iocoder.cn/Zhcg/build-debugger-environment/?zhcg'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
