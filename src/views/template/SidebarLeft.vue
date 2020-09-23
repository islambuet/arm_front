<template>
    
<nav id="system_left_sidebar" class="sidebar d-print-none">
    <ul class="list-unstyled">
        <li @click="$system_htm_elements_action.click_task_links($event)"><router-link to="/"><img src="http://45.251.59.5/arm/images/menu_icons/1/dashboard.png">{{$system_variables.get_label('menu_dashboard')}}</router-link></li>
        <menu-tree v-for="(item, index) in $system_variables.users.tasks" :key="index" :menu="$system_variables.users.tasks[index]" :itemIdPrefix="'left_side_menu_'"></menu-tree>        
        <li><router-link to="/transfer"><i class="fas fa-user"></i> Product Transfer </router-link></li>
    </ul>
</nav>
</template>
<script>
import MenuTree from "./MenuTree.vue";
export default {
  name: 'SidebarLeft',  
  components:{MenuTree}
}
</script>

