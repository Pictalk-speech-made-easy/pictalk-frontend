<template>
  <div class="containing">
    <img class="image" style :src="image" crossorigin="anonymous" />
  </div>
</template>

<script>
export default {
  name: "miniPicto",
  props: {
    image: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
.containing {
  display: flex;
  position: relative;
  flex-shrink: 0;
}
.image {
  margin-top: 0;
  max-height: 5.5rem;
  height: 7vh;
}
</style>
