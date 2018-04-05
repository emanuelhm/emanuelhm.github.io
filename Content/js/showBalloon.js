function showBalloon(alert, classe) {
    if ($(".balloon").length != 0) 
        $(".balloon").text(alert).css("display", "block").removeClass("*").addClass(classe + " balloon");
    else 
        $("<span class='balloon " + classe + "' display='block'>" + alert + "</span>").appendTo("body");
    $(".balloon").delay(4000).fadeOut(5000);
}