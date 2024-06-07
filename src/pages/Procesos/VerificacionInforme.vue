<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title> Verificación Informe de medidor </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form ref="formVerificacionCalibracionMedidores">
        <div class="q-pa-md">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step :name="1" title="1. Seleccione un informe para realizar la verificación" icon="search"
              :done="step > 1">
              <div class="row q-col-gutter-sm">
                <q-toggle class="col-xs-12 col-sm-6 col-md-3 q-field--with-bottom q-pt-sm" v-model="todasFechas"
                  checked-icon="check" color="green" label="Consultar todas las fechas" unchecked-icon="clear" />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" readonly stack-label label="Registros Encontrados"
                  v-model="ListInformes.length" outlined />
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Fecha Inicio"
                  :readonly="todasFechas === true" v-model="Informe.Fechaini_calibracion" type="date" outlined>
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-3 q-pt-sm" stack-label label="Fecha Fin"
                  :readonly="todasFechas === true" v-model="Informe.Fechafin_calibracion" type="date" outlined>
                  <template v-slot:prepend>
                    <q-icon name="date_range" size="lg" />
                  </template>
                </q-input>
                <q-table class="col-xs-12 col-sm-12 col-md-12" title="" no-data-label="No hay registros" hide-bottom
                  :rows-per-page-options="[0]" flat bordered :data="ListInformes" :columns="columnsCalibraciones"
                  :visible-columns="vcCalibraciones">
                  <template v-slot:body-cell-Seleccionar_calibracion="props">
                    <q-td key="Seleccionar_calibracion" :props="props" auto-width>
                      <q-btn :icon="props.row.Icono" :color="props.row.Color" align="center" outline
                        @click="CargarInfomre(props.row)" />
                    </q-td>
                  </template>
                  <template v-slot:top="props">
                    <q-btn color="primary" icon-right="archive" label="" no-caps
                      @click="exportTable(ListInformes, columnsCalibraciones)" />
                    <q-space />
                    <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
            " @click="props.toggleFullscreen" class="q-ml-md" />
                    <q-space />
                    <q-select v-model="vcCalibraciones" multiple outlined dense options-dense
                      :display-value="$q.lang.table.columns" emit-value map-options :options="columnsCalibraciones"
                      option-value="name" options-cover style="min-width: 150px" />
                  </template>
                </q-table>
              </div>
              <div class="row justify-center q-pa-sm">
                <q-btn label="Consultar" icon="search" outline align="center" unelevated
                  @click="consultarFiltroCalibracion()">
                </q-btn>
              </div>
            </q-step>
            <!-- datos medidor -->

            <q-step :name="2" title="2. Verificar Medidor" icon="settings" :done="step > 2">
              Información Medidor

              <div class="row q-col-gutter-sm">
                <!-- disable readonly  -->
                <!-- <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" 
                  stack-label label="Año Fabricación" 
                  v-model="ordenEntradaD.Fabricacion_ordenentradad"
                  type="number" outlined  /> -->

                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Serial Medidor"
                  v-model="VerificacionInforme.SerialMedidor" outlined />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Año Fabricación"
                  v-model="VerificacionInforme.AñoFabricacion" type="number" outlined disable />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Lectura orden"
                  v-model="VerificacionInforme.LecturaOrdenEntradad" type="number" outlined disable />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Marca Medidor"
                  v-model="VerificacionInforme.MarcaMedidor" outlined disable />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Modelo Medidor"
                  v-model="VerificacionInforme.ModeloMedidor" outlined disable />
                <q-input class="col-xs-12 col-sm-6 col-md-4 q-pt-sm" stack-label label="Norma Referencia"
                  v-model="VerificacionInforme.NormaRef" outlined disable />
              </div>
              <div></div>
              <q-stepper-navigation>
                <q-btn label="Continuar" @click="step = 3" color="green" />
                <q-btn @click="step = 6" outline align="center" unelevated color="red" label="Saltar" class="q-ml-sm" />
                <q-btn @click="step = 1" color="primary" label="Volver" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
            <!-- paso 3 evidencai fotografica -->
            <q-step :name="3" title="3. Verificar Evidencia Fotográfica" icon="photo" :done="step > 3">
              verificación de evidencia Fotográfica
              <div class="q-pa-xs flex justify-around" style="gap: 15px">
                <div class="q-pa-xs flex justify-around" style="gap: 15px">
                  <q-card class="my-card bg-grey-2" style="width: 148px"
                    v-for="(imageSrc, index) in VerificacionInforme.img" :key="index">
                    <q-img :src="imageSrc" @click="AbrirCambio(index)"></q-img>
                  </q-card>
                  <q-dialog v-model="dialogReplace" :position="position">
                    <q-card style="width: 350px">
                      <q-card-section class="row items-center wrap justify-center">
                        <q-btn flat icon="photo_camera" label="camara" @click="replaceImage(index, 1)" />

                        <q-btn flat icon="add_photo_alternate" label="Abrir galeria" @click="replaceImage(index, 0)" />
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn label="Continuar" @click="step = 4" color="green" />
                <q-btn @click="step = 5" outline align="center" unelevated color="red" label="Saltar" class="q-ml-sm" />
                <q-btn @click="step = 2" color="primary" label="Volver" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
            <!-- paso 4 verificar incidencias -->
            <q-step :name="4" title="4. Verificar Incidencias" icon="list" :done="step > 4">
              verificación de evidencia Fotográfica
              <div class="bg-cyan text-white">
                <q-toolbar>

                  <q-toolbar-title>verificación de Incidencias</q-toolbar-title>
                  <q-btn flat round dense icon="add_task" />
                </q-toolbar>
              </div>
              <q-table class="col-xs-12 col-sm-12 col-md-3" dense title="" no-data-label="No hay registros" hide-bottom
                :rows-per-page-options="[0]" flat bordered :data="lisIncidencias" :columns="columnsIncidencias"
                row-key="Id_incidencia" selection="multiple" :selected.sync="selected">
                <template v-slot:header-selection="scope">
                  <q-toggle v-model="scope.selected" />
                </template>
                <template v-slot:body-selection="scope">
                  <q-toggle v-model="scope.selected" dense />
                </template>
              </q-table>
              <q-stepper-navigation>
                <q-btn label="Continuar" @click="step = 5" color="green" />
                <q-btn @click="step = 6" outline align="center" unelevated color="red" label="Saltar" class="q-ml-sm" />
                <q-btn @click="step = 3" color="primary" label="Volver" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
            <!-- paso 5 observacion -->
            <q-step :name="5" title="5. Verificar Declaración de inconformidad" icon="chat" :done="step > 5">
              Proceda a realizar la verificación de Declaración de inconformidad
              <q-input v-model="VerificacionInforme.Declaracion" filled autogrow />

              <q-stepper-navigation>
                <q-btn color="primary" @click="step = 6" label="Siguiente" />
                <q-btn flat @click="step = 4" color="primary" label="Volver" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
            <!-- paso 6 fin -->
            <q-step :name="6" title="6. Fin de la Verificación" icon="emoji_events" :done="step > 6">
              Ingrese una observación para la finalización de la verificación de
              la calibración
              <div class="row q-col-gutter-sm">
                <!-- <q-input class="col-xs-12 col-sm-12 col-md-12 q-pt-sm" 
                      stack-label label="Observación Verificación Calibración" 
                      v-model="VerificacionCalibracion.Observacion_verifcalib"
                      type="textarea" outlined  >
                      <template v-slot:prepend>
                        <q-icon name="list" size="lg" />
                      </template>
                    </q-input> -->
              </div>
              <q-stepper-navigation>
                <q-btn color="primary" @click="FinalizarVerificacion(VerificacionInforme)"
                  label="Finalizar Verificación" />
                <q-btn flat @click="step = 5" color="primary" label="Volver" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
          <div class="row q-col-gutter-sm">
            <div class="q-pa-md q-gutter-md">
              <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
