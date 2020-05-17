<template>
  <div>
    <navbar />
    <hr />
    <nuxt />
    <hr />
    <footerPictalk />
  </div>
</template>

<script>
import navbar from "@/components/navbar";
import footerPictalk from "@/components/footer";
export default {
  components: {
    navbar,
    footerPictalk
  }
};
</script>

