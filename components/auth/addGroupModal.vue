<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="arrow-left"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("AddGroup") }}</p>
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
        <b-step-item clickable step="1" :label="$t('GroupName')" clickable>
          <hr />
          <b-field :label="$t('GroupName')">
            <b-input
              v-model="groupName"
              :placeholder="$t('GroupName')"
              type="name"
              maxlength="30"
            />
          </b-field>
          <b-field :label="$t('GroupLabel')">
            <b-icon class="has-background" :icon="groupIcon" />
            &emsp; &emsp;
            <div v-for="icon in iconList" @click="assignGroupIcon(icon)">
              <b-icon :icon="icon" />
            </div>
          </b-field>
          <hr />
        </b-step-item>
        <b-step-item clickable step="2" :label="$t('AddUser')" clickable>
          <b-field :label="$t('AddUser')">
            <b-input
              v-model="addUser"
              placeholder="alex@pictalk.xyz"
              type="email"
              maxlength="64"
            ></b-input>
            <p class="control">
              <b-button
                type="is-success"
                icon-right="plus"
                @click="pushToGroup()"
              />
            </p>
          </b-field>
          <b-table
            :focusable="true"
            :data="getUsersAsObjectArrays"
            :columns="columns"
            :selected.sync="selected"
            :mobile-cards="false"
          >
          </b-table>
          <div class="columns">
            <div class="container column"></div>
            <div class="container column">
              <b-button
                v-if="group.users.indexOf(selected.username) !== -1"
                class="fourWidth"
                type="is-danger"
                icon-left="delete"
                @click="removeFromGroup()"
              />
            </div>
          </div>
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
              expanded
              class="is-info"
              icon-left="content-save"
              :disabled="groupName === ''"
              @click="save()"
              >{{ $t("Save") }}</b-button
            >
          </div>
          <div class="column is-one-quarter">
            <b-button
              class="button center"
              type="button"
              :disabled="activeStep == 1"
              @click="nextStep()"
              icon-right="chevron-right"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
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
    pushToGroup() {
      const index = this.group.users.indexOf(this.addUser);
      if (index === -1) {
        if (
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            this.addUser
          )
        ) {
          this.group.users.push(this.addUser);
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: this.$t("EmailPlease"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.toast.open({
          duration: 5000,
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
            duration: 5000,
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
      console.log("this is index ", this.index);
      let tempMailingList = JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
      Object.assign(this.group, {
        name: this.groupName,
        icon: this.groupIcon,
      });
      if (this.index > -1) {
        console.log("edditing");
        tempMailingList[this.index] = this.group;
      } else {
        console.log("creating");
        tempMailingList.push(this.group);
      }

      try {
        const res = await this.$store.dispatch("editUser", {
          mailingList: tempMailingList,
        });
        this.$parent.close();
        this.$buefy.toast.open({
          message: this.$t("CreatedGroupSucess"),
          type: "is-success",
        });
      } catch (err) {
        console.log(err);
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
      groupIcon: this.group.icon ? this.group.icon : "",
      addUser: "",
      columns: [
        {
          field: "username",
          label: "Email",
          width: "100",
          numeric: false,
          searchable: true,
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
.fourWidth {
  width: 39%;
}
.sixWidth {
  width: 59%;
}
</style>