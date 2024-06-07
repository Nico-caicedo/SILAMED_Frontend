<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="edit_calendar" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" @click="isDialogComponenteConsulta = true" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" @click="isDialogComponenteFiltro = true" />
        </q-avatar>
        <q-toolbar-title> Programación Informe Medidor </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>

      <q-form ref="formordenEntrada" @submit="ProgramarInforme">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="row q-col-gutter-sm">
            <q-select class="col-xs-12 col-md-6 q-field--with-bottom" outlined v-model="Informe.IdOrdenEntradad"
              map-options emit-value option-value="Id_Ordenentradad" option-label="SerialMedidor" clearable
              :options="lisMedidoresNoApto" @input="(val) => {
              consultarFiltro();
            }
            " :rules="[regla]" label="Medidor No Apto">
              <template v-slot:prepend>
                <q-icon name="schedule" size="lg" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section aria-checked="Id_Ordenentrada">
                    <q-item-label v-html="scope.opt.SerialMedidor" />
                    <q-item-label caption>No. Orden Entrada:
                      {{ scope.opt.Id_Ordenentrada }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
              <q-select filled v-model="Informe.Reviso" map-options emit-value option-value="LoginUsuario"
                option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input hide-dropdown-icon
                hide-selected fill-input input-debounce="0" label="Supervisor Informe" @filter="filterFnUsuario">
                <template v-slot:prepend>
                  <q-icon name="supervisor_account" size="lg" />
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
            <div class="col-xs-12 col-sm-12 col-md-6 q-field--with-bottom">
              <q-select filled v-model="Informe.Elaboro" map-options emit-value option-value="LoginUsuario"
                option-label="NombrePersona" :options="listaUsuarios" :rules="[regla]" use-input hide-dropdown-icon
                hide-selected fill-input input-debounce="0" label="Encargado informe" @filter="filterFnUsuario">
                <template v-slot:prepend>
                  <q-icon name="engineering" size="lg" />
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
          </div>
        </div>
        <q-btn color="white" text-color="black" label="Agregar evidencia fotográfica" icon="photo_camera"
          @click="OpenCamera(1)" />
        <!-- <div v-for="(imageSrc, index) in imageSrcs" :key="index">
                    <img style="width: 200px; height: 200px" :src="imageSrc" />
                </div> -->

        <div class="bg-white borde-interno q-mb-md" style="border: 1px solid #ddd !important">
          <div class="row items-center justify-center bg-grey-8 text-white text-center" style="height: 30px">
            Imagenes
          </div>
          <!-- permite vizualiar los archivos que se carguen y modificar si lo requiere el usuario -->
          <div class="q-pa-xs flex justify-around" style="gap: 15px">
            <div class="q-pa-xs flex justify-around" style="gap: 15px">

              <q-card class="my-card bg-grey-2" style="width: 148px" v-for="(imageSrc, index) in imageSrcs" :key="index"
                >
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
        </div>
        <!-- permite cargar los datos -->
        <q-dialog v-model="dialog" :position="position">
          <q-card style="width: 350px">
            <q-card-section class="row items-center wrap justify-center">
              <q-btn flat icon="photo_camera" label="camara" @click="captureImage(1)" />

              <q-btn flat icon="add_photo_alternate" label="Abrir galeria" @click="captureImage(0)" />
            </q-card-section>
          </q-card>
        </q-dialog>
        <div class="q-pa-md q-gutter-md">
          <q-btn label="Programar" icon="save" type="submit" outline align="center" unelevated>
          </q-btn>
        </div>
        <div class="q-pa-md q-gutter-md">
          <q-btn label="Regresar" icon="replay" outline align="center" unelevated @click="regresar">
          </q-btn>
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
import utils from "../../commons/utils.js";
import { date } from "quasar";
import { exportFile } from "quasar";
import {
  DestinationType,
  PictureSourceType,
} from "app/src-cordova/plugins/cordova-plugin-camera/www/CameraConstants";

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
      index: '',
      dialog: false,
      dialogReplace: false,
      position: "bottom",
      imageSrcs: [],
      model: null,
      todasFechas: 0,
      listaProgramaciones: [],
      selectedDate: "",
      listaDiametros: ["15", "20", "25"],
      listaRangoMedicion: [],
      rangoMedicion: {
        Id_rangomedicion: "",
        Nombre_rangomedicion: "",
        Diametromedidor_rangomedicion: 0,
        Estado_rangomedicion: 1,
      },
      condicionMontada: { Id_rangomedicion: "", Diametro_medidor: -1 },
      // modeloMedidor: { id_modelomedidor: -1, id_marcamedidor: -1,	id_tipoindicador: '',	id_princfisico: -1,	id_posicionmed: '',	id_rangom3: -1,	id_rangomedicion: '',	diametronominal_modelomedidor: -1,	divisionescala_modelomedidor: -1,	descripcion_modelomedidor: '',	fecha_modelomedidor: '', login_modelomedidor: '',	estado_modelomedidor: 1 },
      ListaInstrumentosGeneral: [],
      listaInstrumentos: [],
      listaInstrumentosModificar: [],
      listaUsuarios: [],
      lisMedidoresNoApto: [],

      Informe: {
        IdOrdenEntradad: "",
        img: [],
        Reviso: "",
        Elaboro: "",
        Login: "",
      },
      fecha: date,
      usuario: {},
      ordenEntradaD: {
        Id_ordenentradad: -1,
        Id_ordenentrada: -1,
        Id_marcamedidor: -1,
        Diametronominal_ordenentradad: 0,
        Id_modelomedidor: -1,
        Id_normaref: null,
        Aptocalibrar_ordenentradad: "",
        Fabricacion_ordenentradad: "",
        Lectura_ordenentradad: "",
        Serialmedidor_ordenentradad: "",
        Caudalpermanente_ordenentradad: 0,
        Claseprecision_ordenentradad: 0,
        Presionmax_ordenentradad: 0,
        Perdidapresion_ordenentradad: "",
        Rangomedicion1_ordenentradad: 0,
        Rangomedicion2_ordenentradad: 0,
        Clasetemperatura_ordenentradad: "",
        Sensibilidadaar_ordenentradad: "",
        Sebsibilidadaab_ordenentradad: "",
        Identificador_ordenentradad: 0,
        Clasemetrologica_ordenentradad: "",
        Precisionnominal_ordenentradad: 0,
        Observacion_ordenentradad: "",
        Estado_ordenentradad: 0,
        Nombre_marcamedidor: "",
        Descripcion_modelomedidor: "",
        Nombre_normaref: "",
        Marcamedidor: { Id_marcamedidor: null, Nombre_marcamedidor: "" },
        Modelomedidor: {
          Id_modelomedidor: null,
          Descripcion_modelomedidor: "",
          Diametronominal_modelomedidor: "",
        },
        Icono: "edit",
        Incidencias: 0,
        ListaIncidencias: [],
        Programado_ordenentradad: 0,
        Calibrado_ordenentradad: 0,
        Certificado_ordenentradad: 0,
      },
      columnsMedidores: [
        {
          name: "Id_ordenentradad",
          align: "left",
          label: "Id",
          field: "Id_ordenentradad",
          required: true,
          sortable: true,
        },
        {
          name: "Serialmedidor_ordenentradad",
          align: "left",
          label: "Serial",
          field: "Serialmedidor_ordenentradad",
          sortable: true,
        },
        {
          name: "Fabricacion_ordenentradad",
          align: "left",
          label: "AñoFab",
          field: "Fabricacion_ordenentradad",
          sortable: true,
        },
        {
          name: "Lectura_ordenentradad",
          label: "Lectura",
          field: "Lectura_ordenentradad",
          sortable: true,
        },
        {
          name: "Nombre_marcamedidor",
          align: "left",
          label: "Marca Medidor",
          field: "Nombre_marcamedidor",
          sortable: true,
        },
        {
          name: "Descripcion_modelomedidor",
          align: "left",
          label: "Modelo Medidor",
          field: "Descripcion_modelomedidor",
          sortable: true,
        },
        {
          name: "Aptocalibrar_ordenentradad",
          align: "left",
          label: "AptoCal",
          field: "Aptocalibrar_ordenentradad",
          sortable: true,
        },
        {
          name: "Diametronominal_ordenentradad",
          align: "left",
          label: "DNom",
          field: "Diametronominal_ordenentradad",
          sortable: true,
        },
        {
          name: "Nombre_normaref",
          align: "left",
          label: "Norma Referencia",
          field: "Nombre_normaref",
          sortable: true,
        },
      ],
      vcMedidores: [
        "Id_ordenentradad",
        "Serialmedidor_ordenentradad",
        "Fabricacion_ordenentradad",
        "Lectura_ordenentradad",
        "Descripcion_modelomedidor",
      ],
      columnsCaudales: [
        {
          name: "Id_caudal",
          align: "left",
          label: "Id",
          field: "Id_caudal",
          sortable: true,
        },
        {
          name: "Nombre_caudal",
          align: "left",
          label: "Nombre Prueba",
          field: "Nombre_caudal",
          sortable: true,
        },
        {
          name: "Modificar_caudal",
          label: "Modificar",
          field: "Modificar_caudal",
        },
      ],
    };
  },
  mounted() {
    this.usuario = this.$q.localStorage.getItem("usuarioSILAMED");
    utils.verificarUsuario(this.usuario.LoginUsuario, this);
    this.accesos = this.$q.localStorage.getItem("accesosSILAMED");
    this.mostrarNormaReferencia();
    this.reiniciarProgramacion();
    this.ProgramacionOrdenB.FechaIni = utils.fechaActual();
    this.ProgramacionOrdenB.FechaFin = utils.fechaActual();
  },
  created() {
    const instrumento = {
      Id_instrumento: -1,
      IdTipoInstrumento: "",
      Id_variablemedicion: "",
      Nombre_variablemedicion: "",
      Nombre_instrumento: "",
      Serial_instrumento: "",
      Codigo_instrumento: "",
      Descripcion_instrumento: "",
      Medida_instrumento: -1,
      Activo_instrumento: 1,
      Login_instrumento: "",
      LisTrazabilidadInstrumentos: [],
    };
    this.mostrarInstrumentosGeneral(instrumento);
  },
  methods: {
    AbrirCambio(index){
      
      this.index = index
      this.dialogReplace = true;

    },
    Limpiar() {
      (this.imageSrcs = []),
        (this.Informe = {
          IdOrdenEntradad: "",
          img: [],
          Reviso: "",
          Elaboro: "",
          Login: "",
        });
    },
    ProgramarInforme() {
      this.Informe.img = this.imageSrcs;
      this.Informe.Login = this.usuario.LoginUsuario;
      console.log(this.Informe);
      const self = this;
      self.$q.loading.show();
      api
        .post("/medidor/SetInformeMedidor/", self.Informe)
        .then((response) => {
          this.Limpiar();
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
        });
    },

    imprimir() {
      const self = this;
      const IdInforme = 2120;
      self.$q.loading.show();
      api
        .get(`/medidor/ImprimirInforme/${IdInforme}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const blobURL = URL.createObjectURL(blob);
          window.open(blobURL);
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
        });
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
      // Tomar una nueva foto o seleccionar una imagen de la galería
      navigator.camera.getPicture(
        (imageData) => {
          // En caso de éxito
          // Concatenar los datos de la imagen en una URL base64
          const imageSrc = `data:image/jpeg;base64,${imageData}`;

          // Reemplazar la imagen en la posición 'index' con la nueva imagen
          this.$set(this.imageSrcs, index, imageSrc);
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
    InformateCreate() {
      this.img = [imgtest, imgtest];

      console.log(informe);
      //   Notificar al usuario que las imágenes se han enviado exitosamente

      this.$q.notify("Imágenes enviadas al backend correctamente.");
      this.$q.loading.show();
      api
        .post("/medidor/ProgrmarInforme/", informe)
        .then((response) => {
          this.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Rango Medicion " + error);
          this.$q.loading.hide();
        });
    },
    getBase64Image(imageSrc) {
      // Crear un nuevo objeto Image
      const img = new Image();

      // Configurar el manejador de eventos onload
      img.onload = function () {
        // Crear un lienzo (canvas) para convertir la imagen en base64
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Establecer el tamaño del lienzo para que coincida con el tamaño de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el lienzo
        ctx.drawImage(img, 0, 0);

        // Obtener el contenido del lienzo en formato base64
        const base64Data = canvas.toDataURL("image/jpeg");

        // Resolver la promesa con el contenido de la imagen en formato base64
        resolve(base64Data);
      };

      // Configurar el manejador de eventos onerror
      img.onerror = function () {
        // Rechazar la promesa si hay un error al cargar la imagen
        reject(new Error("Error al cargar la imagen."));
      };

      // Establecer la fuente de la imagen para cargarla
      img.src = imageSrc;
      console.log(img);
    },
    cambiarInstrumento(instrumento) {
      const self = this;
      this.Instrumento = instrumento;
      self.listaInstrumentosModificar = [];
      self.listaInstrumentos.forEach(function (inst) {
        if (
          inst.IdTipoInstrumento === instrumento.Instrumento.IdTipoInstrumento
        ) {
          self.listaInstrumentosModificar.push(inst);
        }
      });
      this.isDialogComponenteCambiarInstrumento = true;
    },
    mostrarfotos() {
      this.getBase64Image(this.imageSrcs);
      // console.log(this.imageSrcs)
    },
    modificarInstrumento(instrumento) {
      const self = this;
      self.ListaInstrumentosGeneral.forEach(function (inst) {
        if (inst.Id_instrumento === self.Instrumento.Id_instrumento) {
          inst.Id_instrumento = instrumento.Id_instrumento;
          inst.Nombre_instrumento = instrumento.Nombre_instrumento;
          inst.Codigo_instrumento = instrumento.Codigo_instrumento;
          // self.listaInstrumentosModificar.push(inst)
          self.isDialogComponenteCambiarInstrumento = false;
        }
      });
    },
    mostrarRangoMedicion(rm) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/programacionorden/rangoMedicionMostrar/", rm)
        .then((response) => {
          self.listaRangoMedicion = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Rango Medicion " + error);
          self.$q.loading.hide();
        });
    },
    mostrarInstrumentosGeneral(inst) {
      const self = this;
      self.$q.loading.show();
      api
        .post("/instrumento/instrumentoMostrarFiltro/", inst)
        .then((response) => {
          self.listaInstrumentos = response.data;
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Instrumentos Gral " + error);
          self.$q.loading.hide();
        });
    },
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
        "ConsultaProgramacionMedidores_" + utils.fechaActual();
      const status = exportFile(nombreArchivo + ".csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "No existen datos para descargar",
          color: "negative",
          icon: "warning",
        });
      }
    },
    mostrarModelos(marca) {
      if (marca !== null) {
        this.lisModelomedidor = marca.LisModelomedidor;
        this.ordenEntradaD.Nombre_marcamedidor = marca.Nombre_marcamedidor;
        this.ordenEntradaD.Id_marcamedidor = marca.Id_marcamedidor;
        if (marca.LisModelomedidor.length < 1) {
          this.ordenEntradaD.Id_modelomedidor = "";
        }
      }
    },
    cargarModelo(modelo) {
      if (modelo !== null) {
        this.ordenEntradaD.Descripcion_modelomedidor =
          modelo.Descripcion_modelomedidor;
        this.ordenEntradaD.Id_modelomedidor = modelo.Id_modelomedidor;
        this.ordenEntradaD.Diametronominal_ordenentradad =
          modelo.Diametronominal_modelomedidor;
      }
    },

    mostrarNormaReferencia() {
      const self = this;
      self.$q.loading.show();
      api
        .get("/medidor/GetMedidoresNoAptos/")
        .then((response) => {
          self.lisMedidoresNoApto = response.data;
          // self.ordenEntradaD.Id_normaref = response.data[0].Id_normaref
          console.log(self.lisMedidoresNoApto);
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Fallo la conexion - Norma Referencia " + error);
          self.$q.loading.hide();
        });
    },
    getSelectedString() {
      return this.selectedMedidores.length > this.banco.Medidores_banco
        ? `No puede agragar medidores que superen la capacidad del banco - ${this.selectedMedidores.length} medidores`
        : this.selectedMedidores.length === 0
          ? ""
          : `${this.selectedMedidores.length} medidor${this.selectedMedidores.length > 1 ? "es" : ""
          } de ${this.lisMedidores.length} medidores`;
    },
    getSelectdMedidores() {
      return this.lisMedidores.length === 0
        ? ""
        : `${this.lisMedidores.length} medidor${this.lisMedidores.length > 1 ? "es" : ""
        } `;
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
    regresar() {
      this.$router.push("/admin");
    },
    reiniciarProgramacion() {
      // this.ordenEntradaD = { Id_puse: 'PS01', Login_ordenEntrada: this.usuario.LoginUsuario, Numero_ordenEntrada: '0', Valor_ordenEntrada: 0, Observaciones_ordenEntrada: '' }
      this.ProgramacionOrden = {
        Id_programacionorden: null,
        Id_ordenentradad: null,
        Id_tipoensayo: null,
        Nombre_tipoensayo: "",
        Id_banco: null,
        Nombre_banco: "",
        Fechacalibracion_programacionorden: "",
        Horacalibracion_programacionorden: "",
        Duracioncalibracion_programacionorden: 0,
        Medidores_programacionorden: 0,
        Supervisor_programacionorden: "",
        Encargado_programacionorden: "",
        Observacion_programacionorden: "",
        Login_programacionorden: "",
        LisProgOrdenDet: [],
        LisInstProg: [],
      };
      this.ProgramacionOrden.Fechacalibracion_programacionorden =
        utils.fechaActual();
      this.ProgramacionOrden.Horacalibracion_programacionorden = "07:30";
      this.ProgramacionOrden.Login_programacionorden =
        this.usuario.LoginUsuario;
      this.fechaIni = this.ProgramacionOrden.Fechacalibracion_programacionorden;
      this.fechaFin = this.ProgramacionOrden.Fechacalibracion_programacionorden;
      this.listaClientes = [];
      this.selectedMedidores = [];
      this.SelectedPruebas = [];
      this.SelectedInstrumentos = [];
      this.consultarFiltro();
    },
    consultarordenProgramacionFechas() {
      const self = this;
      self.$q.loading.show();
      if (self.todasFechas === 1) {
        self.ProgramacionOrdenB.Id_programacionorden = 1;
      } else {
        self.ProgramacionOrdenB.Id_programacionorden = 0;
      }
      if (self.ProgramacionOrdenB.Login_programacionorden === null) {
        self.ProgramacionOrdenB.Login_programacionorden = "";
      }

      api
        .post(
          "/programacionorden/ProgramacionConsultaFechas/",
          this.ProgramacionOrdenB
        )
        .then((response) => {
          if (response.data != null) {
            self.listaProgramaciones = response.data;
          }
          self.$q.loading.hide();
        })
        .catch((error) => {
          utils.mensaje("Consulta RC - Fallo la conexion " + error);
          self.$q.loading.hide();
        });
    },
    regla(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return true;
      }
      return false || "Falta completar información";
    },
    programacionOrdenImprimirPDF(IdProgramacionOrden) {
      this.$q.loading.show();
      api
        .get(
          `/programacionorden/programacionImprimirPDF/${IdProgramacionOrden}`,
          { responseType: "arraybuffer" }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const blobURL = URL.createObjectURL(blob);
          window.open(blobURL);
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
        });
    },
    guardarProgramacion() {
      const self = this;
      if (
        self.ProgramacionOrden.Supervisor_programacionorden ===
        self.ProgramacionOrden.Encargado_programacionorden
      ) {
        utils.mensaje(
          "No puedes seleccionar el mismo supervisor al encargado de la calibración"
        );
        return;
      }
      if (this.SelectedPruebas.length < 1) {
        utils.mensaje(
          "Debe seleccionar al menos una prueba de caudal para realizar las pruebas"
        );
        return;
      }
      if (this.selectedMedidores.length < 1) {
        utils.mensaje(
          "No ha seleccionados medidores para las pruebas, debe seleccionar al menos uno"
        );
        return;
      }
      if (this.selectedMedidores.length > this.banco.Medidores_banco) {
        utils.mensaje(
          "Los medidores seleccionados no pueden superar la capcidad del banco, Capacidad del Banco: " +
          this.banco.Medidores_banco +
          ", Medidores seleccionados: " +
          this.selectedMedidores.length
        );
        return;
      }
      this.$q
        .dialog({
          title: "SILAMED",
          dark: true,
          message: "Esta seguro de guardar la programación?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          self.ProgramacionOrden.LisProgOrdenDet = [];
          self.ProgramacionOrden.LisInstProg = [];
          self.ProgramacionOrden.Medidores_programacionorden =
            self.selectedMedidores.length;
          self.ProgramacionOrden.Id_banco = this.banco.Id_banco;
          for (const oed of self.selectedMedidores) {
            const oeDet = {
              Id_pod: 0,
              Id_programacionorden: 0,
              Id_ordenentradad: oed.Id_ordenentradad,
              Estado_pod: 1,
            };
            self.ProgramacionOrden.LisProgOrdenDet.push(oeDet);
          }
          // VERIFICAR TRAZABILIDAD DEL INSTRUMENTO
          for (const caudalP of self.SelectedPruebas) {
            if (caudalP.ListaInstrumentoCaudal.length > 0) {
              for (const lic of caudalP.ListaInstrumentoCaudal) {
                // El Id_trazabilidadinst: se actualiza con el procedimiento almacenado.
                let instr = {
                  Id_instprog: -1,
                  Id_programacionorden: 0,
                  Id_caudal: caudalP.Id_caudal,
                  IdTipoInstrumento: lic.IdTipoInstrumento,
                  Id_instrumento: lic.Id_instrumento,
                  Id_trazabilidadinst: 0,
                  Login_instprog: self.usuario.LoginUsuario,
                  Fecha_instprog: "",
                  Estado_instprog: 1,
                };
                self.ProgramacionOrden.LisInstProg.push(instr);
              }
            } else {
              utils.mensaje(
                "El Caudal " +
                caudalP.Nombre_caudal +
                " no tiene instrumentos asociados"
              );
              return;
            }
          }
          if (self.ProgramacionOrden.LisInstProg.length > 0) {
            api
              .post(
                "/programacionorden/guardarProgramacion/",
                this.ProgramacionOrden
              )
              .then((response) => {
                utils.mensaje(
                  "Programación realizada con éxito para " +
                  response.data.Medidores_programacionorden +
                  " medidores"
                );
                self.programacionOrdenImprimirPDF(
                  response.data.Id_programacionorden
                );
                self.reiniciarProgramacion();
                self.$q.loading.hide();
              })
              .catch((error) => {
                utils.mensaje(
                  "Fallo la conexion - Guardar Programacion " + error
                );
                self.$q.loading.hide();
              });
          } else {
            utils.mensaje(
              "No cuenta con instrumentos asociados a la calibración, verifique"
            );
            return;
          }
        })
        .onCancel(() => { });
    },
    formatoNumero(numero, decimales) {
      return utils.formatoNumero(numero, decimales);
    },
    consultarFiltro() {
      console.log(this.Informe.IdOrdenEntradad);
    },
  },
};
</script>
