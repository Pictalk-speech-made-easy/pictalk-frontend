<template>
  <div class="containing pops-up">
    <div class="numberContainer">
      <img class="image" style :src="image" crossorigin="anonymous" />
      <div v-if="pictoCount > 1" class="centeredText">
        {{ pictoCount }}
      </div>
    </div>
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
    pictoCount: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style scoped>
.pops-up {
  animation-name: pop;
  animation-duration: 125ms;
  animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes pop {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.containing {
  display: flex;
  position: relative;
  flex-shrink: 0;
}
.numberContainer {
  text-align: center;
  color: rgb(255, 0, 0);
}
.centeredText {
  position: absolute;
  bottom: 8px;
  right: 16px;
}
.image {
  margin-top: 0;
  max-height: 5.5rem;
  min-height: 2.9rem;
  height: 7vh;
}
</style>
