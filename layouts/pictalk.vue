<template>
  <div>
    <pictalkNavbar />
    <hr />
    <nuxt />
    <br />
  </div>
</template>

<script>
import pictalkNavbar from "@/components/navigation/pictalk-navbar";

export default {
  components: {
    pictalkNavbar
  }
};
</script>
