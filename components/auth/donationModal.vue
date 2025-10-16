<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">{{ $t("DonationTitle") }}</p>
    </header>
    <section class="modal-card-body" style="flex-grow: 0; padding: 4rem 2rem;">
      <div class="subtitle">
        <p v-html="$t('DonationText')"></p>
        <br>
        <div class="button-container">
          <b-button class="button" type="is-primary" @click="openDonationPage()">
            {{ $t("MakeADonation") }}
          </b-button>
        </div>
        <br>
      </div>
    </section>
    <footer class="modal-card-foot">

    </footer>
  </div>
</template>
<script>
export default {
  name: "donationModal",
  methods: {
    openDonationPage() {
      window.open("https://www.helloasso.com/associations/pictalk-speech-made-easy/formulaires/1", "_blank");
    }
  }
};
</script>
<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

div.media-content {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.scrollableDiv {
  border: solid;
  border-width: 1px;
  border-color: #00000040;
  background-color: #f5f5f5;
  max-height: 20vh;
  overflow: scroll;
}

.headers {
  margin-bottom: 0.5rem;
  padding: 0.4rem;
}

.leftAlign {
  display: inline-block;
}

.centerImage {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marginAuto {
  margin: auto;
  display: block;
}
</style>