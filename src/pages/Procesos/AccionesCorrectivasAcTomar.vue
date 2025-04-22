<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-toolbar-title>Acciones Correctivas - Acciones a Tomar</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container v-if="Mostrar">
      <q-btn label="Actividades" />
      <q-table class="col-xs-12 col-sm-12 col-md-12" title="" style="margin: 15px" separator="cell"
        no-data-label="No hay registros" show-bottom flat bordered :data="DocsAc" :columns="columnsDocAc"
        :rows-per-page-options="[10]">
        <!-- :visible-columns="vcCertificado" -->
        <template v-slot:top="props">
          <q-space />
          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen" class="q-ml-md" />
          <q-space />
          <q-select v-model="vcAC" multiple outlined dense options-dense :display-value="$q.lang.table.columns"
            emit-value map-options :options="columnsDocAc" option-value="name" options-cover style="min-width: 150px" />
        </template>

        <template v-slot:body-cell-Hallazgos="props" flat class="">
          <q-td key="Hallazgos" :props="props" class="cursor-pointer"
            @click="viewDescription(props.row.Hallazgo, 'Hallazgos')">
            <q-btn class="" label="" icon="visibility" flat color="" />

          </q-td>
        </template>
        <template v-slot:body-cell-NCSimiliares="props" flat class="">
          <q-td key="NCSimiliares" :props="props" class="cursor-pointer"
            @click="viewDescription(props.row.NCSimilares, 'NCSimilares')">
            <q-btn class="" label="" icon="visibility" flat />
          </q-td>
        </template>
        <template v-slot:body-cell-operaciones="props">
          <q-td key="operaciones" :props="props" auto-width>
            <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
            <q-btn icon="arrow_forward_ios" @click="ChangeView(props.row.IdAC)" flat color="positive" />
            <q-btn icon="edit" to="/Procesos/AccionesCorrectivas" flat color="primary" />
            <q-btn icon="delete" color="negative" align="center" flat @click="DeleteAccion(props.rowIndex)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="DescripcionVisible" persistent>
        <q-card style="width: 600px">
          <q-card-section>
            <div class="text-h5 text-center">{{ titleDescripcion }}</div>
          </q-card-section>

          <q-card-section>
            <p>{{ Descripcion }}</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Ok" color="positive" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
    <q-page-container v-if="Mostrar == false">
      <div class="flex items-center q-gutter-md q-ma-xs">
        <p class="text-h6 font-semibold text-dark">Acción Correctiva No. {{ Informe.Consecutivo }}</p>
        <q-icon class="q-ma-xs" name="arrow_forward" size="sm" />
        <div class="flex items-center">
          <p class="text-h6 font-semibold text-dark">Responsable de Acción:</p>

          <div class="bg-grey-3 q-pa-md rounded-lg shadow-sm">
            <p class="q-ma-none text-center text-bold text-dark text-body1">
              {{ Informe.NombreQuienTramita }}
            </p>
            <p class="q-ma-none text-center text-grey-8 text-caption">
              {{ Informe.CargoTramitoAccion }}
            </p>
          </div>
        </div>
      </div>
      <hr>
      <div>
        <q-btn class="q-ma-sm" label="regresar" icon="undo" @click="ReturnView" color="info" />
        <q-list class="flex justify-center items-center q-gutter-sm q-mt-sm q-mb-sm q-mt-0">

          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" v-model="TipoAccion"
                val="Correcciones" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">Correcciones</q-item-label>
              <q-item-label class="text-caption">
                Acción tomada para eliminar la No Conformidad
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" v-model="TipoAccion"
                val="AccionesCorrectivas" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">Acciones Correctivas</q-item-label>
              <q-item-label class="text-caption">
                Acción tomada para eliminar la causa de la No Conformidad
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="Visible" class="q-ma-sm">
          <p class="text-h6">Agregar Acción</p>
          <div class="row items-center q-gutter-sm">
            <q-input type="text" v-model="Accion.AccionTxt" autogrow label="Acción" filled
              class="col-xs-12 col-sm-12 col-md-4" />
            <q-input v-model="Accion.Fecha" filled type="date" class="col-xs-12 col-sm-12 col-md-2" />
            <q-input tipe="text" v-model="Accion.Evidencia" label="Evidencia" filled autogrow
              class="col-xs-12 col-sm-12 col-md-4" />
            <q-btn label="Agregar Acción" icon="add" color="primary" class="col-xs-12 col-sm-12 col-md-3" size="18px"
              @click="AddAcciones" />
            <q-btn label="Guardar todas las acciones" icon="save" color="positive" class="col-xs-12 col-sm-12 col-md-5"
              size="18px" @click="SaveActions" />
          </div>
        </div>

        <div class="q-ma-md" v-if="TipoAccion === 'Correcciones'">
          <p class="text-h5 q-mb-md">Acciones</p>
          <q-table class="col-xs-12 col-sm-12 col-md-12" title="" style="margin: 15px" separator="cell"
            no-data-label="No hay registros" show-bottom flat bordered :data="Correcciones" :columns="columnsAc"
            :rows-per-page-options="[10]">
            <!-- :visible-columns="vcCertificado" -->
            <template v-slot:top="props">
              <q-space />
              <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen" class="q-ml-md" />
              <q-space />
              <q-select v-model="vcAC" multiple outlined dense options-dense :display-value="$q.lang.table.columns"
                emit-value map-options :options="columnsAc" option-value="name" options-cover
                style="min-width: 150px" />
            </template>

            <template v-slot:body-cell-evidencias="props" flat class="">
              <q-td key="evidencias" :props="props" class="cursor-pointer">
                <q-btn class="" label="" color="warning" icon="folder" @click="MostrarEvidecias(props.row.IdAT)" />
                <p class="">{{ props.row.evidencia }}</p>
              </q-td>
            </template>
            <template v-slot:body-cell-operaciones="props">
              <q-td  v-if="Visible" key="operaciones" :props="props" auto-width>
                <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
                <q-btn icon="delete" color="negative" align="center" flat @click="DeleteAccion(props.rowIndex)" />
                <q-btn icon="edit" @click="EditAccion(props.row.key)" flat color="primary" />
              </q-td>
              <q-td  v-if="!Visible" key="operaciones" :props="props" auto-width>
                <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
                <p>  No Disponibles</p>
              </q-td>
            </template>
          </q-table>
        </div>

        <div class="q-ma-md" v-if="TipoAccion === 'AccionesCorrectivas'">
          <p class="text-h5 q-mb-md">Acciones</p>
          <q-table class="col-xs-12 col-sm-12 col-md-12" title="" style="margin: 15px" separator="cell"
            no-data-label="No hay registros" show-bottom flat bordered :data="AcCorrectivas" :columns="columnsAc"
            :rows-per-page-options="[10]">
            <!-- :visible-columns="vcCertificado" -->
            <template v-slot:top="props">
              <q-space />
              <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen" class="q-ml-md" />
              <q-space />
              <q-select v-model="vcAC" multiple outlined dense options-dense :display-value="$q.lang.table.columns"
                emit-value map-options :options="columns" option-value="name" options-cover style="min-width: 150px" />
            </template>

            <template v-slot:body-cell-evidencias="props" flat class="">
              <q-td key="evidencias" :props="props" class="cursor-pointer">
                <q-btn class="" label="" color="warning" icon="folder" @click="MostrarEvidecias(props.row.IdAT)" />
                <p class="">{{ props.row.evidencia }}</p>
              </q-td>
            </template>
            <template  v-slot:body-cell-operaciones="props">
              <q-td v-if="Visible" key="operaciones" :props="props" auto-width>
                <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
                <q-btn icon="delete" color="negative" align="center" flat @click="DeleteAccion(props.rowIndex)" />
                <q-btn icon="edit" @click="EditAccion(props.row.key)" flat color="primary" />
              </q-td>
              <q-td v-if="!Visible" key="operaciones" :props="props" auto-width>
                <!-- <q-btn icon="visibility" color="black" align="center" flat @click="GetIdTNC(props.row.IdTNC, 1)" /> -->
                  <p>No Disponibles</p>
              </q-td>
            </template>
          </q-table>


        </div>
      </div>

      <q-dialog v-model="ShowEvidence" persistent>
        <q-card style="width: 800px">
          <q-card-section v-if="FirtsView">
            <div class="text-h5 text-center text-weight-bolder">Evidencias</div>
            <div v-if="Visible" class="row  q-gutter-sm">
              <q-input label="Evidencia" v-model="EvidenciaTxt" class="col-xs-12 col-sm-8 col-md-8" autogrow filled />
              <q-btn label="Agregar" class="col-xs-12 col-sm-3 col-md-3" size="" icon="save" @click="AddEvidence"
                color="positive" />
            </div>
            <div v-if="SinInfo.Evidencias === false">
              <p class="text-center text-h6">SIN EVIDENCIAS AÚN</p>
            </div>
            <div class="q-pa-sm">
              <p v-if="SinInfo.Evidencias == true" class="text-weight-bold q-ma-none">
                Presione una evidencia para ver los archivos de soporte.
              </p>
              <div v-for="(item, index) in Evidencias" :key="index" class="q-gutter-sm">
                <div class="row q-gutter-sm">
                  <p class="flex justify-center items-center col-xs-1 col-sm-1 col-md-1"
                    style="font-weight: bold; font-size: 1.5em; width: 20px">
                    {{ index + 1 }}
                  </p>

                  <p style="cursor: pointer; border-radius: 5px; padding: 3px"
                    class="row items-center justify-left bg-grey-3 col-xs-7 col-sm-8 col-md-8"
                    @click="GetArchivosId(item.IdEvidencia)">
                    {{ item.EvidenciaTxt }}
                  </p>

                  <q-btn icon="folder" @click="GetArchivosId(item.IdEvidencia)" style="height: 35px;" color="warning"
                    class="text-black  col-xs-2 col-sm-1 col-md-1" />
                  <q-btn icon="delete" color="negative" style="height: 35px;" class="col-xs-2 col-sm-1 col-md-1" />

                  <!-- <q-input class="col-xs-9 col-sm-9 col-md-9" v-model="datos[index]" type="text" autogrow filled />
                  <q-btn icon="delete" class="col-xs-1 col-sm-1 col-md-1" color="red" @click="RemoveAction(index)" /> -->
                </div>
              </div>
            </div>


          </q-card-section>

          <q-card-section v-if="!FirtsView">
            <p class="text-h5 text-center">Archivos Adjuntos</p>
            <q-btn icon="add" label="agregar evidencia" @click="OpenModalArchivos()" color="positive" />
            <q-file ref="ArchivosVarios" multiple append v-model="FileSave" @input="CargarArchivos"
              style="display: none" />


            <div v-for="(item, index) in Archivos" :key="index" class="q-gutter-sm">
              <div class="row q-gutter-sm">
                <p class="row justify-center col-xs-1 col-sm-1 col-md-1" style="
                            font-weight: bold;
                            font-size: 1.5em;
                            width: 20px;
                          "></p>

                <div class="row items-center">
                  <p outlined multiple ellipsis style="max-width: 320px">
                    {{ item.RutaArchivo }}
                  </p>
                  <q-btn icon="download" color="green" flat dense size="20px" @click="Descarga(item.Ruta)">
                    <q-tooltip> Descargar </q-tooltip>
                  </q-btn>
                  <q-btn v-if="Visible" icon="publish" color="blue" flat dense size="20px"
                    @click="OpenModalArchivoIndividual(index)">
                    <q-tooltip> Remplazar </q-tooltip>
                  </q-btn>
                  <q-file :ref="'fileInputs' + index" v-model="File" style="display: none"
                    @input="UpdateArchivo(item.IdArchivo)" />
                  <!-- @input="handleFileInput" -->
                  <q-btn v-if="Visible" @click="ModalEvidencia(index, item)" icon="delete" color="red" flat
                    dense size="20px">
                    <q-tooltip> Eliminar </q-tooltip>
                  </q-btn>
                  <q-item-section class="row items-center" style="width: 50px">
                    <q-checkbox :disable="AprobarSeguimiento" v-if="item.Aprobado === 0" v-model="IdsAprobar"
                      :val="item.IdEvidencia">
                      <q-tooltip> Aprobar </q-tooltip>
                    </q-checkbox>
                    <q-icon class="" v-if="item.Aprobado === 1" color="green" name="check_circle" size="1.9rem">
                      <q-tooltip> Aprobado </q-tooltip>
                    </q-icon>
                  </q-item-section>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="center">
            <q-btn v-if="FirtsView" label="ok" v-close-popup color="primary" @click="ResetearDatos" />
            <q-btn v-if="!FirtsView" color="primary" @click="FirtsView = true" label="regresar" />
          </q-card-actions>
        </q-card>

      </q-dialog>
      <q-dialog v-model="ModalArch" class="col-xs-12 col-sm-12 col-md-12" persistent>
      <q-card style="width: 600px; max-width: none">
        <q-card-section style="padding: 16px 16px 0 16px">
          <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
            ¿Esta Seguro de eliminar el Archivo?
          </div>
        </q-card-section>

        <q-card-section>
          <div>
            <p class="text-h6 text-center">
              Una vez eliminado no podra ser recuperado.
            </p>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Confirmar" color="positive" @click="RemoveArchivo(PaqEvidencia)" />
        </q-card-actions>
      </q-card>
    </q-dialog>


      <q-dialog v-model="ArchivosVisible" class="col-xs-12 col-sm-12 col-md-12" persistent>
        <q-card style="width: 600px; max-width: none">
          <q-card-section style="padding: 16px 16px 0 16px">
            <div class="text-h5 text-center text-weight-bolder" style="padding: 16px 16px 0 16px">
              Archivos a guardar
            </div>
            <q-btn label="agregar" icon="add" color="positive" @click="AddMoreFiles" />
            <q-file ref="AddArchivos" append multiple v-model="FileTem" style="display: none"
              @input="transferirArchivos" />
          </q-card-section>

          <q-card-section>
            <q-scroll-area class="q-gutter-sm" style="height: 300px">
              <div class="q-gutter-sm" v-for="(item, index) in FileSave" :key="index">
                <div class="row">
                  <p style="max-width: 600px; border-radius: 4px; padding: 5px" outlined ellipsis
                    class="bg-grey-4 col-xs-10 col-sm-10 col-md-10">
                    {{ item.name }}
                  </p>
                  <q-btn color="negative" style="width: 40px; height: 40px" class="col-xs-1 col-sm-1 col-md-1"
                    icon="delete" @click="RemoveFileSave(index)" />
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn label="Cancelar" color="negative" v-close-popup />
            <q-btn label="guardar" color="positive" @click="GuardarEvidencias" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>

  </q-layout>
