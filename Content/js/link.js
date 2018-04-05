function link(id) {
    if(id.id === undefined)
        $("#" + id[0].id).submit();
    else 
        $("#" + id.id).submit();
}