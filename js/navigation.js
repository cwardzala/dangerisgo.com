define(['jquery', 'device'], function ($, device) {
    var nav = {};


    nav.listen = function () {
        $('.js-nav-expand')
            .on('click', function () {
                nav.mobile();
            });
    };

    nav.mobile = function () {
        var $nc = $('.nav-collapse');
        if ($nc.height() == 0) {
            $nc.css('height', $nc[0].scrollHeight);
        } else {
            $nc.css('height', 0);
        }
    };

    return nav;

});
