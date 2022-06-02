<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("RecentNews") }}</h1>
        <b-image
          lazy
          alt="A technician working on a computer with tools"
          :srcset="require('@/assets/UpdatesandNews.png').srcSet"
          :placeholder="require('@/assets/UpdatesandNews.png').placeholder"
          style="width: 80%; margin-left: 10%"
        ></b-image>
        <br />
        <b-message type="is-success">
          <div class="subtitle">
            &#127881;&#127881;&#127881;{{
              $t("AwardPictalk")
            }}&#127881;&#127881;&#127881;
          </div>
        </b-message>
        <b-message type="is-success">
          <div class="subtitle">
            {{ $t("PictalkNewsSTitle") }}
            <a
              href="https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement"
              >https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement</a
            >
          </div>
        </b-message>

        <div class="is-size-5 notification">
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone1") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone2") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone3") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone4") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone5") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone6") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone7") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone8") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone9") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone10") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapDone11") }}
            </p>
          </div>
        </div>
        <h1 class="title">{{ $t("Roadmap") }}</h1>
        <div class="is-size-5 notification">
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="true"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapTodo1") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="false"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapTodo2") }}
            </p>
          </div>
          <div
            style="display: flex; flex-dirrection: column; margin-bottom: 1em"
          >
            <b-checkbox-button
              v-model="done"
              :native-value="false"
              type="is-success"
            >
              <b-icon
                icon="check"
                style="
                  margin-left: auto;
                  margin-right: auto;
                  border: solid;
                  border-width: 1px;
                  border-color: #4c43292f;
                "
              ></b-icon>
            </b-checkbox-button>
            <p>
              {{ $t("RoadmapTodo3") }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script >
export default {
  data() {
    return {
      done: true,
    };
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: this.$t("TitleNews"),
        ...i18nHead.htmlAttrs,
      },
      title: this.$t("TitleNews"),
      meta: [
        {
          hid: "descriptionNews",
          name: "description",
          content: this.$t("DescriptionNews"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>
