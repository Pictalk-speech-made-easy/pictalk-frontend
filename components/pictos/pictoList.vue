<template>
  <div>
    <section>
      <div class="columns is-mobile is-multiline is-centered">
        <picto class="column" v-for="picto in pictos" :key="picto.name" />
      </div>
    </section>
  </div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
  components: {
    picto: picto
  },
  props: {
    pictos: {
      type: Array,
      required: true
    }
  }
};
</script>
