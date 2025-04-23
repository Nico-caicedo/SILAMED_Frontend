<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="edit_calendar" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="print" />
        </q-avatar>
        <q-avatar>
          <q-btn flat round dense icon="content_paste_search" />
        </q-avatar>
        <q-toolbar-title> Programación Informe Medidor </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>

      <q-form ref="formordenEntrada" @submit="ProgramarInforme">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="row q-gutter-md" style="padding: 8px;" >
            <q-select class="col-xs-11 col-sm-11 col-md-11 q-field--with-bottom" outlined v-model="Informe.IdOrdenEntradad"
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

            <div class="col-xs-11 col-sm-11 col-md-11 q-field--with-bottom">
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
            <div class="col-xs-11 col-sm-11 col-md-11 q-field--with-bottom">
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
        <q-btn style="margin-bottom: 10px;" color="white" text-color="black" label="Agregar evidencia fotográfica" icon="photo_camera"
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
        <div class="q-pa-md q-gutter-md col-xs-12 col-sm-11 col-md-12">
          <q-btn class="col-xs-1 col-sm-11 col-md-12" label="Programar" color="positive" icon="save" type="submit"   unelevated>
          </q-btn>
      
        
          <q-btn class="col-xs-11 col-sm-11 col-md-12" label="Regresar" icon="replay" color="primary" unelevated @click="regresar">
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
   
    // this.ProgramacionOrdenB.FechaIni = utils.fechaActual();
    // this.ProgramacionOrdenB.FechaFin = utils.fechaActual();
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
      console.log(this.Informe)
      if(this.Informe.img.length == 4 && this.Informe.Elaboro != '' && this.Informe.Reviso != '' ){
        const self = this;
      self.$q.loading.show();
      api
        .post("/medidor/SetInformeMedidor/", self.Informe)
        .then((response) => {
          this.Limpiar();
          this.$q.loading.hide();
      this.$q.notify({
                  type: 'positive',
                  message: 'Informe Medidor creado con éxito',
                  position: 'top-right'
                });
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
        });
      }else{
        this.$q.notify({
                  type: 'warning',
                  message: 'Faltan evidencias o campos por completar',
                  position: 'top-right'
                });
      }

     
    },

    captureImage(tipo) {

      if(this.imageSrcs.length == 4){
      this.$q.notify({
                  type: 'warning',
                  message: 'El máximo de imagenes se completo.',
                  position: 'top-right'
                });
      }else{
      
        navigator.camera.getPicture(
        (data) => {
          // on success
          const imageSrc = `data:image/jpeg;base64,${data}`;

          // Agregar la nueva imagen a la matriz de imágenes
          this.imageSrcs.push(imageSrc);
        },
        () => {
          // on fail
          // this.$q.notify("");
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
      }
   
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
          this.dialogReplace = false
          this.$q.notify({
                  type: 'positive',
                  message: 'se remplazo la evidencia',
                  position: 'top-right'
                });
        },
        () => {
          // En caso de fallo
          // Mostrar una notificación si no se puede acceder a la cámara del dispositivo
          this.$q.notify({
                  type: 'negative',
                  message: 'No se pudo acceder a la cámara del dispositivo.',
                  position: 'top-right'
                });
         
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
          // console.log(self.lisMedidoresNoApto);
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
    regla(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return true;
      }
      return false || "Falta completar información";
    },
    consultarFiltro() {
      // console.log(this.Informe.IdOrdenEntradad);
    },
  },
};
</script>
