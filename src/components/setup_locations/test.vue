<template>
  <div>
    {{me}}
  </div>
  
  
</template>

<script>
export default {
    name: 'Test',    
    mounted:function()
    {
      //this.init(0);        
    },
    data() {
      return {
          me:-1
      }
    },
    
    methods:{
    init:function(value)
    { 
        //console.log(value);
        console.log('from refer');
        this.me=value; 
        console.log(this.me);       
    }, 
  }
}
</script>
