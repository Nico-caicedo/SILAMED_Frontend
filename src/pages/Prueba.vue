<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-light-blue-9">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="vpn_key" />
        </q-avatar>
        <q-toolbar-title>SILAMED</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <div class="row justify-center q-pt-sm">
          <img class="col-xs-6 col-sm-3 col-md-2" src="~assets/logo.png" />
        </div>
        <div>
          <p>Puede buscar su certificado:</p>
          <div class="col-xs-5 col-sm-3 col-md-2">
            <q-input v-model="search" filled type="search" hint="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
          </div>
     
        </div>

        <!-- Aquí puedes activar algo en la página basado en el ID -->
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  data() {
    return {
      id: null,
    };
  },
  created() {
    // Acceder al parámetro ID de la ruta
    this.id = this.$route.params.id;

    // Aquí puedes activar algo en la página basado en el ID
  },
};
</script>
