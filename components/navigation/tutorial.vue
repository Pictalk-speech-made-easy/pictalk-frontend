<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <b-button
          class="button"
          type="is-danger"
          icon-left="arrow-left"
          @click="$parent.close()"
        />
        <p align="center" class="modal-card-title">
          {{ $t("TitleTutorial") }}
        </p>
      </header>
      <section class="modal-card-body">
        <b-steps
          v-model="activeStep"
          rounded
          animated
          :has-navigation="false"
          mobile-mode="compact"
          label-position="bottom"
        >
          <b-step-item clickable step="1" clickable>
            <b-image
              lazy
              alt="A little boy talking thanks to Pictalk"
              :srcset="require('@/assets/Tutorial1.jpg').srcSet"
              style="width: 70%; margin-left: 15%"
            ></b-image>
            <p class="is-size-6 notification">
              {{ $t("Tutorial1") }}
            </p>
          </b-step-item>
          <b-step-item step="2" clickable>
            <b-image
              lazy
              alt="A little boy talking thanks to Pictalk"
              :srcset="require('@/assets/Tutorial2.png').srcSet"
              style="width: 70%; margin-left: 15%"
            ></b-image>
            <p class="is-size-6 notification">
              {{ $t("Tutorial2") }}
            </p>
          </b-step-item>
          <b-step-item step="3" clickable>
            <b-image
              lazy
              alt="A little boy talking thanks to Pictalk"
              :srcset="require('@/assets/Tutorial3.png').srcSet"
              style="width: 70%; margin-left: 15%"
            ></b-image>
            <p class="is-size-6 notification">
              {{ $t("Tutorial3") }}
            </p>
          </b-step-item>
          <b-step-item step="4" clickable>
            <b-image
              lazy
              alt="A little boy talking thanks to Pictalk"
              :srcset="require('@/assets/Tutorial4.png').srcSet"
              style="width: 70%; margin-left: 15%"
            ></b-image>
            <p class="is-size-6 notification">
              {{ $t("Tutorial4") }}
            </p>
          </b-step-item>
          <b-step-item step="5" clickable>
            <b-image
              lazy
              alt="A little boy talking thanks to Pictalk"
              :srcset="require('@/assets/Tutorial5.png').srcSet"
              style="width: 70%; margin-left: 15%"
            ></b-image>
            <p class="is-size-6 notification">
              {{ $t("Tutorial5") }}
            </p>
          </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <div class="container">
          <div class="columns is-mobile is-full">
            <div class="column is-one-quarter">
              <b-button
                @click="previousStep()"
                :disabled="activeStep == 0"
                class="button center"
                type="button"
                icon-right="chevron-left"
              />
            </div>
            <div class="column is-half">
              <b-button
                :disabled="activeStep != 4"
                :label="$t('TutorialSkip')"
                expanded
                @click="$parent.close()"
              >
              </b-button>
            </div>
            <div class="column is-one-quarter">
              <b-button
                class="button center"
                type="button"
                :disabled="activeStep == 4"
                @click="nextStep()"
                icon-right="chevron-right"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </form>
</template>
<script>
export default {
  name: "Tutorial",
  data() {
    return {
      activeStep: 0,
    };
  },
  methods: {
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
  },
};
</script>
