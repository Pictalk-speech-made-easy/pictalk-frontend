<template>
  <div style="display: flex">
    <div class="hiddenMobile">
      <br />
      <a href="#basics"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle1") }}</b></a
      >
      <hr style="margin: 4px" />
      <a href="#fundamentals"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle2") }}</b></a
      >
      <a href="#speechbar"
        ><p class="is-size-6 darker">{{ $t("TutorialRef1") }}</p></a
      >
      <a href="#action_menu"
        ><p class="is-size-6 darker">{{ $t("TutorialRef2") }}</p></a
      >
      <a href="#create"
        ><p class="is-size-6 darker">{{ $t("TutorialRef3") }}</p></a
      >
      <a href="#edit"
        ><p class="is-size-6 darker">{{ $t("TutorialRef4") }}</p></a
      >
      <a href="#delete"
        ><p class="is-size-6 darker">{{ $t("TutorialRef5") }}</p></a
      >
      <a href="#star"
        ><p class="is-size-6 darker">{{ $t("TutorialRef6") }}</p></a
      >
      <hr style="margin: 4px" />
      <a href="#advanced"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle3") }}</b></a
      >
      <a href="#linked_duplicate"
        ><p class="is-size-6 darker">{{ $t("TutorialRef7") }}</p></a
      >
      <a href="#distinct_copy"
        ><p class="is-size-6 darker">{{ $t("TutorialRef8") }}</p></a
      >
      <a href="#image_options"
        ><p class="is-size-6 darker">{{ $t("TutorialRef9") }}</p></a
      >
      <hr style="margin: 4px" />
      <a href="#sharing"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle4") }}</b></a
      >
      <a href="#create_group"
        ><p class="is-size-6 darker">{{ $t("TutorialRef10") }}</p></a
      >
      <a href="#share_group"
        ><p class="is-size-6 darker">{{ $t("TutorialRef11") }}</p></a
      >
      <hr style="margin: 4px" />
      <a href="#application_settings"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle5") }}</b></a
      >
      <a href="#voices"
        ><p class="is-size-6 darker">{{ $t("TutorialRef12") }}</p></a
      >
      <hr style="margin: 4px" />
      <a href="#offline"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle6") }}</b></a
      >
      <hr style="margin: 4px" />
      <a href="#public"
        ><b class="is-size-6 contrast">{{ $t("TutorialTitle7") }}</b></a
      >
      <hr style="margin: 4px" />
    </div>
    <div
      style="
        width: 100vw;
        max-width: 960px;
        display: block;
        margin-right: auto;
        margin-left: auto;
        padding: 1vmax;
      "
    >
      <p style="text-align: center" id="basics">
        <b class="is-size-4">
          {{ $t("TutorialTitle1") }}
        </b>
      </p>

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
      <p style="text-align: center" id="fundamentals">
        <b class="is-size-4">
          {{ $t("TutorialTitle2") }}
        </b>
      </p>
      <div id="speechbar">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial5") }}
        </p>
      </div>
      <div class="video-wrapper">
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/pictobar.png').srcSet"
          alt="image of a pictogram sentence"
          style="aspect-ratio: 563/94; min-height: 8vh; max-width: 98vw"
        ></b-image>
      </div>
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
      <div id="action_menu">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial10") }}
        </p>
      </div>
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
      <div id="create">
        <p class="text is-size-5 notification" style="margin-top: 0px">
          {{ $t("Tutorial11") }}
        </p>
      </div>
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
      <div id="edit">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial12") }}
        </p>
      </div>
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
      <div id="delete">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial13") }}
        </p>
      </div>
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
      <div id="star">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial14") }}
        </p>
      </div>
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
      <hr />
      <p style="text-align: center" id="advanced">
        <b class="is-size-4">
          {{ $t("TutorialTitle3") }}
        </b>
      </p>
      <div id="linked_duplicate">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial15") }}
        </p>
      </div>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/7linkedDuplicate.mp4')"
        ></video>
      </div>
      <div id="distinct_copy">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial16") }}
        </p>
      </div>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/8distinctCopy.mp4')"
        ></video>
      </div>
      <div id="image_options">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial17") }}
        </p>
      </div>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/9advancedOptions.mp4')"
        ></video>
      </div>
      <hr />
      <div id="sharing">
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialTitle4") }}
          </b>
        </p>
      </div>
      <div id="create_group">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial23") }}
        </p>
      </div>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/10groupCreate.mp4')"
        ></video>
      </div>
      <div id="share_group">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial24") }}
          <b-button
            type="is-primary is-light"
            icon-right="page-layout-sidebar-right"
            style="width: 2rem; height: 2rem"
          ></b-button>
        </p>
      </div>
      <div class="video-wrapper">
        <video
          style="justify-content: center"
          class="video"
          controls
          loop
          alt="creating a pictogram in Pictalk"
          :src="require('@/static/11groupShare.mp4')"
        ></video>
      </div>
      <hr />
      <p style="text-align: center" id="application_settings">
        <b class="is-size-4">
          {{ $t("TutorialTitle5") }}
        </b>
      </p>
      <div id="voices">
        <p class="text is-size-5 notification">
          {{ $t("Tutorial20") }}
        </p>
      </div>
      <div class="video-wrapper">
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/voiceSettings.png').srcSet"
          alt="screenshot of the voice app settings"
          style="
            aspect-ratio: 644/545;
            width: 96%;
            max-width: 545px;
            margin-top: 10px;
          "
        ></b-image>
      </div>
      <hr />
      <p style="text-align: center" id="offline">
        <b class="is-size-4">
          {{ $t("TutorialTitle6") }}
        </b>
      </p>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial18") }}
      </p>
      <div class="video-wrapper">
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/downloadIndicatorFull.png').srcSet"
          alt="screenshot of a download indicator at 100%"
          style="
            aspect-ratio: 7/1;
            height: 7vh;
            max-height: 70px;
            margin-top: 1rem;
          "
        ></b-image>
      </div>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial19") }}
      </p>
      <div class="video-wrapper">
        <b-image
          class="image"
          lazy
          :srcset="require('@/assets/downloadedImages.png').srcSet"
          alt="screenshot of a download indicator at 100%"
          style="
            aspect-ratio: 3/1;
            height: 17vh;
            max-height: 200px;
            margin-top: 1rem;
          "
        ></b-image>
      </div>
      <hr />
      <p style="text-align: center" id="public">
        <b class="is-size-4">
          {{ $t("TutorialTitle7") }}
        </b>
      </p>
      <p class="text is-size-5 notification">
        {{ $t("Tutorial21") }}
        <b-button
          type="is-success is-light"
          icon-right="web"
          style="
            width: 2rem;
            height: 2rem;
            border: solid;
            border-width: 1px;
            border-color: #48c78e;
          "
        ></b-button>
        {{ $t("Tutorial22") }}
      </p>
      <hr />
      <b-button
        class="endButton"
        type="is-success"
        :label="$t('TutorialSkip')"
        @click="toPictalk()"
      >
      </b-button>
    </div>
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
  max-width: min(676px, 98vw);
  max-height: min(75vh, 720px);
  aspect-ratio: 676/900;
}
.video-wrapper {
  display: flex;
  justify-content: center;
}
.text {
  min-width: 280px;
  margin-top: 1vh;
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
.contrast {
  color: #ee0000;
}
.darker {
  color: #4a4a4a;
}
:target:before {
  content: "";
  display: block;
  height: 50px;
  margin: -50px 0 0;
}
.hiddenMobile {
  border: solid;
  border-width: 0;
  border-bottom-width: 1px;
  border-color: rgb(221, 221, 221);
  box-shadow: 4px 0px 3px -2px rgb(160 160 160);
}
@media screen and (max-width: 960px) {
  .hiddenMobile {
    display: none;
  }
}
@media screen and (min-width: 960px) {
  .hiddenMobile {
    min-width: 140px;
    margin-left: 20px;
    position: sticky;
    top: 0;
    max-height: 90vh;
  }
}
</style>
