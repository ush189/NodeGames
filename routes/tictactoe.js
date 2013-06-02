
/*
 * GET tictactoe page.
 */

exports.index = function(req, res) {
    var fields = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var extraClass = '';
            var clear = false;
            if (i == 2) {
                extraClass += ' lastRow';
            }
            if (j == 2) {
                extraClass += ' lastCol';
                clear = true;
            }
            fields.push({
                id: 'field_' + i + '_' + j,
                extraClass: extraClass,
                clearBoth: clear
            });
        }
    }
            
    res.render('tictactoe', {
        title: 'Node Games',
        navigation: ['Home'],
        fields: fields,
        players: []
    });
};