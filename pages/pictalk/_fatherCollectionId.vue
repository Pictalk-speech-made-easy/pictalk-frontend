<template>
  <div>
    <p>Redirecting</p>
  </div>
</template>
<script>
export default {
  layout: "pictalk",
  mounted() {
    this.$router.push("/pictalk");
  }
}
</script>