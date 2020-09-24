<template>
  <div>
    <div v-show="$system_variables.status_data_loaded==1">
      <div class="card d-print-none mb-2">
        <div class="card-body">
            <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=filter,8=column header -->
            <router-link  to="/setup_locations/area/add" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('action_new')}}</router-link>
            <b-button class="mr-2 mb-2" variant="success" @click="$parent.get_items()" >{{$system_variables.get_label('action_refresh')}}</b-button>
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import Pagination from '@/views/template/Pagination.vue'
import ColumnControl from '@/views/template/ColumnControl.vue'


export default {
  name: 'List',
  components: {
    Pagination,ColumnControl   
  },
  data:function(){
    return{
      show_column_controls:true,
      show_fitler_options:false
    }
  },
  computed:{   
    
  },  
  mounted:function()
  {      
  }, 
  methods:{    
       
  } 
}
</script>
