var change = function(thisId, targetId){
	$("#" + thisId).modal('hide');
	$("#" + thisId).on('hidden.bs.modal', function(){
		$("#" + targetId).modal('show');
	})
}