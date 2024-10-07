<template>
  <div>
    <h1>Matchs d'aujourd'hui - Grands Championnats</h1>
    <ul>
      <li v-for="league in leagues" :key="league.id">
        <!-- Affiche le logo du championnat et son nom -->
        <div>
          <img :src="league.logo" :alt="league.name" width="50" />
          <strong>{{ league.name }}</strong>
        </div>

        <!-- Si des matchs sont programmés, affiche les matchs -->
        <ul v-if="league.fixtures.length">
          <li v-for="fixture in league.fixtures" :key="fixture.id">
            <img :src="fixture.homeTeamLogo" :alt="fixture.homeTeam" width="30" />
            {{ fixture.homeTeam }} vs
            <img :src="fixture.awayTeamLogo" :alt="fixture.awayTeam" width="30" />
            {{ fixture.awayTeam }} - {{ fixture.date }}
          </li>
        </ul>

        <!-- Si aucun match, affiche un message -->
        <p v-else>Aucun match aujourd'hui</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leagues: [
        { id: 39, name: 'Premier League', logo: '', fixtures: [] },
        { id: 140, name: 'La Liga', logo: '', fixtures: [] },
        { id: 135, name: 'Serie A', logo: '', fixtures: [] },
        { id: 78, name: 'Bundesliga', logo: '', fixtures: [] },
        { id: 61, name: 'Ligue 1', logo: '', fixtures: [] },
      ], // Stocke les championnats avec leur ID, nom, et logo
    };
  },
  created() {
    this.fetchLeaguesAndFixturesForToday(); // Récupérer les logos et les matchs des championnats
  },
  methods: {
    // Récupérer la date actuelle au format YYYY-MM-DD
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    // Faire appel à l'API pour récupérer les logos et matchs du jour pour les championnats
    fetchLeaguesAndFixturesForToday() {
      const today = this.getCurrentDate(); // Obtenir la date actuelle

      // Récupérer les matchs du jour
      fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': 'ccb655c33ade9aee154a4c87bfbffa05', // Remplace par ta clé API
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.response) {
            // Parcourir chaque ligue pour ajouter les matchs correspondants
            this.leagues.forEach((league) => {
              // Filtrer les matchs pour la ligue actuelle
              const leagueFixtures = data.response.filter(
                (fixture) => fixture.league.id === league.id
              );

              // Ajouter les matchs et le logo de la ligue si des matchs sont trouvés
              if (leagueFixtures.length) {
                league.logo = leagueFixtures[0].league.logo; // Prendre le logo du premier match
                league.fixtures = leagueFixtures.map((fixture) => ({
                  id: fixture.fixture.id,
                  homeTeam: fixture.teams.home.name,
                  homeTeamLogo: fixture.teams.home.logo,
                  awayTeam: fixture.teams.away.name,
                  awayTeamLogo: fixture.teams.away.logo,
                  date: fixture.fixture.date,
                }));
              } else {
                // Récupérer seulement le logo même s'il n'y a pas de match
                this.fetchLeagueLogo(league.id, league);
              }
            });
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des matchs :', error);
        });
    },
    // Récupérer le logo de la ligue si aucun match n'est programmé
    fetchLeagueLogo(leagueId, league) {
      fetch(`https://v3.football.api-sports.io/leagues?id=${leagueId}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': 'ccb655c33ade9aee154a4c87bfbffa05', // Remplace par ta clé API
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.response && data.response.length) {
            league.logo = data.response[0].league.logo; // Ajouter le logo même sans match
          }
        })
        .catch((error) => {
          console.error(`Erreur lors de la récupération du logo de la ligue ${leagueId} :`, error);
        });
    },
  },
};
</script>

<style scoped>
/* Ajouter du style ici si nécessaire */
</style>
