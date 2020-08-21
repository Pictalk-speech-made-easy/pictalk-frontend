<template>
  <div>
    <pictoList :pictos="loadedPictos" />
  </div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
export default {
  components: {
    pictoList: pictoList
  },
  data() {
    return {
      loadedPictos: [
        {
          name: "monNom"
        },
        {
          name: "monNom"
        },
        {
          name: "monNom"
        },
        {
          name: "monNom"
        }
      ]
    };
  }
};
</script>