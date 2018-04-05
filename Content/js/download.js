$("#download").click(function () {
    $("#modalAtualizarTask").modal('hide');
    $("#modalDownload").modal('show');
});

$("#Concluir").click(function () {
    $("#modalDownload").modal('hide');
    $("#modalAtualizarTask").modal('show');
});