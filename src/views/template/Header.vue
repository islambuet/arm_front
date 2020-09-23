<template>
  <header id="system_top_bar" class="d-print-none">
    <!-- LOGO -->
    <div id="logo_container" class="d-none d-lg-block d-xl-block float-left">
        <img style="height: 25px;" v-bind:src="'/images/logo-lg.png'" alt="">
    </div>
    <!-- Left Sidebar handler -->
    <button id="handler_left_sidebar" class="handler-sidebar float-left" v-on:click="$system_htm_elements_action.click_handler_left_sidebar($event)">
        <b-icon icon="border-width" variant="danger"></b-icon>
        
    </button>
    <!-- Right Sidebar handler -->
    <button id="handler_right_sidebar" class="handler-sidebar float-right" v-on:click="$system_htm_elements_action.click_handler_right_sidebar($event)">
        <b-icon icon="border-width" variant="danger"></b-icon>
    </button>    
    <ul class="list-unstyled float-right mb-0">
        
        <!-- Language options -->
        <li>
           
            <a class="nav-link dropdown-toggle mr-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">

                                <span class="ml-1">
                                    {{$system_variables.get_label('label_change_language')}} <i class="mdi mdi-chevron-down"></i>
                                </span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <!-- item-->
                <a href="#" class="dropdown-item" id="system_language_english" v-on:click="$system_htm_elements_action.click_change_language($event,'en')">
                    <span>English</span>
                </a>
                <!-- item-->
                <a href="" class="dropdown-item" id="system_language_bangla" v-on:click="$system_htm_elements_action.click_change_language($event,'bn')">
                    <span>বাংলা</span>
                </a>
            </div>
        </li>
        <!-- Users options -->
        <li>
            <a class="nav-link dropdown-toggle mr-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                <img v-bind:src="$system_variables.user.info.profile_picture" v-if="$system_variables.user.info.profile_picture" alt="profileImage" class="rounded-circle" style="height: 32px;width: 32px;">
                <img v-bind:src="'/images/guest.png'" v-else alt="Image" class="rounded-circle" style="height: 32px;width: 32px;">
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <div class="dropdown-item">
                    <h6 class="text-overflow m-0">{{$system_variables.get_label('label_welcome')}} {{$system_variables.user.name}}</h6>
                </div>
                <!-- item-->
                
                <a href="<?php echo site_url('user/profile_picture');?>" class="system_ajax dropdown-item" v-if="$system_variables.user.id > 0">
                    <i class="fe-user"></i>
                    <span>Profile Picture</span>
                </a>

                <!-- item-->
                <a href="<?php echo site_url('user/edit_password');?>" class="system_ajax dropdown-item" v-if="$system_variables.user.id > 0">
                    <i class="fe-lock"></i>
                    <span>Change Password</span>

                </a>

                <div class="dropdown-divider" v-if="$system_variables.user.id > 0"></div>
                <a href="#" class="system_ajax dropdown-item" v-on:click.prevent="logout" v-if="$system_variables.user.id > 0">
                    <i class="fe-log-out"></i>
                    <span>Logout</span>
                </a>
            </div>
        </li>
    </ul>
</header>
</template>
