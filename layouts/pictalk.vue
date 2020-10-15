<template>
  <div>
    <pictalkNavbar />
    <hr />
    <nuxt />
    <br />
    <CookieControl/>
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
