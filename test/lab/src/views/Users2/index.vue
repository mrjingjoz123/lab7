<template>
  <div>
    <b-button variant="success" class="float-right" @click="addNewUser"
      >Add New</b-button
    >
    <b-modal
      id="modal-form-user"
      ref="modal-form-user"
      :title="title"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name"
          :invalid-feedback="invalidFeedbackName"
          valid-feedback="สำเร็จ"
          :state="stateName"
        >
          <b-form-input id="name" v-model="form.name" required></b-form-input>
        </b-form-group>
        <b-form-group
          label="Gender:"
          label-for="gender"
          :invalid-feedback="invalidFeedbackGender"
          valid-feedback="สำเร็จ"
          :state="stateGender"
        >
          <b-form-select
            id="gender"
            v-model="form.gender"
            :options="genderOptions"
            required
          ></b-form-select>
        </b-form-group>
      </form>
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>
    </b-modal>
    <b-table striped hover :items="userList" :fields="fields">
      <template v-slot:cell(operation)="data">
        <b-button @click="editUser(data.item)">Edit</b-button>
        &nbsp;
        <b-button variant="danger" @click="delUser(data.item)">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios'
import userService from './UserService.js'
export default {
  data () {
    return {
      title: 'เพิ่มผู้ใช้ใหม่',
      form: {
        id: -1,
        name: '',
        gender: null
      },
      genderOptions: [
        { text: 'Select One', value: null },
        { value: 'M', text: 'ผู้ชาย' },
        { value: 'F', text: 'ผู้หญิง' }
      ],
      userList: [],
      fields: ['id', 'name', 'gender', 'operation']
    }
  },
  methods: {
    addNewUser () {
      console.log('Add New user ')
      this.$bvModal.show('modal-form-user')
    },
    editUser (user) {
      console.log('Edit ')
      console.log(user)
      this.title = 'แก้ไขผู้ใช้'
      this.form = { ...user }
      this.$bvModal.show('modal-form-user')
    },
    delUser (user) {
      console.log('Del ')
      console.log(user)
      this.boxTwo = ''
      this.$bvModal
        .msgBoxConfirm('ท่านต้องการลบ ' + user.name + ' หรือไม่!!!', {
          title: 'กรุณายืนยัน',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            // this.deleteUser(user)
            // userService.deleteUser(this.form)
            this.getUsers()
          }
        })
    },
    resetModal () {
      this.form = {
        id: -1,
        name: '',
        gender: null
      }
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      if (this.stateName === false || this.stateGender === false) {
        return
      }
      if (this.form.id > 0) {
        // this.updateUser(this.form)
        userService.updateUser(this.form)
        this.getUsers()
      } else {
        // this.addUser(this.form)
        // userService.addUser(this.form)
        axios.post('http://localhost:3000/users', this.form).then(res => {
          console.log(res)
          this.getUsers()
        }).catch(err => {
          console.log(err)
        })
      }
      this.$nextTick(() => {
        this.$bvModal.hide('modal-form-user')
      })
    },
    getUsers () {
      // this.userList = userService.getUsers()
      axios.get('http://localhost:3000/users').then(res => {
        console.log(res)
        this.userList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    stateName () {
      return this.form.name.length >= 2
    },
    invalidFeedbackName () {
      if (this.form.name.length > 0) {
        return 'ชื่อต้องมีขนาดอย่างน้อย 2 ตัวอักษร'
      }
      return 'ต้องใส่ชื่อ'
    },
    stateGender () {
      return this.form.gender != null
    },
    invalidFeedbackGender () {
      if (this.form.gender != null) {
        return ''
      }
      return 'กรุณาเลือกเพศของคุณ'
    }
  },
  mounted () {
    console.log('Vue component is mounted')
    this.getUsers()
  }
}
</script>
