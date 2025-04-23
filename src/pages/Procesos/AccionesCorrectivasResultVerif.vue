<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="swipe" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-toolbar-title>Acciones Correctivas - Resultados Verificación
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="Mostrar">
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
          <q-td key="Hallazgos" :props="props" class="cursor-pointer" @click="viewDescription(props.row.evidencia)">
            <q-btn class="" label="" icon="visibility" flat color="" />
          </q-td>
        </template>
        <template v-slot:body-cell-NCSimiliares="props" flat class="">
          <q-td key="NCSimiliares" :props="props" class="cursor-pointer" @click="viewDescription(props.row.evidencia)">
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
    </q-page-container>

    <q-page-container v-if="!Mostrar">
      <q-btn label="regresar" class="q-ma-sm" icon="undo" @click="ReturnView" color="info" />
      <div v-if="ResponsableState" class="row q-ml-sm ">

        <div class="col-xs-11 col-sm-5 col-md-4 q-field--with-bottom">
          <q-select filled v-model="Responsables.ResponsableVerificar" map-options emit-value
            option-value="LoginUsuario" option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input
            hide-dropdown-icon hide-selected fill-input input-debounce="0" label="Responsable Verificar y Aprobar"
            @filter="filterFnUsuario">
            <template v-slot:prepend>
              <q-icon name="person" size="lg" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label v-html="scope.opt.NombrePersona" />
                  <q-item-label caption>Login: {{ scope.opt.LoginUsuario }}
                  </q-item-label>
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
        </div>
        <div class="q-ml-sm col-xs-11 col-sm-5 col-md-4 q-field--with-bottom">
          <q-select filled v-model="Responsables.ResponsableEvaluar" map-options emit-value option-value="LoginUsuario"
            option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input hide-dropdown-icon
            hide-selected fill-input input-debounce="0" label="Responsable de evaluación" @filter="filterFnUsuario">
            <template v-slot:prepend>
              <q-icon name="person" size="lg" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label v-html="scope.opt.NombrePersona" />
                  <q-item-label caption>Login: {{ scope.opt.LoginUsuario }}
                  </q-item-label>
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
        </div>

        <q-btn  label="Guardar responsables" icon="save" style="height: 40px;"
          class="q-ml-sm col-xs-11 col-sm-5 col-md-3" color="positive" @click="GuardarResponsables" />
      </div>
      <div v-if="!ResponsableState" class="flex q-gutter-md q-ma-xs">

<!-- Responsable Verificar -->
<div class="flex flex-col items-center bg-grey-3 q-pa-md rounded-lg shadow-sm">
  <p class="text-bold text-dark text-body1 q-mb-xs">Responsable Verificar: </p>
 <div>
  <p class="q-ma-none text-center text-dark text-body2">
    {{ Informe.NombreResponsableVerificar || Informe.ResponsableVerificar }}
  </p>
  <p class="q-ma-none text-center text-grey-8 text-caption">
    {{ Informe.CargoResponsableVerificar }}
  </p>
 </div>
</div>


<!-- Responsable Evaluar -->
<div class="flex flex-col items-center bg-grey-3 q-pa-md rounded-lg shadow-sm">
  <p class="text-bold text-dark text-body1 q-mb-xs">Responsable Evaluar: </p>
  <div>
    <p class="q-ma-none text-center text-dark text-body2">
    {{ Informe.NombreResponsableEvaluar || Informe.ResponsableEvaluar }}
  </p>
  <p class="q-ma-none text-center text-grey-8 text-caption">
    {{ Informe.CargoResponsableEvaluar }}
  </p>
  </div>
</div>


