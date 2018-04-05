$("#Cor").spectrum({
    preferredFormat: "hex",
    allowEmpty: false,
    chooseText: "Selecionar",
    cancelText: "",
    move: function (color) {
        $("#Cor").val(color.toHex());
    }
});