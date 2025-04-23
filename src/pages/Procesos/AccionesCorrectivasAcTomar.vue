<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="help" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-toolbar-title
          >Acciones Correctivas - Acciones a Tomar
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formEntregaMedidores">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-xs-12 col-sm-12 col-md-12 q-pt-sm"
              v-model="AccionCorrectiva.CargoQuienLevantaAccion"
              label="Acciones a tomar"
              type="textarea"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-12 q-pt-sm"
              v-model="AccionCorrectiva.Hallazgo"
              label="Observaciones"
              type="textarea"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.NCSimilares"
              label="NC Similares"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.ImagenCausas"
              label="Imagen de Causas"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.CausaRaiz"
              label="Causa Raíz"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.Correcciones"
              label="Correcciones"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.ResponsableCierre"
              label="Responsable de Cierre"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-12 q-pt-sm"
              v-model="AccionCorrectiva.ProcesoLevantaAccion"
              type="textarea"
              label="Proceso que Levanta la Acción"
            />
          </div>
        </div>
        <div class="row justify-center q-pa-sm">
          <q-btn label="Guardar" icon="save" outline align="center" unelevated>
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<script>
import utils from "../../commons/utils.js";
export default {
  name: "AccionesCorrectivas",
  data() {
    return {
      // Aquí van las propiedades reactivas del componente
      TipoEvaluacion: [
        { IdTipoEvaluacion: "I", Nombre: "Interna" },
        { IdTipoEvaluacion: "E", Nombre: "Externa" },
      ],
      AccionCorrectiva: {
        IdAccionCorrectiva: 0,
        IdTipoEvaluacion: "",
        FechaApertura: utils.fechaActual(),
        FechaCierre: utils.fechaActual(),
        ProcesoLevantaAccion: "",
        QuienLevantaAccion: "",
        CargoQuienLevantaAccion: "",
        IdTramitoAccion: 0,
        Hallazgo: "",
        NCSimilares: "",
        ImagenCausas: "",
        CausaRaiz: "",
        Correcciones: [],
        ResponsableCierre: "",
      },
    };
  },
  methods: {
    // Aquí van los métodos del componente
  },
  computed: {
    // Aquí van las propiedades computadas del componente
  },
  mounted() {
    // Aquí van las acciones a realizar cuando el componente se monte
  },
};
</script>

<style scoped>
/* Aquí van los estilos específicos del componente */
</style>