</div>

      <div>
        <p class="text-h5 text-center text-weight-bold">Acciones Implementadas</p>
      </div>
      <div class="row">
        <q-select filled v-model="TipoAccion" emit-value map-options :options="options" label="Tipo de Acción"
          @input="FilterActions" class=" q-ml-sm col-xs-1 col-sm-1 col-md-2" />
      </div>
      <div class="flex">

        <div class="" style="width: 50%;">
          <q-scroll-area style="height: 350px; max-width: 600px;">
            <div v-for="(item, index) in AccionesFiltradas" :key="index" class="bg-white  q-gutter-md" style="
              width: 95% !important;
              width: 100%;
              min-height: none;
              height: 95%;
            ">

              <div class="flex justify-center items-center q-gutter-md">
                <p style="width: 450px;" class=""> {{ item.AccionTxt }}</p>
                <q-btn icon="folder" class="text-black" color="warning" @click="SearchEvidencia(item.IdAT)" />
              </div>
            </div>

          </q-scroll-area>
        </div>
        <div class="q-pa-md  q-gutter-md" style="width: 50%;">
          <p class="text-center text-subtitle1 text-capitalize ">evaluación De La Eficacia y Justificación De Las
            Acciones
            Implementadas</p>
          <q-separator />

          <q-input :disable="EvaluarDisable" type="text" autogrow filled label="Escriba aqui..." />

          <p class="text-subtitle1 text-center text-capitalize">Firma Responsable Cierre</p>
          <q-separator />

          <q-btn :disable="EvaluarDisable" label="Cargar Firma" color="positive" icon="publish" @click="$refs.fileInput.pickFiles()" />
          <q-checkbox :disable="EvaluarDisable" v-model="autorizado" label="Autorizo el uso de mi firma en este documento" color="primary" />

          <q-file ref="fileInput" style="display: none;" filled v-model="file" label="Seleccionar imagen" accept="image/*"
            @input="onFileChange" />

            <q-dialog v-model="cropDialog" persistent>
  <q-card style="min-width: 500px;">
    <q-card-section>
      <canvas ref="cropCanvas" style="max-width: 100%; border: 1px solid #ccc;"></canvas>
    </q-card-section>
    <q-card-actions align="around">
      <q-btn label="Girar 90°" color="info" @click="rotateImage" />
      <q-btn label="Procesar Firma" color="positive" @click="processImage" />
      <q-btn label="Cancelar" color="negative" @click="cropDialog = false" />
    </q-card-actions>
  </q-card>
</q-dialog>

<div v-if="croppedImage" style="margin-top: 20px;">
  <q-img :src="croppedImage" style="width: 300px; height: 150px; border: 1px dashed #ccc;" />
</div>
        </div>

      </div>

      <!-- partes de aprobar evidencias de acciones -->

      <q-dialog v-model="ShowEvidence" persistent>
        <q-card style="width: 800px">
          <q-card-section v-if="FirtsView">
            <div class="text-h5 text-center text-weight-bolder">Evidencias</div>

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
                </div>
              </div>
            </div>


          </q-card-section>

          <q-card-section v-if="!FirtsView">
            <p class="text-h5 text-center">Archivos Adjuntos</p>
            <!-- v-if="AccionesSeguimiento" -->
            <div  v-if="VerificarState" class="row justify-end q-gutter-sm">
              <q-btn label="Aprobar todos" color="blue" @click="AprobarTodos" />
              <q-btn :disabled="IdsAprobar.length === 0" label="Aprobar" color="green" @click="Aprobar" />
            </div>
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
                  <!-- v-if="AccionesResponsable"  -->

                  <q-file :ref="'fileInputs' + index" v-model="File" style="display: none"
                    @input="UpdateArchivo(item.IdArchivo)" />
                  <!-- @input="handleFileInput" -->
                  <!-- v-if="AccionesResponsable" -->
                  <q-btn v-if="VerificarState"  @click="ModalEvidencia(index, item)" icon="delete" color="red" flat dense size="20px">
                    <q-tooltip> Eliminar </q-tooltip>
                  </q-btn>
                  <q-item-section class="row items-center" style="width: 50px">
                    <q-checkbox :disable="VerificarDisable" v-if="item.IsAprobado === 0" v-model="IdsAprobar"
                      :val="item.IdArchivo">
                      <q-tooltip> Aprobar </q-tooltip>
                    </q-checkbox>
                    <q-icon class="" v-if="item.IsAprobado === 1" color="green" name="check_circle" size="1.9rem">
                      <q-tooltip> Aprobado </q-tooltip>
                    </q-icon>
                  </q-item-section>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn label="ok" @click="ResetearDatos" v-close-popup color="primary" />
            <q-btn @click="FirtsView = true" label="regresar" v-if="!FirtsView" />
          </q-card-actions>
        </q-card>

      </q-dialog>


    </q-page-container>
  </q-layout>
</template>

