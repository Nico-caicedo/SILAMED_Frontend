<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
        <q-toolbar>
            <q-avatar>
                <q-btn flat round dense icon="account_box" />
            </q-avatar>
            <q-avatar>
                <q-btn flat round dense icon="delete" @click="limpiarTercero"/>
            </q-avatar>
            <q-toolbar-title>
              Usuarios del Sistema
            </q-toolbar-title>
            <q-btn flat icon="person_add" label="Todos..." @click="mostrarusuarioPersona(-1)" />
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-form ref="formCl" @submit="guardarUsu(usuarioAcceso)">
          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 q-field--with-bottom">
                <q-select
                filled
                v-model="filtroBuscaUsuario"
                map-options emit-value option-value="usuario"
                option-label="NombrePersona"
                :options="listaUsuarios"
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Buscar Usuario"
                @filter="filterFnUsuario"
                @input="val => { cargarUsuario(val) }"
                >
                <template v-slot:prepend>
                <q-icon name="search" size="lg" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                        <q-item-label v-html="scope.opt.NombrePersona" />
                        <q-item-label caption>Login: {{scope.opt.LoginUsuario}} </q-item-label>
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
            <div class="col-xs-12 col-sm-12 col-md-4 q-field--with-bottom">
                <q-select
                filled
                v-model="filtroBusca"
                map-options emit-value option-value="tercero"
                option-label="Identificacion_persona"
                :options="listaTerceros"
                use-input
                hide-dropdown-icon
                hide-selected
                fill-input
                input-debounce="0"
                label="Buscar Persona"
                @filter="filterFn"
                @input="val => { cargarPersona(val) }"
                >
                <template v-slot:prepend>
                <q-icon name="person" size="lg" />
                </template>
                <template v-slot:append>
                  <q-btn icon="person_add" color="black" flat dense unelevated @click="agregarPersona" />
                </template>
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section>
                        <q-item-label v-html="scope.opt.Nombre_persona + ' ' + scope.opt.Otrosnombres_persona + ' ' + scope.opt.Apellido1_persona + ' ' + scope.opt.Apellido2_persona" />
                        <q-item-label caption>Identification: {{scope.opt.Identificacion_persona}} </q-item-label>
                        <q-item-label caption>Id Person: {{scope.opt.Id_persona}} </q-item-label>
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
            <q-input class="col-xs-12 col-md-8 q-field--with-bottom"
                outlined
                readonly
                v-model="nombrePersona"
                label="Nombre"
            />
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
                  outlined
                  v-model="usuarioAcceso.LoginUsuario"
                  label="Usuario"
                  :rules="[ regla ]"
                >
                <template v-slot:prepend>
                  <q-icon name="account_circle" size="lg" />
                </template>
            </q-input>
            <q-select class="col-xs-12 col-sm-5 col-md-6"
              filled
              v-model="usuarioAcceso.IdRol"
              :rules="[ regla ]"
              map-options emit-value option-value="IdRol"
              option-label="NombreRol" :options="listaRoles"
              label="Rol Usuario"
            >
              <template v-slot:prepend>
                <q-icon name="accessibility" size="lg" />
              </template>
            </q-select>
            <q-input class="col-xs-12 col-md-2 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.IdPersona"
              :rules="[ regla ]"
              label="Id Persona"
            />
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.LogincreaUsuario"
              label="Creado por"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              type="date"
              v-model="usuarioAcceso.FechaUsuario"
              label="Fecha creado"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-4 q-field--with-bottom"
              outlined
              readonly
              v-model="usuarioAcceso.ProximocambioUsuario"
              label="Fecha proximo cambio"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" size="lg" />
              </template>
            </q-input>
            <q-input class="col-xs-12 col-md-8 q-field--with-bottom"
              outlined
              v-model="usuarioAcceso.ObservacionesUsuario"
              label="Cargo"
            />
            <q-select class="col-xs-12 col-sm-6 col-md-4"
              filled
              v-model="usuarioAcceso.PeriodocambioUsuario"
              :rules="[ regla ]"
              map-options emit-value
              :options="periodoCambio"
              label="Cambio (meses)"
            >
              <template v-slot:prepend>
                <q-icon name="today" size="lg" />
              </template>
            </q-select>
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.PassnoexpireUsuario"
                checked-icon="check"
                :rules="[ regla ]"
                true-value="1"
                false-value="0"
                color="green"
                label="El password no expira"
                unchecked-icon="clear"
            />
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.ActivoUsuario"
                checked-icon="check"
                :rules="[ regla ]"
                true-value="1"
                false-value="0"
                color="green"
                label="Usuario activo en el sistema"
                unchecked-icon="clear"
            />
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.NomodpassUsuario"
                checked-icon="check"
                true-value="1"
                false-value="0"
                :rules="[ regla ]"
                color="green"
                label="No puede cambiar password"
                unchecked-icon="clear"
            />
            <q-toggle class="col-xs-12 col-sm-6 col-md-4"
                v-model="usuarioAcceso.ModpasspiUsuario"
                checked-icon="check"
                true-value="1"
                false-value="0"
                :rules="[ regla ]"
                color="green"
                label="Cambiar password en el proximo inicio"
                unchecked-icon="clear"
            />
            </div>
            <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-3">
                <div class="row justify-center q-pt-sm">
                <q-btn label="Guardar" class="col-xs-12 col-sm-12 col-md-12" icon="save" outline type="submit" align="center" unelevated >
                </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Restaurar password " icon="vpn_key" outline align="center" unelevated @click="restablecerClave">
                </q-btn>
                </div>
                <div class="row justify-center q-pa-sm">
                <q-btn label="Regresar" icon="replay" class="col-xs-12 col-sm-12 col-md-12" outline align="center" @click="regresar" unelevated v-close-popup>
                </q-btn>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <div class="bg-cyan text-white">
                <q-toolbar>
                  <q-btn flat round dense icon="person" />
                  <q-toolbar-title>Usuarios del Sistema</q-toolbar-title>
                </q-toolbar>
              </div>
              <q-list class="col-xs-12 col-sm-12 col-md-8">
                <q-item v-for="usu in listaUsuarios" :key="usu.Login_usuario" @click.native="cargarUsuario(usu)" class="q-my-sm" clickable>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> <b> {{ usu.NombrePersona }} </b> </q-item-label>
                      <q-item-label>
                          Id Persona: {{ usu.IdPersona }} <br/>
                            Usuario: <b> {{ usu.LoginUsuario }} </b> <br/>
                            Creado por: {{ usu.LogincreaUsuario }} <br/>
                            Id Rol: {{ usu.IdRol }} <br/>
                            Periodo cambio Password: {{ usu.PeriodocambioUsuario }} <br/>
                            Proximo Cambio: {{ usu.ProximocambioUsuario }} <br/>
                            Fecha creación: {{ usu.FechaUsuario.slice(0, 10) }} <br/>
                            El Password nunca expira: {{ usu.PassnoexpireUsuario }} <br/>
                            Activo en el Sistema: {{ usu.ActivoUsuario }} <br/>
                            No puede cambiar el password: {{ usu.NomodpassUsuario }} <br/>
                            Proximo cambio del password: {{ usu.ModpasspiUsuario }} <br/>
                            Cargo: {{ usu.ObservacionesUsuario }} <br/>
                      </q-item-label>
                      <q-separator />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-5">
            </div>
            </div>
          </div>
        </q-form>
        <q-dialog v-model="isDialogComponentePersonas" style="max-width: 650px" :maximized="true">
        <q-card>
          <q-bar>
            <div>componentePersonas</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <component :is="componentePersonas"></component>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utils from '../../commons/utils.js'
