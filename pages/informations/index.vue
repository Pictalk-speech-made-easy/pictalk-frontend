<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-size-2 is-size-2-mobile">
          {{ $t("Informations") }}
        </h1>
        <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Team") }}</h2>
        <div class="columns">
          <b-image
            style="aspect-ratio: 16/9"
            class="center column"
            lazy
            :srcset="require('@/assets/Contact_compressed.png').srcSet"
            :placeholder="
              require('@/assets/Contact_compressed.png').placeholder
            "
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <b-image
            style="aspect-ratio: 16/9"
            class="center column"
            lazy
            :srcset="require('@/assets/Contact_compressed.png').srcSet"
            :placeholder="
              require('@/assets/Contact_compressed.png').placeholder
            "
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <b-image
            style="aspect-ratio: 16/9"
            class="center column"
            lazy
            :srcset="require('@/assets/Contact_compressed.png').srcSet"
            :placeholder="
              require('@/assets/Contact_compressed.png').placeholder
            "
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <b-image
            style="aspect-ratio: 16/9"
            class="center column"
            lazy
            :srcset="require('@/assets/Contact_compressed.png').srcSet"
            :placeholder="
              require('@/assets/Contact_compressed.png').placeholder
            "
            alt="help center people wearing headsets"
            rounded
          ></b-image>
        </div>
        <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Partners") }}</h2>
        <b-carousel-list
          v-model="test"
          :data="items"
          :items-to-show="3"
          autoplay
          repeat
        >
          <template #item="list">
            <div class="">
              <b-image
                style="aspect-ratio: 16/9"
                class="center column"
                lazy
                :src="list.image"
                :placeholder="
                  require('@/assets/Contact_compressed.png').placeholder
                "
                alt="help center people wearing headsets"
                rounded
              ></b-image>
              <p class="title is-4">{{ list.title }}</p>
              <p class="title is-6">{{ list.description }}</p>
            </div>
          </template>
        </b-carousel-list>
        <h2 class="title is-size-3 is-size-3-mobile">
          {{ $t("HowContribute") }}
        </h2>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      test: 0,
      items: [
        {
          title: "Fondation INSA Lyon",
          description:
            "La fondation INSA Lyon, à travers le Coups de pouce passions a fourni une aide de 1000€",
          image:
            "https://best.insa-lyon.org/sites/best.insa-lyon.org/files/fondateurs/insa_lyon_foundation.png",
        },
        {
          title: "Digital Ocean",
          description:
            "Hébergeur de notre serveur, Digital Ocean à subventionné à hauteur de 250€ nos coûts de fonctionnement informatiques",
          image:
            "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.png",
          rating: 3.5,
        },
        {
          title: "Slide 3",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 5,
        },
        {
          title: "Slide 4",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
        },
        {
          title: "Slide 5",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 5,
        },
        {
          title: "Slide 6",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 4,
        },
        {
          title: "Slide 7",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 2.7,
        },
        {
          title: "Slide 8",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 1.5,
        },
      ],
    };
  },
  methods: {
    info(value) {
      this.test = value;
    },
  },
};
</script>
