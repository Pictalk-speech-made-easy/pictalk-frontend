<template>
  <div class="container">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Get Started to PicTalk now !</h1>
        </div>
      </div>
    </section>
    <b-image
      lazy
      :srcset="require('@/assets/Getting_Started.png').srcSet"
      alt="Rocket carrying non-verbal people"
    ></b-image>
    <body>
      <section class="section">
        <h2 class="subtitle">
          In this short tutorial, we will go through the major features of
          PicTalk. Let's <b>go : </b>
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/1-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          This is the first screen you will see. At the top you can see the
          navbar. The navbar helps you navigate through the app. As you can see,
          there are many tabs in PicTalk. To begin your journey, please click on
          the "Sign Up" button.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/2_signup-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>
        <br />
        <h2 class="subtitle">
          This menu will show up. Please complete the form and read carefully
          the legal informations message. Don't put a false email or you will
          lose your account if you don't remember your password... The language
          is also important so the voice will speak your tongue. The name and
          surname are needed because of legal requirements.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/3_signup-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Here is the form after a valid completion.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/4_once_logged.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Congrats ! You can now see the PicTalk homescreen. As you can see it
          is full blank for now. But don't panic, we will fill it up soon ! But
          before diving deep into PicTalk, let's see how it works.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/Collections-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          These are collections. We can think of Collections as a big folder.
          They regroup pictogramms per themes. Of course, you decide. In this
          example I've put some basic themes my little brother uses daily. We
          loves telling us what he wants for dinner ! He also loves to travel
          and let the others know where he went... Let's get back ! The big
          squares are the collections. In the collections you can see little
          squares with some text in them. I call them pictogramms. Don't worry
          If you don't fully understand, we will go through an example later on.
          All good ?
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/Pictogramms-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Let's talk now about pictogramms. Here we zoomed at the Drink & Eat
          collection. We can see pictogramms of a different size and shade. It
          is because pictogramms can, as collections, contain pictogramms. That
          maner allows us to make sentences with ease. Let's say we enter in the
          Drink & Eat collection. We want to drink so we click on the "I want to
          drink..." pictogramm. Once we clicked, we have the choice to click on
          "A cup of water" or "Some tea" or "A juice made of...". If I click on
          A cup of water, Pictalk will say "I want to drink a cup of water". But
          If I clicked on "a juice made of..." and "Apples" instead of "A cup of
          water", Pictalk would say: "I want to drink a juice made of apples".
          The sentence may not sound a bit natural but this is an example were
          this method is the worst... Most of the time it's very good. Now,
          let's head up to creating collections and pictogramms ! I hope you are
          excited !
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/5_question-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Click now in the violet button at the top of the screen. The usual one
          where it's for the parameters. You will see a popup like this one.
          Answering to the addition will bring you to the supervisor mode. It
          let you create, edit and delete collections and pictogramms. Before
          answering the question, let's talk about why I implemented this
          mecanism. I want my app to be as simple as possible. This mecanism
          doesn't need another supervisor password or a complicated thing.
          Educators, parents and brothers can add pictogramms remove, edit
          etc... And that, with only one account. we can have a supervised area
          and the playground. And the child will not be able to delete by error
          some pictogramms.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/6_adminMode-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          We are now in the supervisor mode. At the collections level. Because,
          as we saw before, you need to pick a collection before accessing it's
          pictogramms. You can see the purple button changed to grey. If you
          click the grey button, you will leave supervisor mode. Did you saw the
          circled "+" appear ? It let us create a collection.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/7_create_collection-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Complete the name, the color and upload a file to create the
          collection ! At the bottom of the form, there is a little rectangle
          with a cross in it. Once your file is selected, it will display you
          file's name. (Take a look at the next picture)
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/8_manger-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          And here is my collection. I selected the "manger.png" image. Click on
          "create" to continue.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/9_collections-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          In addition to the "EAT" collection, I created two others. Let's add
          some content in the "EAT" collection. Click the EAT icon.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/11_create_pictogram-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          You will now see a blank screen, that's normal, you don't have
          pictogramms yet. Repeat the same steps as for the collections (click
          in the purple button and answer the question). Here's the create
          pictogramm form. The speech is what actually the app will say. The
          meaning in opposition is simply the name of the picto. The third
          element is the "Folder". If you want your pictogramm to contain other
          pictos, put it to true. Otherwise I recommend you leave it in false.
          In this example the sentence is finished when we will say "I am
          hungry"... We don't need to put other words behind this one. Next,
          upload the image and Create !
        </h2>
        <b-image
          lazy
          :srcset="
            require('@/assets/12_create_pictogram_folder-min.png').srcSet
          "
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Here is an example were it's good to make a pictogram folder. "I want"
          can be followed by many words !
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/13_pictograms-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Here are our two pictogramms. The first means "I'm hungry" and the
          other "I want". As you can see, the color of the bar at the bottom is
          the same as the color you defined in the collection. Take a closer
          look at the pictobar...
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/14_pictobar-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          The "trash" button will bring you to the collections and erase the
          sentence. The other red button is for deleting the last picto of the
          sentence. The last one is for talking. Click on the pictos and try
          constructing sentences. Delete them, etc...
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/15_pictobar_1_picto-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Here is what happens when I click on a pictogramm. It appears on the
          bottom bar, the pictobar.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/16_picto_folder-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Now if I click on the "I want" picto folder it brings me to the
          pictogramms it contains. It's pure blank because it doesn't contain
          any pictogramms yet. Let's create one !
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/17_frites-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Here is the pictogramm I'm making inside of the "I want" folder. As we
          will not put any word after "some french fries" our pictogramm isn't a
          folder.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/18_picto_bar_2pictos-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          Now, click on the "FRIES" pictogramm. See how the pictobar adds "some
          french fries" to the "I want". Let's Talk (click on the blue button)
          VOILAAAA A SENTENCE !!! You have all the knowledge to use Pictalk at
          his best ! I will try to give more examples of pictgramms my brother
          have. Go on for the last screen I'll present here.
        </h2>
        <b-image
          lazy
          :srcset="require('@/assets/19_parameters-min.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>

        <h2 class="subtitle">
          This is the user menu. You can access it by clicking on the blue
          button on the navbar. Here you can change the language, the name and
          all the stuff you entered during Sign Up.
        </h2>
        <br />
        <h2 class="title">Thanks for having read all the tutorial</h2>
      </section>
    </body>
  </div>
</template>
