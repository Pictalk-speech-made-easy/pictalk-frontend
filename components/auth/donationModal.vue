<template>
  <div class="modal-card">
    <header class="modal-card-head"></header>
    <section class="modal-card-body" style="flex-grow: 0; padding: 1rem 2rem;">
      <div class="subtitle">
        <p v-html="$t('DonationText' + textAlt)"></p>
        <br>
        <div class="button-container">
          <b-button class="button customButton" type="is-success" @click="openDonationPage()">
            {{ $t("DonationTextCta" + textAlt) }}
          </b-button>
          <b-button v-if="textAlt == 1 || textAlt == 3" class="button customButton" type="is-info"
            @click="openDonationPage()">
            {{ $t("DonationTextOther") }}
          </b-button>
          <b-button class="button customButton" type="is-danger" @click="$parent.close()">
            {{ $t("DonationTextDecline" + textAlt) }}
          </b-button>
        </div>
        <br>
      </div>
    </section>
    <footer class="modal-card-foot"></footer>
  </div>
</template>
<script>
export default {
  name: "donationModal",
  data() {
    return {
      textAlt: Math.floor(Math.random() * 4) + 1
    };
  },
  methods: {
    openDonationPage() {
      window.open("https://www.helloasso.com/associations/pictalk-speech-made-easy/formulaires/1", "_blank");
    }
  }
};
</script>
<style scoped>
.button-container {
  flex-wrap: wrap;
  display: flex;
  gap: 0.5rem;
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

.customButton {
  font-size: clamp(0.8em, 4vw, 1.15em);
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
  margin: 0 2px;
}

.customButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}
</style>