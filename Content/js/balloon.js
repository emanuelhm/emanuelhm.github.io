function simularCriacaoUsuario() {
    sessionStorage.setItem("cor", $("#Cor").val());
    window.location.href = "/inicio.html";
}

function simularCriacaoGrupo() {
    sessionStorage.setItem("nomeGrupo", $("#Nome").val());
    sessionStorage.setItem("descricaoGrupo", $("#Descricao").val());
    sessionStorage.setItem("corGrupo", $("#Cor").val());
    window.location.href = "/grupo.html";
}