<style>
.borde-interno {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.disable_card {
  background: rgba(135, 132, 132, 0.16) !important;
  opacity: 0.5;
}
</style>
<script>
import { api } from "boot/axios";
import {UrlServer} from "boot/server.js"
import utils from "../../commons/utils.js";
import { date } from "quasar";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== undefined ? formatFn(val) : val;

  formatted =
    formatted === undefined || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  name: "programacionOrden",
  data() {
    return {
      dialog: false,
      dialogReplace: false,
      position: "bottom",
      imageSrcs: [],
      model: null,
      Repeticiones: 1,
      IdCaudalMostrar: "",
      NRepeticion: 0,
      RepeticionesFaltantes: 0,
      Informe: {
        IdInforme: "",
        IdOrdenEntradad: "",
        Fechaini: "",
        Fechafin_calibracion: "",
        Fecha_calibracion: "",
        Observacion: "",
        SerialMedidor: "",
        NInforme: "",
      },
      VerificacionInforme: {
        Id_verifcalib: -1,
        Id_calibracion: -1,
        Fecha_verifcalib: "",
        Login_verifcalib: "",
        Observacion_verifcalib: "",
        Estado_verifcalib: 1,
        ListaVerificacionInstrumento: [],
        ListaVerificacionMedidor: [],
        SerialMedidor: "",
        NInforme: "",
        img: [],
      },
      VerificacionCopia: {
        Id_verifcalib: -1,
        Id_calibracion: -1,
        Fecha_verifcalib: "",
        Login_verifcalib: "",
        Observacion_verifcalib: "",
        Estado_verifcalib: 1,
        ListaVerificacionInstrumento: [],
        ListaVerificacionMedidor: [],
        SerialMedidor: "",
        NInforme: "",
        img: [],
      },

      ListInformes: [],
      LisCalibracionPrueba: [],
      LisRepeticionCP: [],
      LisRepeticionCPInstrumentos: [],
      LisRepeticionCPMedidores: [],
      step: 1,
      LisLecturasIniciales: [],
      LisLecturasFinales: [],
      todasFechas: false,
      ListaInstrumentosGeneral: [],
      listaInstrumentos: [],
      columnsInstrumentos: [
        {
          name: "Id_instrumento",
          label: "Id",
          field: "Id_instrumento",
          sortable: true,
        },
        {
          name: "Codigo_instrumento",
          align: "left",
          label: "Código",
          field: "Codigo_instrumento",
          sortable: true,
        },
        {
          name: "Descripcion_instrumento",
          label: "Descripción",
          field: "Descripcion_instrumento",
          sortable: true,
        },
      ],
      selected: [],

      fechaIni: "",
      fechaFin: "",
      componente: null,
      isDialogComponente: false,
      isDialogComponenteInstrumentos: false,
      isDialogComponenteFiltro: false,
      VolumenRecipiente: 0,
      fecha: date,
      usuario: {},

      vcCalibraciones: ["ID_ORDENENTRADAD", "NInforme", "SerialMedidor"],
      columnsCalibraciones: [
        {
          name: "Seleccionar_calibracion",
          align: "left",
          label: "Verificar",
          field: "Seleccionar_calibracion",
          required: true,
          sortable: true,
        },
        {
          name: "IdInforme",
          align: "left",
          label: "Id Informe",
          field: "IdInforme",
          required: true,
          sortable: true,
        },
        {
          name: "ID_ORDENENTRADAD",
          label: "IdOrdenEntradad",
          field: "ID_ORDENENTRADAD",
          sortable: true,
        },
        {
          name: "NInforme",
          label: "NInforme",
          field: "NInforme",
          sortable: true,
        },
        {
          name: "SerialMedidor",
          label: "Medidor",
          field: "SerialMedidor",
          sortable: true,
        },
        {
          name: "Nombre_supervisor",
          align: "left",
          label: "Nombre Supervisor",
          field: "Nombre_supervisor",
          sortable: true,
        },
        {
          name: "Nombre_encargado",
          align: "left",
          label: "Nombre Encargado",
          field: "Nombre_encargado",
          sortable: true,
        },
        {
          name: "Observacion_calibracion",
          align: "left",
          label: "Observacion",
          field: "Observacion_calibracion",
          sortable: true,
        },
      ],
      vcCalibracionPruebas: [
        "Tempambini_calprueba",
        "Tempambfin_calprueba",
        "Humedadrelini_calprueba",
        "Humedadrelfin_calprueba",
        "Fechaini_calprueba",
        "Fechafin_calprueba",
      ],
      columnsCalibracionPruebas: [
        {
          name: "Seleccionar_calibracionprueba",
          align: "left",
          label: "Verificar",
          field: "Seleccionar_calibracionprueba",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calprueba",
          align: "left",
          label: "Id",
          field: "Id_calprueba",
          required: true,
          sortable: true,
        },
        {
          name: "Id_calibracion",
          align: "left",
          label: "IdCal",
          field: "Id_calibracion",
          required: true,
          sortable: true,
        },
        {
          name: "Id_caudal",
          align: "left",
          label: "caudal",
          field: "Id_caudal",
          required: true,
          sortable: true,
        },
        {
          name: "Fechaini_calprueba",
          align: "left",
          label: "Inicio",
          field: "Fechaini_calprueba",
          sortable: true,
        },
        {
          name: "Fechafin_calprueba",
          align: "left",
          label: "Final",
          field: "Fechafin_calprueba",
          sortable: true,
        },
      ],
      index: "",
      ListIncidencias: [],
      columnsIncidencias: [
        {
          name: "Id_incidencia",
          required: true,
          label: "Id",
          field: "Id_incidencia",
          sortable: true,
        },
        {
          name: "Nombre_incidencia",
          align: "left",
          label: "Nombre Incidencia",
          field: "Nombre_incidencia",
          sortable: true,
        },
      ],

    };
  },
  mounted() {
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
    utils.verificarUsuario(this.usuario.LoginUsuario, this);
    this.accesos = this.$q.localStorage.getItem("accesosSILAMED");
    const incidencia = { Id_incidencia: -1, Nombre_incidencia: "" };
    this.mostrarIncidencias(incidencia);
  },
  created() {
    const instrumento = {
      Id_instrumento: -1,
      IdTipoInstrumento: 0,
      Id_variablemedicion: "",
      Nombre_variablemedicion: "",
      Nombre_instrumento: "",
      Serial_instrumento: "",
      Codigo_instrumento: "",
      Descripcion_instrumento: "",
      Activo_instrumento: 1,
      Login_instrumento: "",
      LisTrazabilidadInstrumentos: [],
    };

    const caudal = { ...this.caudal };
    caudal.Id_caudal = "";
    caudal.Nombre_caudal = "";
    this.mostrarCaudal(caudal);
    this.Informe.Fechaini_calibracion = utils.fechaActual();
    this.Informe.Fechafin_calibracion = utils.fechaActual();
  },
  methods: {
    AbrirCambio(index) {
      this.index = index;
      this.dialogReplace = true;
    },
    captureImage(tipo) {
      navigator.camera.getPicture(
        (data) => {
          // on success
          const imageSrc = `data:image/jpeg;base64,${data}`;

          // Agregar la nueva imagen a la matriz de imágenes
          this.imageSrcs.push(imageSrc);
        },
        () => {
          // on fail
          this.$q.notify("Could not access device camera.");
        },
        {
          quality: 100,
          destinationType: 0,
          targetWidth: 1600,
          targetHeight: 1200,
          sourceType: tipo,
          encodingType: 0,
          saveToPhotoAlbum: false,
          correctOrientation: true,
        }
      );
    },
    replaceImage(index, tipo) {
      this.$q.notify("este es index" + index);
      // Tomar una nueva foto o seleccionar una imagen de la galería
      navigator.camera.getPicture(
        (imageData) => {
          // En caso de éxito
          // Concatenar los datos de la imagen en una URL base64
          const imageSrc = `data:image/jpeg;base64,${imageData}`;

          // Reemplazar la imagen en la posición 'index' con la nueva imagen
          this.$set(this.VerificacionInforme.img, index, imageSrc);
        },
        () => {
          // En caso de fallo
          // Mostrar una notificación si no se puede acceder a la cámara del dispositivo
          this.$q.notify("No se pudo acceder a la cámara del dispositivo.");
        },
        {
          quality: 100,
          destinationType: 0,
          targetWidth: 1600,
          targetHeight: 1200,
          sourceType: tipo,
          encodingType: 0,
          saveToPhotoAlbum: false,
          correctOrientation: true,
        }
      );
    },
    OpenCamera(option) {
      this.position = "bottom";
      if (option == 1) {
        this.dialog = true;
      }

      if (option == 2) {
        this.dialogReplace = true;
      }
    },
    CargarInfomre(Inf) {
      const self = this;
      console.log(Inf);

      Inf.Icono = "verified";
      Inf.Color = "red";

      var i = this.ListInformes.indexOf(Inf);

      api
        .post(`/medidor/CallMedidor/${Inf.IdOrdenEntradad}`)
        .then((response) => {
          self.VerificacionInforme = response.data;
          // const baseURL = "http://170.0.1.62:3000/";
          this.VerificacionInforme.img = this.VerificacionInforme.img.map(
            (image) => `${UrlServer}${image}`
          );

          this.selected = this.VerificacionInforme.listIncidencias
          console.log(self.VerificacionInforme);
          this.VerificacionCopia = JSON.parse(JSON.stringify(this.VerificacionInforme));
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Tipo Ensayo " + error);
          self.$q.loading.hide();
        });

      // this.LisCalibraciones.splice(i, 1)
      this.step = 2;
    },
    mostrarCaudal(caudal) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/programacionorden/caudalMostrar/", caudal)
        .then((response) => {
          self.listaCaudales = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Tipo Ensayo " + error);
          self.$q.loading.hide();
        });
    },

    regresar() {
      this.$router.push("/admin");
    },

    FinalizarVerificacion(Verificacion) {
      // Guardar la verificación y reiniciar las variables
      //  this.guardarVerificacionCalibracion();

      Verificacion.img = Verificacion.img.map(img => img.replace(UrlServer, ""));
      Verificacion.listIncidencias = this.selected
      const self = this;
      self.$q.loading.show();
      api.post("/medidor/VerificarInforme/", Verificacion)
        .then((response) => {
          this.step = 1
          this.ListInformes = [];
          this.Informe.Fechaini_calibracion = utils.fechaActual();
          this.Informe.Fechafin_calibracion = utils.fechaActual();
          this.todasFechas = false
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexión - Tipo Ensayo " + error);
          self.$q.loading.hide();
        });

    },


    // FUNCIONES QUE SERVIRA PARA MÁS ADELANTE LA CREACIÓN DE MODULO TRABAJO NO CONFORME
    // compararJSON(obj1, obj2) {
    //    // Verificar si ambos son objetos
    //     console.log(this.selected)
    //     Verificacion.listIncidencias = this.selected
    //     console.log(Verificacion)
    //     console.log(this.VerificacionCopia)

    // const result = JSON.stringify(Verificacion) === JSON.stringify(this.VerificacionCopia)
    // const result2 = Verificacion.every((arr, i) => arr === a2[i])
    // // this.compararJSON(Verificacion,this.VerificacionCopia)
    // console.log(result)
    // console.log(result2)
    // },

    exportTable(tablaE, columnasE) {
      // naive encoding to csv format
      const content = [columnasE.map((col) => wrapCsvValue(col.label))]
        .concat(
          tablaE.map((row) =>
            columnasE
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === undefined ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      var nombreArchivo =
        "ConsultaVerificacionCalibracion_" + utils.fechaActual();
      const status = exportFile(nombreArchivo + ".csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "No existen datos para descargar",
          color: "negative",
          icon: "warning",
        });
      }
    },

    guardarVerificacionCalibracion() {
      const self = this;
      self.VerificacionCalibracion.ListaVerificacionInstrumento =
        self.LisRepeticionInsMOD;
      self.VerificacionCalibracion.ListaVerificacionMedidor =
        self.LisRepeticionMedMOD;
      this.$q
        .dialog({
          title: "SILAMED",
          dark: true,
          message: "Esta seguro de guardar la Verificación de medidores?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          api
            .post(
              "/calibracionmedidores/insertarVerificacionCalibracion/",
              this.VerificacionCalibracion
            )
            .then((response) => {
              if (response.data === true) {
                this.LisCalibracionPrueba = [];
                this.step = 1;
              } else {
                utils.mensaje("Algo salió mal, verifique");
              }
              self.$q.loading.hide();
            })
            .catch((error) => {
              utils.mensaje(
                "Fallo la conexion - Guardar Programacion " + error
              );
              self.$q.loading.hide();
            });
        })
        .onCancel(() => { });
    },

    consultarFiltroCalibracion() {
      const Login = this.usuario.LoginUsuario;
      const self = this;
      self.$q.loading.show();
      self.ListInformes = [];

      self.Informe.Id_programacionorden = -1;
      if (self.todasFechas === true) {
        self.Informe.Estado_calibracion = 1;
      } else {
        self.Informe.Estado_calibracion = 0;
      }
      self.Informe.Login_calibracion = "";
      api
        .post(
          `/medidor/GetInformesVerificar/${Login}/${this.Informe.Fechaini_calibracion}/${this.Informe.Fechafin_calibracion}/${self.Informe.Estado_calibracion}`
        )
        .then((response) => {
          console.log(response.data);
          self.ListInformes = response.data;
          self.ListInformes.forEach((informe) => {
            informe.Color = "blue";
            informe.Icono = "edit";
          });
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - LisCalibraciones " + error);
          self.$q.loading.hide();
        });
    },
    mostrarIncidencias(incidencia) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/medidor/incidenciasMostrar/", incidencia)
        .then((response) => {
          self.lisIncidencias = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Incidencias " + error);
          self.$q.loading.hide();
        });
    },
  },
};
</script>
