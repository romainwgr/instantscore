<template>
  <div>
    <h1>Aujourd'hui - Grands Championnats</h1>
    <ul>
      <li v-for="league in leagues" :key="league.id" class="league-container">
        <!-- Conteneur cliquable pour chaque ligue -->
        <button @click="viewLeague(league.id,league.name)" class="league-header">
          <div>
            <img :src="league.logo" :alt="league.name" width="50" />
          </div>
        </button>

        <!-- Si des matchs sont programmés, les afficher -->
        <ul v-if="league.fixtures.length">
          <li v-for="fixture in league.fixtures" :key="fixture.id" class="fixture-container">
            <div class="match-item">
              <img :src="fixture.homeTeamLogo" :alt="fixture.homeTeam" width="30" />
              {{ fixture.homeTeam }} vs
              <img :src="fixture.awayTeamLogo" :alt="fixture.awayTeam" width="30" />
              {{ fixture.awayTeam }} - {{ fixture.date }}
            </div>
          </li>
        </ul>

        <!-- Si aucun match, afficher le message avec bouton -->
        <button v-else @click="viewLeague(league.id)" class="no-match">
          Aucun match aujourd'hui
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leagues: [
        { id: 39, name: 'Premier League',logo: 'https://pub-04e39e7700124882ad144cc86818b7c1.r2.dev/premierleague.webp', fixtures: [] },
        { id: 140, name: 'La Liga',logo: 'https://pub-04e39e7700124882ad144cc86818b7c1.r2.dev/laliga.webp', fixtures: [] },
        { id: 135, name: 'Serie A',logo: 'https://pub-04e39e7700124882ad144cc86818b7c1.r2.dev/seriea.png', fixtures: [] },
        { id: 78, name: 'Bundesliga',logo: 'https://pub-04e39e7700124882ad144cc86818b7c1.r2.dev/bundesliga.webp', fixtures: [] },
        { id: 61, name: 'Ligue 1',logo: 'https://pub-04e39e7700124882ad144cc86818b7c1.r2.dev/ligue1fr.png', fixtures: [] },
      ],
    };
  },
  created() {
    this.fetchLeaguesAndFixturesForToday();
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    fetchLeaguesAndFixturesForToday() {
      const today = this.getCurrentDate();

      fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': 'ccb655c33ade9aee154a4c87bfbffa05',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.response) {
            this.leagues.forEach((league) => {
              const leagueFixtures = data.response.filter(
                (fixture) => fixture.league.id === league.id
              );

              if (leagueFixtures.length) {
                league.logo = leagueFixtures[0].league.logo;
                league.fixtures = leagueFixtures.map((fixture) => ({
                  id: fixture.fixture.id,
                  homeTeam: fixture.teams.home.name,
                  homeTeamLogo: fixture.teams.home.logo,
                  awayTeam: fixture.teams.away.name,
                  awayTeamLogo: fixture.teams.away.logo,
                  date: fixture.fixture.date,
                }));
              }
            });
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des matchs :', error);
        });
    },
    viewLeague(leagueId,leagueName) {
      this.$router.push({ name: 'LeaguePage', params: { id: leagueId, name: leagueName } });
    },
  },
};
</script>

<style scoped>
/* Réinitialisation minimale et essentielle */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding: 10px;
  background-color: white;
  color: grey;
}

/* Conteneur de ligue */
.league-container {
  margin-bottom: 20px;
}

/* Bouton de ligue */
.league-header {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.league-header img {
  margin-right: 10px;
}

.match-item {
  margin-left: 10px;
}

.no-match {
  background-color: #ffcccc;
  border: 1px solid #ff6666;
  padding: 10px;
  cursor: pointer;
  display: block;
  text-align: left;
  margin-top: 10px;
  width: 100%;
}
</style>
