<template>
    <md-toolbar class="md-primary">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button @click="historyBack" class="md-icon-button">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </div>

        <md-autocomplete
          class="search"
          v-model="selectedEmployee"
          :md-options="employees"
          md-layout="box">
          <label>Search...</label>
        </md-autocomplete>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button">
            <md-icon>refresh</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>
        </div>
      </div>
    </md-toolbar>
<!--    <ul>
      <li><router-link to="/write">wrtie</router-link></li>
    </ul>-->
</template>

<script>
  export default {
    name: 'Header',
    data: () => ({
      selectedEmployee: null,
      employees: [
        'Jim Halpert',
        'Dwight Schrute',
        'Michael Scott',
        'Pam Beesly',
        'Angela Martin',
        'Kelly Kapoor',
        'Ryan Howard',
        'Kevin Malone',
        'Creed Bratton',
        'Oscar Nunez',
        'Toby Flenderson',
        'Stanley Hudson',
        'Meredith Palmer',
        'Phyllis Lapin-Vance'
      ]
    }),
    methods: {
      historyBack(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss">
  .md-toolbar{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  .search {
    max-width: 500px;
  }
  .md-autocomplete-box-content{
    background-color: white;
  }
</style>
