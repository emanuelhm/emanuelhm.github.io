var quest = {

    tasks: [],

    add: function (task) {
        this.tasks.push(task);
    },

    remove: function (index) {
        this.tasks.splice(index, 1);
    },

    get: function (index) {
        return this.tasks[index];
    },

    set: function (index, doc) {
        this.tasks[index] = doc;
    },

    setProp: function (index, prop, doc) {
        this.tasks[index][prop] = doc;
    },

    render: function () {
        $('#task-container div').remove();
        var len = this.tasks.length - 1;
        var cor = $("#Cor").val();
        for (var x = 0; x < this.tasks.length; x++) {
            var content = "<div class='margin-bottom item' id=" + x + ">" +
                                "<a onclick='showAtualizarTaskModal(" + x + ")'><div class='filete' style='background-color: " + cor + "'></div></a>" +
                                "<div class='quest-body flex-properties-c'>" +
                                    "<div class='icon-black limit-lines'>" +
                                        "<a onclick='showAtualizarTaskModal(" + x + ")'>" +
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
                                        "<select class='form-control Status' onchange='mudarStatus(" + x + ")'>" +
                                            "<option value='0'>A Fazer</option>" +
                                            "<option value='1'>Fazendo</option>" +
                                            "<option value='2'>Feito</option>" +
                                        "</select>" +
                                    "</div>" +
                                "</div>" +
                            "</div>";
            $("#task-container").append(content);
            $('#Status').val(this.get(len)["Status"]);
        }
    }
}

