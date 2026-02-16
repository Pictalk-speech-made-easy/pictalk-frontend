<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle"
        style="height: 100%; display: flex; flex-direction: column; max-width: 36rem !important; margin: 0px auto;">

        <!-- ══════════════════════════════════
             STEP 1 — Reconnaissance
        ══════════════════════════════════ -->
        <div v-if="currentStep === 1" style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="goToDecline()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Pour vous, professionnel·le</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Grâce à Pictalk, vous faites votre travail <span class="red">comme il se doit.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.25rem;">
            Vous avez les compétences. Pictalk vous donne l'outil pour qu'elles s'expriment pleinement — sans friction,
            sans limites techniques.
          </p>

          <div class="quote-block" style="margin-bottom:1.25rem;">
            <p>« Grâce à Pictalk, mon élève a pu dire "j'ai faim" pour la première fois à 12 ans. »</p>
            <cite>— Éducatrice spécialisée, ESAT de Bordeaux</cite>
          </div>

          <div class="comments-wall" ref="commentsWall">
            <div class="comment-item" v-for="(comment, index) in comments" :key="index">
              <div class="comment-header">
                <span class="comment-author">{{ comment.customerName }}</span>
              </div>
              <p class="comment-text">"{{ truncate(comment.comment) }}"</p>
            </div>
          </div>

          <div class="avatars-row" style="margin:1rem 0 1.5rem;">
            <div class="av av-red">M</div>
            <div class="av av-dark">S</div>
            <div class="av av-gray">L</div>
            <div class="av av-purple">A</div>
            <div class="av av-blue">T</div>
            <span class="avatars-label">+2 400 professionnels comme vous</span>
          </div>

          <div style="flex:1;"></div>

          <button class="btn-red" style="margin-bottom:0.75rem;" @click="currentStep = 2">
            Je veux que Pictalk continue →
          </button>
          <button class="btn-ghost" @click="handleRemindLater()">Me rappeler dans 7 jours</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 2 — Le risque
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 2" style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="goToDecline()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Ce que peu de gens savent</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Sans soutien, Pictalk peut <span class="red">disparaître.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.25rem;">
            Pictalk est gratuit depuis le 1er jour. Zéro publicité. Zéro exploitation de vos données.
            Mais les serveurs, les développeurs, les mises à jour — ça coûte.
          </p>

          <div class="campaign-progress card" style="margin-bottom:1.25rem;">
            <div class="card-content">
              <div style="text-align:right; font-size:0.85rem; color:#888; font-style:italic; margin-bottom:0.25rem;">
                {{ daysLeft }}
              </div>
              <div class="progress-header">
                <span class="progress-current">{{ campaign.donationCount }} ({{ Math.round(campaign.progressPercent)
                }}%)</span>
                <span class="progress-target">{{ campaign.currentTarget }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: campaign.progressPercent + '%' }"></div>
              </div>
              <p style="font-size:0.85rem; color:#888; text-align:center; margin-top:0.5rem; font-style:italic;">
                Objectif adhésions 2025
              </p>
            </div>
          </div>

          <div class="risk-card" style="margin-bottom:1.5rem;">
            <p style="font-size:0.9rem; font-weight:700; color:#e5352c; margin-bottom:0.75rem;">Ce qui est en jeu :</p>
            <ul class="check-list">
              <li>La disponibilité 24/7 de l'application</li>
              <li>Les nouvelles fonctionnalités prévues</li>
              <li>Le support aux familles et aux pros</li>
            </ul>
          </div>

          <div style="flex:1;"></div>

          <button class="btn-red" style="margin-bottom:0.75rem;" @click="currentStep = 3">
            Qu'est-ce que je peux faire ?
          </button>
          <button class="btn-ghost" @click="currentStep = 1">← Retour</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 3 — Mission + Outils
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 3" style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="goToDecline()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Ce que vous pouvez faire</p>
          <h1 class="step-title" style="margin-bottom:0.75rem;">
            Votre direction a besoin de vous pour franchir le pas.
          </h1>
          <p class="step-body" style="margin-bottom:1.25rem;">
            Vous ne prenez pas la décision financière — mais vous êtes le meilleur argument. Voici comment ça se passe :
          </p>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <div class="step-pill">
              <div class="step-num">1</div>
              <div class="step-text">
                <strong>Vous partagez les infos</strong>
                Téléchargez le dossier et envoyez-le à votre direction — ça prend 2 minutes.
              </div>
            </div>
            <div class="step-pill">
              <div class="step-num">2</div>
              <div class="step-text">
                <strong>Votre direction découvre les bénéfices</strong>
                1 750€ économisés/an, fonctionnalités pro à venir, modèle associatif loi 1901.
              </div>
            </div>
            <div class="step-pill">
              <div class="step-num">3</div>
              <div class="step-text">
                <strong>L'établissement adhère</strong>
                Vous débloquez le partage, les groupes, et la suite. Et Pictalk continue.
              </div>
            </div>
          </div>

          <div style="flex:1;"></div>

          <button class="btn-red" style="margin-bottom:0.75rem;" @click="downloadSlides()">
            📄 Télécharger le dossier de présentation
          </button>
          <button class="btn-dark" style="margin-bottom:0.75rem;" @click="openCalendly()">
            📅 Réserver 30 min avec l'équipe Pictalk
          </button>
          <button class="btn-ghost" @click="currentStep = 2">← Retour</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 99 — Pourquoi pas ?
             Reached via ✕ from any page
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 99">
          <h1 style="font-size:2rem; color:#1f2937; line-height:1.75rem; margin-top:1rem; text-align:left;">
            {{ $t('why-not-support') }}
          </h1>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button" style="border:solid 2px; border-color:gray;"
              @click="handleReason('prefer-later')">
              Pas le bon moment
            </b-button>
            <b-button class="button reason-button" style="border:solid 2px; border-color:gray;"
              @click="handleReason('direction-decides')">
              Ma direction prend les décisions, pas moi
            </b-button>
            <b-button class="button reason-button" style="border:solid 2px; border-color:gray;"
              @click="handleReason('not_using')">
              {{ $t('i-dont-use-app') }}
            </b-button>
            <b-button class="button reason-button" style="border:solid 2px; border-color:gray;"
              @click="handleReason('other')">
              {{ $t('other-reason-specify') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size:1rem;" type="is-text" @click="currentStep = stepBeforeDecline">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>

        <!-- STEP 100 — Not using: feedback -->
        <div v-else-if="currentStep === 100">
          <h1 style="font-size:2rem; color:#1f2937; line-height:1.75rem; margin-bottom:1rem; text-align:left;">
            {{ $t('whats-wrong') }}
          </h1>
          <p style="font-size:1rem; color:#666; margin-bottom:1.5rem; text-align:left;">
            {{ $t('your-feedback-helps') }}
          </p>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('missing-features') ? 'border:solid 2px; border-color:#E86C4F; background:rgba(232,108,79,0.1);' : 'border:solid 2px; border-color:gray;'"
              @click="toggleDontUseReason('missing-features')">
              {{ $t('missing-important-features') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('too-many-bugs') ? 'border:solid 2px; border-color:#E86C4F; background:rgba(232,108,79,0.1);' : 'border:solid 2px; border-color:gray;'"
              @click="toggleDontUseReason('too-many-bugs')">
              {{ $t('too-many-bugs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('not-my-needs') ? 'border:solid 2px; border-color:#E86C4F; background:rgba(232,108,79,0.1);' : 'border:solid 2px; border-color:gray;'"
              @click="toggleDontUseReason('not-my-needs')">
              {{ $t('not-my-needs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('other-dont-use') ? 'border:solid 2px; border-color:#E86C4F; background:rgba(232,108,79,0.1);' : 'border:solid 2px; border-color:gray;'"
              @click="toggleDontUseReason('other-dont-use')">
              {{ $t('other-reason-specify') }}
            </b-button>
          </div>
          <br>
          <div v-if="selectedDontUseReasons.length > 0" style="margin-top:1rem;">
            <p style="font-size:1rem; color:#333; margin-bottom:0.5rem; text-align:left; font-weight:600;">
              {{ $t('what-should-we-change') }}
            </p>
            <b-field>
              <b-input v-model="dontUseComment" type="textarea" :placeholder="$t('your-feedback-placeholder')" rows="4"
                style="border-radius:12px;"></b-input>
            </b-field>
            <b-button class="button step-button" style="background:#E86C4F; color:white; margin-top:1rem;"
              @click="submitDontUseFeedback" :loading="loading">
              {{ $t('Send') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size:1rem;" type="is-text" @click="currentStep = 99">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>

        <!-- STEP 101 — Other reason: free text -->
        <div v-else-if="currentStep === 101">
          <h1 style="font-size:2rem; color:#1f2937; line-height:1.75rem; margin-bottom:1rem; text-align:left;">
            {{ $t('explain-to-us') }}
          </h1>
          <p style="font-size:1rem; color:#666; margin-bottom:1.5rem; text-align:left;">
            {{ $t('what-prevents-contribution') }}
          </p>
          <br>
          <b-field>
            <b-input v-model="otherReasonComment" type="textarea" :placeholder="$t('your-feedback-placeholder')"
              rows="5" style="border-radius:12px;"></b-input>
          </b-field>
          <p style="font-size:0.9rem; color:#666; margin-top:0.5rem; text-align:left;">
            💡 {{ $t('feedback-helps-financing') }}
          </p>
          <br>
          <b-button class="button step-button" style="background:#E86C4F; color:white; margin-top:1rem;"
            @click="submitOtherReasonFeedback" :loading="loading">
            {{ $t('Send') }}
          </b-button>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size:1rem;" type="is-text" @click="currentStep = 99">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "membershipModal",
  props: {
    campaign: {
      type: Object,
      required: true
      // { donationCount, progressPercent, currentTarget, levelDeadline }
    }
  },
  data() {
    return {
      comments: [],
      autoScrollInterval: null,
      currentStep: 1,
      stepBeforeDecline: 1,
      loading: false,
      // decline flow
      selectedDontUseReasons: [],
      dontUseComment: "",
      otherReasonComment: ""
    };
  },

  computed: {
    daysLeft() {
      const today = new Date();
      const endDate = new Date(this.campaign.levelDeadline);
      const timeDiff = endDate - today;
      if (timeDiff <= 0) return this.$t("campaign-ended");
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return this.$t("campaign-days-left").replace("{days}", days);
    }
  },

  beforeDestroy() {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  },

  async mounted() {
    this.$posthog?.capture("membership-modal-shown");
    this.donationPromptShown();
    await this.getComments();
    this.startAutoScroll();
  },

  methods: {
    // ── Shared with original modal ──────────────────

    truncate(text) {
      if (!text) return "";
      if (text.length <= 300) return text;
      return text.substring(0, 300) + "...";
    },

    startAutoScroll() {
      if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = setInterval(() => {
        const container = this.$refs.commentsWall;
        if (container) {
          const itemHeight = container.querySelector(".comment-item")?.offsetHeight || 100;
          if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
            container.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            container.scrollBy({ top: itemHeight, behavior: "smooth" });
          }
        }
      }, 5000);
    },

    async getComments() {
      try {
        const res = await axios.get("https://donations-api.pictalk.org/v1/donations/comments");
        this.comments = res.data.comments;
      } catch (error) {
        console.log("error", error);
      }
    },

    async donationPromptShown() {
      try {
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/shown`
        );
      } catch (error) {
        console.log("error", error);
      }
    },

    // ── Navigation ──────────────────────────────────

    goToDecline() {
      this.stepBeforeDecline = this.currentStep;
      this.selectedDontUseReasons = [];
      this.dontUseComment = "";
      this.otherReasonComment = "";
      this.currentStep = 99;
    },

    // ── Snooze: reuse donation-prompt/shown on reopen ──

    async handleRemindLater() {
      this.$posthog?.capture("membership-modal-remind-later");
      try {
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: "remind-later" }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.$parent.close();
    },

    // ── Decline reasons ─────────────────────────────

    async handleReason(reason) {
      this.$posthog?.capture(`membership-no-support-${reason}`);

      if (reason === "not_using") {
        this.currentStep = 100;
        return;
      }
      if (reason === "other") {
        this.currentStep = 101;
        return;
      }

      // prefer-later, direction-decides: just decline + close
      try {
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.$parent.close();
    },

    toggleDontUseReason(reason) {
      if (this.selectedDontUseReasons.includes(reason)) {
        this.selectedDontUseReasons = this.selectedDontUseReasons.filter(r => r !== reason);
      } else {
        this.selectedDontUseReasons.push(reason);
      }
    },

    async submitDontUseFeedback() {
      if (!this.selectedDontUseReasons || this.selectedDontUseReasons.length === 0) return;
      try {
        this.loading = true;
        this.$posthog?.capture(`membership-not-using-${this.selectedDontUseReasons.join(",")}`);
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          {
            reason: "not_using",
            metadata: {
              locale: this.$i18n.locale,
              issues: this.selectedDontUseReasons
            },
            comment: this.dontUseComment
          }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },

    async submitOtherReasonFeedback() {
      if (!this.otherReasonComment || this.otherReasonComment.trim() === "") return;
      try {
        this.loading = true;
        this.$posthog?.capture("membership-other-reason");
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: "other", comment: this.otherReasonComment }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },

    // ── CTAs ────────────────────────────────────────

    downloadSlides() {
      this.$posthog?.capture("membership-slides-downloaded");
      window.open("https://pictalk.org/membership-slides.pdf", "_blank");
      this.$parent.close();
    },

    openCalendly() {
      this.$posthog?.capture("membership-calendly-clicked");
      window.open("https://calendly.com/pictalk/adhesion", "_blank");
      this.$parent.close();
    }
  }
};
</script>

<style scoped>
.modal-card-body {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

@media (max-width: 600px) {
  .modal-card-body {
    min-height: 70vh;
    padding: 1rem;
  }
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f2f2f2;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #e5352c;
}

.step-title {
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.5px;
  color: #0d0d0d;
  text-align: left;
  margin: 0;
}

.step-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  text-align: left;
  margin: 0;
}

.red {
  color: #e5352c;
}

/* Comments wall — same as donation modal */
.comments-wall {
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.comments-wall::-webkit-scrollbar {
  width: 6px;
}

.comments-wall::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, .2);
  border-radius: 3px;
}

.comment-item {
  scroll-snap-align: start;
  margin-bottom: 0.6rem;
  background: #f5f5f5;
  padding: 0.65rem 0.875rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: left;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.comment-author {
  font-weight: 700;
  font-size: 0.8rem;
  color: #333;
}

.comment-text {
  color: #4b5563;
  font-style: italic;
  margin: 0;
  font-size: 0.875rem;
}

.quote-block {
  border-left: 3px solid #e5352c;
  padding: 0.75rem 1rem;
  background: #fafafa;
  border-radius: 0 12px 12px 0;
}

.quote-block p {
  font-size: 0.9rem;
  font-style: italic;
  color: #333;
  line-height: 1.55;
  margin: 0;
  text-align: left;
}

.quote-block cite {
  font-size: 0.75rem;
  color: #aaa;
  font-style: normal;
  margin-top: 0.4rem;
  display: block;
}

.avatars-row {
  display: flex;
  align-items: center;
}

.av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.av:first-child {
  margin-left: 0;
}

.av-red {
  background: #e5352c;
}

.av-dark {
  background: #0d0d0d;
}

.av-gray {
  background: #888;
}

.av-purple {
  background: #7c3aed;
}

.av-blue {
  background: #0891b2;
}

.avatars-label {
  font-size: 0.8rem;
  color: #666;
  margin-left: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: #171717;
}

.progress-bar-container {
  width: 100%;
  height: 32px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #ff5757;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.risk-card {
  border: 1.5px solid #ffd5d3;
  background: #fff9f9;
  border-radius: 14px;
  padding: 1rem;
}

.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.check-list li {
  display: flex;
  gap: 0.625rem;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #333;
}

.check-list li::before {
  content: "✓";
  color: #e5352c;
  font-weight: 900;
  flex-shrink: 0;
}

.step-pill {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  padding: 0.75rem;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.step-num {
  width: 24px;
  height: 24px;
  background: #e5352c;
  color: #fff;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.875rem;
  line-height: 1.45;
  color: #333;
  text-align: left;
}

.step-text strong {
  color: #0d0d0d;
  display: block;
  margin-bottom: 0.125rem;
  font-size: 0.9rem;
}

/* Decline buttons — same pattern as family modal */
.reason-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.reason-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.2s ease;
  white-space: normal;
  height: auto;
  word-break: break-word;
}

.reason-button:hover {
  border-color: #e5352c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 53, 44, 0.15);
}

.bottom-link {
  text-align: center;
  margin-top: 1.5rem;
}

.bottom-link .button {
  color: #666;
  text-decoration: underline;
  font-size: 0.9rem;
}

.step-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
}

.btn-red {
  display: block;
  width: 100%;
  background: #e5352c;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 1.1rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  line-height: 1.3;
}

.btn-dark {
  display: block;
  width: 100%;
  background: #0d0d0d;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 1.1rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  line-height: 1.3;
}

.btn-ghost {
  display: block;
  width: 100%;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #aaa;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  text-align: center;
  padding: 0.625rem;
}

.card {
  border: 1.5px solid #ebebeb;
  border-radius: 16px;
}

.card-content {
  padding: 1rem;
}
</style>