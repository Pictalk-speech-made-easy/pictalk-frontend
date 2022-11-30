<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">
        {{ $t("ShareCollection") }}
      </p>
    </header>
    <section class="modal-card-body">
      <div>
        <div class="lightbackground">
          <p class="subtitle centeredText">{{ $t("ShareAddSomeone") }}:</p>
          <b-field>
            <b-input
              v-model="addSharer"
              expanded
              :placeholder="$t('PlaceHolderEmail')"
              type="email"
              maxlength="64"
            ></b-input>
            <b-select v-model="mode" required>
              <option v-if="canShareWithEditorPermissions" value="editor">
                ✏️
              </option>
              <option value="viewer">👁️</option>
            </b-select>
            <b-button
              type="is-success"
              icon-right="plus"
              @click="pushToCollaborators()"
            />
          </b-field>
        </div>
        <div class="lightbackground">
          <p class="subtitle centeredText">{{ $t("ShareWhoHasAccess") }}?</p>
          <b-table
            :striped="true"
            :narrowed="true"
            :hoverable="true"
            v-if="sharersDictToObj.length > 0"
            :data="sharersDictToObj"
            :columns="columns"
            :mobile-cards="false"
            :checked-rows.sync="selected"
            checkable
            :custom-is-checked="(a, b) => a.username == b.username"
            checkbox-position="left"
            checkbox-type="is-danger"
          >
          </b-table>
          <div class="selectedOptions" v-if="selected.length > 0">
            <b-button
              class="roundedbtn"
              type="is-danger"
              icon-left="delete"
              @click="removeFromCollaborators()"
            />
            <b-select
              style="margin-left: auto"
              class="roundedbtn"
              v-model="modeSelect"
              required
              @input="changeSelectedMode"
            >
              <option value="viewer">👁️</option>
              <option v-if="canShareWithEditorPermissions" value="editor">
                ✏️
              </option>
              <option v-if="modeSelect == 'mixed'" value="mixed">
                👁️/✏️
              </option></b-select
            >
          </div>
        </div>

        <div class="lightbackground">
          <p class="subtitle centeredText">{{ $t("ShareAddGroup") }}:</p>
          <b-field :label="$t('Groups')">
            <div
              v-if="groups.length != 0"
              class="columns is-multiline is-mobile"
            >
              <div
                v-for="(group, index) in groups"
                class="
                  column
                  lessPadding
                  is-6-mobile
                  is-6-tablet
                  is-6-desktop
                  is-6-widescreen
                  is-6-fullhd
                "
              >
                <div
                  :class="
                    selectedGroups.indexOf(index) >= 0
                      ? 'card has-background rounder'
                      : 'card rounder'
                  "
                >
                  <div
                    class="card-content smallerbottompadding"
                    @click="GroupToSelected(index)"
                  >
                    <div class="media shrinked">
                      <div v-if="group.icon" class="media-left">
                        <b-icon :icon="group.icon" />
                      </div>
                      <p class="title is-6 noScrolling">
                        {{ group.name }}
                      </p>
                    </div>
                    <div class="limitheight">
                      <p
                        v-for="(user, index) in group.users"
                        class="is-size-6 limitwidth"
                      >
                        {{ user in sharersDict ? "✅" : "❌" }}
                        {{ user }}
                      </p>
                    </div>
                  </div>
                  <div v-if="!groupStatus(group).full" class="addmissing">
                    <b-button
                      type="is-success"
                      :loading="loading === index"
                      class="roundedbtn"
                      @click="addMissing(index)"
                      >{{ $t("AddMissing") }}</b-button
                    >
                    <b-select class="roundedbtn" v-model="group.mode" required>
                      <option value="viewer">👁️</option>
                      <option
                        v-if="canShareWithEditorPermissions"
                        value="editor"
                      >
                        ✏️
                      </option>
                    </b-select>
                  </div>
                </div>
              </div>
            </div>
          </b-field>

          <b-button
            type="is-success"
            class="actionButtons roundedbtn"
            icon-left="plus"
            @click="openAddGroupModal()"
            >{{ $t("CreateNewGroup") }}</b-button
          >
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
    </footer>
  </div>
