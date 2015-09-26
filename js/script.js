$(document).ready(function () {
    var Games = {
        init: function () {
            $('.game-container').fadeOut();
            var hash = window.location.hash.replace('#', '');
            if (this[hash]) {
                this[hash].init();
                $('#' + hash + '-game').fadeIn();
            }
        }
    };

    Games.words = {
        $suggestions: $('#words-game .suggestions'),
        $answers: $('#words-game .answers'),
        $winnings: $('#words-game .winnings .coins'),
        $startBtn: $('#words-game button[name="start"]'),
        $winBtn: $('#words-game button[name="win"]'),
        $wordText: $('#words-game input[name="word"]'),
        currentWord: 'Tere',

        init: function () {
            this.updateUI();
            this.bindEvents();
        },

        bindEvents: function () {
            $('#words-game .suggestions, #words-game .answers').sortable({
                connectWith: '#words-game .char-container',
                placeholder: 'placeholder'
            });

            this.$startBtn.click($.proxy(function () {
                this.currentWord = this.$wordText.val();
                this.updateUI();
                this.$wordText.val('');
            }, this));

            this.$winBtn.click($.proxy(function () {
                this.addWin();
            }, this));

            this.$winnings.click($.proxy(function() {
                this.removeWin();
            }, this));
        },

        updateUI: function () {
            this.$suggestions.html('');
            this.$answers.html('');
            var chars = this.currentWord.split('');

            // Shuffle characters in word
            chars = chars.sort(function () {
                return 0.5 - Math.random()
            });

            var $template = $('.char-template');
            $(chars).each($.proxy(function (i, char) {
                $template.tmpl({'char': char}).hide().appendTo(
                    this.$suggestions).delay(i * 500).fadeIn();
            }, this));
        },

        addWin: function () {
            var win = $('<div>');
            win.addClass('coin').hide();
            this.$winnings.append(win).fadeIn();
            win.html($('.winnings .coin').length);
            win.fadeIn();
        },

        removeWin: function() {
            $('.winnings .coin').last().remove();
        }
    };

    $(window).on('hashchange', function () {
        Games.init();
    });

    Games.init();
});