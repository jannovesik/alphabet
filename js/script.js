$(document).ready(function () {
    var game = {
        init: function(word) {
            this.$suggestions = $('#suggestions');
            this.$answers = $('#answers');
            this.$suggestions.html('');
            this.$answers.html('');

            var data = [];
            $(word).each(function (i, char) {
                if (char != '#') {
                    data.push({'char': char});
                }
            });
            $('.char-template').tmpl(data).appendTo('#suggestions');
        }
    };

    var word = window.location.hash.split('');
    game.init(word);

    $('#suggestions, #answers').sortable({
        connectWith: '.char-container',
        placeholder: 'placeholder'
    });

    $(window).on('hashchange', function() {
        var word = window.location.hash.split('');
        game.init(word);
    });
});