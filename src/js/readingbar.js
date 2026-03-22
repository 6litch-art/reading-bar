
;(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ReadingBar = factory();
    }

})(this, function () {

    const ReadingBar = window.ReadingBar = {};
        ReadingBar.version = '0.1.0';

    const Settings = ReadingBar.settings = {
		"id"        : "reading-bar",
		"classname" : null,
		"container" : "body",

        "offset": 0,
		"extraHeight": 0,
		"element": undefined,
    };

    let isReady = false;

    ReadingBar.configure = function (options) {

        let key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        return this;
    };

	ReadingBar.setOffset = function(el = '#page') {

		Settings["offset"] = $(el).position().top;
	}

	ReadingBar.removeExtraHeight = function(el) {

		Settings["extraHeight"] = 0;
		if( $(el).length ) {

			if($(el)[0].attributes.style.nodeValue.match("display[ ]*:[ ]*none") == null)
				Settings["extraHeight"] = $(el).height();
		}
	}

    ReadingBar.ready = function (options = {}) {

		ReadingBar.setOffset();
        ReadingBar.configure(options);

		let el = document.createElement("div");
		$(el).attr("id", Settings["id"]);

		if(Settings["classname"] !== null)
			$(el).addClass(Settings["classname"]);

        ReadingBar.configure({'element': el});
		$(Settings["container"]).append(el);

		isReady = true;
		dispatchEvent(new Event('readingbar:ready'));

		$(window).one('beforeunload.readingbar', __delete__, false);
		$(window).on('scroll.readingbar', __main__);

		return this;
    };

	function __delete__(e) {

		$(Settings["element"]).remove();
		$(window).off('scroll.readingbar');
	}

    function __main__(e) {

		if( !isReady ) return;
		if(  isReady && typeof Settings["element"] === "undefined") {

			dispatchEvent(new Event('readingbar:idle'));
			isReady = false;

			return;
		}

		const element = document.documentElement;
		const body = document.body;

		const scrollNum = (element.scrollTop||body.scrollTop) - Settings["offset"];
		const scrollDen = (element.scrollHeight||body.scrollHeight) - element.clientHeight - Settings["offset"] - Settings["extraHeight"];
		const scroll = (scrollDen ? scrollNum / scrollDen * 100 : 0);

		$(Settings["element"]).css('--scroll', scroll + '%');
	}


    $(window).on("load.readingbar", function() {

		const readingBarEl = $(".reading-bar").length;
        if (readingBarEl > 0) ReadingBar.ready();
    });

    return ReadingBar;
});
