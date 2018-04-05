$("#notificacao").click(function () {
    $("#badge").hide();
    var notificacoes = [];
    $(".notificacao").each(function (index, value) {
        notificacoes.push(value.dataset.id)
    });
    $.post("/Home/NotificationVisualizada", { Notificacoes: notificacoes });
});