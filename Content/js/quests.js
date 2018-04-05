
function filter(questIndex) {
    if (questIndex === -1)
        $(".task-item").show();
    else {
        $(".task-item").hide();
        $("[data-quest='" + questIndex + "']").show();
    }
};
