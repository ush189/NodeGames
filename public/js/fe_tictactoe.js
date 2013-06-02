jQuery(function() {
    var socket = io.connect('http://localhost:8080');
    
    // register to game
    socket.on('connect', function() {
        socket.emit('enter', jQuery.cookie('player'));
    });

    // display system message
    socket.on('system', function(message) {
        jQuery('#chat').append(
              '<span class="messageTime">' + formatTime(new Date()) + ' </span>'
            + '<span class="messageSystem">' + message + '</span>'
            + '<br />'
        );
        // scroll to bottom of chat container
        jQuery("#chat").scrollTop(jQuery("#chat")[0].scrollHeight);
    });

    // refresh players list
    socket.on('updateplayers', function(players) {
        jQuery('#players ul').html('');
        jQuery.each(players, function(clientId, player) {
            jQuery('#players ul').append('<li>' + player + ' <button type="button" name="challenge" value="' + clientId + '">Start game</button></li>');
        });
        jQuery('button[name=challenge]').click(function() {
            socket.emit('newgame', jQuery(this).attr('value'));
        });
    });
    
    // display chat message
    socket.on('chat', function(data) {
        jQuery('#chat').append(
              '<span class="messageTime">' + formatTime(new Date()) + ' </span>'
            + '<span class="messageAuthor">' + data.player + ': </span>'
            + '<span class="messageUser">' + data.message + '</span>'
            + '<br />'
        );
        // scroll to bottom of chat container
        jQuery("#chat").scrollTop(jQuery("#chat")[0].scrollHeight);
    });
    
    // move of opponent
    socket.on('move', function(coords) {
        // mark clicked field
        jQuery('.recent_x').removeClass('recent_x');
        jQuery('.recent_o').removeClass('recent_o');
        jQuery('#field_' + coords.x + '_' + coords.y)
            .html('o')
            .addClass('taken recent_o');
        
        // enable untaken fields
        enableFields(jQuery('.tictactoeField').not('.taken'), socket);
    });

    // enable all fields
    enableFields(jQuery('.tictactoeField'), socket);
    
    jQuery('button[name=newgame]').click(function() {
        jQuery('.tictactoeField').html('');
        enableFields(jQuery('.tictactoeField'), socket);
    });
    
    // chat form
    jQuery('form[name=chatinput]').submit(function() {
        if (jQuery('input[name=message]').val()) {
            socket.emit('chat', jQuery('input[name=message]').val());
            jQuery('input[name=message]').val('').focus();
        }
        return false;
    });
    jQuery('button[name=chatsubmit]').click(function() {
        jQuery('form[name=chatinput]').submit();
    });
});

/**
 * @param jQuery field
 * @param socket.io socket
 */
function enableFields(field, socket) {
    field.removeClass('disabled taken recent_x recent_o');

    // make a move
    field.click(function() {
	    var fieldId = jQuery(this).attr('id');
	    socket.emit('clicked', {x: fieldId.split('_')[1], y: fieldId.split('_')[2]});
	    
	    // mark clicked field
        jQuery('.recent_x').removeClass('recent_x');
	    jQuery('.recent_o').removeClass('recent_o');
	    jQuery(this).html('x').addClass('taken recent_x');
	    
	    // disable all fields until move from opponent
	    jQuery('.tictactoeField').addClass('disabled').unbind('click');
    });
}

/**
 * @param Date date
 * @return String hh:mm:ss
 */
function formatTime(date) {
    var hours   = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return hours + ':' + minutes + ':' + seconds;
}