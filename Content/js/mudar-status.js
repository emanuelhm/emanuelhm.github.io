function mudarStatus(status) {
    $.ajax({
        /ContentType: 'application/json;',
        type: "POST",
        url: "/Quest/MudarStatus",
        data: JSON.stringify({
            "Id": status.id,
            "Status": status.value
        }),
        success: function (response) {
            if (response == "true")
                showBalloon("Atualizado com sucesso", "green-alert")
            else
                showBalloon("Algo deu errado", "yellow-alert");
        },
        error: function () {
            showBalloon("Algo deu errado", "yellow-alert");
        }
    });
}