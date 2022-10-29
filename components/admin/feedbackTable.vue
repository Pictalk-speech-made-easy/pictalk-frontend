<template>
  <section>
    <b-table
      :data="feedbacks"
      ref="table"
      paginated
      :current-page.sync="page"
      :per-page="perPage"
      :opened-detailed="defaultOpenedDetails"
      detailed
      detail-key="id"
      :detail-transition="transitionName"
      :show-detail-icon="showDetailIcon"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      :loading="loading"
      backend-pagination
      :total="total"
      @page-change="onPageChange"
      backend-sorting
      :default-sort-direction="defaultSortOrder"
      :default-sort="[sortField, sortOrder]"
      @sort="onSort"
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
            <b-dropdown aria-role="list">
              <template #trigger="{ active }">
                <b-button
                  :label="$t('FeedbackType')"
                  type="is-primary"
                  :icon-right="active ? 'menu-up' : 'menu-down'"
                />
              </template>
              <b-dropdown-item
                v-for="state in feedbackStateEnum.filter(
                  (state) => state != props.row.state
                )"
                :key="state"
                @click="editFeedback(props.row, state)"
                aria-role="listitem"
                :value="state"
                >{{ state }}</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </article>
      </template>
    </b-table>
  </section>
</template>

<script>
import axios from "axios";
export default {
  async fetch() {
    try {
      this.loading = true;
      var res = await axios.get(`/feedback?page=1&per_page=${this.perPage}`);
      this.feedbacks = res.data.feedbacks;
      this.total = res.data.total_count;
      this.loading = false;
      return res;
    } catch (error) {
      console.log("error ", error);
    }
  },
  data() {
    return {
      page: 1,
      perPage: 5,
      total: 0,
      loading: false,
      sortField: "vote_count",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      showDetailIcon: true,
      useTransition: false,
      feedbackStateEnum: ["OPENED", "INPROGRESS", "ONHOLD", "COMPLETE"],
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
  methods: {
    async loadAsyncData() {
      try {
        var res = await axios.get(
          `/feedback?page=${this.page}&per_page=${this.perPage}&sortField=${
            this.sortField
          }&sortOrder=${String(this.sortOrder).toUpperCase()}`
        );
        this.total = res.data.total_count;
        this.feedbacks = res.data.feedbacks;
        return res;
      } catch (error) {
        console.log("error ", error);
      }
    },
    onPageChange(page) {
      this.page = page;
      this.loadAsyncData();
    },

    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.loadAsyncData();
    },

    async editFeedback(feedback, stateValue) {
      try {
        feedback.state = stateValue;
        feedback.blocking = String(feedback.blocking);
        await axios.put(`/feedback/${feedback.id}`, feedback);
        return;
      } catch (error) {
        console.log("error ", error);
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
