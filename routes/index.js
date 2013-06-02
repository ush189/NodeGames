
/*
 * GET home page.
 */

exports.index = function(req, res) {
    if (req.cookies.player) {
	    res.render('index', {
	        title: 'Welcome to Node Games',
	        navigation: ['Logout', 'TicTacToe']
	    });
    } else {
	    res.render('index', {
	        title: 'Welcome to Node Games',
	        navigation: ['Login', 'TicTacToe']
	    });
    }
};