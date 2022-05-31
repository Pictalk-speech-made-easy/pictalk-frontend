<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head" style="padding: 2%">
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
            :loading="loading"
            @click="pushToSharers()"
          />
        </b-field>
        <b-table
          v-if="loneCollaborators.length > 0"
          :focusable="true"
          :data="SharersObj"
          :columns="columns"
          :selected.sync="selected"
          :mobile-cards="false"
        >
        </b-table>
        <br />
        <b-button
          v-if="
            loneCollaborators
              .map((Sharer) => {
                return Sharer.username;
              })
              .indexOf(selected.username) !== -1
          "
          class="fourWidth"
          type="is-danger"
          icon-left="delete"
          @click="removeFromSharers()"
        />
        <hr v-if="SharersObj.length > 0" />
        <b-field :label="$t('Groups')">
          <div v-if="groups.length != 0" class="columns is-multiline is-mobile">
            <div
              v-for="(group, index) in groups"
              class="
                column
                lessPadding
                is-6-mobile is-6-tablet is-6-desktop is-6-widescreen is-6-fullhd
              "
            >
              <div>
                <div
                  :class="[
                    isGroupSelected(group) || isGroupShared(group)
                      ? 'card has-background'
                      : 'card',
                  ]"
                >
                  <div class="card-content">
                    <div
                      class="media"
                      @click="addOrRemoveGroupToSelected(group)"
                    >
                      <div v-if="group.icon" class="media-left">
                        <b-icon :icon="group.icon" />
                      </div>
                      <div class="media-content">
                        <p class="title is-6">
                          {{ group.name }}
                        </p>
                      </div>
                    </div>
                    <b-select
                      v-if="group.selected"
                      v-model="group.mode"
                      required
                    >
                      <option value="viewer">👁️</option>
                      <option value="editor">✏️</option>
                    </b-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-tooltip :label="$t('CreateGroups')" :triggers="['hover']">
            <b-image
              v-if="groups.length == 0"
              lazy
              class="center"
              :srcset="require('@/assets/NoGroups.png').srcSet"
              alt="a group of person crossed out with a red cross"
              style="width: 50%"
            ></b-image>
          </b-tooltip>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot" style="padding: 2%">
      <b-button class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
      <b-button
        class="button is-primary"
        :loading="loading"
        @click="onSubmitted()"
        >{{ $t("Share") }}</b-button
      >
    </footer>
  </div>
</template>
<script >
import sharers from "@/mixins/sharers";
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
      loading: false,
      collaborators: [],
      selectedGroups: [],
      loneCollaborators: [],
      groups: [],
      mode: "viewer",
      selected: {},
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
    this.picto.viewers.forEach((viewer) =>
      this.collaborators.push({
        username: viewer,
        mode: "viewer",
        access: "1",
      })
    );
    this.picto.editors.forEach((editor) =>
      this.collaborators.push({
        username: editor,
        mode: "editor",
        access: "1",
      })
    );
    this.groups = this.getGroups;
    let found;
    this.collaborators.forEach((coll) => {
      found = false;
      this.groups.forEach((group) => {
        if (group.users.indexOf(coll.username) != -1) {
          found = true;
          if (!group.foundUserCount) {
            group.foundUserCount = 0;
          }
          group.foundUserCount += 1;
        }
      });
      if (!found) {
        this.loneCollaborators.push(coll);
        this.SharersObj = this.loneCollaborators.map((loneCollaborator) => {
          return {
            username: loneCollaborator.username,
            mode: loneCollaborator.mode === "viewer" ? "👁️" : "✏️",
          };
        });
      }
    });
  },
  computed: {
    getLoneCollaborators() {
      return this.loneCollaborators.filter(
        (collaborator) => collaborator.access == "1"
      );
    },
    getTrueAccessCollaborators() {
      return this.collaborators.filter(
        (collaborator) => collaborator.access == "1"
      );
    },
    getGroups() {
      return JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
    },
    getSharedGroups() {
      return this.groups.filter((group) => this.isGroupShared(group));
    },
  },
  methods: {
    async pushToSharers() {
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.addSharer);
      const indexCollab = this.loneCollaborators
        .map((collaborator) => {
          return collaborator.username;
        })
        .indexOf(this.addSharer);
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
            };
          } else {
            this.SharersObj.push({
              username: this.addSharer,
              mode: this.mode === "viewer" ? "👁️" : "✏️",
            });
          }
          if (indexCollab !== -1) {
            this.loneCollaborators[indexCollab] = {
              username: this.addSharer,
              mode: this.mode,
              access: "1",
            };
          } else {
            this.loneCollaborators.push({
              username: this.addSharer,
              mode: this.mode,
              access: "1",
            });
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
    removeFromSharers() {
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.selected.username);
      const indexCollab = this.loneCollaborators
        .map((collaborator) => {
          return collaborator.username;
        })
        .indexOf(this.selected.username);

      if (index !== -1) {
      }
      if (indexCollab !== -1) {
        this.loneCollaborators[indexCollab] = {
          username: this.selected.username,
          mode: this.mode,
          access: "0",
        };
      }
    },
    isGroupSelected(group) {
      return group.selected;
    },
    isGroupShared(group) {
      return group.foundUserCount == group.users.length;
    },
    addOrRemoveGroupToSelected(selectedGroup) {
      selectedGroup.selected = !selectedGroup?.selected;
      this.groups.push("");
      this.groups.pop();
    },
    async onSubmitted() {
      this.loading = true;
      try {
        const sharedGroups = this.getSharedGroups.concat(
          this.groups.filter((group) => group.selected)
        );
        const editorUsernameArray = sharedGroups
          .filter((group) => group.mode == "editor")
          .map((group) => group.users)
          .concat(
            this.loneCollaborators
              .filter((coll) => coll.mode == "editor")
              .map((coll) => coll.username)
          )
          .flat();
        if (editorUsernameArray.length != 0) {
          await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: editorUsernameArray,
            role: "editor",
            access: "1",
          });
        }

        const viewerUsernameArray = sharedGroups
          .filter((group) => group.mode == "viewer")
          .map((group) => group.users)
          .concat(
            this.loneCollaborators
              .filter((coll) => coll.mode == "viewer")
              .map((coll) => coll.username)
          )
          .flat();
        if (viewerUsernameArray.length != 0) {
          await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: viewerUsernameArray,
            role: "viewer",
            access: "1",
          });
        }

        const deletedUsernameArray = sharedGroups
          .filter((group) => !group.selected)
          .concat(
            this.loneCollaborators
              .filter((coll) => coll.access == "0")
              .map((coll) => coll.username)
          )
          .flat();
        if (deletedUsernameArray.length != 0) {
          await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: deletedUsernameArray,
            role: "viewer",
            access: "0",
          });
        }
        this.$buefy.toast.open({
          message: this.$t("UpdatedSharers"),
          type: "is-success",
        });
        this.$parent.close();
      } catch (err) {
        console.log(err);
        this.$buefy.toast.open({
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
        });
      }
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.has-background {
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 5px 6px #ff5e5e; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 3px 3px 5px 6px #ff5e5e; /* Firefox 3.5 - 3.6 */
  box-shadow: 3px 3px 5px 6px #ff5e5e; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.lessPadding {
  padding: 0.3rem;
}
.fullWidth {
  width: 100%;
}
.fourWidth {
  width: 39%;
}
</style>