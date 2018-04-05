<template>
  <div class="pull-center">
    <button class="btn"
      @click="btn_zagruzka"
      :class="{'btn-dark': seen, 'btn-danger': !seen}">
			<i class="fas fa-paperclip"></i>
			{{btn_upload_text}}
		</button>
    <transition-group name="bounce"
    >
        <div v-if="seen" v-for="(file, index) in files"
             :key="index">
          <p is="app-input" class="docBlock"
            :url="url"
            :component="component"
            :readonly="readonly"
            :EntID="EntID"
            :title="file.title"
            :id="index.replace('id','')"
            :loaded="file.loaded"
            :formats="formats"
            :key2="index"
            @uploaded="uploadedHandler"
          ></p>
      </div>
    </transition-group>
  </div>
</template>



<script>

import Input from './Input.vue';
import axios from 'axios';

export default {
  props: ['component', 'url', 'formats', 'readonly'],
  data(){
    return {
      seen: false,
      files: [],
      msg:'',
      status:'',
      EntID: ''
    }
  },
  components: {
    'app-input': Input
  },
  computed: {
    btn_upload_text(){
        if(!this.seen && !this.readonly){
          return "Загрузить документы на "+this.component;}
        else if (!this.seen && this.readonly){
          return "Показать документы на "+this.component;}
        else{return "Скрыть";}
      }
  },
	methods: {
    btn_zagruzka(){
      this.seen = !this.seen;
      if(this.component=='sudozahod'){
        let btn =  document.querySelector('.btn-zahod');
        if(btn){btn.click();}
      }
      if(this.component=='sudoothod'){
        let btn = document.querySelector('.btn-othod');
        if(btn){btn.click();}
      }
    },
    listView: function(){
      let that = this;
          axios.get(that.url+'?component='+that.component+'&get_list=1')
          .then(res=>{
            that.files = eval('(' +res.data+ ')');//парсим текст в объект;
            //console.log('that.files===>>',that.files);
          })
          .then(()=>{
            this.uploaded_list();
          })
          .catch(e => {
            console.info('catch->',e);
            that.status = 0;
            that.msg = "Ошибка при проверке уже загруженных документов. Проверьте соединение.";
            that.showAlert(); that.alertColor = "danger";
          })
    },
    uploaded_list(){
      let that = this;
            axios.get(that.url+'?component='+that.component+'&action=get_uploaded_list&EntID='+that.EntID)
              .then( res => {
                //console.log('ОТВЕТ2',res.data);
                if(res.data.msg!=null){
                  let uploadedDocs = res.data.msg.split(',');
                // console.log('otvet->',uploadedDocs, 'that.files=>',that.files);
                  uploadedDocs.forEach((e) => {
                  // console.log('uploadedDOCS=>>>',e,that.files)
                  try{that.files["id"+e].loaded = 1;}
                  catch(e){
                    console.info('file loaded ERRR => ',e, that)
                  }
                    //console.log('that.files["id"+e]=>',that.files["id"+e])
                  })
                }
              })
    },
      uploadedHandler: function (e,ee) {
       console.log(this,e,ee)
       this.listView();
    },
      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
    }
  },
  mounted() {
    var params = window.location.search.replace("?", "").split("&").reduce(function(p, e) {var a = e.split("=");
    p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);return p;}, {});
    this.EntID = params['EntID'];
    this.listView();
    /*
    let head = {headers: {'Content-Type': 'application/json'}}
    axios.get('../src/sudozahod.json',head)
    .then(res => {
      this.files = [];
      this.files = res.data;
      console.log(typeof this.files, this.files.length)
    })
    .catch(e=>{
      this.errors = e;
    })*/
     //this.files = [];
  }
}




</script>


 	<style>
		.check {padding-top:3px;}
		.docBlock {border: black 1px dotted;}
		input.check {vertical-align: text-top;}
    button:disabled { cursor: not-allowed;}
    .pull-center { text-align: center;}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
	</style>

