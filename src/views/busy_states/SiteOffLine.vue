<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-sm-6">
                <div class="text-center pt-2">
                    <h1 class="text-error mt-4">{{$system_variables.get_label('msg_site_off_line_title')}}</h1>
                    <h3 class="text-uppercase text-danger mt-3">{{$system_variables.get_label('msg_site_off_line_sub_title')}}</h3>
                    <p class="text-muted mt-3">{{$system_variables.get_label('msg_site_off_line_body')}}</p>            
                    <b-button onclick="window.location.reload();" class="mr-2 mb-2" variant="success">{{$system_variables.get_label('button_refresh_page')}}</b-button>        
                </div>

            </div><!-- end col -->
        </div>
            <!-- end row -->                        
    </div>
</template>