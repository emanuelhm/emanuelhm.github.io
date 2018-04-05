$(".integrante").on("click", function () {
    $.post("/Grupo/GetInfoIntegrante", { Email: $(this).data("email"), GrupoId: $("#integrantes").data("rel") }, function (data) {
        if (data.Success === "true") {
            $("#IntegranteNome").text(data.Nome);
            $("#IntegranteEmail").text(data.Email);
            $("#telefones-container *").remove();
            oi = data;
            if (data.Telefones.length > 0) {
                $("#telefones-container").append("<h3>Telefones</h3>");
                $.each(data.Telefones, function (index, value) {
                    $("#telefones-container").append("<p>" + value.Tipo + ": " + value.Numero + "</p>");
                });
            }
            $("#modalIntegrante").modal('show');
        }
        else {
            showBalloon(data.Alert, "yellow-alert");
        }
    }).fail(function () {
        showBalloon("Algo deu errado", "yellow-alert");
    })
});


