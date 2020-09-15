<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-sm-6">
                <div class="text-center pt-2">
                    <h1 class="text-error mt-4">{{$systemVariables.labels.msgLoadingAccessDenyHeader}}</h1>
                    <h3 class="text-uppercase text-danger mt-3">{{$systemVariables.labels.msgLoadingAccessDenySubHeader}}</h3>
                    <p class="text-muted mt-3">{{$systemVariables.labels.msgLoadingAccessDenyInfo}}</p>                    
                </div>

            </div><!-- end col -->
        </div>
            <!-- end row -->                        
    </div>
</template>