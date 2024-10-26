<template>
  <div id="app">
    <!-- Navigation avec vue-router -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link :to="{ name: 'LeaguePage', params: { id: 39 }}">Premier League</router-link>
    </nav>
    
    <!-- Composant dynamique affiché en fonction de la route actuelle -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  color: black;
  margin-top: 3rem;
}

nav {
  margin-bottom: 20px;
}

nav a {
  text-decoration: none;
  color: blue;
  margin-right: 15px;
}
</style>
