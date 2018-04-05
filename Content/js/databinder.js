function DataBinder( object_id ) {

  var pubSub = jQuery({});

  var data_attr = "bind-" + object_id,
  message = object_id + ":change";

  jQuery( document ).on( "change", "[data-" + data_attr + "]", function( evt ) {
  	var $input = jQuery( this );

  	pubSub.trigger( message, [ $input.data( data_attr ), $input.val() ] );
  });

  return pubSub;
}

function task( uid ) {
	var binder = new DataBinder( uid ),

	task = {
    attributes: {},

    set: function( attr_name, val ) {
      this.attributes[ attr_name ] = val;
      binder.trigger( uid + ":change", [ attr_name, val, this ] );
    },

    get: function( attr_name ) {
      return this.attributes[ attr_name ];
    },

    get_attr: function() {
      return attributes;
    },

    _binder: binder
  };

  binder.on( uid + ":change", function( evt, attr_name, new_val, initiator ) {
    if ( initiator !== task ) {
      task.set( attr_name, new_val );
    }
  });

  return task;
}