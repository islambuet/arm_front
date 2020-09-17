<template>
  <div>
    <div v-if="$parent.permissions.action1 || $parent.permissions.action2" v-show="$systemVariables.statusSaving==0 && $systemVariables.statusDataLoaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
                <b-button class="mr-2 mb-2" variant="success" @click="back">{{$systemVariables.getLabel('buttonBack')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(false)">{{$systemVariables.getLabel('buttonSave')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(true)">{{$systemVariables.getLabel('buttonSaveNew')}}</b-button>
            </div>
        </div>  
        <div class="card d-print-none mb-2">
          <div class="card-header">
            <div v-if="$parent.item.id>0">Edit variety::{{$parent.item.name}}</div>
            <div v-else>Create New variety</div>
          </div>
          <div class="card-body">
            <form id="form_save_variety">
              <input type="hidden" name="id" :value="$parent.item.id">
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>Crop Name</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.crop_id" @change="onChangecrop()" name="item[crop_id]" >
                        <option value="">{{$systemVariables.getLabel('LabelSelect')}}</option>
                        <option v-for="(option, index) in $parent.crops" :key="index" :value="option.value">
                            {{ option.text}}
                        </option>
                    </select>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>Type Name</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.type_id" name="item[crop_type_id]">
                        <option value="">{{$systemVariables.getLabel('LabelSelect')}}</option>
                        <option v-for="(option, index) in $parent.cropTypes[$parent.item.crop_id]" :key="index" :value="option.value">
                            {{ option.text}}
                        </option>
                    </select>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>Name</label></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[name]" v-model="$parent.item.name" class="form-control" />
                </b-col>                
              </b-row>
              </form>
          </div>          
        </div> 
        
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEdit',
  mounted:function()
  {    
  },  
  methods:{
    onChangecrop:function()
    {
      this.$parent.item['type_id']='';     
    },
    back:function()
    {
      this.$router.push("/variety");     
    },
    save:function(save_and_new)
    {
      this.$systemVariables.statusSaving=1;        
      var formData=new FormData(document.getElementById('form_save_variety'));
      formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
          
            
      this.$axios.post('/variety/save_item',formData)
      .then(response=>{          
        this.$systemVariables.statusSaving=0;
        if(response.data.errorString)        
        {            
          if(response.data.errorString==this.$systemResponse.NoAccess)
          { 
            this.$systemVariables.statusTaskLoaded=-2;
          }
          else
          {
              this.$systemVariables.statusDataLoaded=1;
              this.$bvToast.toast(response.data.errorString, {
                title: 'Error',
                autoHideDelay: 5000,
                appendToast: false    
              });
          }          
        }
        else
        {
            this.$parent.reloadItems=true;
            this.$bvToast.toast("variety saved Succesfully", {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false    
              });
              if(save_and_new)
              {
                this.$router.push("/variety/add");
              }
              else
              {
                this.$router.push("/variety");
              }
              
        }        
      })
      .catch(error => {   
        this.$systemVariables.statusSaving=0;
        this.$bvToast.toast('Server Error', {
          title: 'Save Problem',
          autoHideDelay: 5000,
          appendToast: false
        });     
      });
    }
  }  
}
</script>