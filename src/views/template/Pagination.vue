<template>
    <div>
        <div v-if="pagination.page_options">
            <ul class="pagination mb-0">
                <li class="float-left mr-2"><p class=" p-2">{{$system_variables.get_label('label_items_per_page')}} </p></li >
                <li class="float-left page-item  mr-2">
                    <select class="form-control" v-model="pagination.items_per_page" @change="pagination.current_page=1;on_change_page()" >
                        <option v-for="(option, index) in pagination.page_options" :key="index" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </li>   
                <li class="float-left mr-2"><p class=" p-2">{{$system_variables.get_label('label_go_to_page')}}</p></li > 
                <li class="float-left page-item  mr-2">
                    <select class="form-control" v-model="pagination.current_page" @change="on_change_page()" >
                        <option v-for="(option, index) in Math.ceil(pagination.num_items/pagination.items_per_page)" :key="index" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </li> 
                <li class="float-left page-item" :class="{ 'disabled': pagination.current_page<2 }">
                    <a class="page-link" @click.prevent="--pagination.current_page;on_change_page()">&laquo; {{$system_variables.get_label('label_previous_page')}}</a>
                </li>
                <li class="float-left page-item" :class="{ 'disabled': pagination.current_page>=Math.ceil(pagination.num_items/pagination.items_per_page)}">
                    <a class="page-link" @click.prevent="++pagination.current_page;on_change_page()">{{$system_variables.get_label('label_next_page')}} &raquo;</a>
                </li>           
                                           
            </ul>
        </div>
        <div class="text-center">
            <ul class="pagination mb-0">
                <li class="float-left mr-2" v-if="pagination.page_options"><p class=" p-2">{{$system_variables.get_label('label_displaying_range')}}:</p></li > 
                <li class="float-left page-item  mr-2" v-if="pagination.page_options"><p class=" p-2">{{(pagination.current_page-1)*pagination.items_per_page}}-{{(pagination.current_page)*pagination.items_per_page}}</p></li>
                <li class="float-left mr-2"><p class=" p-2">{{$system_variables.get_label('label_num_item_showing')}}:</p></li >
                <li class="float-left page-item  mr-2"><p class=" p-2">{{pagination.num_item_showing}}</p></li>
                <li class="float-left mr-2"><p class=" p-2">{{$system_variables.get_label('label_num_items')}}:</p></li >
                <li class="float-left page-item  mr-2"><p class=" p-2">{{pagination.num_items}}</p></li>
            </ul>                
        </div>
    </div>
</template>

<script>
export default { 
  name: "Pagination",   
  props: {
        on_change_page: {
            type: Function,
            default: ()=> (console.log('default on page changed called'))            
        },        
        pagination:{
            type: Object,
            default: () => ({current_page:1,items_per_page:50,num_item_showing:0,num_items:10,page_options: [10,20, 30, 50, 100]}
                )            
        },
    },    
};
</script>

<style scoped>
    .pagination a:hover{ cursor: pointer }
</style>
