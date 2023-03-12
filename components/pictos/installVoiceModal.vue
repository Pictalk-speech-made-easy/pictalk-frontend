<template>
  <div data-cy="cypress-installVoiceModal" class="modal-card">
    <section class="modal-card-body rounded-top">
      <installVoice style="padding: 2em"></installVoice>
    </section>
    <footer class="modal-card-foot">
      <b-button data-cy="cypress-installVoiceModal-close" class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
    </footer>
  </div>
</template>
<script>
import installVoice from "@/components/pictos/installVoice";
export default {
  name: "installOtherBrowserModal",
  components: {installVoice}
};
</script>
<style scoped>
.rounded-top{
  border-radius: 6px 6px 0 0;
}
</style>