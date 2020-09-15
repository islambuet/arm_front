<template>
    <div>
        <div>
            <ul class="pagination mb-0">
                <li class="float-left mr-2"><p class=" p-2">{{$systemVariables.getLabel('LabelitemsPerPage')}} </p></li >            
                <li class="float-left page-item  mr-2">
                    <select class="form-control" v-model="pagination.itemsPerPage" @change="pagination.currentPage=1;onChangePage()" >
                        <option v-for="(option, index) in pagination.pageOptions" :key="index" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </li>   
                <li class="float-left mr-2"><p class=" p-2">{{$systemVariables.getLabel('LabelGoToPage')}}</p></li >            
                <li class="float-left page-item  mr-2">
                    <select class="form-control" v-model="pagination.currentPage" @change="onChangePage()" >
                        <option v-for="(option, index) in Math.ceil(pagination.numItems/pagination.itemsPerPage)" :key="index" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </li>  
                <li class="float-left page-item" :class="{ 'disabled': pagination.currentPage<2 }">
                    <a class="page-link" @click.prevent="--pagination.currentPage;onChangePage()">&laquo; {{$systemVariables.getLabel('LabelPreviousPage')}}</a>
                </li>
                <li class="float-left page-item" :class="{ 'disabled': pagination.currentPage>=Math.ceil(pagination.totalItems/pagination.itemsPerPage)}">
                    <a class="page-link" @click.prevent="++pagination.currentPage;onChangePage()">{{$systemVariables.getLabel('LabelNextPage')}} &raquo;</a>
                </li>                            
            </ul>
        </div>
        <div class="text-center">
                <ul class="pagination">
                    <li class="float-left mr-2"><p class=" p-2">{{$systemVariables.getLabel('LableDisplayingItem1')}}:</p></li >            
                    <li class="float-left page-item  mr-2">
                        <p class=" p-2">{{(pagination.currentPage-1)*pagination.itemsPerPage}}-{{(pagination.currentPage)*pagination.itemsPerPage}}</p>
                    </li>  
                    <li class="float-left mr-2"><p class=" p-2">{{$systemVariables.getLabel('LableDisplayingItem2')}}:</p></li >            
                    <li class="float-left page-item  mr-2">
                        <p class=" p-2">{{pagination.numItemshowing}}</p>
                    </li> 
                    <li class="float-left mr-2"><p class=" p-2">{{$systemVariables.getLabel('LabelTotalItem')}}:</p></li >            
                    <li class="float-left page-item  mr-2">
                        <p class=" p-2">{{pagination.numItems}}</p>
                    </li> 
                                     
                </ul>                
        </div>

            
        </b-row>
    </div>
</template>

<script>
export default { 
  name: "Pagination",   
  props: {
        onChangePage: Function,        
        pagination:{
            type: Object,
            default: () => ({currentPage:1,itemsPerPage:50,numItemshowing:0,numItems:10,pageOptions: [10,20, 30, 50, 500,100]}
                )            
        },
    },    
};
</script>

<style scoped>
    .pagination a:hover{ cursor: pointer }
</style>
