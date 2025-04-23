<template>
    <q-layout container style="height: 90vh">
        <q-header class="bg-red-8">
            <q-toolbar>
                <q-avatar>
                    <q-btn flat round dense icon="vpn_key" />
                </q-avatar>
                <q-toolbar-title>
                  Cambiar Password
                </q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <div class="q-pa-md">
              <div class="row justify-center q-pt-sm">
                  <q-input v-model="usuario.LoginUsuario" class="col-xs-12 col-sm-6 col-md-4"
                  label="Usuario" outlined lazy-rules :rules="[ val => val && val.length > 0 || 'Falta llenar campo']" />
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Password" class="col-xs-12 col-sm-6 col-md-4" v-model="usuario.PasswordUsuario" @keydown.enter.prevent="login" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Nuevo Password" class="col-xs-12 col-sm-6 col-md-4" v-model="usuario.PasswordNuevo" @keydown.enter.prevent="login" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwdN ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdN = !isPwdN" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-input label="Confirmar Password" class="col-xs-12 col-sm-6 col-md-4" v-model="usuario.PasswordConfirma" @keydown.enter.prevent="login" outlined :type="isPwd ? 'password' : 'text'" :rules="[val => val !== null && val !== '' || 'Falta llenar campo']">
                  <template v-slot:append>
                      <q-icon :name="isPwdC ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdC = !isPwdC" />
                  </template>
                  </q-input>
              </div>
              <div class="row justify-center q-pt-sm">
                  <q-btn label="Cambiar Password" class="col-xs-12 col-sm-6 col-md-4" icon="vpn_key" outline align="center" unelevated @click="login()"/>
              </div>
          </div>
      </q-page-container>
    </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import utils from '../../commons/utils.js'
export default {
  name: 'CambioClave',
  data () {
    return {
      isPwd: true,
      isPwdN: true,
      isPwdC: true,
      usuario: { LoginUsuario: '', PasswordUsuario: '', PasswordNuevo: '', PasswordConfirma: '', IdPersona: -1 }
    }
  },
  mounted () {
  },
  created () {
    const value = this.$q.localStorage.getItem('usuarioSILAMED')
    if (value) {
      this.usuario = value
    }
    utils.verificarUsuario(this.usuario.LoginUsuario, this)
  },
  methods: {
    login () {
      const self = this
      if (this.usuario.PasswordNuevo === this.usuario.PasswordUsuario) {
        utils.mensaje('El nuevo password no puede ser igual al anterior')
        return
      }
      if (this.usuario.PasswordNuevo !== this.usuario.PasswordConfirma) {
        utils.mensaje('El password nuevo con concuerda')
        return
      }
      if (this.usuario.PasswordNuevo === '') {
        utils.mensaje('El password no puede ser vacio')
        return
      }
      self.$q.loading.show()
      api.post('/usuario/autenticacion', this.usuario)
        .then((response) => {
          var datos = response.data
          if (!datos.LoginUsuario) {
            utils.mensaje('El usuario o password no coinciden, verifique')
          } else {
            self.usuario.PasswordUsuario = this.usuario.PasswordConfirma
            self.$q.localStorage.set('usuarioSILAMED', datos)
            this.cambiarClave()
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Login - Fail conexion ' + error)
          self.$q.loading.hide()
        })
    },
    cambiarClave () {
      const self = this
      self.$q.loading.show()
      api.post('/usuario/modificaPassword', this.usuario)
        .then((response) => {
          var datos = response.data
          if (datos > 0) {
            utils.mensaje('El password ha sido cambiado con éxito')
            self.$router.push('/admin')
          } else {
            utils.mensaje('El password no fue modificado, consulte con el administrador')
          }
          self.$q.loading.hide()
        })
        .catch((error) => {
          utils.mensaje('Cambio Password - Fallo conexion ' + error)
          self.$q.loading.hide()
        })
    }
  }
}
</script>
