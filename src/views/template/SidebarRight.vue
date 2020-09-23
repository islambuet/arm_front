<template>
  <nav id="system_right_sidebar" class="sidebar d-print-none">
    <div v-if="$system_variables.user.id >0">
      <ul class="list-unstyled" v-if="this.$system_variables.user.tasks.length >0">
          <menu-tree v-for="(item, index) in $system_variables.user.tasks" :key="index" :menu="$system_variables.user.tasks[index]" :itemIdPrefix="'right_side_menu_'"></menu-tree>
      </ul>
    </div>
    <div class="card mb-0 mt-0" style="background-color: #000000;" v-if="!($system_variables.user.id >0) &&($route.name!='Login')">
        <div class="card-body p-4">
          <p class="mt-2">{{$system_variables.get_label('label_registerd_user')}}</p>
          <p @click="$system_htm_elements_action.click_task_links($event)"><router-link class="btn btn-md btn-block btn-primary" to="/login">{{$system_variables.get_label('label_login')}}</router-link></p>
        </div>
    </div>
  </nav>
</template>
<script>
import MenuTree from "./MenuTree.vue";
export default {
  name: 'SidebarRight', 
  components:{MenuTree}  
}

</script>

