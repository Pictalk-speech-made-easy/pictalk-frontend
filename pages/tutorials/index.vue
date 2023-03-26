<template>
<div class="container">
  <div class="title">{{$t('Tutorials')}}</div>
  <div class="columns is-multiline is-vcentered">
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/leiYJHOp4QQ">
      <b-image loading="lazy"
        class="subcard-img bigger"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialBasics.png').srcSet"
        :placeholder="require('@/assets/TutorialBasics.png').placeholder"
      />
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsBasics')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsBasicsText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/DO9Dyzjt0Y4">
      <b-image loading="lazy"
        class="subcard-img bigger"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialCreation.png').srcSet"
        :placeholder="require('@/assets/TutorialCreation.png').placeholder"
      />
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsCreation')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsCreationText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/PcB-28gygjY">
      <b-image loading="lazy"
        class="subcard-img bigger"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialOrganizing.png').srcSet"
        :placeholder="require('@/assets/TutorialOrganizing.png').placeholder"
      />
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsOrganizing')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsOrganizingText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/iDvX3BWYadc">
      <b-image loading="lazy"
        class="subcard-img bigger"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialSharing.png').srcSet"
        :placeholder="require('@/assets/TutorialSharing.png').placeholder"
      />
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsSharing')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsSharingText')}}
      </div>
    </div>
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