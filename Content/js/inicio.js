$(function () {

    $("form").on('keyup keydown submit click focusout onfocus', function(){
        var errors = $('[aria-invalid=true]');
        if(errors[0]!=undefined)
            $('label[for='+$('[aria-invalid=true]')[0]['id']+"] span").css('display', 'inline');
        for(x = 1; x < errors.length; x++){
            $('label[for='+$('[aria-invalid=true]')[x]['id']+"] span").css('display', 'none');
        }
    });

    $("#formCriarGrupo").validate({
        errorPlacement: function(error, element) {
            $( element )
            .closest( "form" )
            .find( "label[for='" + element.attr( "id" ) + "']" )
            .append( error );
        },
        errorElement: "span",
        rules: {
            Nome: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            Descricao: {
                required: true,
                minlength: 3,
                maxlength: 120
            }
        }
    });
});