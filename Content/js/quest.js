function showBalloon(alert, classe) {
    $(".balloon").addClass(classe);
    $(".balloon").text(alert);
    $(".balloon").css("display", "block");
    $(".balloon").delay(4000).fadeOut(2000);
}

var quest = {

    TasksViewModel: [],

    add: function (task) {
        this.TasksViewModel.push(task);
    },

    remove: function (index) {
        this.TasksViewModel.splice(index, 1);
    },

    get: function (index) {
        return this.TasksViewModel[index];
    },

    set: function (index, doc) {
        this.TasksViewModel[index] = doc;
    },

    setProp: function (index, prop, doc) {
        this.TasksViewModel[index][prop] = doc;
    },

    getAll: function () {
        return this.TasksViewModel;
    },


    render: function () {
        $('#task-container div').remove();
        for (var x = 0; x < this.TasksViewModel.length; x++) {
            var content =   "<div class='margin-bottom item' id=" + x + ">" +
                                "<a onclick='showAtualizarTaskModal(" + x + ")'><div class='filete' style='background-color: " + quest.Cor + "'></div></a>" +
                                "<div class='quest-body flex-properties-c'>" +
                                    "<div class='icon-black limit-lines'>" +
                                        "<a onclick='showTaskModal(" + x + ")'>" +
                                            "<h4 class='Nome'>" + this.get(x)['Nome'] + "</h4>" +
                                        "</a>" +
                                    "</div>" +
                                    "<div class='limit-lines'>" +
                                        "<h4 class='Descricao'>" + this.get(x)["Descricao"] + "</h4>" +
                                    "</div>" +
                                    "<div>" +
                                        "<h4 class='DataConclusao'>" + this.get(x)["DataConclusao"].split('-').reverse().join('/') + "</h4>" +
                                    "</div>" +
                                    "<div class='select-container'>" +
                                        "<select id='" + this.get(x)["Id"] + "' class='form-control Status' onchange='mudarStatus(this)'>" +
                                        "<option value='0'>A Fazer</option>" +
                                        "<option value='1'>Fazendo</option>" +
                                        "<option value='2'>Feito</option>" +
                                        "</select>" +
                                    "</div>" +
                                "</div>" +
                            "</div>";
            $("#task-container").append(content);
            $('#' + x + ' .Status').val(this.get(x)["Status"]);
            $('#Nome').text(quest.Nome);
            $("#Descricao").text(quest.Descricao);
        }
    }
}

function mudarStatus(index) {
    var status = $("#" + index + " .Status").val();
    quest.setProp(index, "Status", parseInt(status));
    if (quest.get(index)['Feedback'] != undefined)
        if (status == 0 || status == 1)
            quest.setProp(index, 'Feedback', undefined);
}

function submit(id, action) {
    $('#' + id).attr('action', action).submit();
}

function renderFiles(reference) {
    $("#data div").remove();
    var list = (typeof (reference) === "number") ? quest.get(reference).Files : reference;
    $.each(list, function (index, file) {
        var data = `
                    <div id="${index}-div" class="download-item flex-properties-r">
                        <form method="post" action="/File/Download" id="fileForm${index}" style="display: none;">
                            <input type="hidden" value="${file.Id}" name="Id" />
                        </form>
                        <div class="download-info">
                            ${ file.Response === "Image" ? `<img src="Images/${file.Url.split('.')[0]+'-min.jpg'}">` : `<i class="fa fa-file" aria-hidden="true"></i>` }
                        </div>
                        <div class="download-info icon-black">
                            <a class="limit-lines" title="${file.Nome}" onclick="$('#fileForm${index}').submit()"><p>${file.Nome}</p></a>
                        </div>
                        <div class="download-info">
                            <span>${Math.ceil(file.Size * 10) / 10} MB</span>
                        </div>
                        <div class="download-info">
                            <button onclick="deletar('${file.Id}', '${index}-div')" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
        `;
        $("#data").append(data);
    });
}

var taskIndex;
function showTaskModal(index) {
    taskIndex = index;
    $("#NomeTask").text(quest.get(index)["Nome"]);
    $("#DescricaoTask").text(quest.get(index)["Descricao"]);
    $("#DataConclusao").text(quest.get(index)["DataConclusao"].split('-').reverse().join('/'));

    var dificuldade = "";
    switch (quest.get(index)["Dificuldade"]) {
        case 0:
            dificuldade = 'Fácil';
            break;
        case 1:
            dificuldade = 'Médio';
            break;
        case 2:
            dificuldade = 'Difícil';
            break;
    }
    $("#Dificuldade").text(dificuldade);

    if (quest.get(index).ResponsavelNome === ""){
        var data = `
            <div><p>Todos os colaboradores são responsáveis</p></div>
        `;
        $("#Responsavel div").remove();
        $("#Responsavel").append(data);
    }
    else{
        var data = `
                        <div>
                            <p>Colaborador responsável</p>
                            <h3 id="Responsavel">${quest.get(index).ResponsavelNome}</h3>
                        </div>
        `;
        $("#Responsavel div").remove();
        $("#Responsavel").append(data);
    }
    renderFiles(taskIndex);
    $("#modalTask").modal('show');
}

var hide;
$("#Download").click(function (){

    $("#modalTask").modal('hide');
    
    hide = true;
    $("#modalTask").on('hidden.bs.modal', function(){
        if (hide){
            $("#modalDownload").modal('show');
            hide = false;
        }
    });
});

