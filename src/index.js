;(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ReadingBar = factory();
    }

})(this, function () {

    var ReadingBar = {};
        ReadingBar.version = '0.1.0';

    var Settings = ReadingBar.settings = {
		"id"        : "reading-bar",
		"classname" : null,
		"container" : "body",

        "offset": 0,
		"extraHeight": 0,
		"element": undefined,
    };

    var isReady = false;

    ReadingBar.configure = function (options) {

        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        return this;
    };

	ReadingBar.setOffset = function(el = '#page') {

		Settings["offset"] = $(el).position().top;
	}

	ReadingBar.removeExtraHeight = function(el) {

		Settings["extraHeight"] = 0;
		if( $(el).length ) {

			if($(el)[0].attributes.style.nodeValue.match("display[ ]*:[ ]*none") == null)
				Settings["extraHeight"] = $(el).height();
		}
	}

    ReadingBar.ready = function (options = {}) {

		ReadingBar.setOffset();
        ReadingBar.configure(options);

		el = document.createElement("div");
		$(el).attr("id", Settings["id"]);

		if(Settings["classname"] !== null)
			$(el).addClass(Settings["classname"]);

        ReadingBar.configure({'element': el});
		$(Settings["container"]).append(el);

		isReady = true;
		dispatchEvent(new Event('readingbar:ready'));

		$(window).one('onbeforeunload.readingbar', __delete__, false);
		$(window).on('scroll.readingbar', __main__);

		return this;
    };

	function __delete__(e) {

		$(Settings["element"]).remove();
		$(window).off('scroll.readingbar');
	}

    function __main__(e) {

		if( !isReady ) return;
		if(  isReady && typeof(Settings["element"]) === undefined) {

			dispatchEvent(new Event('readingbar:idle'));
			isReady = false;

			return;
		}

		var element = document.documentElement;
		var body = document.body;

		var scrollNum = (element.scrollTop||body.scrollTop) - Settings["offset"];
		var scrollDen = (element.scrollHeight||body.scrollHeight) - element.clientHeight - Settings["offset"] - Settings["extraHeight"];
		var scroll = (scrollDen ? scrollNum / scrollDen * 100 : 0);

		$(Settings["element"]).css('--scroll', scroll + '%');
	}

    return ReadingBar;
});