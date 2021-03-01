<template>
  <div>
    <section class="section">
    <div class="container">
      <h1 class="title">Recent news !</h1>
<b-image lazy alt="A little boy talking thanks to Pictalk" 
				:srcset="require('@/assets/UpdatesandNews.png').srcSet"
                style="width: 80%;margin-left: 10%"
				></b-image>
        <br>
        <b-message type="is-success">
          <div class="subtitle">
            &#127881;&#127881;&#127881; <b>PicTalk</b> was awarded 1000€ at the <b> Coups de pouce passion</b> contest ! &#127881;&#127881;&#127881;
          </div>
        </b-message>
        <b-message type="is-success">
          <div class="subtitle">
            <b>Pictalk</b> in the news ! (FR) : <a href="https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement">https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement</a>
          </div>
        </b-message>
      
      <p class="is-size-5 notification">
        <b-field>
            <b-checkbox :value="true" type="is-success">Now the MEANING is showed instead of the SPEECH in the Picto bar. Same for the <b>copy</b> button</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success">PicTalk is in the playstore !</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success">Once the pictograms have been loaded at least one time, you can use them <b>offline</b> !</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success"><b>Install</b> the application via Chrome and Firefox (Tap Install on the options menu) </b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success">No more third-party <b>Cookies</b> </b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success">You can put a <b>star</b> in a picto so it shows at the beginning of a view </b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="true" type="is-success"><b>Admin mode</b> is now more consistent through the different menus </b-checkbox>
        </b-field>
    </p> 
      <h1 class="title">Roadmap</h1>
      <p class="is-size-5 notification">
         <b-field>
            <b-checkbox :value="false" type="is-primary">Pictalk in the <b>Microsoft store</b></b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="false" type="is-primary">Provide some <b>pictogramms</b> and <b>bundles</b> at the start of an account (Makathon)</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="false" type="is-primary">Make a <b>video</b> tutorial</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="false" type="is-primary"><b>Translate</b> the website in French, Spanish and German</b-checkbox>
        </b-field>
        <b-field>
            <b-checkbox :value="false" type="is-primary"><b>Download</b> all your pictogramms with one button </b-checkbox>
        </b-field>  
      </p>
    </div>
  </section>
  </div>
</template>