$("#Concluir").click(function () {

    $("#modalDownload").modal('hide');
    
    hide = true;
    $("#modalDownload").on('hidden.bs.modal', function(){
        if (hide){
            $("#modalTask").modal('show');
            hide = false;
        }
    });
});

function deletar(Id, div){
    $.post("/File/Delete", { Id: Id })
    .done(function(data){
        if(data === "Ok"){
            showBalloon("Deletado com sucesso", "green-alert");
            $("#"+div).remove();
        }
        else if(data === "Error")
            showBalloon("Algo deu errado", "yellow-alert");
    })
    .fail(function(){
        showBalloon("Algo deu errado", "yellow-alert");  
    });
}

document.getElementById('formFiles').onsubmit = function () {
    $("#textFiles").val("");
    var formdata = new FormData(); //FormData object
    formdata.append("Id", quest.get(taskIndex).Id);
    var fileInput = document.getElementById('Files');
    var validTypes = ["rar", "zip", "doc", "docx", "pdf", "xlsx", "xls", "ppt", "pptx", "jpg", "jpeg", "png", "gif"];
    //Iterating through each files selected in fileInput
    var errors = { number: 0, values: [] };
    for (i = 0; i < fileInput.files.length; i++) {
        if(validTypes.indexOf(fileInput.files[i].name.split('.').pop()) == -1){
            errors.values.push(fileInput.files[i].name);
            errors.number += 1;
        }
        else if(fileInput.files[i].size <= 10000000)
            formdata.append(fileInput.files[i].name, fileInput.files[i]);
        else{
            errors.values.push(fileInput.files[i].name);
            errors.number += 1;
        }
    }
    if(errors.number > 0){
        var alert = "";
        $.each(errors.values, function(index, value){
            alert += value;
            if(index === errors.number - 2)
                alert += " e ";
            else if(index != errors.number - 1)
                alert += ", ";
        });
        if(errors.number > 1)
            showBalloon("Os arquivos " + alert + " são inválidos", "yellow-alert");
        else
            showBalloon("O arquivo " + alert + " é inválido", "yellow-alert");
    }
            
    if (fileInput.files.length > errors.number) {
        //Creating an XMLHttpRequest and sending
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/File/UploadIntegrante');
        xhr.send(formdata);
        $("#load").append(` <div id="floatingCirclesG">
                                <div class="f_circleG" id="frotateG_01"></div>
                                <div class="f_circleG" id="frotateG_02"></div>
                                <div class="f_circleG" id="frotateG_03"></div>
                                <div class="f_circleG" id="frotateG_04"></div>
                                <div class="f_circleG" id="frotateG_05"></div>
                                <div class="f_circleG" id="frotateG_06"></div>
                                <div class="f_circleG" id="frotateG_07"></div>
                                <div class="f_circleG" id="frotateG_08"></div>
                            </div>`);
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                if (xhr.status == 200) {
                    if(xhr.response === "")
                        showBalloon("Algo deu errado", "yellow-alert");
                    else{
                        files = JSON.parse(xhr.response);
                        var Files = [];
                        var errors = { number: 0, values: []};
                        $.each(files, function(index, file){
                            if(file.Response === "Error"){
                                errors.values.push(value.Nome);
                                errors.number += 1;
                            }
                            else{
                                Files.push(file);
                            }
                        });
                        quest.TasksViewModel[taskIndex].Files = quest.TasksViewModel[taskIndex].Files.concat(Files);
                        renderFiles(taskIndex);
                            if(errors.number > 0){
                                var alert = "";
                                $.each(errors.values, function(index, value){
                                    alert += value;
                                    if(index === errors.number - 2)
                                        alert += " e ";
                                    else if(index != errors.number - 1)
                                        alert += ", ";
                                });
                                if(errors.number > 1)
                                    showBalloon("Os arquivos " + alert + " têm formato incompatível", "yellow-alert");
                                else
                                    showBalloon("O arquivo " + alert + " tem formato incompatível", "yellow-alert");
                            }
                        }
                    $("#load div").remove();
                    }
                else{
                    showBalloon("Algo deu errado", "yellow-alert");
                    $("#load div").remove();
                }
            }
        }
    }

    return false;
}

// We can attach the `fileselect` event to all file inputs on the page
$(document).on('change', ':file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    oi = input;
    input.trigger('fileselect', [numFiles, label]);
});

// We can watch for our custom `fileselect` event like this
$(document).ready(function () {
    $(':file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });
});


$(document).ready(function () {

    $.ajax({
        contentType: 'application/json;',
        type: "POST",
        url: "/Quest/GetQuests",
        data: JSON.stringify({
            "Hash": $("#GrupoId").val()
        }),
        success: function (result) {
            oi = result;
            quest.Id = result.data.Id
            quest.Nome = result.data.Nome;
            quest.Descricao = result.data.Descricao;
            quest.Cor = result.data.Cor;
            quest.TasksViewModel = result.data.TasksViewModel;

            $.each(quest.TasksViewModel, function (index, value) {
                quest.TasksViewModel[index].DataConclusao = new Date(parseInt(/^(\/)(Date\()(.+)(\))(\/)$/g.exec(value.DataConclusao)[3])).toLocaleDateString()
            });

            quest.render();
        },
        error: function () {
            showBalloon("Algo deu errado", "yellow-alert");
        }
    });

});