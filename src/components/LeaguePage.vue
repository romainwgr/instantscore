<template>
    <div>
      <h1>Classement {{ id }}</h1>
      <!-- Si le classement est disponible, afficher le tableau -->
      <table v-if="standings.length && !loading">
        <thead>
          <tr>
            <th>Position</th>
            <th>Équipe</th>
            <th>Joués</th>
            <th>Gagnés</th>
            <th>Nuls</th>
            <th>Perdus</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in standings" :key="team.team.id">
            <td>{{ team.rank }}</td>
            <td><img :src="team.team.logo" :alt="team.team.name" width="30" /> {{ team.team.name }}</td>
            <td>{{ team.all.played }}</td>
            <td>{{ team.all.win }}</td>
            <td>{{ team.all.draw }}</td>
            <td>{{ team.all.lose }}</td>
            <td>{{ team.points }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Afficher un message si le classement est vide -->
      <p v-else-if="!loading && !standings.length">Classement non disponible pour cette ligue.</p>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const standings = ref([]);
      const loading = ref(true);
      const error = ref(null);
  
      const fetchLeagueStandings = async (leagueId) => {
        loading.value = true; // Assurez-vous que loading est à true lors de chaque fetch
        error.value = null; // Réinitialiser l'erreur
  
        try {
          const response = await fetch(
            `https://v3.football.api-sports.io/standings?league=${leagueId}&season=2024`,
            {
              method: 'GET',
              headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': 'ccb655c33ade9aee154a4c87bfbffa05', // Remplace par ta clé API
              },
            }
          );
          const data = await response.json();
          if (data && data.response && data.response.length) {
            standings.value = data.response[0].league.standings[0];
          } else {
            throw new Error('Aucun classement trouvé.');
          }
        } catch (err) {
          error.value = `Erreur lors de la récupération du classement : ${err.message}`;
        } finally {
          loading.value = false;
        }
      };
  
      // Appeler la fonction de récupération au montage du composant
      onMounted(() => {
        fetchLeagueStandings(props.id);
      });
  
      // Regarder les changements sur props.id au cas où la route change
      watch(
        () => props.id,
        (newId) => {
          fetchLeagueStandings(newId);
        }
      );
  
      return {
        standings,
        loading,
        error
      };
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    padding: 8px 12px;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
  }
  
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  img {
    vertical-align: middle;
    margin-right: 10px;
  }
  </style>
  