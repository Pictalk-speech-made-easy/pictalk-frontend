<template>
  <div>
    <section class="section">
    <div class="container">
      <h1 class="title">Help</h1>
      <b-image lazy alt="A little boy talking thanks to Pictalk" 
				:srcset="require('@/assets/Help.png').srcSet"
                style="width: 80%;margin-left: 10%"
				></b-image>

        <div class="box">
          <b-button
            type="is-primary"
            icon-right="home"
          />
          <br>
          <br>
          This button will bring you to your collections menu. It will delete the sentence you are doing.
        </div>
        <div class="box">
          <b-button
            type="is-info"
            icon-right="account-circle"
          />
                    <br>
          <br>
          This button will bring you to your account menu. The account menu let you change your email, language and password.
        </div>
        <div class="box">
          <b-button
            type="is-link"
            icon-right="pencil"
          />
            <b-button
                type="is-light"
                icon-right="pencil"
            />
                      <br>
          <br>
            These buttons will allow you to enter in supervisor mode and quit supervisor mode. Supervisor mode is required in order to modify, add en delete pictograms.
        </div>
        <div class="box">
            <b-button type="is-danger" icon-right="delete" />
                      <br>
          <br>
            This button will delete your current sentence and bring you to the collections menu. Works the same as the "home" button.
        </div>
        <div class="box">
            <b-button
                type="is-danger"
                icon-right="backspace"
            />
                      <br>
          <br>
            This button will delete the last picto in your sentence. If it was a folder, then you go back to the previous screen.
        </div>
        <div class="box">
            <b-button
                type="is-success"
                icon-right="message"
            />
                      <br>
          <br>
            This button will pronounce and speak at loud the sentence you are doing.
        </div>
     <div class="box">
         <b-button
            type="is-info"
            icon-right="content-copy"
        />
                  <br>
          <br>
        This button will copy your current sentence. You can now paste the sentence everywhere !
     </div>
     <div class="box">
         <b-button
            type="is-success"
            icon-right="refresh"
        />
                  <br>
          <br>
        Sometimes you will need to press this button to fetch your lastest pictograms. 
        Let's say you have added 10 pictograms in your computer and they don't show up in your kid's phone : Hit this button in his phone and it will fetch all the recent pictograms and data you uploaded !
     </div>
    </div>
  </section>
  </div>
</template>
