<template>
  <div>
    <div v-if="$parent.permissions.action1 || $parent.permissions.action2" v-show="$system_variables.status_data_loaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
                <b-button class="mr-2 mb-2" variant="success" @click="back">{{$system_variables.get_label('button_back')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(false)">{{$system_variables.get_label('button_save')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(true)">{{$system_variables.get_label('button_save_new')}}</b-button>
            </div>
        </div>  
        <form id="form_save_transfer">
          <div class="card d-print-none mb-2">
            <div class="card-header">
              <div v-if="$parent.item.id>0">Edit variety::{{$parent.item.name}}</div>
              <div v-else>Create New Product Transfer</div>
            </div>
            <div class="card-body">
                <input type="hidden" name="id" :value="$parent.item.id">
                <b-row class="mb-2">
                  <b-col cols="4" class="text-right"><label>Crop Name</label></b-col>
                  <b-col cols="8" sm="4">
                    <select class="form-control" v-model="$parent.item.crop_id" @change="on_change_crop()" name="item[crop_id]" >
                          <option value="">{{$system_variables.get_label('label_select')}}</option>
                          <option v-for="(option, index) in $parent.crops" :key="index" :value="option.value">
                              {{ option.text}}
                          </option>
                      </select>
                  </b-col>                
                </b-row>
                <!-- <b-row class="mb-2">
                  <b-col cols="4" class="text-right"><label>Type Name</label></b-col>
                  <b-col cols="8" sm="4">
                    <select class="form-control" v-model="$parent.item.type_id" @change="on_change_crop_type()" name="item[crop_type_id]">
                        <option value="">{{$system_variables.get_label('label_select')}}</option>
                        <option v-for="(option, index) in $parent.crop_types[$parent.item.crop_id]" :key="index" :value="option.value">
                            {{ option.text}}
                        </option>
                    </select>
                  </b-col>                
                </b-row> -->
                <b-row class="mb-2">
                  <b-col cols="4" class="text-right"><label>Variety Name</label></b-col>
                  <b-col cols="8" sm="4">
                    <select class="form-control" v-model="$parent.item.variety_id" name="item[variety_id]">
                        <option value="">{{$system_variables.get_label('label_select')}}</option>
                        <option v-for="(option, index) in $parent.type_varieties[$parent.item.crop_id]" :key="index" :value="option.variety_id">
                            {{ option.variety_name }} - ( {{ option.pack_size }} gm )
                        </option>
                    </select>
                  </b-col>                
                </b-row>
                <b-row class="mb-2">
                  <b-col cols="4" class="text-right"><label>&nbsp;</label></b-col>
                  <b-col cols="8" sm="4">
                    <button type="button" class="btn mr-2 mb-2 btn-success" @click="on_click_add_more()"> + button_add_more</button>
                  </b-col>                
                </b-row>
            </div>          
          </div>
          <div class="card ">
            <div class="card-header d-print-none">
                Transfer
            </div>
            <div class="card-body"> 
              <table class="table table-bordered">
                <thead> 
                  <tr>
                    <th rowspan="2">ID</th>
                    <th rowspan="2">Crop</th>
                    <th rowspan="2">Type</th>
                    <th rowspan="2">Variety</th>
                    <th rowspan="2">Pack Size (gm)</th>
                    <th rowspan="2">Min Qty (Kg)</th>
                    <th rowspan="2">Max Qty (Kg)</th>
                    <th colspan="2">Current Stock (Kg)</th>
                    <th colspan="2">Order Quantity</th>
                    <th rowspan="2">Remove</th>
                  </tr>
                  <tr>
                    <th>Pkt</th>
                    <th>Kg</th>
                    <th>Pkt</th>
                    <th>Kg</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item_add, index) in items_add" :key="index" :data-key="index">
                    <td>{{item_add.id}}</td>
                    <td>{{item_add.crop_name}}</td>
                    <td>{{item_add.type_name}}</td>
                    <td>{{item_add.variety_name}}</td>
                    <td>{{item_add.pack_size}}</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>{{item_add.stock_current_pkt}}</td>
                    <td>{{item_add.stock_current_kg}}</td>
                    <td><input type="text" class="form-control" v-model="item_add.quantity_order_pkt" :name="'item_variety['+item_add.id+']'"></td>
                    <td>{{item_add.quantity_order_pkt / 1000}}</td>
                    <td @click="add_more_remove($event, index)"><Button type="button" class="btn btn-danger">X</Button></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="9"> Total: </th>
                    <th>{{computedTotal}}</th>
                    <th colspan="2"> </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div> 
        </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddEdit',
  mounted:function()
  {    

  },  
  data() {
    return {
      items_add:[],
      total_packet:0
    }
  },
  computed:{
    computedTotal:function(){
      var total = 0;
      for(var i=0; i<this.items_add.length; i++){
        total +=parseFloat(this.items_add[i].quantity_order_pkt);
      }
      return total;
    }
  }, 
  methods:{
    on_change_crop:function(){ 
      this.$parent.item['variety_id']='';     
    },
    on_click_add_more:function(){
      if(! this.$parent.item.variety_id){
        return this.$bvToast.toast('You have not selected any variety', {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      }
      var variety_pack_id = this.$parent.item.variety_id;
      var variety_pack_info = this.$parent.variety_pack_info[variety_pack_id];
      if(!variety_pack_info){
        return this.$bvToast.toast('No data found.', {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      }
      var search = this.items_add.filter((e)=>e.id == variety_pack_id )
      if(search.length>0){
        return this.$bvToast.toast(search[0].variety_name + ' already selected.', {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      }
      this.items_add.push(
        { 
          id:variety_pack_info.id, 
          crop_name: variety_pack_info.crop_name, 
          type_name: variety_pack_info.crop_type_name, 
          variety_name: variety_pack_info.variety_name, 
          pack_size: variety_pack_info.pack_size,
          stock_current_pkt: variety_pack_info.current_stock,
          stock_current_kg: (variety_pack_info.current_stock) / 1000,
          quantity_order_pkt: 0,
          quantity_order_kg: 0,
        }
      )
    },
    add_more_remove(events, index){
      console.log(index);
      console.log(this.items_add);
      this.items_add.splice(index,1);
      //this.items_add = this.items_add.filter((e)=>e.id !== rowID )
    },
    back:function()
    {
      this.$router.push("/transfer");     
    },
    save:function(save_and_new)
    {
      this.$system_variables.status_data_loaded=1;        
      var formData=new FormData(document.getElementById('form_save_transfer'));
      formData.append ('token_auth', this.$system_variables.user.tokenAuth);      
      this.$axios.post('/transfer_save_item',formData)
      .then(response=>{          
        this.$system_variables.status_data_loaded=0;
        if(response.data.errorString)        
        {            
          if(response.data.errorString==this.$systemResponse.NoAccess)
          { 
            this.$system_variables.statusTaskLoaded=-2;
          }
          else
          {
              this.$system_variables.statusDataLoaded=1;
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
            this.$bvToast.toast("Saved Succesfully", {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false    
            });
            if(save_and_new)
            {
                this.$router.push("/transfer/add");
            }
            else
            {
                //this.$router.push("/transfer");
            }
        }        
      })
      .catch(error => {   
        this.$system_variables.statusSaving=0;
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