<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Sign Up</p>
      </header>
      <section class="modal-card-body">
        <b-steps v-model="activeStep" animated rounded has-navigation mobile-mode>
          <b-step-item step="1" label="Basics" clickable>
            <h1 class="title has-text-centered">Basic Information</h1>
            <b-field label="Name">
              <b-input maxlength="30" placeholder="Dupont"></b-input>
            </b-field>
            <b-field label="Surname">
              <b-input placeholder="Pierre" maxlength="30"></b-input>
            </b-field>
            <b-field label="Email" type="is-danger" message="This email is invalid">
              <b-input placeholder="exemple@mail.com" loading type="email" maxlength="30"></b-input>
            </b-field>
            <b-field
              label="Password"
              type="is-warning"
              :message="['Password is too short', 'Password must have at least 8 characters']"
            >
              <b-input placeholder="S0meExample!" type="password" maxlength="30"></b-input>
            </b-field>
          </b-step-item>

          <b-step-item step="2" label="Additionnal" clickable>
            <h1 class="title has-text-centered">Additionnal information</h1>
            <b-message type="is-info">
              This additionnal information is optionnal.
              In case you want to benefit from additional features, please fill them.
            </b-message>
            <b-field label="Address">
              <b-input placeholder="Potato St, NewYork"></b-input>
            </b-field>
            <b-field label="Date of Birth">
              <b-datepicker inline></b-datepicker>
            </b-field>
            <b-field label="Gender">
              <b-select placeholder="Select gender" rounded>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </b-select>
            </b-field>
          </b-step-item>

          <b-step-item step="3" label="Finish" clickable>
            <h1 class="title has-text-centered">Finish</h1>Lorem ipsum dolor sit amet.
          </b-step-item>
        </b-steps>
      </section>
    </div>
  </form>
</template>