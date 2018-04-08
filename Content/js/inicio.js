$(function () {

    $(".mudarCor").each(function (index, value) {
        $(value).css("background-color", sessionStorage.getItem("cor"));
    });
    $(".mudarCorFonte").each(function (index, value) {
        $(value).css("color", sessionStorage.getItem("cor"));
    });

    if (sessionStorage.getItem("corGrupo") != null && sessionStorage.getItem("nomeGrupo") != null && sessionStorage.getItem("descricaoGrupo") != null) {
        $("#grupo-container").append(`
            <div class="flex-properties-c margin-bottom item">
                <a href="/grupo.html">
                    <div class="grupo-elipse" style="background-color: ${sessionStorage.getItem("corGrupo")}">
                        <img src="/Content/img/groupicon.png">
                    </div>
                </a>
                <div class="limit-lines limit-lines_grupo_icon icon-black"><a href="/grupo.html" class="grupo-nome">${sessionStorage.getItem("nomeGrupo")}</a></div>
            </div>
        `);
    }

    if (sessionStorage.getItem("quest") != null) {
        var quest = JSON.parse(sessionStorage.getItem("quest"));
        quest.TasksViewModel.forEach(function (task, index, array) {
            $("#task-container").append(`
                <div class="margin-bottom item">
                    <a> <div class="filete" style="background-color: ${quest.Cor}"></div></a>
                    <div class="quest-body flex-properties-c icon-black">
                        <a>
                            <div class="limit-lines task-namegroup">
                                <h4>${task.Nome}</h4>
                            </div>
                        </a>
                        <div class="limit-lines"><h4>${task.Descricao}</h4></div>
                        <div><h4>${new Date(task.DataConclusao).toISOString().slice(0, 10).split("-").reverse().join("/")}</h4></div>
                        <div class="select-container">
                            <select class="form-control">
                                ${ (task.Status == 0) ? '<option selected value="0">A Fazer</option><option value="1">Fazendo</option><option value="2">Feito</option>' : task.Status == 1 ? '<option value="0">A Fazer</option><option selected value="1">Fazendo</option><option value="2">Feito</option>' : task.Status == 2? '<option value="0">A Fazer</option><option value="1">Fazendo</option><option selected value="2">Feito</option>' : '' }
                            </select>
                        </div>
                    </div>
                </div>
            `);
        });
    }

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
        },
        submitHandler: function (form) {
            sessionStorage.setItem("nomeGrupo", $("#Nome").val());
            sessionStorage.setItem("descricaoGrupo", $("#Descricao").val());
            sessionStorage.setItem("corGrupo", $("#Cor").val());
            window.location.href = "/grupo.html";
        }
    });
});