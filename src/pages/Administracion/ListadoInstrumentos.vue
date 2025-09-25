<template>
  <q-layout view="lHh lpr lFf" container style="height: 92vh" class="shadow-2 rounded-borders">
    <q-page-container v-if="Show">
      <h3 class="text-center q-mt-md">Listado de Instrumentos</h3>
      <div class="bg-grey-3 q-pa-md rounded-borders">
        <q-table
          title="Instrumentos"
          :data="ListInstrument"
          :columns="columns"
          row-key="name"
          flat
          bordered
          dense
          @row-click="SeleccionarInstrumento"
        />
      </div>
    </q-page-container>
    <q-page-container v-if="!Show">
      <p @click="Show = true">Regresar</p>
      <h3>Hoja de vida</h3>

      {{ Instrumento }}
    </q-page-container>
  </q-layout>
</template>

<script>
import Utils from "../../commons/utils.js";
export default {
  name: 'ListadoInstrumentos',
  data() {
    return {
      Show: true,
      Instrumento:[],
      ListInstrument: [
        {
          SerialInstrumento: 1234556,
          Instrumento: 'Recipiente Volumentrico',
          TipoInstrumento: 6.0,
          VMediccion: 24,
          EstadoInstrumento: 4.0,
        },
         {
          SerialInstrumento: 1234556,
          Instrumento: 'Recipiente Volumentrico',
          TipoInstrumento: 6.0,
          VMediccion: 24,
          EstadoInstrumento: 4.0,
        },
       
       
      ],
      columns: [
        { name: 'SerialInstrumento', label: 'Serial Instrumento', align: 'left', field: 'SerialInstrumento', sortable: true },
        { name: 'Instrumento', label: 'Nombre Instrumento', align: 'left', field: 'Instrumento', sortable: true },
        { name: 'TipoInstrumento', label: 'Tipo Instrumento', align: 'center', field: 'TipoInstrumento', sortable: true },
        { name: 'VMediccion', label: 'Variable Medición', align: 'center', field: 'VMediccion', sortable: true },
         { name: 'EstadoInstrumento', label: 'Estado Instrumento', align: 'center', field: 'EstadoInstrumento', sortable: true }
      ]
    }
  },
  methods: {
    SeleccionarInstrumento(evt, row, index){
      if(row){
       this.Show = false
       this.Instrumento = row
      }else
      {
       Utils.Notificaciones("Error al seleccionar", "negative", "bottom",this)
      }
    }
  }

}
</script>
