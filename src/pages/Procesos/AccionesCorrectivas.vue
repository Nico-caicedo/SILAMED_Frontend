<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="fact_check" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-toolbar-title
          >Acciones Correctivas - Identificación
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formEntregaMedidores">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <q-select
              class="col-xs-12 col-sm-6 col-md-4 q-field--with-bottom"
              v-model="AccionCorrectiva.IdTipoEvaluacion"
              :options="TipoEvaluacion"
              map-options
              emit-value
              option-value="IdTipoEvaluacion"
              option-label="Nombre"
              hide-dropdown-icon
              hide-selected
              fill-input
              input-debounce="0"
              label="Tipo de Evaluación"
            >
              <template v-slot:prepend>
                <q-icon name="task_alt" size="lg" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label caption
                      ><b> {{ scope.opt.Nombre }} </b></q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
              stack-label
              label="Fecha Apertura"
              v-model="AccionCorrectiva.FechaApertura"
              type="date"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input
              class="col-xs-12 col-sm-6 col-md-3 q-pt-sm"
              stack-label
              label="Fecha Cierre"
              readonly
              v-model="AccionCorrectiva.FechaCierre"
              type="date"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.QuienLevantaAccion"
              label="Quién Levanta la Acción"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.CargoQuienLevantaAccion"
              label="Cargo de Quién Levanta la Acción"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-6 q-pt-sm"
              v-model="AccionCorrectiva.IdTramitoAccion"
              label="Quén Tramitó la Acción"
            />
            <q-input
              class="col-xs-12 col-sm-12 col-md-12 q-pt-sm"
              v-model="AccionCorrectiva.Hallazgo"
              label="Hallazgo"
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
