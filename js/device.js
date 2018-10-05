define(['jquery'], function ($) {
    var d = {},
    _window = window;

    var theTests = {
        "viewport": [
            { category: 'desktop', maxWidth: 5000, minWidth: 1025 },
            { category: 'tablet', maxWidth: 1280, minWidth: 768 },
            { category: 'phone', maxWidth: 767, minWidth: 320 }
        ],
        "platform": [
            { category: 'windows', tokens: /(Windows)/i },
            { category: 'mac', tokens: /(Macintosh)/i },
            { category: 'iOS', tokens: /(iPad|iPhone|iPod)/i },
            { category: 'android', tokens: /(Android)/i },
            { category: 'silk', tokens: /(Silk)/i },
            { category: 'winmobile', tokens: /(Windows Phone OS|Zune)/i },

            // Linux is tricky because Anroid reports itself as Linux.
            // If you are using is.linux to detect desktop linux make sure you also check !is.android
            { category: 'linux', tokens: /(Linux)/i }
        ],
        "pixelDensity": [
            { category: 'LDPI', value: 1 }, // iPad2, OG iPad (132ppi), iPhone3g (163ppi)
            { category: 'MDPI', value: 1.5 }, // DroidX (228ppi)
            { category: 'HDPI', value: 2 },
            { category: 'retina', value: 2 }, // iphone4 (326ppi), iPad"3"(264ppi)
            { category: 'XHDPI', value: 2.5 }
        ]
    },

    methods = {
        viewport: function (i, test) {
            if (test.category !== 'not') {
                d.is.viewport[test.category] = (_window.document.documentElement.clientWidth <= test.maxWidth) && (_window.document.documentElement.clientWidth >= test.minWidth);
            }
        },

        platform: function (i, test) {
            if (test.category && test.category !== 'not') {
                d.is.platform[test.category] = test.tokens.test(_window.navigator.userAgent);
            }
        },

        pixelDensity: function (i, test) {
            if (test.category !== 'not' && _window.devicePixelDensity !== "undefined") {
                d.is[test.category] = (_window.devicePixelDensity === test.value);
            }
        },

        testFor: function (testSets) {
            for (var set in testSets) {
                if (testSets.hasOwnProperty(set)) {
                    var thisSet = set;
                    $(testSets[set]).each(methods[thisSet]);
                }
            }
        },

        overrideIs: function (tests) {
            $(tests).each(function (i, test) {
                d.is[test.category] = test.override;
            });
        }
    };

    d.is = {
        platform: {},
        viewport: {},
        desktop: false, phone: false, tablet: false
    };

    d.update = function() {
        methods.testFor(theTests);

        d.is.desktop = (d.is.platform.mac || d.is.platform.windows || d.is.platform.linux) && !d.is.platform.iOS && !d.is.platform.android && !d.is.platform.silk && d.is.viewport.desktop; // is mac or windows or linux not android or ios and has desktop viewport size range
        d.is.tablet = (d.is.platform.iOS || d.is.platform.android || d.is.platform.silk) && d.is.viewport.tablet; // is ios or android or silk and has tablet viewport size range.
        d.is.phone = (d.is.platform.iOS || d.is.platform.android || d.is.platform.winmobile) && d.is.viewport.phone; // is ios or android and has phone viewport size range

        d.is.supported = (d.is.platform.iOS || d.is.platform.android);

        // force desktop always if on mac or windows.
        if ((d.is.platform.windows || (d.is.platform.mac && !d.is.platform.silk) || (d.is.platform.linux && !d.is.platform.android))) {
            methods.overrideIs([
                { category: 'desktop', override: true },
                { category: 'tablet', override: false },
                { category: 'phone', override: false }
            ]);
        }
        return this;
    };

    // Call update to populate the is object.
    d.update();

    _window.devtest = d;
    return d;

});
