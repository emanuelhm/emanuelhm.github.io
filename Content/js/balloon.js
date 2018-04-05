$("#RegisterForm").submit(function (e) {
    e.preventDefault();
    sessionStorage.setItem("cor", $("#Cor").val());
    window.location.href = "/inicio.html";
});

$("#modalCriarGrupo").submit(function (e) {
    e.preventDefault();
    sessionStorage.setItem("nomeGrupo", $("#Nome").val());
    sessionStorage.setItem("descricaoGrupo", $("#Descricao").val());
    sessionStorage.setItem("corGrupo", $("#Cor").val());
    window.location.href = "/grupo.html";
});

$(document).ready(function () {
    $(".mudarCor").each(function (index, value) {
        $(value).css("background-color", "#" + sessionStorage.getItem("cor"));
    });
    $(".mudarCorFonte").each(function (index, value) {
        $(value).css("color", "#" + sessionStorage.getItem("cor"));
    });
});