</template>
<script >
import sharers from "@/mixins/sharers";
import addGroupModal from "@/components/auth/addGroupModal";
export default {
  mixins: [sharers],
  props: {
    picto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groups: [],
      groupsStatus: [],
      mode: "viewer",
      selected: [],
      selectedGroups: [],
      loading: false,
      sharersDict: [],
      addSharer: "",
      columns: [
        {
          field: "username",
          label: "",
          searchable: false,
        },
        {
          field: "mode",
          label: "",
          searchable: false,
        },
      ],
    };
  },
  watch: {
    groups: function () {
      for (let group of this.groups) {
        this.groupsStatus.push(this.groupStatus(group));
        group.mode = "viewer";
      }
    },
    sharersDict: {
      deep: true,
      handler: function () {
        this.groupsStatus = [];
        for (let group of this.groups) {
          this.groupsStatus.push(this.groupStatus(group));
          group.mode = "viewer";
        }
      },
    },
  },
  created() {
    this.getGroups();
    this.picto.viewers.forEach((viewer) => {
      this.addUserToList(viewer, "viewer");
    });
    this.picto.editors.forEach((editor) => {
      this.addUserToList(editor, "editor");
    });
    for (let group of this.groups) {
      this.groupsStatus.push(this.groupStatus(group));
      group.mode = "viewer";
    }
  },
  computed: {
    modeSelect() {
      const sharingModes = this.selected.map((user) => user.modeRaw);
      const isViewer = sharingModes.indexOf("viewer");
      const isEditor = sharingModes.indexOf("editor");
      if (isViewer !== -1 && isEditor == -1) {
        return "viewer";
      } else if (isViewer == -1 && isEditor !== -1) {
        return "editor";
      } else if (isViewer !== -1 && isEditor !== -1) {
        return "mixed";
      }
    },
    canShareWithEditorPermissions() {
      return (
        this.picto.userId == this.$store.getters.getUser.id ||
        this.picto.editors.indexOf(this.$store.getters.getUser.username) !== -1
      );
    },
    sharersDictToObj() {
      return Object.keys(this.sharersDict).map((key) => {
        return {
          username: key,
          mode: this.sharersDict[key].mode === "viewer" ? "👁️" : "✏️",
          modeRaw: this.sharersDict[key].mode,
        };
      });
    },
  },
  methods: {
    groupStatus(group) {
      let present = [],
        missing = [],
        full = false;
      for (let user of group.users) {
        if (user in this.sharersDict) {
          present.push(user);
        } else {
          missing.push(user);
        }
      }
      if (missing.length == 0) {
        full = true;
      }
      return { full, present, missing };
    },
    addUserToList(user, modeRaw) {
      this.sharersDict[user] = {
        username: user,
        mode: modeRaw,
      };
    },
    triggerGroups() {
      this.groups.push("");
      this.groups.pop();
    },
    getGroups() {
      this.groups = JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
    },
    async openAddGroupModal(group, index) {
      const modal = this.$buefy.modal.open({
        parent: this,
        component: addGroupModal,
        props: {
          group: group,
          index: index,
          mailingList: [...this.$store.getters.getUser.mailingList],
        },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
      modal.$on("close", () => {
        this.getGroups();
      });
    },
    async pushToCollaborators() {
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.addSharer
        )
      ) {
        if (this.addSharer != this.$store.getters.getUser.username) {
          try {
            let collection = await this.$store.dispatch("shareCollection", {
              collectionId: this.picto.id,
              usernames: [this.addSharer],
              role: this.mode,
              access: 1,
            });
            if (
              (this.mode == "viewer" &&
                collection.viewers.indexOf(this.addSharer) !== -1) ||
              (this.mode == "editor" &&
                collection.editors.indexOf(this.addSharer) !== -1)
            ) {
              this.sharersDict[this.addSharer] = {
                username: this.addSharer,
                mode: this.mode,
              };
              this.sharersDict = { ...this.sharersDict };
            }
          } catch (err) {
            if (err?.response?.status == 401) {
              this.$buefy.toast.open({
                message: this.$t("AuthorizationError"),
                position: "is-top",
                type: "is-danger",
              });
            } else if (err?.response?.status == 400) {
              this.$buefy.toast.open({
                message: this.$t("BadRequest"),
                position: "is-top",
                type: "is-danger",
              });
            } else {
              this.$buefy.toast.open({
                message: this.$t("SomeThingBadHappened"),
                position: "is-top",
                type: "is-danger",
              });
            }
          }
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
    },
    async removeFromCollaborators() {
      let toRemoveViewers = [];
      let toRemoveEditors = [];
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i]?.mode == "👁️") {
          toRemoveViewers.push(this.selected[i]?.username);
        } else {
          toRemoveEditors.push(this.selected[i]?.username);
        }
      }
      if (toRemoveViewers.length != 0) {
        try {
          let collection = await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: toRemoveViewers,
            role: "viewer",
            access: 0,
          });
          for (let i = 0; i < toRemoveViewers.length; i++) {
            if (collection.viewers.indexOf(toRemoveViewers[i]) == -1) {
              delete this.sharersDict[toRemoveViewers[i]];
            }
          }
        } catch (err) {
          if (err?.response?.status == 401) {
            this.$buefy.toast.open({
              message: this.$t("AuthorizationError"),
              position: "is-top",
              type: "is-danger",
            });
          } else if (err?.response?.status == 400) {
            this.$buefy.toast.open({
              message: this.$t("BadRequest"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              message: this.$t("SomeThingBadHappened"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      }
      if (toRemoveEditors.length != 0) {
        try {
          let collection = await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: toRemoveEditors,
            role: "editor",
            access: 0,
          });
          for (let i = 0; i < toRemoveEditors.length; i++) {
            if (collection.editors.indexOf(toRemoveEditors[i]) == -1) {
              delete this.sharersDict[toRemoveEditors[i]];
            }
          }
        } catch (err) {
          if (err?.response?.status == 401) {
            this.$buefy.toast.open({
              message: this.$t("AuthorizationError"),
              position: "is-top",
              type: "is-danger",
            });
          } else if (err?.response?.status == 400) {
            this.$buefy.toast.open({
              message: this.$t("BadRequest"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              message: this.$t("SomeThingBadHappened"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      }

      this.sharersDict = { ...this.sharersDict };
      // if (index !== -1) {
      //   this.SharersObj.splice(index, 1);
      // }
    },
    GroupToSelected(index) {
      console.log(this.groups[index].users);
      const present = this.selectedGroups.indexOf(index);
      if (present >= 0) {
        for (let user of this.groups[index].users) {
          for (let i = 0; i < this.selected.length; i++) {
            console.log(i);
            if (this.selected[i].username == user) {
              this.selected.splice(i, 1);
            }
          }
        }
        this.selectedGroups.splice(present, 1);
      } else {
        for (let user of this.groups[index].users) {
          if (user in this.sharersDict) {
            this.selected.push({
              username: this.sharersDict[user].username,
              mode: this.sharersDict[user].mode === "viewer" ? "👁️" : "✏️",
            });
          }
        }
        this.selectedGroups.push(index);
      }
    },
    async addMissing(index) {
      this.loading = true;
      try {
        let collection = await this.$store.dispatch("shareCollection", {
          collectionId: this.picto.id,
          usernames: this.groupsStatus[index].missing,
          role: this.groups[index].mode,
          access: "1",
        });
        this.loading = false;
        const mode = this.groups[index].mode;
        this.groupsStatus[index].missing.forEach((username) => {
          if (
            (mode == "viewer" && collection.viewers.indexOf(username) !== -1) ||
            (mode == "editor" && collection.editors.indexOf(username) !== -1)
          )
            this.sharersDict[username] = { username: username, mode: mode };
        });
      } catch (err) {
        if (err?.response?.status == 401) {
          this.$buefy.toast.open({
            message: this.$t("AuthorizationError"),
            position: "is-top",
            type: "is-danger",
          });
        } else if (err?.response?.status == 400) {
          this.$buefy.toast.open({
            message: this.$t("BadRequest"),
            position: "is-top",
            type: "is-danger",
          });
        } else {
          this.$buefy.toast.open({
            message: this.$t("SomeThingBadHappened"),
            position: "is-top",
            type: "is-danger",
          });
        }
      }

      this.sharersDict = { ...this.sharersDict };
      // TODO Freshly created group has undefined usernames
      this.groups.push("");
      this.groups.pop();
      //this.onSubmitted();
    },
    async changeSelectedMode(mode) {
      this.loading = true;
      try {
        let collection = await this.$store.dispatch("shareCollection", {
          collectionId: this.picto.id,
          usernames: this.selected.map((user) => {
            return user.username;
          }),
          role: mode,
          access: "1",
        });
        this.selected.forEach((selected) => {
          if (
            mode == "editor" &&
            collection.editors.indexOf(selected.username) !== -1
          ) {
            this.sharersDict[selected.username] = {
              username: selected.username,
              mode: mode,
            };
          }
          if (
            mode == "viewer" &&
            collection.viewers.indexOf(selected.username) !== -1
          ) {
            this.sharersDict[selected.username] = {
              username: selected.username,
              mode: mode,
            };
          }
        });
        this.sharersDict = { ...this.sharersDict };
      } catch (err) {
        console.log(err);
        if (err?.response?.status == 401) {
          this.$buefy.toast.open({
            message: this.$t("AuthorizationError"),
            position: "is-top",
            type: "is-danger",
          });
        } else if (err?.response?.status == 400) {
          this.$buefy.toast.open({
            message: this.$t("BadRequest"),
            position: "is-top",
            type: "is-danger",
          });
        } else {
          this.$buefy.toast.open({
            message: this.$t("SomeThingBadHappened"),
            position: "is-top",
            type: "is-danger",
          });
        }
      }
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.has-background {
  border: solid;
  border-width: 2px;
  border-color: #ff5757;
  border-radius: 3px;
}
.lessPadding {
  padding: 0.3rem;
}
.fourWidth {
  width: 39%;
}
.centeredText {
  text-align: center;
}
.subtitle {
  margin-bottom: 0.75em;
}
.actionButtons {
  display: flex;
  margin: 2em auto 0.5em auto;
  width: 50%;
  min-width: 230px;
}
.lightbackground {
  background-color: #fcfcfc;
  padding: 1em;
  border-radius: 12px;
  margin: 0.5em 0;
  border: solid;
  border-color: #00000020;
  border-width: 1px;
}
.noScrolling {
  overflow-y: hidden;
}
.limitheight {
  height: 85px;
  overflow-y: auto;
}
.limitwidth {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: clip;
}
.shrinked {
  margin-bottom: 0.5em !important;
}
.rounder {
  border-radius: 12px;
}
.roundedbtn {
  border-radius: 24px;
}
.addmissing {
  display: flex;
  justify-content: center;
  padding-bottom: 1em;
  gap: 0.5em;
}
.smallerbottompadding {
  padding-bottom: 0.5em;
}
.selectedOptions {
  display: flex;
  justify-content: right;
  margin-top: 1em;
}
</style>
