
/*
 * GET login page.
 */

exports.index = function(req, res) {
    if (req.cookies.player) {
	    // get player from cookie
	    player = req.cookies.player;
    } else if (req.query.player) {
	    // get player from GET
	    player = req.query.player;
	    
	    // set cookie
        res.cookie('player', req.query.player);
    } else if (req.body.player) {
	    // get player from POST
        player = req.body.player;
	    
	    // set cookie
        res.cookie('player', req.body.player);
    } else {
        // show login form
	    res.render('login', {
	        title: 'Node Games - Login',
	        navigation: ['Home']
	    });
	    return;
    }

    res.redirect('/home');
};