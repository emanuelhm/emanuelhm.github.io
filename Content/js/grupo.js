function popularConfirmacaoModal(email, action) {
    $("[name='Email']").val(email);
    $('#formConfirmacao').attr('action', action);
}

$("#formAdicionarIntegrante").validate({
		errorPlacement: function(error, element) {
			$( element )
			.closest( "form" )
			.find( "label[for='" + element.attr( "id" ) + "']" )
			.append( error );
		},
		errorElement: "span",
		rules: {
			EmailIntegrante: {
				required: true,
				email: true,
			},
			debug: {} 
		}
	});