import { date } from 'quasar'
export default {
  name: 'Usuarios',
  data () {
    return {
      usuarioAcceso: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1, NomodpassUsuario: '0', ModpasspiUsuario: '0', PassnoexpireUsuario: '0', ActivoUsuario: '0', FechaUsuario: utils.fechaActual() },
      usuarioB: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1, NomodpassUsuario: '0', ModpasspiUsuario: '0', PassnoexpireUsuario: '0', ActivoUsuario: '0', FechaUsuario: utils.fechaActual() },
      tercero: { Id_persona: -1, Nombre_persona: '', Codigo_municipio: '', Id_departamento: '', Id_tiid: '', Sexo_persona: '', Dv_persona: -1, Nacimiento_persona: '19010101 00:00', Otrosnombres_persona: '', Apellido1_persona: '', Apellido2_persona: '', Alias_persona: '', Direccion_persona: '', Telefono_persona: '', Celular_persona: '', Email_persona: '', Web_persona: '', Observaciones_persona: '' },
      usuario: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1 },
      roles: [],
      periodoCambio: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      filtroBusca: '',
      filtroBuscaUsuario: '',
      nombrePersona: '',
      listaTerceros: [],
      listaUsuarios: [],
      listaPersonas: [],
      listaRoles: [],
      componenteVendedores: null,
      isDialogComponenteVendedores: false,
      componentePersonas: null,
      isDialogComponentePersonas: false,
      selected: []
    }
  },
  mounted () {
    this.accesos = this.$q.localStorage.getItem('accesosSILAMED')
    const value = this.$q.localStorage.getItem('usuarioSILAMED')
    if (value) {
      this.usuario = value
      this.limpiarTercero()
    }
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  created () {
    this.tercero.Nacimiento_persona = date
    this.tercero.Nacimiento_persona = utils.fechaActual()
    this.mostrarRoles(-1)
  },
  methods: {
    limpiarTercero () {
      this.tercero = { Id_persona: -1, Identificacion_persona: '', Nombre_persona: '', Otrosnombres_persona: '', Apellido1_persona: '', Apellido2_persona: '', Alias_persona: '', Direccion_persona: '', Telefono_persona: '', Celular_persona: '', Email_persona: '', Web_persona: '', Observaciones_persona: '', Login_persona: this.usuario.LoginUsuario, Modifica_persona: this.usuario.LoginUsuario }
      this.terceroB = this.tercero
      this.usuarioAcceso = { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1, NomodpassUsuario: '0', ModpasspiUsuario: '0', PassnoexpireUsuario: '0', ActivoUsuario: '0', FechaUsuario: utils.fechaActual() }
      this.listaUsuarios = []
    },
    mostrarPersonasDialog () {
      this.componentePersonas = () => this.isDialogComponentePersonas
      this.isDialogComponentePersonas = true
    },
    abortFilterFn () {
      // console.log('delayed filter aborted')
    },
    filterFn (val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/tercero/mostrarPersonaFiltroGral/${val}`)
          .then((response) => {
            update(() => {
              this.listaTerceros = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    filterFnUsuario (val, update, abort) {
      if (val.length === 0) {
        abort()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.get(`/usuario/usuariosFiltro/${val}`)
          .then((response) => {
            update(() => {
              this.listaUsuarios = response.data
              this.$q.loading.hide()
            })
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            this.$q.loading.hide()
          })
      }, 500)
    },
    agregarPersona () {
      this.componentePersonas = () => import('pages/Administracion/Tercero.vue')
      this.isDialogComponentePersonas = true
    },
    buscarPersonaFiltro () {
      const self = this
      self.listaPersonas = []
      self.$q.loading.show()
      api.post('/tercero/mostrarFiltro', this.tercero)
        .then((response) => {
          self.listaPersonas = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Mostrar Filtro - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    cargarPersona (per) {
      this.tercero = per
      this.nombrePersona = per.Nombre_persona + ' ' + per.Otrosnombres_persona + ' ' + per.Apellido1_persona + ' ' + per.Apellido2_persona
      this.mostrarusuarioPersona(per)
      // this.mostrarListaZonas(usua)
    },
    cargarUsuario (usu) {
      this.usuarioAcceso = usu
      this.nombrePersona = usu.NombrePersona
      this.usuarioAcceso.FechaUsuario = usu.FechaUsuario.slice(0, 10)
      this.usuarioAcceso.ProximocambioUsuario = usu.ProximocambioUsuario.slice(0, 10)
    },
    mostrarRoles (idRol) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/roles/${idRol}`)
        .then((response) => {
          self.listaRoles = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Roles - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    verificarUsuairo (loginUsuario) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/verificacion/${loginUsuario}`)
        .then((response) => {
          self.usuarioB = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Verificar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardarUsu (usu) {
      // const login = this.usuarioAcceso.loginUsuario
      this.verificarUsuairo(this.usuarioAcceso.LoginUsuario)
      this.usuarioAcceso.ModificaUsuario = this.usuario.LoginUsuario
      this.usuarioAcceso.LogincreaUsuario = this.usuario.LoginUsuario
      this.usuarioAcceso.EstadoUsuario = 1
      if (this.usuarioB.IdPersona > 0) {
        this.modificarusuario()
      } else {
        this.guardarusuario()
      }
    },
    guardarusuario () {
      const self = this
      var resultado = 0
      self.$q.loading.show()
      api.post('/usuario/guardarUsuario/', this.usuarioAcceso)
        .then((response) => {
          resultado = response.data
          if (resultado > 0) {
            this.cargarPersona(this.tercero)
            utils.mensaje('usuario guardado con éxito')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Guardar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    modificarusuario () {
      const self = this
      self.$q.loading.show()
      api.post('/usuario/modificaUsuario/', this.usuarioAcceso)
        .then((response) => {
          self.$q.loading.hide()
          utils.mensaje('usuario modificado con éxito')
        })
        .catch((error) => {
          utils.mensaje('Modificar Usuario - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    convertirFecha () {
      this.usuarioAcceso.FechaUsuario = utils.fechaActual()
    },
    regresar () {
      this.$router.push('/admin')
    },
    regla (val) {
      if (val !== null && val !== '' && val !== undefined) {
        return true
      }
      return false || 'Falta completar información'
    },
    mostrarusuarioPersona (persona) {
      const self = this
      self.limpiarTercero()
      self.tercero = persona
      self.usuarioAcceso.LogincreaUsuario = this.usuario.LoginUsuario
      self.usuarioAcceso.FechaUsuario = utils.fechaActual()
      var idPersona = -1
      if (self.tercero.Id_persona > 0) {
        idPersona = self.tercero.Id_persona
        this.usuarioAcceso.IdPersona = self.tercero.Id_persona
      } else {
        idPersona = -1
      }
      self.$q.loading.show()
      api.get(`/usuario/usuariosIdPersona/${idPersona}`)
        .then((response) => {
          self.listaUsuarios = response.data
          if (self.listaUsuarios.length > 0) {
            this.cargarUsuario(self.listaUsuarios[0])
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    restablecerClave () {
      const self = this
      this.$q.dialog({
        title: 'SILAMED',
        dark: true,
        message: 'Está seguro de restaurar la contraseña del usuario ' + this.usuarioAcceso.LoginUsuario + '?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.$q.loading.show()
        self.usuarioAcceso.PasswordUsuario = '1234'
        api.post('/usuario/modificaPassword', this.usuarioAcceso)
          .then((response) => {
            var datos = response.data
            if (datos > 0) {
              utils.mensaje('La contraseña ha sido restaurada con éxito')
            } else {
              utils.mensaje('La contraseña no fue restaurada, comuniquese con el administrador')
            }
            self.$q.loading.hide()
          })
          .catch((error) => {
            utils.mensaje('Fallo la conexion ' + error)
            self.$q.loading.hide()
          })
      }).onCancel(() => {
      })
    }
  }
}
</script>
