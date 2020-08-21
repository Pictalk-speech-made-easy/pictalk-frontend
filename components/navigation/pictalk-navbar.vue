<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" to="/">
        <img
          src="~/assets/logo.png"
          alt="A web app that help speach-disabled people"
          style="height: 100px;"
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/">Home</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/getstarted">Get Started !</b-navbar-item>
      <b-navbar-dropdown label="Info">
        <b-navbar-item tag="nuxt-link" to="/about">About</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <button class="button is-primary">AdminMode</button>
          <b-button type="is-light">Log Out</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
