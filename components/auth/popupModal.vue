<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("PopupCreateAccount1") }}</p>
    </header>
    <section class="modal-card-body">
      <b-image
					class="center"
            lazy
						:srcset="require('@/assets/create_account_popup.png').srcSet"
						alt="A boy and a girl speaking different languages"
            style="max-width: 300px;"
        ></b-image>
        <b-button id="popupmodal-signup" class="button is-primary center" @click="openSignUpModal()">
        {{ $t("SignUp") }}
      </b-button>
      <br>
        <p class="is-size-5 notification">
						<ol style="list-style-type: inherit;margin-left: 5%;">
              <li>{{ $t('PopupCreateAccountText11')}}</li>
              <li>{{ $t('PopupCreateAccountText21')}}</li>
              <li>{{ $t('PopupCreateAccountText3')}}</li>
              <li>{{ $t('PopupCreateAccountText4')}}</li>
              <li>{{ $t('PopupCreateAccountText5')}}</li>
              <li>{{ $t('PopupCreateAccountText6')}}</li>
						</ol>
					</p>
    </section>
    <footer class="modal-card-foot">
      <div class="container">
      </div>
    </footer>
  </div>
</template>
<script>
import signup from "@/components/auth/signupModal";
export default {
  name: "popupModal",
  methods: {
    openSignUpModal() {
      this.$buefy.modal.open({
        parent: this,
        component: signup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
  },
};
</script>
<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>