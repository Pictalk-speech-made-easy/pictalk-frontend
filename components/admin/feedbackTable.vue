<template>
  <section>
    <b-table
      :data="feedbacks"
      ref="table"
      paginated
      per-page="5"
      :opened-detailed="defaultOpenedDetails"
      detailed
      detail-key="id"
      :detail-transition="transitionName"
      :show-detail-icon="showDetailIcon"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        field="title"
        :label="$t('FeedbackTitle')"
        sortable
        v-slot="props"
      >
        {{ props.row.title }}
      </b-table-column>

      <b-table-column field="date" label="Date" sortable v-slot="props">
        {{ new Date(props.row.date).toLocaleDateString() }}
      </b-table-column>

      <b-table-column
        field="blocking"
        :label="$t('FeedbackBlocking')"
        sortable
        v-slot="props"
      >
        <span class="tag is-warning">
          {{ props.row.blocking }}
        </span>
      </b-table-column>
      <b-table-column
        field="action"
        :label="$t('FeedbackType')"
        sortable
        v-slot="props"
      >
        <span class="tag is-info">
          {{ props.row.action }}
        </span>
      </b-table-column>
      <b-table-column
        field="state"
        :label="$t('FeedbackState')"
        sortable
        v-slot="props"
      >
        <span class="tag is-light">
          {{ props.row.state }}
        </span>
      </b-table-column>

      <template #detail="props">
        <article class="box container">
          <div class="">
            <h2 class="subtitle">{{ $t("FeedbackDescription") }}</h2>
            {{ props.row.description }}
            <h2 class="subtitle">{{ $t("FeedbackEvolution") }}</h2>
            {{ props.row.evolution }}
          </div>
          <div style="margin-top: 0.85rem">
            <h2 class="subtitle is-size-5 headers">
              {{ $t("FeedbackDeviceInfo") }}
            </h2>
            <div class="scrollableDiv">
              {{ props.row.deviceInfos }}
            </div>
            <br />
            <h2 class="subtitle is-size-5 headers">
              {{ $t("FeedbackVuex") }}
            </h2>
            <div class="scrollableDiv">
              {{ props.row.vuex }}
            </div>
            <br />
            <h2 class="subtitle is-size-5 headers">
              {{ $t("FeedbackVoices") }}
            </h2>
            <div class="scrollableDiv">
              {{ props.row.voices }}
            </div>
            <br />
          </div>
        </article>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          title: "Test 1",
          date: Date.now(),
          blocking: true,
          contact: "alex@pictalk.org",
          action: "action",
          description: "test description",
          evolution: "azer",
          vuex: "vuex",
          voices: "voices",
          deviceInfos: "deviceInfos",
          state: "State",
        },
      ],
      defaultOpenedDetails: [1],
      showDetailIcon: true,
      useTransition: false,
    };
  },
  props: {
    feedbacks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    transitionName() {
      if (this.useTransition) {
        return "fade";
      }
    },
  },
};
</script>
<style scoped>
.scrollableDiv {
  border: solid;
  border-width: 1px;
  border-color: #00000040;
  background-color: #f5f5f5;
  max-height: 20vh;
  overflow: scroll;
}
</style>
