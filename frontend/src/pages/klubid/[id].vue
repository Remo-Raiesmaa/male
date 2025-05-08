<template>
  <v-container>
    <v-row v-if="club">
      <v-col cols="12">
        <h1 class="mb-2"><a href="/klubid">Klubid</a> / {{ club.name }}</h1>
      </v-col>
    </v-row>

    <v-row v-if="club" align="start">
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title class="text-h5">{{ club.membersCount }}</v-card-title>
          <v-card-text>MÄNGIJAID</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title class="text-h5">{{ club.averageRating }}</v-card-title>
          <v-card-text>KESKMINE REITING</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined elevation="1">
          <v-card-title class="font-weight-bold text-h6">TOP mängijad</v-card-title>
          <v-card-text>
            <v-list class="pa-0">
              <v-list-item
                v-for="(player, index) in topPlayers"
                :key="index"
                class="rounded-lg pa-3 mb-2 d-flex align-center justify-space-between"
                style="background-color: #fff; box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1); width: 100%;"
              >
                <div class="d-flex align-center">
                  <div
                    class="mr-4 px-2 py-1 rounded"
                    :style="`background-color: ${getMedalColor(index)}; font-weight: 500; width: 24px; text-align: center;`"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="text-body-1 font-weight-medium">{{ player.firstName }} {{ player.lastName }}</div>
                </div>
                <div class="text-grey-darken-1 font-weight-medium">
                  {{ player.ranking }}
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6" thickness="3"></v-divider>

    <v-row v-if="club">
      <v-col cols="12" md="6" lg="4">
        <ModifyClubForm
          :is-update="true"
          :club-id="clubId"
          @club-updated="fetchClubData"
        />
      </v-col>
    </v-row>

    <v-divider v-if="club" class="my-6" thickness="3"></v-divider>

    <v-row v-if="club">
      <v-col>
        <PlayersSearchTable :club-id="clubId" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <h2>Klubi ei leitud</h2>
        <p>Vabandame, antud klubi ei eksisteeri või on andmed puudulikud.</p>
        <v-btn color="primary" @click="this.$router.push('/klubid')">
          Tagasi klubide lehele
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fetchClubById } from "@/wrapper/clubsApiWrapper.js";
import { fetchPlayersByClubId } from "@/wrapper/playersApiWrapper.js";
import PlayersSearchTable from "@/components/clubs/PlayersSearchTable.vue";
import AddClubDialog from "@/components/clubs/AddClubDialog.vue";
import ModifyClubForm from "@/components/clubs/ModifyClubForm.vue";

export default {
  name: "ClubDetailsPage",
  components: {
    ModifyClubForm,
    AddClubDialog,
    PlayersSearchTable,
  },
  data() {
    return {
      club: null,
      clubId: null,
      topPlayers: [],
      showModifyClubDialog: false,
    };
  },
  created() {
    this.clubId = this.$route.params.id;
    this.$watch(
      () => this.$route.params.id,
      this.fetchClubData,
      { immediate: true }
    );
  },
  methods: {
    async fetchClubData() {
      this.club = await fetchClubById(this.clubId);
      const clubPlayers = await fetchPlayersByClubId(this.clubId);
      const withRanking = clubPlayers.filter(p => p.ranking != null);
      const sorted = withRanking.sort((a, b) => b.ranking - a.ranking);
      this.topPlayers = sorted.slice(0, 3);
    },
    openModifyClubDialog() {
      this.showModifyClubDialog = true;
    },
    updateShowModifyDialog(value) {
      this.showModifyClubDialog = value;
    },
    getMedalColor(index) {
      return index === 0
        ? '#fff3cd' // kuldne
        : index === 1
        ? '#e0e0e0' // hõbe
        : index === 2
        ? '#e6c3b5' // pronks
        : 'transparent';
    },
  },
};
</script>

<style scoped>
.club-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
}
</style>