</template>

<script>
import utils from "../../commons/utils.js";
import { api } from "src/boot/axios";
import { date, QSpinnerComment, QSpinnerGears, QSpinnerOval } from "quasar";
export default {
  name: "AccionesCorrectivas",
  data() {
    return {
      ModalArch: false,
      ArchivosVisible: false,
      File: null,
      FileSave: null,
      FileTem: null,
      FirtsView: true,
      TipoAccion: "Correcciones",
      columnsAc: [
        {
          name: "AccionTxt",
          label: "Acciones",
          align: "left",
          field: (row) => row.AccionTxt,
        },
        {
          name: "Fecha",
          label: "Fecha Implementación",
          align: "center",
          field: (row) => row.Fecha,
        },
        {
          name: "evidencias",
          label: "Evidencias",
          align: "center",
          field: "evidencias",
        },
        {
          name: "operaciones",
          label: "Operaciones",
          align: "center",
          field: "operaciones",
        },
      ],

      columnsDocAc: [
        {
          name: "Consecutivo",
          label: "No. Ac",
          align: "center",
          field: "Consecutivo",
        },
        {
          name: "TipoEvaluacion",
          label: "Tipo Evaluación",
          align: "center",
          field: "TipoEvaluacion",
        },
        {
          name: "FechaApertura",
          label: "Fecha Apertura",
          align: "center",
          field: "FechaApertura",
        },
        // { name: "AccionTxt", label: "Acciones", align: "left", field: row => row. AccionTxt },
        {
          name: "QuienLevantaAccion",
          label: "Quien Detecta",
          align: "center",
          field: "QuienLevantaAccion",
          format: (val) => (val ? val.toUpperCase() : ""),
        },
        {
          name: "QuienTramitaAccion",
          label: "Quien Tramito",
          align: "center",
          field: "QuienTramitaAccion",
        },
        {
          name: "Hallazgos",
          label: "Hallazgos",
          align: "center",
          field: "Hallazgos",
        },
        {
          name: "NCSimiliares",
          label: "NCSimiliares",
          align: "center",
          field: "NCSimiliares",
        },
        {
          name: "operaciones",
          label: "Operaciones",
          align: "center",
          field: "operaciones",
        },
      ],
      DocsAc: [],
      Accion: { AccionTxt: "", Fecha: "", Evidencia: "" },
      Mostrar: true,
      Correcciones: [],
      AcCorrectivas: [],
      Acciones: [],
      AccionesCorrectivas: [{ Id: "", Accion: "", Fecha: "", Evidencias: [] }],
      vcAC: ["acciones", "fecha", "evidencias"],
      Informe: {},
      Evidencias: [],
      ShowEvidence: false,
      SinInfo: { Evidencias: false, Detiene: true },
      IdAT: '',
      IdEvidencia: '',
      EvidenciaTxt: '',
      Archivos: [],
      DescripcionVisible: false,
      Descripcion: '',
      titleDescripcion: ''
      , Visible: false

    };
  },
  methods: {
    OpenModalArchivoIndividual(index) {
      const fileInputRef = this.$refs["fileInputs" + index];
      if (fileInputRef && fileInputRef[0]) {
        fileInputRef[0].$el.querySelector('input[type="file"]').click();
      }
    },
    ModalEvidencia(index, PaqEvidencia) {
      this.ModalArch = true;
      this.PaqEvidencia = { index: index, PaqEvidencia: PaqEvidencia };
      console.log('  this.PaqEvidencia',  this.PaqEvidencia)
    },
    RemoveArchivo(Evidencia) {
      this.showLoading("procesando datos", QSpinnerOval);
      console.log(Evidencia)
      const RutaArchivo = Evidencia.PaqEvidencia.RutaArchivo;
      const IdArchivo = Evidencia.PaqEvidencia.IdArchivo;
      const Archivo = { RutaArchivo: RutaArchivo, IdArchivo: IdArchivo };
      api
        .post("/AcCorrectivas/DeleteArchivos/", Archivo)
        .then((response) => {
          if (response.data) {
            // this.GetEvidenceId(this.IdAccion);
            this.Notificaciones("Eliminación exitosa", "positive", "bottom");
            this.$q.loading.hide();
            this.FileSave = null;
            this.Archivos.splice(Evidencia.index, 1);
            this.ModalArch = false;
          }
        })
        .catch((error) => {
          // Manejar el error
          console.error("Error al subir archivos:", error);

          // Ocultar indicador de carga si es necesario
          this.$q.loading.hide();
        });
    },

    viewDescription(Description, title) {
      this.DescripcionVisible = true;
      this.Descripcion = Description;
      this.titleDescripcion = title
    },
    GuardarEvidencias() {
      if (this.FileSave.length == 0) {
        this.Notificaciones(
          "Sin Archivos para guardar",
          "negative",
          "bottom"
        );
      } else {
        const Login = this.usuario.LoginUsuario;
        const formData = new FormData();
        formData.append(`IdAT`, this.IdEvidencia);
        if (this.FileSave !== null) {
          this.FileSave.forEach((file) => {
            formData.append("Evidencias", file);
          });
        }

        api
          .post("/AcCorrectivas/InsertArchivo/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data) {
              this.GetArchivosId(this.IdEvidencia);
            }
            this.Notificaciones("Actualización exitosa", "positive", "bottom");
            this.$q.loading.hide();
            this.ArchivosVisible = false;
            this.FileSave = null;
          })
          .catch((error) => {
            // Manejar el error
            console.error("Error al subir archivos:", error);

            // Ocultar indicador de carga si es necesario
            this.$q.loading.hide();
          });
      }
    },
    RemoveFileSave(index) {
      if (this.FileSave.length > 0) {
        this.FileSave.splice(index, 1);
      } else {
        this.Notificaciones(
          "No hay evidencias para eliminar",
          "warning",
          "bottom"
        );
      }
    },
    OpenModalArchivos() {
      const fileInputRef = this.$refs["ArchivosVarios"];
      if (fileInputRef) {
        fileInputRef.$el.querySelector('input[type="file"]').click();
      }
    },
    transferirArchivos() {
      for (let i = 0; i < this.FileTem.length; i++) {
        this.FileSave.push(this.FileTem[i]);
      }
      this.FileTem = null;
    },
    AddMoreFiles() {
      const fileInputRef = this.$refs["AddArchivos"];
      if (fileInputRef) {
        fileInputRef.$el.querySelector('input[type="file"]').click();
      }
    },
    CargarArchivos() {
      this.ArchivosVisible = true;
    },
    ChangeView(IdAc) {
      this.Mostrar = false;
      this.SearchDocAC(IdAc)
      this.SearchActions(IdAc)
    },
    ValidarCargo() {
      console.log(this.Informe)

      if (this.Informe.QuienTramitaAccion == this.usuario.LoginUsuario) {
        // this.IdentificacionStatus = false
        this.Visible = true
        console.log('puede verse')
        // this.Active = true

      }
    },
    ReturnView() {
      this.Mostrar = true;
      this.Acciones = []
      this.AcCorrectivas = []
      this.Correcciones = []
    },
    // OJOOOO------------------------------------------
    // Colocar los Id´s de las evidencias una vez creado el backend
    // esto para garantizar que las eliminaciones se hagan en base de datos correctamente
    // _____--------------------------_---------------------------------------------------
    DeleteAccion(index) {
      this.Correcciones.splice(index, 1);
    },
    MostrarEvidecias(IdAT) {
      this.IdAT = IdAT
      console.log(IdAT)
      this.SearchEvidencia()
      this.ShowEvidence = true

    },
    SearchDocAC(IdAC) {

      var resultado = this.DocsAc.filter(
        (Doc) => Doc.IdAC == IdAC
      )
      this.Informe = resultado[0]
      this.ValidarCargo()
      console.log(this.Informe)
    },
    SearchActions(IdAc) {
      api
        .get(`/AcCorrectivas/SearchActions/${IdAc}`)
        .then((response) => {
          this.Acciones = response.data;
          this.PassActionsData()
          this.Acciones = []
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    ResetearDatos() {
      this.Evidencias = []
      this.SinInfo.Evidencias = false

    },
    AddEvidence() {

      if (
        !this.EvidenciaTxt
      ) {
        this.Notificaciones("Campo vació", "warning", "bottom");
        return false;
      }


      var Evidencia = {
        IdAT: this.IdAT,
        EvidenciaTxt: this.EvidenciaTxt,
      }

      api
        .post("/AcCorrectivas/InsertEvidence", Evidencia)
        .then((response) => {
          console.log(response.data)
          if (response.data) {
            this.Notificaciones("Evidencia Guardada Con Éxito", "positive", "bottom");
            Evidencia = {}
            this.EvidenciaTxt = ''
            this.SearchEvidencia()
          }

        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });

    },
    SearchEvidencia() {
      api
        .get(`/AcCorrectivas/SearchEvidencias/${this.IdAT}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.Evidencias = response.data;
            this.SinInfo.Evidencias = true

          } else {
            this.SinInfo.Evidencias = false
          }


        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    GetArchivosId(IdEvidencia) {

      this.FirtsView = false
      this.IdEvidencia = IdEvidencia
      console.log(this.IdEvidencia)
      api
        .get(`/AcCorrectivas/SearchArchivos/${IdEvidencia}`)
        .then((response) => {
          console.log(response.data)
          if (response.data) {
            this.Archivos = response.data
          }

        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });

    },
    PassActionsData() {
      var correciones = this.Acciones.filter(
        (Action) => Action.TipoAccion === 'Correcciones'
      )

      var AcCorrectivas = this.Acciones.filter(
        (Action) => Action.TipoAccion === 'AccionesCorrectivas'
      )

      this.Correcciones = correciones
      this.AcCorrectivas = AcCorrectivas

    },
    ValidaCampos() {
      if (
        !this.Accion.AccionTxt ||
        !this.Accion.Fecha ||
        !this.Accion.Evidencia
      ) {
        this.Notificaciones("Campos por completar", "warning", "bottom");
        return false;
      }
      return true;
    },
    ValidaActions() {
      if (this.Acciones.length == 0
      ) {
        this.Notificaciones("No hay Acciones para guardar", "warning", "bottom");
        return false;
      }
      return true;
    },
    SaveActions() {
      if (!this.ValidaActions()) return false;
      console.log(this.Acciones)

      if (this.Acciones.length != 0) {
        api
          .post("/AcCorrectivas/SaveActions", this.Acciones)
          .then((response) => {
            console.log(response.data)
            if (response.data) {
              this.Notificaciones("Acciones Guardadas Con Éxito", "positive", "bottom");
              this.Acciones = []
            }

          })
          .catch((error) => {
            console.error("Tipo Identificacion - Fallo la conexion " + error);
          });
      }
    },

    AddAcciones() {
      if (!this.ValidaCampos()) return false;

      if (this.TipoAccion === "Correcciones") {
        this.AddCorreciones();
      } else if (this.TipoAccion === "AccionesCorrectivas") {
        this.AddAccionesCorrectivas()
      }


    },
    SavePaqAcciones() {
      this.Acciones.push({
        IdAC: this.Informe.IdAC,
        AccionTxt: this.Accion.AccionTxt,
        Fecha: this.Accion.Fecha,
        // Evidencias: [{ evidencia: this.Accion.Evidencia }],
        Evidencia: this.Accion.Evidencia,
        TipoAccion: this.TipoAccion
      });
      console.log(this.Acciones)
    },

    AddCorreciones() {
      this.Correcciones.push({
        AccionTxt: this.Accion.AccionTxt,
        Fecha: this.Accion.Fecha,
        // Evidencias: [{ evidencia: this.Accion.Evidencia }],
        Evidencia: this.Accion.Evidencia,
      });
      this.Notificaciones("Se agrego acción", "positive", "bottom");
      this.SavePaqAcciones()
      this.Accion = {
        AccionTxt: "",
        Fecha: "",
        Evidencia: "",
      };
    },
    AddAccionesCorrectivas() {
      this.AcCorrectivas.push({
        AccionTxt: this.Accion.AccionTxt,
        Fecha: this.Accion.Fecha,
        Evidencias: [{ evidencia: this.Accion.Evidencia }],
      });
      this.Notificaciones("Se agrego acción", "positive", "bottom");
      this.SavePaqAcciones()
      this.Accion = {
        AccionTxt: "",
        Fecha: "",
        Evidencia: "",
      };
    },
    Notificaciones(text, color, position) {
      this.$q.notify({
        type: color,
        message: `${text}`,
        position: position,
      });
    },
    GetDocsAC() {
      api
        .get("/AcCorrectivas/GetDocsAC")
        .then((response) => {
          this.DocsAc = response.data;
          console.log(this.DocsAc)
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },

    SendArchivos(Emails, IdTNC) {
      const formData = new FormData();
      formData.append("Emails", Emails.Emails); // Agregar cada correo electrónico al FormData.
      formData.append("Asunto", Emails.Asunto);
      formData.append("Mensaje", Emails.Mensaje);
      if (Emails.NotificacionFiles !== null) {
        Emails.NotificacionFiles.forEach((file) => {
          formData.append("Archivos", file);
        });
      }
      formData.append("LoginEnvia", this.usuario.LoginUsuario);

      return api
        .post(`/medidor/sendEmail/${IdTNC}/${Emails.TipoMensaje}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.Notificaciones(
            "Todos los correos electrónicos han sido enviados exitosamente.",
            "positive",
            "bottom-right"
          );
          return true;
        })
        .catch((error) => {
          console.error("Error al enviar correos:", error);
          this.Notificaciones(
            "Error al enviar correos",
            "negative",
            "bottom-right"
          );
          return false;
        });
    },
    showLoading(mensaje, TipoSpinner = QSpinnerComment) {
      this.$q.loading.show({
        spinner: TipoSpinner,
        spinnerColor: "red",
        message: `<span class="text-white text-weight-bold">${mensaje}</span><br/><span class="text-orange text-weight-bold">Procesando...</span>`,
      });
    },
  },
  mounted() {
    this.GetDocsAC();
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
  },
};
</script>

<style scoped>
.my-styled-table {
  max-width: 100%;
  overflow-x: auto;
}
</style>
