<template>
  <div :dir="dir">
    <div class="hidden-content">
      <h1>
        {{ $t('TitleCompleteKeywords') }}
      </h1>
      <h2>
        {{ $t('DescriptionSEO') }}
      </h2>
    </div>
    <section class="container legacy-home" style="max-width: 768px;">
      <h2 class="legacy-title">{{ $t('HomeLegacyTitle') }}</h2>
      <p class="legacy-deadline">
        {{ $t('BuddyStepAccountDesc') }}. <br>
        {{ $t('BuddyDeadline', { date: deadlineText }) }}
      </p>
      <img class="legacy-image" :srcset="require('@/assets/pictalk_buddy.webp').srcSet"
        sizes="(max-width: 768px) 100vw, 768px" alt="" />
      <buddy-cta />
      <ul class="legacy-points">
        <li>{{ $t('BuddyStepAccountDesc') }}</li>
        <li>{{ $t('HomeLegacyPoint3') }}</li>
        <li>{{ $t('BuddyStepSignIn') }}</li>
      </ul>
      <nuxt-link v-if="$store.getters.isAuthenticated" class="legacy-continue" :to="pictalkHome">
        {{ $t('HomeLegacyContinue', { date: deadlineText }) }}
      </nuxt-link>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import signup from "@/components/auth/buddyMigrationModal";
import BuddyCta from "@/components/auth/buddyCta";
import buddy from "@/mixins/buddy";
export default {
  mixins: [buddy],
  components: {
    signup,
    BuddyCta,
  },
  async created() {
    if (this.directSharerUrlEncoded) {
      this.openSignUpModal();
      return;
    }
    if (this.validationTokenUrlEncoded) {
      try {
        await axios.get(`/auth/validation/${this.validationTokenUrlEncoded}`)
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("VerifiedEmail"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          iconSize: "is-small",
          icon: "mail",
        });
      } catch (err) {
        console.log(err);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("ErrorVerifiedEmail"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "key",
        });
      }
    }
    if (this.$route.query.standalone) {
      if (this.$store.getters.getUser.username) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
        });
      } else {
        this.$router.push({
          path: "/public?fatherCollectionId=284083"
        });
      }
    }
  },
  methods: {
    openSignUpModal() {
      this.$buefy.modal.open({
        parent: this,
        component: signup,
        props: { isNewUser: true },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape"],
      });
    },
  },
  computed: {
    directSharerUrlEncoded() {
      return this.$route.query.directsharer;
    },
    pictalkHome() {
      const rootId = this.$store.getters.getRootId;
      return rootId ? "/pictalk/?fatherCollectionId=" + rootId : "/pictalk/";
    },
    validationTokenUrlEncoded() {
      return this.$route.query.validate;
    },
  },
};
</script>
<style scoped>
.hidden-content {
  display: none;
}

.legacy-home {
  padding: 2rem 1rem 6rem;
}

.legacy-title {
  font-size: clamp(2.25rem, 7vw, 3.5rem);
  line-height: 1.05;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

/* #c62828: brand red darkened for WCAG AA, same as the migration modal */
.legacy-deadline {
  font-style: italic;
  font-size: 1.1rem;
  font-weight: 600;
  color: #c62828;

}

.legacy-transferred {
  color: #257a52;
}

.legacy-deadline svg {
  vertical-align: -0.15em;
  margin-inline-end: 0.25rem;
}

.legacy-image {
  display: block;
  max-height: 420px;
  width: auto;
  max-width: 100%;
  margin: 1.5rem 0;
}

.legacy-points {
  list-style: none;
  margin: 2rem 0 0;
  font-size: 1.1rem;
}

.legacy-points li {
  position: relative;
  padding-inline-start: 2rem;
  margin-bottom: 0.6rem;
}

.legacy-points li::before {
  content: "✓";
  position: absolute;
  inset-inline-start: 0;
  color: #257a52;
  font-weight: 700;
}

.legacy-continue {
  display: inline-block;
  margin-top: 1.5rem;
  color: #595959;
  text-decoration: underline;
}
</style>