<script>
import utils from "../../commons/utils.js";
import { api } from "src/boot/axios";
export default {
  name: "AccionesCorrectivas",
  data() {
    return {
      Responsables: { ResponsableEvaluar: '', ResponsableVerificar: '' },
      file: null,
    cropDialog: false,
    canvas: null,
    ctx: null,
    img: new Image(),
    imageUrl: '',
    croppedImage: null,
    rotation: 0,
    fixedWidth: 300,  // Ancho final deseado
    fixedHeight: 150, // Alto final deseado
      autorizado: false,
      AprobarSeguimiento: false,
      IdsAprobar: [],
      ArchivosVisible: false,
      File: null,
      FileSave: null,
      FileTem: null,
      FirtsView: true,
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
      Mostrar: true,
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
      vcAC: ["acciones", "fecha", "evidencias"],
      Acciones: [],
      SinInfo: { Evidencias: false, Detiene: true },
      Evidencias: [],
      ShowEvidenceVisible: false,
      IdAT: '',
      IdEvidencia: '',
      EvidenciaTxt: '',
      Archivos: [],
      ShowEvidence: false,
      options: [{ label: 'Todos', value: "todo" }, { label: 'Correciones', value: 'Correcciones' }, { label: 'Acciones Correctivas', value: "AccionesCorrectivas" }],
      TipoAccion: 'todo',
      listaUsuarios: [],
      AccionesFiltradas: [],
      Active: true,
      Visible: false,
      ResponsableState: true,
      EvaluarState:false,
      EvaluarDisable:true,
      VerificarState:false,
      VerificarDisable:true,

    };
  },
  methods: {
    onFileChange(event) {
    const file = event && event.target ? event.target.files[0] : this.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.rotation = 0;
        this.openCropDialog();
      };
      reader.readAsDataURL(file);
    }
  },
  openCropDialog() {
    this.cropDialog = true;
    this.$nextTick(() => {
      this.setupCanvas();
    });
  },
  setupCanvas() {
    this.canvas = this.$refs.cropCanvas;
    this.ctx = this.canvas.getContext('2d');

    this.img.onload = () => {
      this.drawImage();
    };
    this.img.src = this.imageUrl;
  },
  drawImage() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const rotation = this.rotation % 360;
    const img = this.img;

    // Ajuste de tamaño del canvas
    if (rotation === 90 || rotation === 270) {
      canvas.width = img.height;
      canvas.height = img.width;
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Centramos para rotar
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  },
  rotateImage() {
    this.rotation = (this.rotation + 90) % 360;
    this.drawImage();
  },
  processImage() {
    // 1. Quitar fondo blanco (hacerlo transparente)
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Si es casi blanco, hacerlo transparente
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = 0; // alpha en 0
      }
    }
    this.ctx.putImageData(imageData, 0, 0);

    // 2. Redibujar en un nuevo canvas de tamaño fijo
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = this.fixedWidth;
    finalCanvas.height = this.fixedHeight;
    const finalCtx = finalCanvas.getContext('2d');

    finalCtx.clearRect(0, 0, this.fixedWidth, this.fixedHeight);
    finalCtx.drawImage(
      this.canvas,
      0, 0, this.canvas.width, this.canvas.height,
      0, 0, this.fixedWidth, this.fixedHeight
    );

    // 3. Guardar imagen final
    this.croppedImage = finalCanvas.toDataURL('image/png');
    this.cropDialog = false;
  },
  GuardarResponsables(){
console.log(this.AccionCorrectiva)
let a = 0
    if(this.Responsables.ResponsableEvaluar != '' && this.Responsables.ResponsableVerificar != '' ){


     let Evidencias = {
      IdAC : this.GlobalIdAc,
      ResponsableVerificar: this.Responsables.ResponsableVerificar,
      ResponsableEvaluar: this.Responsables.ResponsableEvaluar
    }
 api
        .post("/AcCorrectivas/SaveResponsables", Evidencias)
        .then((response) => {
          this.IdsAprobar = [];
          this.GetArchivosId(this.IdEvidencia);
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    }else{
      this.Notificaciones(
          "Faltan responsables por asignar",
          "negative",
          "bottom"
        );
    }
   
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
    filterFnUsuario(val, update, abort) {
      if (val.length === 0) {
        abort();
        return;
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        api
          .get(`/usuario/usuariosFiltro/${val}`)
          .then((response) => {
            update(() => {
              this.listaUsuarios = response.data;
              this.$q.loading.hide();
            });
          })
          .catch((error) => {
            utils.mensaje("Fallo la conexion " + error);
            this.$q.loading.hide();
          });
      }, 500);
    },
    ResetearDatos() {
      this.Evidencias = []
      this.SinInfo.Evidencias = false
      this.Archivos = []
    },
    Aprobar() {
      const dataToSend = this.IdsAprobar.map((id) => {
        return {
          IdEvidencia: id,
          LoginAprueba: this.usuario.LoginUsuario,
        };
      });

      this.AprobarEvidencias(dataToSend);
    },
    regla(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return true;
      }
      return false || "Falta completar información";
    },
    AprobarTodos() {
      const evidenciasNoAprobadas = this.Evidencias.filter(
        (e) => e.Aprobado !== 1
      );
      if (evidenciasNoAprobadas.length === 0) {
        this.Notificaciones(
          "Todas las evidencias ya están aprobadas",
          "warning",
          "bottom"
        );
      } else {
        this.IdsAprobar = this.Evidencias.map((e) => e.IdEvidencia);
        const dataToSend = this.IdsAprobar.map((id) => {
          return {
            IdArchivo: id,
            LoginAprueba: this.usuario.LoginUsuario,
          };
        });
        this.AprobarEvidencias(dataToSend);
      }
    },

    AprobarEvidencias(Evidencias) {
      api
        .post("/AcCorrectivas/AprobarArchivos", Evidencias)
        .then((response) => {
          this.IdsAprobar = [];
          this.GetArchivosId(this.IdEvidencia);
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

    ChangeView(IdAc) {
      this.GlobalIdAc = IdAc
      this.Mostrar = false;
      this.SearchDocAC(IdAc)
      this.SearchActions(IdAc)
      this.VerificarResponsables()
      this.Permisos()
    },
    VerificarResponsables(){
      let ResponsableEvaluar =  this.Informe.ResponsableEvaluar
      let ResponsableVerificar = this.Informe.ResponsableVerificar
      if(ResponsableEvaluar != null && ResponsableVerificar != null){
        this.ResponsableState = false
      }

    },
    Permisos(){
      let FechaCierre = this.Informe.FechaCierre
      let ResponsableEvaluar =  this.Informe.LoginResponsableEvaluar
      let ResponsableVerificar = this.Informe.LoginResponsableVerificar
      let usuario = this.usuario.LoginUsuario
      console.log(this.usuario)
      if(FechaCierre != null){
        this.ResponsableState = false
      }else if(FechaCierre == null){
        console.log(false)
        if(usuario == ResponsableEvaluar){
            this.EvaluarDisable = false
            this.EvaluarState = true
            console.log(true)
        }

        if(usuario == ResponsableVerificar){
         this.VerificarDisable = false
         this.VerificarState = true

        }

        if(usuario != ResponsableEvaluar && usuario != ResponsableVerificar){
          this.ResponsableState = false
          this.EvaluarDisable = true
      this.VerificarDisable = true
      this.EvaluarState = false
        }
      }
    },
    SearchAutorizacion(){

    },
    ReturnView() {
      this.Mostrar = true;
      this.ResponsableState = true
      this.EvaluarDisable = true
      this.VerificarDisable = true
      this.EvaluarState = false
      // this.Acciones = []
      // this.AcCorrectivas = []
      // this.Correcciones = []
    },
    FilterActions() {
      if (this.TipoAccion === "todo") {
        console.log(this.Acciones)
        this.AccionesFiltradas = this.Acciones; // Muestra todo si es "todo"
      } else {
        this.AccionesFiltradas = this.Acciones.filter(
          (Action) => Action.TipoAccion === this.TipoAccion
        );
      }
      console.log("Acciones filtradas:", this.AccionesFiltradas);
    },
    SearchActions(IdAc) {
      api
        .get(`/AcCorrectivas/SearchActions/${IdAc}`)
        .then((response) => {
          this.Acciones = response.data;
          console.log('aa', this.Acciones)
          this.FilterActions()
          // this.PassActionsData()
          // this.Acciones = []
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    SearchDocAC(IdAC) {

      var resultado = this.DocsAc.filter(
        (Doc) => Doc.IdAC == IdAC
      )
      this.Informe = resultado[0]
      console.log(this.Informe)
    },
    SearchEvidencia(IdAT) {
      api
        .get(`/AcCorrectivas/SearchEvidencias/${IdAT}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.Evidencias = response.data;
            this.SinInfo.Evidencias = true
          } else {
            this.SinInfo.Evidencias = false
          }

          this.ShowEvidence = true
          console.log(response.data)
        })
        .catch((error) => {
          console.error("Tipo Identificacion - Fallo la conexion " + error);
        });
    },
    Notificaciones(text, color, position) {
      this.$q.notify({
        type: color,
        message: `${text}`,
        position: position,
      });
    },


  },
  computed: {
    // Aquí van las propiedades computadas del componente
  },
  mounted() {
    // Aquí van las acciones a realizar cuando el componente se monte
    this.GetDocsAC();
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
  },
};
</script>

<style scoped>
/* Aquí van los estilos específicos del componente */
</style>
