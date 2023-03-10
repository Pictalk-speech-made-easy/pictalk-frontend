<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">
        {{ $t("NoVoiceAvailable") }}
      </p>
    </header>
    <section class="modal-card-body">
      <installVoice></installVoice>
    </section>
    <footer class="modal-card-foot">
      <b-button class="button" type="button" @click="$parent.close()">{{
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