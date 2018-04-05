<template>
  <div v-if="!readonly || (readonly && loaded) " >
    <span>{{title}}</span>
      <div class="form-group pull-center">
        <input v-if="!readonly"
          ref="fileInput"
          @change="flsChange"
          :accept="formats"
          type="file">
        <button v-if="!readonly" :disabled="uplBtnStat" class="btn btn-danger" v-on:click="uplHandler">Загрузить</button>
        <template v-if="loaded">
        <a class="btn btn-danger" target="_blank"
        :href="url+'?component='+component+'&action=get_uploaded_list&EntID='+EntID+'&doc_id='+id">Открыть загруженный документ</a>
        </template>
        </div>
        <b-progress :value="uploadPercentage" :max="max" show-progress animated></b-progress>
        <transition name="bounce">
            <b-alert
                  :show="dismissCountDown"
                  dismissible
                  :variant="alertColor"
                  @dismissed="dismissCountdown=0"
                  @dismiss-count-down="countDownChanged">
                  <h3>{{status==1?'':'Error! '}} {{msg}}</h3>
            <h6>Это оповещение будет скрыто автоматически через {{dismissCountDown}} сек...</h6>
          </b-alert>
        </transition>

  </div>
</template>

<script>

import "bootstrap/dist/css/bootstrap.css";
//import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from 'axios';

export default {
  props: ['title','formats', 'files', 'id','loaded','url','component', 'readonly','EntID'],
  data() {
    return {
      max: 100,
      file: undefined,
      uploadPercentage: 0,
      status: '',
      msg:'',
      dismissSecs: 10,
      dismissCountDown: 0,
      alertColor: 'warning',
      uplBtnStat: true
    }
  },
  computed: {},
  methods: {
    changeMessage(e){
      this.message = e.target.value;
      this.$emit('messageChanged', this.message)
    },
    flsChange: function(e){
      if(e.target.files[0]){
				this.file = e.target.files[0];
        //console.log(this,e,this.file)

      }else{this.file = undefined}
      if(this.file != undefined ){this.uplBtnStat = false;}
      else{this.uplBtnStat = true}
			},
			uplHandler(e){
        this.uplBtnStat = true;
      //  console.log(1,this,2,e)


        let head = {
            headers:{'Accept': 'application/json','Content-Type': 'application/octet-stream'},
            onUploadProgress: function( progressEvent ) {
              if( (progressEvent.loaded>0) && (progressEvent.total>0) ){
                this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
              } else{
                this.uploadPercentage = 0;
              }
            }.bind(this)
        };
        let that = this;
        let file = this.$refs.fileInput.files[0]//this.file
        let filename = this.$refs.fileInput.files[0].name; //this.file.name

          const fd = new FormData();
            fd.append("file",file,filename);
            fd.append("id", that.id);
            fd.append("EntID", that.EntID);
            axios.post(that.url+'?component='+that.component+"&action=post",fd,head)
              .then(res => {
              //console.log("success=>",res);
                that.msg = res.data.msg;
                that.status = res.data.status;
                that.showAlert();
                that.alertColor = "success";
              this.$emit('uploaded');
            })
            .catch(e => {
                console.info('catch->',e);
                that.status = 0;
                that.msg = "Ошибка при передаче файла. Проверьте соединение.";
                that.showAlert();
                that.alertColor = "danger";
                setTimeout(()=>{
                  that.uploadPercentage=0;
                  that.uplBtnStat = false;
                },1000)
            })

      },

      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      }
  },
  mounted(){}
}
</script>
