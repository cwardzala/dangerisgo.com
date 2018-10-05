/* Danger is go main.js */
require.config({
    baseUrl: "/js/",
    paths: {
        'jquery': 'libs/jquery-1.9.1.min'
    }
});

require(['jquery', 'device', 'navigation'], function ($, device, nav) {
    nav.listen();
    $(function () {
        var location = window.location;

        $('.navbar .nav li > a').each(function (i,node) {
            var $a = $(node), $li = $a.parent('li');
            if ($a[0].href == location) {
                $li.addClass('active');
            }
        });
    });
});