function renderFiles(reference) {
    $("#data div").remove();
    var list = (typeof (reference) === "number") ? quest.tasks[reference].Files : reference;
    $.each(list, function (index, file) {
        var data = `
                    <div id="${index}-div" class="download-item flex-properties-r">
                        <form method="post" action="/File/Download" id="fileForm${index}" style="display: none;">
                            <input type="hidden" value="${file.Id}" name="Id" />
                        </form>
                        <div class="download-info">
                            ${ file.Response === "Image" ? `<img src="../Images/${file.Url.split('.')[0]+'-min.jpg'}">` : `<i class="fa fa-file" aria-hidden="true"></i>` }
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

function submit(id, action) {
    $('#' + id).attr('action', action).submit();
}

function showAtualizarTaskModal(index) {
    $("#NomeTaskAtualizar").val(quest.get(index)["Nome"]);
    $("#DescricaoTaskAtualizar").text(quest.get(index)["Descricao"]);
    $("#DataConclusaoAtualizar").val(quest.get(index)["DataConclusao"].split('/').reverse().join('-'));
    $("#DificuldadeAtualizar").val(quest.get(index)["Dificuldade"])
    $("#AtualizarTask").data('index', index);
    $("#ExcluirTask").data('index', index);
    $("#modalAtualizarTask").modal('show');
    renderFiles(index);
}

var previousModal;
var hide;
function change(modal) {
    previousModal = modal;

    if (Files.length != 0)
        renderFiles(Files);

    $("#" + modal).modal('hide');

    hide = true;
    $("#" + modal).on('hidden.bs.modal', function () {
        if (hide) {
            $("#modalDownload").modal('show');
            hide = false;
        }
    })
};

$("#Concluir").click(function () {
    $("#modalDownload").modal('hide');

    hide = true;
    $("#modalDownload").on('hidden.bs.modal', function () {
        if (hide) {
            $("#" + previousModal).modal('show');
            hide = false;
        }
    });
});

function deletar(Id, div) {
    $.post("/File/Delete", { Id: Id })
    .done(function (data) {
        if (data === "Ok") {
            showBalloon("Deletado com sucesso", "green-alert");
            $("#" + div).remove();

            var found = false;
            for (var x = 0; x < quest.TasksViewModel && !found; x++) {
                for (var y = 0; y < quest.TasksViewModel[x].Files.length && !found; y++) {
                    if (quest.TasksViewModel[x].Files[y].Id === Id) {
                        quest.TasksViewModel[x].Files.splice(y, 1);
                        found = true;
                    }
                }
            }
        }
        else if (data === "Error")
            showBalloon("Algo deu errado", "yellow-alert");
    })
    .fail(function () {
        showBalloon("Algo deu errado", "yellow-alert");
    });
}

var Files = [];
document.getElementById('formFiles').onsubmit = function () {
    $("#textFiles").val("");
    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('Files');
    var validTypes = ["rar", "zip", "doc", "docx", "pdf", "xlsx", "xls", "ppt", "pptx", "jpg", "jpeg", "png", "gif"];
    //Iterating through each files selected in fileInput
    var errors = { number: 0, values: [] };
    for (i = 0; i < fileInput.files.length; i++) {
        if (validTypes.indexOf(fileInput.files[i].name.split('.').pop()) == -1) {
            errors.values.push(fileInput.files[i].name);
            errors.number += 1;
        }
        else if (fileInput.files[i].size <= 10000000)
            formdata.append(fileInput.files[i].name, fileInput.files[i]);
        else {
            errors.values.push(fileInput.files[i].name);
            errors.number += 1;
        }
    }
    if (errors.number > 0) {
        var alert = "";
        $.each(errors.values, function (index, value) {
            alert += value;
            if (index === errors.number - 2)
                alert += " e ";
            else if (index != errors.number - 1)
                alert += ", ";
        });
        if (errors.number > 1)
            showBalloon("Os arquivos " + alert + " são inválidos", "yellow-alert");
        else
            showBalloon("O arquivo " + alert + " é inválido", "yellow-alert");
    }

    if (fileInput.files.length > errors.number) {
        //Creating an XMLHttpRequest and sending
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/File/Upload');
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
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.response === "")
                        showBalloon("Algo deu errado", "yellow-alert");
                    else {
                        var aux = JSON.parse(xhr.response);
                        Files = Files.concat(aux);
                        var errors = { number: 0, values: [] };
                        var validFiles = [];
                        $.each(Files, function (index, file) {
                            if (file.Response === "Error") {
                                errors.values.push(value.Nome);
                                errors.number += 1;
                            }
                            else
                                validFiles.push(file);
                        });
                        if (previousModal === "modalAtualizarTask"){
                            var index = $("#AtualizarTask").data('index');
                            quest.tasks[index].Files = quest.get(index).Files.concat(validFiles);
                            renderFiles(quest.get(index).Files);
                            Files = [];
                        }
                        else
                            renderFiles(validFiles);
                        if (errors.number > 0) {
                            var alert = "";
                            $.each(errors.values, function (index, value) {
                                alert += value;
                                if (index === errors.number - 2)
                                    alert += " e ";
                                else if (index != errors.number - 1)
                                    alert += ", ";
                            });
                            if (errors.number > 1)
                                showBalloon("Os arquivos " + alert + " têm formato incompatível", "yellow-alert");
                            else
                                showBalloon("O arquivo " + alert + " tem formato incompatível", "yellow-alert");
                        }
                    }
                    $("#load div").remove();
                }
                else {
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

    quest.render();

    $("form").on('keyup keydown submit click focusout onfocus', function () {
        var errors = $('[aria-invalid=true]');
        if (errors[0] != undefined)
            $('label[for=' + $('[aria-invalid=true]')[0]['id'] + "] span").css('display', 'inline');
        for (x = 1; x < errors.length; x++) {
            $('label[for=' + $('[aria-invalid=true]')[x]['id'] + "] span").css('display', 'none');
        }
    });

    $('#formQuest').on("submit", function (e) {
        e.preventDefault();
        $.each(quest.tasks, function (index, value) {
            quest.setProp(index, "DataConclusao", new Date(value.DataConclusao));
        });
        $.ajax({
            contentType: 'application/json;',
            type: "POST",
            url: "/Quest/CriarQuestPost",
            data: JSON.stringify({
                "Nome": $("#Nome").val(),
                "Descricao": $("#Descricao").val(),
                "Cor": $("#Cor").val(),
                "GrupoCriadorId": $("#GrupoCriadorId").val(),
                "TasksViewModel": quest.tasks
            }),
            success: function (response) {
                if (response == "true")
                    window.location.href = "/Home/Inicio";
                else
                    showBalloon("Algo deu errado", "yellow-alert");
            },
            error: function () {
                showBalloon("Algo deu errado", "yellow-alert");
            }
        });
    });

    $('#AdicionarTask').click(function (event) {
        event.preventDefault();
        if ($("#formAdicionarTaskModal").valid()) {
            quest.add({
                'Nome': $('#NomeTask').val(),
                'Descricao': $('#DescricaoTask').val(),
                'DataConclusao': $('#DataConclusao').val(),
                'Dificuldade': $('#Dificuldade').val(),
                'Status': 0,
                'UsuarioResponsavelId': $('#Responsavel').val(),
                'Files': Files,
            });

            document.getElementById("formAdicionarTaskModal").reset();
            $("#NomeTask").val('');
            $("#DescricaoTask").text('');
            $("#DataConclusao").val('');
            $("#Dificuldade").val(0);
            $("#Responsavel").val("");
            $("#data div").remove();
            Files = [];

            quest.render()
            $('#modalAdicionarTask').modal('hide');
        }
    });

    $("#modalAdicionarTask").on('shown.bs.modal', function () {
        renderFiles(Files);
    });

    $("#modalAtualizarTask").on('show.bs.modal', function () {
        $("#ResponsavelAtualizar").val(quest.get($("#AtualizarTask").data('index')).UsuarioResponsavelId);
    });

    $('#AtualizarTask').click(function (event) {
        event.preventDefault();
        if ($("#formAtualizarTaskModal").valid()) {
            quest.set($("#AtualizarTask").data('index'), {
                'Nome': $('#NomeTaskAtualizar').val(),
                'Descricao': $('#DescricaoTaskAtualizar').val(),
                'DataConclusao': $('#DataConclusaoAtualizar').val(),
                'Dificuldade': $('#DificuldadeAtualizar').val(),
                'UsuarioResponsavelId': $('#ResponsavelAtualizar').val(),
                'Files': quest.tasks[$("#AtualizarTask").data('index')].Files.concat(Files),
            })
            Files = [];
            quest.render();
            $('#modalAtualizarTask').modal('hide');
        }
    });

    $('#ExcluirTask').click(function () {
        event.preventDefault();
        quest.remove($('#ExcluirTask').data('index'));
        quest.render();
        $('#modalAtualizarTask').modal('hide');
    });

    $("#formQuest").validate({
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            Nome: {
                required: true,
                minlength: 2,
                maxlength: 20
            },
            Descricao: {
                required: true,
                maxlength: 300
            }
        }
    });

    $('#formAdicionarTaskModal').validate({
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            NomeTask: {
                required: true,
                minlength: 1,
                maxlength: 40
            },
            DescricaoTask: {
                required: true,
                maxlength: 300
            },
            DataConclusao: {
                required: true,
                date: true,
                futureDate: true
            }
        },
    });

    $('#formAtualizarTaskModal').validate({
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            NomeTaskAtualizar: {
                required: true,
                minlength: 2,
                maxlength: 40
            },
            DescricaoTaskAtualizar: {
                required: true,
                maxlength: 300
            },
            DataConclusaoAtualizar: {
                required: true,
                futureDate: true
            }
        },
    });

});