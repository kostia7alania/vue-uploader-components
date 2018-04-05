<template>
    <app-upload
      :readonly="readonly"
      :url="url"
      :formats="formats"
      :component="component"></app-upload>
</template>

<script>
export default {
  data () {
    return {
      component: 'sudoothod',
      readonly: true,
      url: '//192.168.202.103/seaport_new/doc_upload.php',
			formats: '.pdf'
    }
  }
}
</script>

