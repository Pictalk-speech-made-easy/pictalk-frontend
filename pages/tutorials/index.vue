<template>
  <div
    style="
      max-width: 960px;
      display: block;
      margin-right: auto;
      margin-left: auto;
      padding: 1vmax;
    "
  >
    <p style="text-align: center">
      <b class="is-size-4">
        {{ $t("TutorialTitle1") }}
      </b>
    </p>
    <div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial1") }}
      </p>
      <div style="display: flex; justify-content: center">
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/eat.png').srcSet"
          alt="pictogram of a someone eating"
          style="aspect-ratio: 1/1; width: 50%; max-width: 300px"
        ></b-image>
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/fries.png').srcSet"
          alt="pictogram of french fries"
          style="aspect-ratio: 1/1; width: 50%; max-width: 300px"
          >{{ $t("Pictogram") }}</b-image
        >
      </div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial2") }} {{ $t("Tutorial3") }}
      </p>
      <b-image
        class="image"
        lazy
        :srcset="require('@/assets/tree.png').srcSet"
        alt="image of a pictogram sentence"
        style="aspect-ratio: 1131/558"
      ></b-image>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial4") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="Navigation in the Pictalk app"
          :src="require('@/static/1navigation.mp4')"
        ></video>
      </div>
      <hr />

      <p class="text is-size-5 notification">
        {{ $t("Tutorial5") }}
      </p>
      <b-image
        class="image"
        lazy
        :srcset="require('@/assets/pictoBar.png').srcSet"
        alt="image of a pictogram sentence"
        style="aspect-ratio: 563/94; max-height: 10vh"
      ></b-image>
      <p class="text is-size-5 notification">
        <b-button
          type="is-success"
          icon-right="volume-high"
          style="width: 2rem; height: 2rem"
        ></b-button>
        {{ $t("Tutorial6") }}
      </p>
      <p class="text is-size-5 notification">
        <b-button
          type="is-info"
          icon-right="content-copy"
          style="width: 2rem; height: 2rem"
        ></b-button>
        {{ $t("Tutorial7") }}
      </p>
      <p class="text is-size-5 notification">
        <b-button
          class="buttonBorder"
          inverted
          type="is-danger"
          icon-right="backspace"
          style="width: 2rem; height: 2rem"
        ></b-button>
        {{ $t("Tutorial8") }}
      </p>
      <p class="text is-size-5 notification">
        <b-button
          class="buttonBorder"
          inverted
          type="is-danger"
          icon-right="delete"
          style="width: 2rem; height: 2rem"
        ></b-button>
        {{ $t("Tutorial9") }}
      </p>
      <hr />
      <p class="text is-size-5 notification">
        {{ $t("Tutorial10") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="Going into admin mode in the Pictalk application"
          :src="require('@/static/2admin.mp4')"
        ></video>
      </div>
      <div
        class="video-wrapper"
        style="height: 54px; margin-top: 2vh; background-color: #f5f5f5"
      >
        <div class="columns is-mobile margins">
          <div class="column noPadding">
            <b-button class="addButton" type="is-success" icon-right="image" />
          </div>
          <div class="column noPadding">
            <b-button
              class="addButton"
              type="is-primary"
              icon-right="folder-table"
            />
          </div>
        </div>
      </div>
      <p class="text is-size-5 notification" style="margin-top: 0px">
        {{ $t("Tutorial11") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/3creation.mp4')"
        ></video>
      </div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial12") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/4edit.mp4')"
        ></video>
      </div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial13") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/5delete.mp4')"
        ></video>
      </div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial14") }}
      </p>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/6star.mp4')"
        ></video>
      </div>
    </div>
    <hr />

    <b-button
      class="endButton"
      type="is-success"
      :label="$t('TutorialSkip')"
      @click="toPictalk()"
    >
    </b-button>
  </div>
</template>
<script >
export default {
  name: "Tutorial",
  data() {
    return {
      activeStep: 0,
    };
  },
  methods: {
    toPictalk() {
      this.$router.push({
        path: "/pictalk/",
      });
    },
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
  },
};
</script>
<style scoped>
.endButton {
  bottom: 1%;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 70vw;
  min-width: 230px;
  max-width: 768px;
  border-radius: 7px;
  -webkit-box-shadow: 2px 2px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.video {
  max-width: 676px;
  max-height: 75vh;
  aspect-ratio: 676/900;
}
.video-wrapper {
  display: flex;
  justify-content: center;
}
.text {
  min-width: 280px;
  margin-top: 2vh;
  margin-bottom: 2px;
  padding: 1vmax;
}
.image {
  min-width: 140px;
}
.buttonBorder {
  border: solid;
  border-color: #f14668;
  border-width: 1px;
}
.noPadding {
  padding: 0%;
}
.addButton {
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  height: 100%;
  width: 95%;
}
.margins {
  width: 50vw;
  min-width: 130px;
  max-width: 260px;
  margin-left: 1vw;
  margin-right: 1vw;
  margin-top: 5px;
  height: 44px;
}
</style>