<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("AddGroup") }}</p>
    </header>
    <section class="modal-card-body">
      <b-field :label="$t('GroupName')">
        <b-input
          v-model="groupName"
          :placeholder="$t('GroupName')"
          type="name"
          maxlength="30"
        />
      </b-field>
      <!--
      <b-field :label="$t('GroupLabel')">
        <b-icon class="has-background" :icon="groupIcon" />
        &emsp; &emsp;
        <div v-for="icon in iconList" @click="assignGroupIcon(icon)">
          <b-icon :icon="icon" />
        </div>
      </b-field>
      -->

      <b-field :label="$t('AddUser')">
        <div style="justify-content: left; display: flex">
          <b-input
            v-model="addUser"
            :placeholder="$t('PlaceHolderEmail')"
            type="email"
            maxlength="64"
          ></b-input>
          <p class="control">
            <b-button
              type="is-success"
              icon-right="plus"
              :loading="loading"
              @click="pushToGroup()"
            />
          </p>
        </div>
      </b-field>
      <b-table
        v-show="getUsersAsObjectArrays.length > 0"
        :focusable="true"
        :data="getUsersAsObjectArrays"
        :columns="columns"
        :selected.sync="selected"
        :mobile-cards="false"
      >
      </b-table>
      <div>
        <b-button
          v-if="group.users.indexOf(selected.username) !== -1"
          style="border: solid; border-width: 1px; border-color: #f14668"
          class="actionButtons"
          inverted
          type="is-danger"
          icon-left="delete"
          @click="removeFromGroup()"
        />
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="container">
        <b-button
          style="
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            display: flex;
          "
          class="is-info"
          icon-left="content-save"
          :disabled="groupName === ''"
          :loading="loadingSave"
          @click="save()"
          >{{ $t("Save") }}</b-button
        >
      </div>
    </footer>
  </div>
</template>
<script >
export default {
  props: {
    group: {
      type: Object,
      required: false,
      default: () => ({
        users: [],
      }),
    },
    index: {
      type: Number,
      required: false,
    },
    mailingList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    getUsersAsObjectArrays() {
      return this.group.users.map((user) => {
        return {
          username: user,
        };
      });
    },
  },
  methods: {
    async pushToGroup() {
      const index = this.group.users.indexOf(this.addUser);
      if (index === -1) {
        if (
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            this.addUser
          )
        ) {
          if (this.addUser != this.$store.getters.getUser.username) {
            this.group.users.push(this.addUser);
          } else {
            this.$buefy.toast.open({
              message: this.$t("NotShareYourself"),
              position: "is-top",
              type: "is-danger",
            });
          }
        } else {
          this.$buefy.toast.open({
            message: this.$t("EmailPlease"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.toast.open({
          message: this.$t("DuplicateGroupUser"),
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    removeFromGroup() {
      try {
        const index = this.group.users.indexOf(this.selected.username);
        if (index !== -1) {
          this.group.users.splice(index);
        } else {
          this.$buefy.toast.open({
            message: this.$t("CannotRemoveGroupUser"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } catch (error) {
        // selected is empty
      }
    },
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
    assignGroupIcon(icon) {
      this.groupIcon = icon;
    },
    async save() {
      this.loadingSave = true;
      Object.assign(this.group, {
        name: this.groupName,
        icon: this.groupIcon,
      });
      if (this.index > -1) {
        this.mailingList[this.index] = this.group;
      } else {
        this.mailingList.push(this.group);
      }

      try {
        const res = await this.$store.dispatch("editUser", {
          mailingList: this.mailingList,
        });
        this.loadingSave = false;
        this.$parent.close();
        this.$buefy.toast.open({
          message: this.$t("CreatedGroupSucess"),
          type: "is-success",
        });
      } catch (err) {
        console.log(err);
        this.loadingSave = false;
        this.$buefy.toast.open({
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
        });
      }
    },
  },
  data() {
    return {
      selected: {},
      activeStep: 0,
      loading: false,
      loadingSave: false,
      iconList: [
        "account-group",
        "school",
        "airplane",
        "star",
        "plus",
        "video-vintage",
        "van-passenger",
      ],
      groupName: this.group.name ? this.group.name : "",
      groupIcon: this.group.icon ? this.group.icon : "account-group",
      addUser: "",
      columns: [
        {
          field: "username",
          label: "Email",
          width: "100",
          numeric: false,
          searchable: false,
        },
      ],
    };
  },
};
</script>
<style scoped>
.has-background {
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 5px 6px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 3px 3px 5px 6px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 3px 3px 5px 6px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.actionButtons {
  margin-top: 10px;
  width: 40vw;
  min-width: 200px;
  max-width: 300px;
  display: flex;
  margin-right: auto;
  margin-left: auto;
}
</style>