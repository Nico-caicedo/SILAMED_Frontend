<template>
  <q-layout container style="height: 90vh">
    <q-header class="bg-red-8">
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="pages" />
        </q-avatar>
        <q-toolbar-title>Roles</q-toolbar-title>
        <q-btn flat icon="contacts" label="Usuarios" @click="abrirVentanaUsuarioRol" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="q-pa-md">
        <q-select class="col-xs-12 col-sm-6 col-md-4" stack-label label="Roles" v-model="idRol" emit-value map-options option-value="IdRol"
          option-label="NombreRol" :options="roles" outlined  @input="val => { mostrarAccesosTrue(val, '-1') }">
          <template v-slot:prepend>
            <q-icon name="verified" />
          </template>
        </q-select>
      </div>
      <div class="q-pa-md">
        <q-tree class="col-12 col-sm-12"
          :nodes="accesos" label-key="DescripcionAcceso"
          node-key="IdAcceso" children-key="Hijos"
          tick-strategy="leaf"
          :ticked.sync="accesosSeleccion"
        >
        </q-tree>
      </div>
      <div class="row justify-center q-pa-sm">
        <q-btn label="Actualizar Accesos" icon="update" outline align="center" unelevated @click="guardar" >
        </q-btn>
      </div>
    </q-page-container>
    <q-dialog v-model="isDialogComponenteUsuarios" style="max-width: 500px" :maximized="true">
      <q-card>
        <q-bar>
          <div>Componente</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <component :is="componenteusuarios"></component>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style lang="stylus">
</style>

<script>
import { api } from 'boot/axios'
import utils from '../../commons/utils.js'
export default {
  data () {
    return {
      roles: [],
      accesos: [],
      accesosSeleccion: [],
      accesosRol: [],
      nuevoAccesos: [],
      idRol: '',
      usuario: { LoginUsuario: '', PasswordUsuario: '', IdPersona: -1, NomodpassUsuario: null, PassnoexpireUsuario: null, ActivoUsuario: null },
      usuarios: [],
      usuariosFiltro: [],
      usuarioRol: { IdUsuario: null, IdRol: null },
      componenteusuarios: null,
      isDialogComponenteUsuarios: false
    }
  },
  created () {
    this.mostrarRoles(-1)
    this.mostrarAccesos('-1')
    this.usuario = this.$q.localStorage.getItem('usuarioSILAMED')
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  methods: {
    abrirVentanaUsuarioRol () {
      this.componenteusuarios = () => import('pages/Administracion/AdminUsuarios.vue')
      this.isDialogComponenteUsuarios = true
    },
    mostrarRoles (idRol) {
      const self = this
      self.$q.loading.show()
      api.get(`/usuario/roles/${idRol}`)
        .then((response) => {
          self.roles = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Roles - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarAccesos (idModulo) {
      const self = this
      self.$q.loading.show()
      self.accesosSeleccion = []
      api.get(`/usuario/AccesosIdModulo/${idModulo}`)
        .then((response) => {
          self.accesos = response.data
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Accesos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    guardar () {
      const self = this
      this.nuevoAccesos = []

      if (self.accesosSeleccion.length > 0) {
        self.accesosSeleccion.forEach(function (acceso) {
          const ac = self.accesosRol.find(f => f.IdAcceso === acceso)
          if (ac) {
            ac.EstadoRolacceso = 1
          } else {
            self.nuevoAccesos.push({ IdAcceso: acceso, IdRol: self.idRol, LoginRolacceso: self.usuario.LoginUsuario, EstadoRolacceso: 1 })
          }
        })
      }

      if (self.accesosRol.length > 0) {
        self.accesosRol.forEach(function (acceso) {
          const ac = self.accesosSeleccion.find(f => f === acceso.IdAcceso)
          if (ac) {
          } else {
            self.nuevoAccesos.push({ IdAcceso: acceso.IdAcceso, IdRol: self.idRol, LoginRolacceso: self.usuario.LoginUsuario, EstadoRolacceso: 0 })
          }
        })
      }

      self.$q.loading.show()
      api.post('/usuario/guardarRolAccesos', self.nuevoAccesos)
        .then((response) => {
          utils.mensaje('Accesos Actualizados con exito')
          self.$q.loading.hide()
          // self.listarVistas(self.idRol)
        })
        .catch((error) => {
          utils.mensaje('Actualizar Accesos - Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    },
    mostrarAccesosTrue (idRol, idModulo) {
      const self = this
      self.accesosSeleccion = []
      self.$q.loading.show()
      api.get(`/usuario/accesos/${idRol}/${idModulo}`)
        .then((response) => {
          self.accesosRol = response.data
          self.accesosRol.forEach(function (acceso) {
            self.accesosSeleccion.push(acceso.IdAcceso)
          })
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Fallo la conexion ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
