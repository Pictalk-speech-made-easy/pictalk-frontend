<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head" style="padding: 2%">
        <b-button
          class="button"
          type="is-danger"
          icon-left="close"
          @click="$parent.close()"
        />
        <p style="text-align: center" class="modal-card-title">
          {{ $t("TitleTutorial") }}
        </p>
      </header>
      <section class="modal-card-body">
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialAdminMode") }}
          </b>
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/admin-mode.mp4')"
        ></video>
        <p class="is-size-5 notification">
          {{ $t("Tutorial1") }}
        </p>
        <hr />
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialCreateItems") }}
          </b>
        </p>
        <p class="is-size-5 notification">
          {{ $t("Tutorial2") }}
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/create-collection.mp4')"
        ></video>
        <p class="is-size-5 notification">
          {{ $t("Tutorial3") }}
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/create-picto.mp4')"
        ></video>

        <p class="is-size-5 notification">
          {{ $t("Tutorial4") }}
        </p>
        <hr />
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialEditItem") }}
          </b>
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/edit-picto.mp4')"
        ></video>

        <p class="is-size-5 notification">
          {{ $t("TutorialStar") }}
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/star-picto.mp4')"
        ></video>
        <hr />
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialCopy") }}
          </b>
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/copy.mp4')"
        ></video>
        <p class="is-size-5 notification">
          {{ $t("TutorialCopyText") }}
        </p>
        <hr />
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialLink") }}
          </b>
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/link.mp4')"
        ></video>
        <p class="is-size-5 notification">
          {{ $t("TutorialLinkText") }}
        </p>
        <hr />
        <p style="text-align: center">
          <b class="is-size-4">
            {{ $t("TutorialDelete") }}
          </b>
        </p>
        <video
          controls
          loop
          alt="A little boy talking thanks to Pictalk"
          :src="require('@/static/delete-item.mp4')"
        ></video>
        <p class="is-size-5 notification">
          {{ $t("TutorialDeleteText") }}
        </p>
        <b-button
          class="has-background"
          type="is-success"
          :label="$t('TutorialSkip')"
          expanded
          @click="$parent.close()"
        >
        </b-button>
      </section>
    </div>
  </form>
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
.has-background {
  border-radius: 5px;
  -webkit-box-shadow: 2px 2px 2px 2px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 2px 2px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 2px 2px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>