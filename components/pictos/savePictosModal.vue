<template>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        Experimental Download All Pictos
      </header>
      <section class="modal-card-body">
        <b-progress type="is-success" :value="requestsPercentage" show-value format="percent"></b-progress>
      </section>
      <footer class="modal-card-foot">
        <b-button class="is-primary" @click="closeModal()">Close</b-button>
        <b-button class="is-primary" @click="downloadAll()">Start</b-button>
      </footer>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      nb_requests: 0,
      done_requests: 0,
      dl_launched: false,
    };
  },
  methods: {
      delay(delayInms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(2);
          }, delayInms);
        });
      },
      closeModal(){
        this.$parent.close();
      },
      async downloadAll(){
      this.dl_launched = true;
      const res = await axios.get("/pictalk/allPictos");
      var views = this.$store.getters.getPictoViews;
      var already_saved_pictos=[];
      await this.$store.dispatch("resetViews");
      await views.forEach((view) => {
        view.pictos.forEach((picto) => {
          already_saved_pictos.push(picto.id);
        });
      });
      this.nb_requests = res.data.length - already_saved_pictos.length;
      res.data.forEach(async picto => {
        if(!already_saved_pictos.find((elem) => elem == picto.id)){
          try {
            const img = await axios.get("/pictalk/"+picto.path);
            this.done_requests+=1;
          } catch(error){
            console.log(error);
          }
          if (picto.path) {
            picto.path =
              axios.defaults.baseURL + "/pictalk/" + picto.path;
          }
          // View existante pour le picto ?
          const viewExists = views.findIndex(
            view => view.fatherId === picto.fatherId &&
            view.collectionId === picto.collectionId
          );
          if(picto.folder == 1) {
            const folderExists = views.findIndex(
            view => view.fatherId === picto.id &&
            view.collectionId === picto.collectionId
            );
            if(folderExists != -1){
              views.push({collectionId: picto.collectionId, fatherId: picto.id, pictos: Array()}); //View of folder
            }
          }
          if(viewExists == -1){
            views.push({collectionId: picto.collectionId, fatherId: picto.fatherId, pictos: Array()}); //Add view if not here
            views[views.length -1].pictos.push({...picto});
          } else {
            views[viewExists].pictos.push({...picto});
            already_saved_pictos.push(picto.id);
          }
          
        }

      });
        
      views.forEach((view) => {
        this.$store.dispatch('addView', view);
      });
      return;
    },
  },
  computed: {
    requestsPercentage(){
      if(this.nb_requests == 0 && this.dl_launched == false){
        return 0;
      } else {
        if(this.dl_launched == true && this.nb_requests == 0){
          return 100;
        } else {
        return (this.done_requests/this.nb_requests)*100;
        }
      }
    }
  },};
</script>
