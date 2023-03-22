<template>
<div class="container">
  <div class="title">{{$t('Tutorials')}}</div>
  <div class="columns">
    <div class="column">
      <div class="subtitle">{{$t('TutorialsBasics')}}</div>
      <a href="https://youtu.be/leiYJHOp4QQ">
      <img loading="lazy"
        class="subcard-img bigger"
        alt="drawing of a person working with a computer"
        :srcset="require('@/assets/TutorialBasics.png').srcSet"
      >
      </a>
    </div>
    <div class="column">
      <div class="subtitle">{{$t('TutorialsCreation')}}</div>
      <a href="https://youtu.be/DO9Dyzjt0Y4">
      <img loading="lazy"
        class="subcard-img bigger"
        alt="drawing of a person working with a computer"
        :srcset="require('@/assets/TutorialCreation.png').srcSet"
      >
      </a>
    </div>
    <div class="column">
      <div class="subtitle">{{$t('TutorialsOrganizing')}}</div>
      <a href="https://youtu.be/PcB-28gygjY">
      <img loading="lazy"
        class="subcard-img bigger"
        alt="drawing of a person working with a computer"
        :srcset="require('@/assets/TutorialOrganizing.png').srcSet"
      >
      </a>
    </div>
  </div>
  </div>
</template>
<style scoped>
.subcard-img {
  border-radius: 12px;
}

.bigger {
  min-height: 30vmin;
}
</style>