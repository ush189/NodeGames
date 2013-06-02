
/*
 * GET logout page.
 */

exports.index = function(req, res) {
	res.clearCookie('player');
    res.redirect('back');
}