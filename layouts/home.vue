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
import navbar from "@/components/navigation/navbar";
import footerPictalk from "@/components/navigation/footer";
export default {
  components: {
    navbar,
    footerPictalk
  }
};
</script>

