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
              <option value="editor">✏️</option>
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
            v-if="SharersObj.length > 0"
            :data="SharersObj"
            :columns="columns"
            :mobile-cards="false"
            :checked-rows.sync="selected"
            checkable
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
              @input="changeModeOfSelectedUsers()"
            >
              <option value="viewer">👁️</option>
              <option value="editor">✏️</option>
            </b-select>
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
                        {{
                          collaboratorsNames.indexOf(user) >= 0 ? "✅" : "❌"
                        }}
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
                      <option value="editor">✏️</option>
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
      loneCollaborators: [],
      collaboratorsNames: [],
      groups: [],
      groupsStatus: [],
      mode: "viewer",
      modeSelect: "viewer",
      selected: [],
      selectedGroups: [],
      loading: false,
      SharersObj: [],
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
  mounted() {
    this.getGroups();
    console.log(this.groups);
    this.picto.viewers.forEach((viewer) => {
      this.addUserToList(viewer);
      this.collaboratorsNames.push(viewer);
    });
    this.picto.editors.forEach((editor) => {
      this.addUserToList(editor);
      this.collaboratorsNames.push(editor);
    });
    for (let group of this.groups) {
      this.groupsStatus.push(this.groupStatus(group));
      group.mode = "viewer";
    }
  },
  computed: {
    getLoneCollaborators() {
      return this.loneCollaborators.filter(
        (collaborator) => collaborator.access == "1"
      );
    },
  },
  methods: {
    changeModeOfSelectedUsers() {},
    groupStatus(group) {
      let present = [],
        missing = [],
        full = false;
      for (let user of group.users) {
        if (this.collaboratorsNames.indexOf(user) >= 0) {
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
    addUserToList(user) {
      let collaborator = {
        username: user,
        mode: "viewer",
        access: "1",
      };
      // push user to the colaborators list that lists all users disregarding rights on item
      this.loneCollaborators.push(collaborator);
      // map user to a table input
      this.SharersObj = this.loneCollaborators.map((loneCollaborator) => {
        return {
          username: loneCollaborator.username,
          mode: loneCollaborator.mode === "viewer" ? "👁️" : "✏️",
          modeRaw: this.mode,
        };
      });
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
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.addSharer);
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.addSharer
        )
      ) {
        if (this.addSharer != this.$store.getters.getUser.username) {
          if (index !== -1) {
            this.SharersObj[index] = {
              username: this.addSharer,
              mode: this.mode === "viewer" ? "👁️" : "✏️",
              modeRaw: this.mode,
            };
          } else {
            this.SharersObj.push({
              username: this.addSharer,
              mode: this.mode === "viewer" ? "👁️" : "✏️",
              modeRaw: this.mode,
            });
          }
          await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: [this.addSharer],
            role: this.mode,
            access: 1,
          });
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
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.selected.username);
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: [this.selected.username],
        role: this.SharersObj[index].modeRaw,
        access: 0,
      });
      if (index !== -1) {
        this.SharersObj.splice(index, 1);
      }
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
          for (let i = 0; i < this.SharersObj.length; i++) {
            if (this.SharersObj[i].username == user) {
              this.selected.push(this.SharersObj[i]);
            }
          }
        }
        this.selectedGroups.push(index);
      }
    },
    async addMissing(index) {
      this.loading = index;
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: this.groupsStatus[index].missing,
        role: this.groups[index].mode,
        access: "1",
      });
      this.loading = false;
      this.groups.push("");
      this.groups.pop();
      //this.onSubmitted();
    },
    async changeGroupMode(selectedGroup) {
      this.loading = true;
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: selectedGroup.users,
        role: selectedGroup.mode,
        access: String(selectedGroup.selected | 0),
      });
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
