<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("PopupCreateAccount") }}</p>
    </header>
    <section class="modal-card-body">
      <div class="subtitle">
        {{ $t("PopupCreateAccountText1")}}
      </div>
      <div class="subtitle">
        {{ $t("PopupCreateAccountText2")}}
      </div>
      <b-button class="button is-primary" @click="openSignUpModal()">
        {{ $t("SignUp") }}
      </b-button>
    </section>
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