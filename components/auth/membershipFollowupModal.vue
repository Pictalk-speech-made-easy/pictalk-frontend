<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle"
        style="height:100%; display:flex; flex-direction:column; max-width:36rem !important; margin:0px auto;">

        <!-- ══════════════════════════════════
             STEP 1 — Suivi slides
        ══════════════════════════════════ -->
        <div v-if="currentStep === 1" style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Suite de la semaine dernière</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Avez-vous pu en parler à <span class="red">votre direction ?</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            Il y a quelques jours, vous avez téléchargé le dossier de présentation Pictalk. On voulait juste prendre des
            nouvelles.
          </p>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <button :class="['followup-btn', { selected: followupAnswer === 'not_yet' }]"
              @click="followupAnswer = 'not_yet'">
              <span class="followup-icon">⏳</span>
              <div class="followup-text">
                <strong>Pas encore transmis</strong>
                <span>Je n'ai pas encore eu l'occasion.</span>
              </div>
            </button>
            <button :class="['followup-btn', { selected: followupAnswer === 'sent' }]" @click="followupAnswer = 'sent'">
              <span class="followup-icon">📨</span>
              <div class="followup-text">
                <strong>J'ai transmis les slides</strong>
                <span>En attente d'une réponse.</span>
              </div>
            </button>
            <button :class="['followup-btn', { selected: followupAnswer === 'responded' }]"
              @click="followupAnswer = 'responded'">
              <span class="followup-icon">💬</span>
              <div class="followup-text">
                <strong>Ma direction a répondu</strong>
                <span>On en a discuté.</span>
              </div>
            </button>
            <button :class="['followup-btn', { selected: followupAnswer === 'joined' }]"
              @click="followupAnswer = 'joined'">
              <span class="followup-icon">🎉</span>
              <div class="followup-text">
                <strong>Mon établissement a adhéré !</strong>
                <span>C'est fait.</span>
              </div>
            </button>
          </div>

          <div style="flex:1;"></div>

          <button class="btn-red" style="margin-bottom:0.75rem;" :disabled="!followupAnswer" @click="submitFollowup()">
            Continuer →
          </button>
          <button class="btn-ghost" @click="$parent.close()">Pas maintenant</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 2a — not_yet: encouragement + re-download
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 2 && followupAnswer === 'not_yet'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Pas de pression</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Quand vous serez prêt·e, <span class="red">tout est là.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            Le dossier est prêt à envoyer à votre direction. Ça prend 2 minutes — quand le moment se présente.
          </p>

          <div class="reminder-card" style="margin-bottom:1.5rem;">
            <p
              style="font-size:0.85rem; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:.8px; margin-bottom:0.75rem;">
              Le dossier contient</p>
            <div class="feat-row"><span class="feat-name">Les 1 750€ économisés / an</span><span
                class="feat-ok">✓</span></div>
            <div class="feat-row"><span class="feat-name">Le modèle associatif loi 1901</span><span
                class="feat-ok">✓</span></div>
            <div class="feat-row"><span class="feat-name">Les fonctionnalités pros à venir</span><span
                class="feat-soon">→ Bientôt</span></div>
            <div class="feat-row" style="border:none;"><span class="feat-name">Les modalités d'adhésion</span><span
                class="feat-ok">✓</span></div>
          </div>

          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" @click="downloadSlides()">
            📄 Retélécharger le dossier
          </button>
          <button class="btn-ghost" @click="$parent.close()">Je le ferai plus tard</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 2b — sent: encourage + offer calendly
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 2 && followupAnswer === 'sent'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Bien joué</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Vous avez fait le <span class="red">premier pas.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            C'est souvent la partie la plus difficile. Si votre direction a des questions, on peut intervenir
            directement — un appel de 30 min suffit pour tout régler.
          </p>

          <div class="quote-block" style="margin-bottom:1.5rem;">
            <p>« Ma directrice avait des questions sur le budget. L'équipe Pictalk a répondu à tout en 20 minutes. »</p>
            <cite>— Orthophoniste, SESSAD de Lyon</cite>
          </div>

          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" @click="openCalendly()">
            📅 Réserver 30 min avec l'équipe Pictalk
          </button>
          <button class="btn-ghost" @click="$parent.close()">On attend sa réponse d'abord</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 2c — responded: find out what happened
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 2 && followupAnswer === 'responded'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Qu'est-ce qu'elle a dit ?</p>
          <h1 class="step-title" style="margin-bottom:1.25rem;">
            La réponse de votre direction.
          </h1>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <button :class="['followup-btn', { selected: directionResponse === 'positive' }]"
              @click="directionResponse = 'positive'">
              <span class="followup-icon">👍</span>
              <div class="followup-text">
                <strong>Réponse positive</strong>
                <span>Elle est intéressée ou prête à aller plus loin.</span>
              </div>
            </button>
            <button :class="['followup-btn', { selected: directionResponse === 'hesitant' }]"
              @click="directionResponse = 'hesitant'">
              <span class="followup-icon">🤔</span>
              <div class="followup-text">
                <strong>Elle hésite</strong>
                <span>Elle a des questions ou des doutes.</span>
              </div>
            </button>
            <button :class="['followup-btn', { selected: directionResponse === 'negative' }]"
              @click="directionResponse = 'negative'">
              <span class="followup-icon">👎</span>
              <div class="followup-text">
                <strong>Réponse négative</strong>
                <span>Ce n'est pas possible pour l'instant.</span>
              </div>
            </button>
          </div>

          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" :disabled="!directionResponse"
            @click="submitDirectionResponse()">
            Continuer →
          </button>
          <button class="btn-ghost" @click="$parent.close()">Pas maintenant</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 3c-positive — direction is on board
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 3 && directionResponse === 'positive'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">Excellent</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Plus qu'un appel pour <span class="red">finaliser.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            On prend 30 minutes avec vous et votre direction pour répondre à toutes les questions et configurer
            l'adhésion.
          </p>
          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" @click="openCalendly()">
            📅 Réserver 30 min avec l'équipe Pictalk
          </button>
          <button class="btn-ghost" @click="$parent.close()">Je transmets le lien moi-même</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 3c-hesitant — direction has doubts
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 3 && directionResponse === 'hesitant'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">On peut aider</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Les doutes, c'est <span class="red">notre spécialité.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            Budget, modèle associatif, questions techniques — on a répondu à tout ça des dizaines de fois. Un appel
            suffit pour lever les hésitations.
          </p>
          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" @click="openCalendly()">
            📅 Réserver un appel avec votre direction
          </button>
          <button class="btn-ghost" @click="$parent.close()">Je gère ça de mon côté</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 3c-negative — direction said no
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 3 && directionResponse === 'negative'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <p class="eyebrow" style="margin-bottom:0.5rem;">On comprend</p>
          <h1 class="step-title" style="margin-bottom:1rem;">
            Merci d'avoir essayé. <span class="red">Vraiment.</span>
          </h1>
          <p class="step-body" style="margin-bottom:1.5rem;">
            Pictalk reste disponible pour vous et vos patients. Si la situation change, revenez quand vous voulez.
          </p>

          <!-- Feedback: why did they say no -->
          <div class="risk-card" style="margin-bottom:1.25rem;">
            <p style="font-size:0.85rem; font-weight:700; color:#e5352c; margin-bottom:0.5rem;">Vous savez pourquoi ?
              (facultatif)</p>
            <b-field>
              <b-input v-model="negativeComment" type="textarea"
                placeholder="Budget, priorités différentes, autre chose..." rows="3"
                style="border-radius:10px;"></b-input>
            </b-field>
          </div>

          <div style="flex:1;"></div>
          <button class="btn-red" style="margin-bottom:0.75rem;" @click="submitNegativeFeedback()">
            Envoyer et fermer
          </button>
          <button class="btn-ghost" @click="$parent.close()">Fermer sans envoyer</button>
        </div>

        <!-- ══════════════════════════════════
             STEP 2d — joined: celebration
        ══════════════════════════════════ -->
        <div v-else-if="currentStep === 2 && followupAnswer === 'joined'"
          style="width:100%; height:100%; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:0.5rem;">
            <button class="close-btn" @click="$parent.close()">✕</button>
          </div>

          <div style="text-align:center; padding:2rem 0 1.5rem;">
            <div style="font-size:52px; margin-bottom:1rem;">🎉</div>
            <p class="eyebrow" style="text-align:center; margin-bottom:0.75rem;">Merci</p>
            <h1 class="step-title" style="text-align:center; font-size:1.6rem; margin-bottom:1rem;">
              Votre établissement fait partie <span class="red">de l'aventure.</span>
            </h1>
            <p class="step-body" style="text-align:center;">
              Grâce à vous, Pictalk continue. Les fonctionnalités professionnelles vous seront accessibles en
              avant-première.
            </p>
          </div>

          <div class="avatars-row" style="justify-content:center; margin-bottom:1.5rem;">
            <div class="av av-red">M</div>
            <div class="av av-dark">S</div>
            <div class="av av-gray">L</div>
            <div class="av av-purple">A</div>
            <div class="av av-blue">T</div>
            <span class="avatars-label">Vous rejoignez 18 établissements</span>
          </div>

          <div style="flex:1;"></div>
          <button class="btn-red" @click="$parent.close()">
            Parfait, retour à l'application
          </button>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "membershipFollowupModal",

  data() {
    return {
      currentStep: 1,
      loading: false,
      followupAnswer: null,    // not_yet | sent | responded | joined
      directionResponse: null, // positive | hesitant | negative
      negativeComment: ""
    };
  },

  mounted() {
    this.$posthog?.capture("membership-followup-modal-shown");
    this.donationPromptShown();
  },

  methods: {
    async donationPromptShown() {
      try {
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/shown`
        );
      } catch (error) {
        console.log("error", error);
      }
    },

    async submitFollowup() {
      if (!this.followupAnswer) return;
      try {
        this.$posthog?.capture(`membership-followup-${this.followupAnswer}`);
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: `followup-${this.followupAnswer}` }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.currentStep = 2;
    },

    async submitDirectionResponse() {
      if (!this.directionResponse) return;
      try {
        this.$posthog?.capture(`membership-direction-response-${this.directionResponse}`);
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: `direction-${this.directionResponse}` }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.currentStep = 3;
    },

    async submitNegativeFeedback() {
      try {
        this.loading = true;
        this.$posthog?.capture("membership-direction-negative-feedback");
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: "direction-negative", comment: this.negativeComment }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },

    downloadSlides() {
      this.$posthog?.capture("membership-followup-slides-downloaded");
      window.open("https://pictalk.org/membership-slides.pdf", "_blank");
      this.$parent.close();
    },

    openCalendly() {
      this.$posthog?.capture("membership-followup-calendly-clicked");
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

.followup-btn {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #fff;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all .15s;
}

.followup-btn:hover {
  border-color: #ccc;
}

.followup-btn.selected {
  border-color: #e5352c;
  background: #fff9f9;
}

.followup-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.followup-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.followup-text strong {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0d0d0d;
}

.followup-text span {
  font-size: 0.8rem;
  color: #888;
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

.reminder-card {
  border: 1.5px solid #ebebeb;
  border-radius: 14px;
  padding: 1rem;
}

.feat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.feat-name {
  font-size: 0.875rem;
  color: #333;
}

.feat-ok {
  font-size: 0.75rem;
  font-weight: 700;
  color: #22c55e;
}

.feat-soon {
  font-size: 0.75rem;
  font-weight: 700;
  color: #e5352c;
}

.risk-card {
  border: 1.5px solid #ffd5d3;
  background: #fff9f9;
  border-radius: 14px;
  padding: 1rem;
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

.btn-red:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
</style>