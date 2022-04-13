"use strict";

// Component Definition
var KTApp = (function () {
  /** @type {object} colors State colors **/
  var settings = {};

  var initTooltip = function (el) {
    var theme = el.data("theme") ? "tooltip-" + el.data("theme") : "";
    var width = el.data("width") == "auto" ? "tooltop-auto-width" : "";
    var trigger = el.data("trigger") ? el.data("trigger") : "hover";

    $(el).tooltip({
      trigger: trigger,
      template:
        '<div class="tooltip ' +
        theme +
        " " +
        width +
        '" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>',
    });
  };

  var initTooltips = function () {
    // init bootstrap tooltips
    $('[data-toggle="tooltip"]').each(function () {
      initTooltip($(this));
    });
  };

  var initPopover = function (el) {
    var skin = el.data("skin") ? "popover-" + el.data("skin") : "";
    var triggerValue = el.data("trigger") ? el.data("trigger") : "hover";

    el.popover({
      trigger: triggerValue,
      template:
        '\
            <div class="popover ' +
        skin +
        '" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>',
    });
  };

  var initPopovers = function () {
    // init bootstrap popover
    $('[data-toggle="popover"]').each(function () {
      initPopover($(this));
    });
  };

  var initFileInput = function () {
    // init bootstrap popover
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val();
      $(this).next(".custom-file-label").addClass("selected").html(fileName);
    });
  };

  var initScroll = function () {
    $('[data-scroll="true"]').each(function () {
      var el = $(this);

      KTUtil.scrollInit(this, {
        mobileNativeScroll: true,
        handleWindowResize: true,
        rememberPosition: el.data("remember-position") == "true" ? true : false,
      });
    });
  };

  var initAlerts = function () {
    // init bootstrap popover
    $("body").on("click", "[data-close=alert]", function () {
      $(this).closest(".alert").hide();
    });
  };

  var initCard = function (el, options) {
    // init card tools
    var el = $(el);
    var card = new KTCard(el[0], options);
  };

  var initCards = function () {
    // init card tools
    $('[data-card="true"]').each(function () {
      var el = $(this);
      var options = {};

      if (el.data("data-card-initialized") !== true) {
        initCard(el, options);
        el.data("data-card-initialized", true);
      }
    });
  };

  var initStickyCard = function () {
    if (typeof Sticky === "undefined") {
      return;
    }

    var sticky = new Sticky('[data-sticky="true"]');
  };

  var initAbsoluteDropdown = function (context) {
    var dropdownMenu;

    if (!context) {
      return;
    }

    $("body")
      .on("show.bs.dropdown", context, function (e) {
        dropdownMenu = $(e.target).find(".dropdown-menu");
        $("body").append(dropdownMenu.detach());
        dropdownMenu.css("display", "block");
        dropdownMenu.position({
          my: "right top",
          at: "right bottom",
          of: $(e.relatedTarget),
        });
      })
      .on("hide.bs.dropdown", context, function (e) {
        $(e.target).append(dropdownMenu.detach());
        dropdownMenu.hide();
      });
  };

  var initAbsoluteDropdowns = function () {
    $("body").on("show.bs.dropdown", function (e) {
      // e.target is always parent (contains toggler and menu)
      var $toggler = $(e.target).find("[data-attach='body']");
      if ($toggler.length === 0) {
        return;
      }
      var $dropdownMenu = $(e.target).find(".dropdown-menu");
      // save detached menu
      var $detachedDropdownMenu = $dropdownMenu.detach();
      // save reference to detached menu inside data of toggler
      $toggler.data("dropdown-menu", $detachedDropdownMenu);

      $("body").append($detachedDropdownMenu);
      $detachedDropdownMenu.css("display", "block");
      $detachedDropdownMenu.position({
        my: "right top",
        at: "right bottom",
        of: $(e.relatedTarget),
      });
    });

    $("body").on("hide.bs.dropdown", function (e) {
      var $toggler = $(e.target).find("[data-attach='body']");
      if ($toggler.length === 0) {
        return;
      }
      // access to reference of detached menu from data of toggler
      var $detachedDropdownMenu = $toggler.data("dropdown-menu");
      // re-append detached menu inside parent
      $(e.target).append($detachedDropdownMenu.detach());
      // hide dropdown
      $detachedDropdownMenu.hide();
    });
  };

  return {
    init: function (settingsArray) {
      if (settingsArray) {
        settings = settingsArray;
      }

      KTApp.initComponents();
    },

    initComponents: function () {
      initScroll();
      initTooltips();
      initPopovers();
      initAlerts();
      initFileInput();
      initCards();
      initStickyCard();
      initAbsoluteDropdowns();
    },

    initTooltips: function () {
      initTooltips();
    },

    initTooltip: function (el) {
      initTooltip(el);
    },

    initPopovers: function () {
      initPopovers();
    },

    initPopover: function (el) {
      initPopover(el);
    },

    initCard: function (el, options) {
      initCard(el, options);
    },

    initCards: function () {
      initCards();
    },

    initSticky: function () {
      initSticky();
    },

    initAbsoluteDropdown: function (context) {
      initAbsoluteDropdown(context);
    },

    block: function (target, options) {
      var el = $(target);

      options = $.extend(
        true,
        {
          opacity: 0.05,
          overlayColor: "#000000",
          type: "",
          size: "",
          state: "primary",
          centerX: true,
          centerY: true,
          message: "",
          shadow: true,
          width: "auto",
        },
        options
      );

      var html;
      var version = options.type ? "spinner-" + options.type : "";
      var state = options.state ? "spinner-" + options.state : "";
      var size = options.size ? "spinner-" + options.size : "";
      var spinner = '<span class="spinner ' + version + " " + state + " " + size + '"></span';

      if (options.message && options.message.length > 0) {
        var classes = "blockui " + (options.shadow === false ? "blockui" : "");

        html = '<div class="' + classes + '"><span>' + options.message + "</span>" + spinner + "</div>";

        var el = document.createElement("div");

        $("body").prepend(el);
        KTUtil.addClass(el, classes);
        el.innerHTML = html;
        options.width = KTUtil.actualWidth(el) + 10;
        KTUtil.remove(el);

        if (target == "body") {
          html =
            '<div class="' +
            classes +
            '" style="margin-left:-' +
            options.width / 2 +
            'px;"><span>' +
            options.message +
            "</span><span>" +
            spinner +
            "</span></div>";
        }
      } else {
        html = spinner;
      }

      var params = {
        message: html,
        centerY: options.centerY,
        centerX: options.centerX,
        css: {
          top: "30%",
          left: "50%",
          border: "0",
          padding: "0",
          backgroundColor: "none",
          width: options.width,
        },
        overlayCSS: {
          backgroundColor: options.overlayColor,
          opacity: options.opacity,
          cursor: "wait",
          zIndex: target == "body" ? 1100 : 10,
        },
        onUnblock: function () {
          if (el && el[0]) {
            KTUtil.css(el[0], "position", "");
            KTUtil.css(el[0], "zoom", "");
          }
        },
      };

      if (target == "body") {
        params.css.top = "50%";
        $.blockUI(params);
      } else {
        var el = $(target);
        el.block(params);
      }
    },

    unblock: function (target) {
      if (target && target != "body") {
        $(target).unblock();
      } else {
        $.unblockUI();
      }
    },

    blockPage: function (options) {
      return KTApp.block("body", options);
    },

    unblockPage: function () {
      return KTApp.unblock("body");
    },

    getSettings: function () {
      return settings;
    },
  };
})();

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTApp;
}

// Initialize KTApp class on document ready
$(document).ready(function () {
  KTApp.init(KTAppSettings);
});

// CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
window.onload = function () {
  var result = KTUtil.getByTagName("body");
  if (result && result[0]) {
    KTUtil.removeClass(result[0], "page-loading");
  }
};
("use strict");

// Component Definition
var KTCard = function (elementId, options) {
  // Main object
  var the = this;
  var init = false;

  // Get element object
  var element = KTUtil.getById(elementId);
  var body = KTUtil.getBody();

  if (!element) {
    return;
  }

  // Default options
  var defaultOptions = {
    toggleSpeed: 400,
    sticky: {
      releseOnReverse: false,
      offset: 300,
      zIndex: 101,
    },
  };

  ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var Plugin = {
    /**
     * Construct
     */

    construct: function (options) {
      if (KTUtil.data(element).has("card")) {
        the = KTUtil.data(element).get("card");
      } else {
        // reset menu
        Plugin.init(options);

        // build menu
        Plugin.build();

        KTUtil.data(element).set("card", the);
      }

      return the;
    },

    /**
     * Init card
     */
    init: function (options) {
      the.element = element;
      the.events = [];

      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);
      the.header = KTUtil.child(element, ".card-header");
      the.footer = KTUtil.child(element, ".card-footer");

      if (KTUtil.child(element, ".card-body")) {
        the.body = KTUtil.child(element, ".card-body");
      } else if (KTUtil.child(element, ".form")) {
        the.body = KTUtil.child(element, ".form");
      }
    },

    /**
     * Build Form Wizard
     */
    build: function () {
      // Remove
      var remove = KTUtil.find(the.header, "[data-card-tool=remove]");
      if (remove) {
        KTUtil.addEvent(remove, "click", function (e) {
          e.preventDefault();
          Plugin.remove();
        });
      }

      // Reload
      var reload = KTUtil.find(the.header, "[data-card-tool=reload]");
      if (reload) {
        KTUtil.addEvent(reload, "click", function (e) {
          e.preventDefault();
          Plugin.reload();
        });
      }

      // Toggle
      var toggle = KTUtil.find(the.header, "[data-card-tool=toggle]");
      if (toggle) {
        KTUtil.addEvent(toggle, "click", function (e) {
          e.preventDefault();
          Plugin.toggle();
        });
      }
    },

    /**
     * Enable stickt mode
     */
    initSticky: function () {
      var lastScrollTop = 0;
      var offset = the.options.sticky.offset;

      if (!the.header) {
        return;
      }

      window.addEventListener("scroll", Plugin.onScrollSticky);
    },

    /**
     * Window scroll handle event for sticky card
     */
    onScrollSticky: function (e) {
      var offset = the.options.sticky.offset;

      if (isNaN(offset)) return;

      var st = KTUtil.getScrollTop();

      if (st >= offset && KTUtil.hasClass(body, "card-sticky-on") === false) {
        Plugin.eventTrigger("stickyOn");

        KTUtil.addClass(body, "card-sticky-on");

        Plugin.updateSticky();
      } else if (st * 1.5 <= offset && KTUtil.hasClass(body, "card-sticky-on")) {
        // Back scroll mode
        Plugin.eventTrigger("stickyOff");

        KTUtil.removeClass(body, "card-sticky-on");

        Plugin.resetSticky();
      }
    },

    updateSticky: function () {
      if (!the.header) {
        return;
      }

      var top;

      if (KTUtil.hasClass(body, "card-sticky-on")) {
        if (the.options.sticky.position.top instanceof Function) {
          top = parseInt(the.options.sticky.position.top.call(this, the));
        } else {
          top = parseInt(the.options.sticky.position.top);
        }

        var left;
        if (the.options.sticky.position.left instanceof Function) {
          left = parseInt(the.options.sticky.position.left.call(this, the));
        } else {
          left = parseInt(the.options.sticky.position.left);
        }

        var right;
        if (the.options.sticky.position.right instanceof Function) {
          right = parseInt(the.options.sticky.position.right.call(this, the));
        } else {
          right = parseInt(the.options.sticky.position.right);
        }

        KTUtil.css(the.header, "z-index", the.options.sticky.zIndex);
        KTUtil.css(the.header, "top", top + "px");
        KTUtil.css(the.header, "left", left + "px");
        KTUtil.css(the.header, "right", right + "px");
      }
    },

    resetSticky: function () {
      if (!the.header) {
        return;
      }

      if (KTUtil.hasClass(body, "card-sticky-on") === false) {
        KTUtil.css(the.header, "z-index", "");
        KTUtil.css(the.header, "top", "");
        KTUtil.css(the.header, "left", "");
        KTUtil.css(the.header, "right", "");
      }
    },

    /**
     * Remove card
     */
    remove: function () {
      if (Plugin.eventTrigger("beforeRemove") === false) {
        return;
      }

      // Remove tooltips
      var tooltips;
      if ((tooltips = document.querySelectorAll(".tooltip.show"))) {
        $(tooltips).tooltip("dispose");
      }

      KTUtil.remove(element);

      Plugin.eventTrigger("afterRemove");
    },

    /**
     * Set content
     */
    setContent: function (html) {
      if (html) {
        the.body.innerHTML = html;
      }
    },

    /**
     * Get body
     */
    getBody: function () {
      return the.body;
    },

    /**
     * Get self
     */
    getSelf: function () {
      return element;
    },

    /**
     * Reload
     */
    reload: function () {
      Plugin.eventTrigger("reload");
    },

    /**
     * Toggle
     */
    toggle: function () {
      if (KTUtil.hasClass(element, "card-collapse") || KTUtil.hasClass(element, "card-collapsed")) {
        Plugin.expand();
      } else {
        Plugin.collapse();
      }
    },

    /**
     * Collapse
     */
    collapse: function () {
      if (Plugin.eventTrigger("beforeCollapse") === false) {
        return;
      }

      KTUtil.slideUp(the.body, the.options.toggleSpeed, function () {
        Plugin.eventTrigger("afterCollapse");
      });

      KTUtil.addClass(element, "card-collapse");
    },

    /**
     * Expand
     */
    expand: function () {
      if (Plugin.eventTrigger("beforeExpand") === false) {
        return;
      }

      KTUtil.slideDown(the.body, the.options.toggleSpeed, function () {
        Plugin.eventTrigger("afterExpand");
      });

      KTUtil.removeClass(element, "card-collapse");
      KTUtil.removeClass(element, "card-collapsed");
    },

    /**
     * Trigger events
     */
    eventTrigger: function (name) {
      //KTUtil.triggerCustomEvent(name);
      for (var i = 0; i < the.events.length; i++) {
        var event = the.events[i];
        if (event.name == name) {
          if (event.one == true) {
            if (event.fired == false) {
              the.events[i].fired = true;
              return event.handler.call(this, the);
            }
          } else {
            return event.handler.call(this, the);
          }
        }
      }
    },

    addEvent: function (name, handler, one) {
      the.events.push({
        name: name,
        handler: handler,
        one: one,
        fired: false,
      });

      return the;
    },
  };

  //////////////////////////
  // ** Public Methods ** //
  //////////////////////////

  /**
   * Set default options
   */

  the.setDefaults = function (options) {
    defaultOptions = options;
  };

  /**
   * Remove card
   */
  the.remove = function () {
    return Plugin.remove(html);
  };

  /**
   * Init sticky card
   */
  the.initSticky = function () {
    return Plugin.initSticky();
  };

  /**
   * Rerender sticky layout
   */
  the.updateSticky = function () {
    return Plugin.updateSticky();
  };

  /**
   * Reset the sticky
   */
  the.resetSticky = function () {
    return Plugin.resetSticky();
  };

  /**
   * Destroy sticky card
   */
  the.destroySticky = function () {
    Plugin.resetSticky();
    window.removeEventListener("scroll", Plugin.onScrollSticky);
  };

  /**
   * Reload card
   */
  the.reload = function () {
    return Plugin.reload();
  };

  /**
   * Set card content
   */
  the.setContent = function (html) {
    return Plugin.setContent(html);
  };

  /**
   * Toggle card
   */
  the.toggle = function () {
    return Plugin.toggle();
  };

  /**
   * Collapse card
   */
  the.collapse = function () {
    return Plugin.collapse();
  };

  /**
   * Expand card
   */
  the.expand = function () {
    return Plugin.expand();
  };

  /**
   * Get cardbody
   * @returns {jQuery}
   */
  the.getBody = function () {
    return Plugin.getBody();
  };

  /**
   * Get cardbody
   * @returns {jQuery}
   */
  the.getSelf = function () {
    return Plugin.getSelf();
  };

  /**
   * Attach event
   */
  the.on = function (name, handler) {
    return Plugin.addEvent(name, handler);
  };

  /**
   * Attach event that will be fired once
   */
  the.one = function (name, handler) {
    return Plugin.addEvent(name, handler, true);
  };

  // Construct plugin
  Plugin.construct.apply(the, [options]);

  return the;
};

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTCard;
}

("use strict");
// DOCS: https://javascript.info/cookie

// Component Definition
var KTCookie = (function () {
  return {
    // returns the cookie with the given name,
    // or undefined if not found
    getCookie: function (name) {
      var matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
      );
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    // Please note that a cookie value is encoded,
    // so getCookie uses a built-in decodeURIComponent function to decode it.
    setCookie: function (name, value, options) {
      if (!options) {
        options = {};
      }

      options = Object.assign({}, { path: "/" }, options);

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
      }

      var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

      for (var optionKey in options) {
        if (!options.hasOwnProperty(optionKey)) {
          continue;
        }
        updatedCookie += "; " + optionKey;
        var optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        }
      }

      document.cookie = updatedCookie;
    },
    // To delete a cookie, we can call it with a negative expiration date:
    deleteCookie: function (name) {
      setCookie(name, "", {
        "max-age": -1,
      });
    },
  };
})();

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTCookie;
}

("use strict");

// Component Definition
var KTDialog = function (options) {
  // Main object
  var the = this;

  // Get element object
  var element;
  var body = KTUtil.getBody();

  // Default options
  var defaultOptions = {
    placement: "top center",
    type: "loader",
    width: 100,
    state: "default",
    message: "Loading...",
  };

  ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var Plugin = {
    /**
     * Construct
     */

    construct: function (options) {
      Plugin.init(options);

      return the;
    },

    /**
     * Handles subtoggle click toggle
     */
    init: function (options) {
      the.events = [];

      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);

      the.state = false;
    },

    /**
     * Show dialog
     */
    show: function () {
      Plugin.eventTrigger("show");

      element = document.createElement("DIV");
      KTUtil.setHTML(element, the.options.message);

      KTUtil.addClass(element, "dialog dialog-shown");
      KTUtil.addClass(element, "dialog-" + the.options.state);
      KTUtil.addClass(element, "dialog-" + the.options.type);

      if (the.options.placement == "top center") {
        KTUtil.addClass(element, "dialog-top-center");
      }

      body.appendChild(element);

      the.state = "shown";

      Plugin.eventTrigger("shown");

      return the;
    },

    /**
     * Hide dialog
     */
    hide: function () {
      if (element) {
        Plugin.eventTrigger("hide");

        element.remove();
        the.state = "hidden";

        Plugin.eventTrigger("hidden");
      }

      return the;
    },

    /**
     * Trigger events
     */
    eventTrigger: function (name) {
      for (var i = 0; i < the.events.length; i++) {
        var event = the.events[i];

        if (event.name == name) {
          if (event.one == true) {
            if (event.fired == false) {
              the.events[i].fired = true;
              return event.handler.call(this, the);
            }
          } else {
            return event.handler.call(this, the);
          }
        }
      }
    },

    addEvent: function (name, handler, one) {
      the.events.push({
        name: name,
        handler: handler,
        one: one,
        fired: false,
      });

      return the;
    },
  };

  //////////////////////////
  // ** Public Methods ** //
  //////////////////////////

  /**
   * Set default options
   */

  the.setDefaults = function (options) {
    defaultOptions = options;
  };

  /**
   * Check shown state
   */
  the.shown = function () {
    return the.state == "shown";
  };

  /**
   * Check hidden state
   */
  the.hidden = function () {
    return the.state == "hidden";
  };

  /**
   * Show dialog
   */
  the.show = function () {
    return Plugin.show();
  };

  /**
   * Hide dialog
   */
  the.hide = function () {
    return Plugin.hide();
  };

  /**
   * Attach event
   * @returns {KTToggle}
   */
  the.on = function (name, handler) {
    return Plugin.addEvent(name, handler);
  };

  /**
   * Attach event that will be fired once
   * @returns {KTToggle}
   */
  the.one = function (name, handler) {
    return Plugin.addEvent(name, handler, true);
  };

  // Construct plugin
  Plugin.construct.apply(the, [options]);

  return the;
};

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTDialog;
}

("use strict");

// Component Definition
var KTHeader = function (elementId, options) {
  // Main object
  var the = this;
  var init = false;

  // Get element object
  var element = KTUtil.getById(elementId);
  var body = KTUtil.getBody();

  if (element === undefined) {
    return;
  }

  // Default options
  var defaultOptions = {
    offset: {
      desktop: true,
      tabletAndMobile: true,
    },
    releseOnReverse: {
      desktop: false,
      tabletAndMobile: false,
    },
  };

  ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var Plugin = {
    /**
     * Run plugin
     * @returns {KTHeader}
     */
    construct: function (options) {
      if (KTUtil.data(element).has("header")) {
        the = KTUtil.data(element).get("header");
      } else {
        // reset header
        Plugin.init(options);

        // build header
        Plugin.build();

        KTUtil.data(element).set("header", the);
      }

      return the;
    },

    /**
     * Handles subheader click toggle
     * @returns {KTHeader}
     */
    init: function (options) {
      the.events = [];

      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);
    },

    /**
     * Reset header
     * @returns {KTHeader}
     */
    build: function () {
      var eventTriggerState = true;
      var lastScrollTop = 0;

      window.addEventListener("scroll", function () {
        var offset = 0,
          st,
          attrName;

        if (KTUtil.isBreakpointDown("lg") && the.options.offset.tabletAndMobile === false) {
          return;
        }

        if (KTUtil.isBreakpointUp("lg") && the.options.offset.desktop === false) {
          return;
        }

        if (KTUtil.isBreakpointUp("lg")) {
          offset = the.options.offset.desktop;
        } else if (KTUtil.isBreakpointDown("lg")) {
          offset = the.options.offset.tabletAndMobile;
        }

        st = KTUtil.getScrollTop();

        if (
          (KTUtil.isBreakpointDown("lg") && the.options.releseOnReverse.tabletAndMobile) ||
          (KTUtil.isBreakpointUp("lg") && the.options.releseOnReverse.desktop)
        ) {
          if (st > offset && lastScrollTop < st) {
            // down scroll mode
            if (body.hasAttribute("data-header-scroll") === false) {
              body.setAttribute("data-header-scroll", "on");
            }

            if (eventTriggerState) {
              Plugin.eventTrigger("scrollOn", the);
              eventTriggerState = false;
            }
          } else {
            // back scroll mode
            if (body.hasAttribute("data-header-scroll") === true) {
              body.removeAttribute("data-header-scroll");
            }

            if (eventTriggerState == false) {
              Plugin.eventTrigger("scrollOff", the);
              eventTriggerState = true;
            }
          }

          lastScrollTop = st;
        } else {
          if (st > offset) {
            // down scroll mode
            if (body.hasAttribute("data-header-scroll") === false) {
              body.setAttribute("data-header-scroll", "on");
            }

            if (eventTriggerState) {
              Plugin.eventTrigger("scrollOn", the);
              eventTriggerState = false;
            }
          } else {
            // back scroll mode
            if (body.hasAttribute("data-header-scroll") === true) {
              body.removeAttribute("data-header-scroll");
            }

            if (eventTriggerState == false) {
              Plugin.eventTrigger("scrollOff", the);
              eventTriggerState = true;
            }
          }
        }
      });
    },

    /**
     * Trigger events
     */
    eventTrigger: function (name, args) {
      for (var i = 0; i < the.events.length; i++) {
        var event = the.events[i];
        if (event.name == name) {
          if (event.one == true) {
            if (event.fired == false) {
              the.events[i].fired = true;
              return event.handler.call(this, the, args);
            }
          } else {
            return event.handler.call(this, the, args);
          }
        }
      }
    },

    addEvent: function (name, handler, one) {
      the.events.push({
        name: name,
        handler: handler,
        one: one,
        fired: false,
      });
    },
  };

  //////////////////////////
  // ** Public Methods ** //
  //////////////////////////

  /**
   * Set default options
   */

  the.setDefaults = function (options) {
    defaultOptions = options;
  };

  /**
   * Register event
   */
  the.on = function (name, handler) {
    return Plugin.addEvent(name, handler);
  };

  ///////////////////////////////
  // ** Plugin Construction ** //
  ///////////////////////////////

  // Run plugin
  Plugin.construct.apply(the, [options]);

  // Init done
  init = true;

  // Return plugin instance
  return the;
};

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTHeader;
}

("use strict");

// Component Definition
var KTImageInput = function (elementId, options) {
  // Main object
  var the = this;
  var init = false;

  // Get element object
  var element = KTUtil.getById(elementId);
  var body = KTUtil.getBody();

  if (!element) {
    return;
  }

  // Default options
  var defaultOptions = {
    editMode: false,
  };

  ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var Plugin = {
    /**
     * Construct
     */

    construct: function (options) {
      if (KTUtil.data(element).has("imageinput")) {
        the = KTUtil.data(element).get("imageinput");
      } else {
        // reset menu
        Plugin.init(options);

        // build menu
        Plugin.build();

        KTUtil.data(element).set("imageinput", the);
      }

      return the;
    },

    /**
     * Init avatar
     */
    init: function (options) {
      the.element = element;
      the.events = [];

      the.input = KTUtil.find(element, 'input[type="file"]');
      the.wrapper = KTUtil.find(element, ".image-input-wrapper");
      the.cancel = KTUtil.find(element, '[data-action="cancel"]');
      the.remove = KTUtil.find(element, '[data-action="remove"]');
      the.src = KTUtil.css(the.wrapper, "backgroundImage");
      the.hidden = KTUtil.find(element, 'input[type="hidden"]');

      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);
    },

    /**
     * Build
     */
    build: function () {
      // Handle change
      KTUtil.addEvent(the.input, "change", function (e) {
        e.preventDefault();

        if (the.input && the.input.files && the.input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            KTUtil.css(the.wrapper, "background-image", "url(" + e.target.result + ")");
          };
          reader.readAsDataURL(the.input.files[0]);

          KTUtil.addClass(the.element, "image-input-changed");
          KTUtil.removeClass(the.element, "image-input-empty");

          // Fire change event
          Plugin.eventTrigger("change");
        }
      });

      // Handle cancel
      KTUtil.addEvent(the.cancel, "click", function (e) {
        e.preventDefault();

        // Fire cancel event
        Plugin.eventTrigger("cancel");

        KTUtil.removeClass(the.element, "image-input-changed");
        KTUtil.removeClass(the.element, "image-input-empty");
        KTUtil.css(the.wrapper, "background-image", the.src);
        the.input.value = "";

        if (the.hidden) {
          the.hidden.value = "0";
        }
      });

      // Handle remove
      KTUtil.addEvent(the.remove, "click", function (e) {
        e.preventDefault();

        // Fire cancel event
        Plugin.eventTrigger("remove");

        KTUtil.removeClass(the.element, "image-input-changed");
        KTUtil.addClass(the.element, "image-input-empty");
        KTUtil.css(the.wrapper, "background-image", "none");
        the.input.value = "";

        if (the.hidden) {
          the.hidden.value = "1";
        }
      });
    },

    /**
     * Trigger events
     */
    eventTrigger: function (name) {
      //KTUtil.triggerCustomEvent(name);
      for (var i = 0; i < the.events.length; i++) {
        var event = the.events[i];
        if (event.name == name) {
          if (event.one == true) {
            if (event.fired == false) {
              the.events[i].fired = true;
              return event.handler.call(this, the);
            }
          } else {
            return event.handler.call(this, the);
          }
        }
      }
    },

    addEvent: function (name, handler, one) {
      the.events.push({
        name: name,
        handler: handler,
        one: one,
        fired: false,
      });

      return the;
    },
  };

  //////////////////////////
  // ** Public Methods ** //
  //////////////////////////

  /**
   * Set default options
   */

  the.setDefaults = function (options) {
    defaultOptions = options;
  };

  /**
   * Attach event
   */
  the.on = function (name, handler) {
    return Plugin.addEvent(name, handler);
  };

  /**
   * Attach event that will be fired once
   */
  the.one = function (name, handler) {
    return Plugin.addEvent(name, handler, true);
  };

  // Construct plugin
  Plugin.construct.apply(the, [options]);

  return the;
};

// webpack support
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = KTImageInput;
}

("use strict");

// Component Definition
var KTMenu = function (elementId, options) {
  // Main object
  var the = this;
  var init = false;

  // Get element object
  var element = KTUtil.getById(elementId);
  var body = KTUtil.getBody();

  if (!element) {
    return;
  }

  // Default options
  var defaultOptions = {
    // scrollable area with Perfect Scroll
    scroll: {
      rememberPosition: false,
    },

    // accordion submenu mode
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
      autoScrollSpeed: 1200,
      expandAll: true, // allow having multiple expanded accordions in the menu
    },

    // dropdown submenu mode
    dropdown: {
      timeout: 500, // timeout in milliseconds to show and hide the hoverable submenu dropdown
    },
  };

  ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var Plugin = {
    /**
     * Run plugin
     * @returns {KTMenu}
     */
    construct: function (options) {
      if (KTUtil.data(element).has("menu")) {
        the = KTUtil.data(element).get("menu");
      } else {
        // reset menu
        Plugin.init(options);

        // reset menu
        Plugin.reset();

        // build menu
        Plugin.build();

        KTUtil.data(element).set("menu", the);
      }

      return the;
    },

    /**
     * Handles submenu click toggle
     * @returns {KTMenu}
     */
    init: function (options) {
      the.events = [];

      the.eventHandlers = {};

      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);

      // pause menu
      the.pauseDropdownHoverTime = 0;

      the.uid = KTUtil.getUniqueID();
    },

    update: function (options) {
      // merge default and user defined options
      the.options = KTUtil.deepExtend({}, defaultOptions, options);

      // pause menu
      the.pauseDropdownHoverTime = 0;

      // reset menu
      Plugin.reset();

      the.eventHandlers = {};

      // build menu
      Plugin.build();

      KTUtil.data(element).set("menu", the);
    },

    reload: function () {
      // reset menu
      Plugin.reset();

      // build menu
      Plugin.build();

      // reset submenu props
      Plugin.resetSubmenuProps();
    },

    /**
     * Reset menu
     * @returns {KTMenu}
     */
    build: function () {
      // General accordion submenu toggle
      the.eventHandlers["event_1"] = KTUtil.on(element, ".menu-toggle", "click", Plugin.handleSubmenuAccordion);

      // Dropdown mode(hoverable)
      if (Plugin.getSubmenuMode() === "dropdown" || Plugin.isConditionalSubmenuDropdown()) {
        // dropdown submenu - hover toggle
        the.eventHandlers["event_2"] = KTUtil.on(
          element,
          '[data-menu-toggle="hover"]',
          "mouseover",
          Plugin.handleSubmenuDrodownHoverEnter
        );
        the.eventHandlers["event_3"] = KTUtil.on(
          element,
          '[data-menu-toggle="hover"]',
          "mouseout",
          Plugin.handleSubmenuDrodownHoverExit
        );

        // dropdown submenu - click toggle
        the.eventHandlers["event_4"] = KTUtil.on(
          element,
          '[data-menu-toggle="click"] > .menu-toggle, [data-menu-toggle="click"] > .menu-link .menu-toggle',
          "click",
          Plugin.handleSubmenuDropdownClick
        );
        the.eventHandlers["event_5"] = KTUtil.on(
          element,
          '[data-menu-toggle="tab"] > .menu-toggle, [data-menu-toggle="tab"] > .menu-link .menu-toggle',
          "click",
          Plugin.handleSubmenuDropdownTabClick
        );
      }

      // Handle general link click
      the.eventHandlers["event_6"] = KTUtil.on(
        element,
        ".menu-item > .menu-link:not(.menu-toggle):not(.menu-link-toggle-skip)",
        "click",
        Plugin.handleLinkClick
      );

      // Init scrollable menu
      if (the.options.scroll && the.options.scroll.height) {
        Plugin.scrollInit();
      }
    },

    /**
     * Reset menu
     * @returns {KTMenu}
     */
    reset: function () {
      KTUtil.off(element, "click", the.eventHandlers["event_1"]);

      // dropdown submenu - hover toggle
      KTUtil.off(element, "mouseover", the.eventHandlers["event_2"]);
      KTUtil.off(element, "mouseout", the.eventHandlers["event_3"]);

      // dropdown submenu - click toggle
      KTUtil.off(element, "click", the.eventHandlers["event_4"]);
      KTUtil.off(element, "click", the.eventHandlers["event_5"]);

      // handle link click
      KTUtil.off(element, "click", the.eventHandlers["event_6"]);
    },

    /**
     * Init scroll menu
     *
     */
    scrollInit: function () {
      if (the.options.scroll && the.options.scroll.height) {
        KTUtil.scrollDestroy(element, true);
        KTUtil.scrollInit(element, {
          mobileNativeScroll: true,
          windowScroll: false,
          resetHeightOnDestroy: true,
          handleWindowResize: true,
          height: the.options.scroll.height,
          rememberPosition: the.options.scroll.rememberPosition,
        });
      } else {
        KTUtil.scrollDestroy(element, true);
      }
    },

    /**
     * Update scroll menu
     */
    scrollUpdate: function () {
      if (the.options.scroll && the.options.scroll.height) {
        KTUtil.scrollUpdate(element);
      }
    },

    /**
     * Scroll top
     */
    scrollTop: function () {
      if (the.options.scroll && the.options.scroll.height) {
        KTUtil.scrollTop(element);
      }
    },

    /**
     * Get submenu mode for current breakpoint and menu state
     * @returns {KTMenu}
     */
    getSubmenuMode: function (el) {
      if (KTUtil.isBreakpointUp("lg")) {
        if (el && KTUtil.hasAttr(el, "data-menu-toggle") && KTUtil.attr(el, "data-menu-toggle") == "hover") {
          return "dropdown";
        }

        if (KTUtil.isset(the.options.submenu, "desktop.state.body")) {
          if (KTUtil.hasClasses(body, the.options.submenu.desktop.state.body)) {
            return the.options.submenu.desktop.state.mode;
          } else {
            return the.options.submenu.desktop.default;
          }
        } else if (KTUtil.isset(the.options.submenu, "desktop")) {
          return the.options.submenu.desktop;
        }
      } else if (
        KTUtil.isBreakpointUp("md") &&
        KTUtil.isBreakpointDown("lg") &&
        KTUtil.isset(the.options.submenu, "tablet")
      ) {
        return the.options.submenu.tablet;
      } else if (KTUtil.isBreakpointDown("md") && KTUtil.isset(the.options.submenu, "mobile")) {
        return the.options.submenu.mobile;
      } else {
        return false;
      }
    },

    /**
     * Get submenu mode for current breakpoint and menu state
     * @returns {KTMenu}
     */
    isConditionalSubmenuDropdown: function () {
      if (KTUtil.isBreakpointUp("lg") && KTUtil.isset(the.options.submenu, "desktop.state.body")) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Reset submenu attributes
     * @returns {KTMenu}
     */
    resetSubmenuProps: function (e) {
      var submenus = KTUtil.findAll(element, ".menu-submenu");
      if (submenus) {
        for (var i = 0, len = submenus.length; i < len; i++) {
          var submenu = submenus[0];

          KTUtil.css(submenu, "display", "");
          KTUtil.css(submenu, "overflow", "");

          if (submenu.hasAttribute("data-hor-direction")) {
            KTUtil.removeClass(submenu, "menu-submenu-left");
            KTUtil.removeClass(submenu, "menu-submenu-right");
            KTUtil.addClass(submenu, submenu.getAttribute("data-hor-direction"));
          }
        }
      }
    },

    /**
     * Handles submenu hover toggle
     * @returns {KTMenu}
     */
    handleSubmenuDrodownHoverEnter: function (e) {
      if (Plugin.getSubmenuMode(this) === "accordion") {
        return;
      }

      if (the.resumeDropdownHover() === false) {
        return;
      }

      var item = this;

      if (item.getAttribute("data-hover") == "1") {
        item.removeAttribute("data-hover");
        clearTimeout(item.getAttribute("data-timeout"));
        item.removeAttribute("data-timeout");
      }

      Plugin.showSubmenuDropdown(item);
    },

    /**
     * Handles submenu hover toggle
     * @returns {KTMenu}
     */
    handleSubmenuDrodownHoverExit: function (e) {
      if (the.resumeDropdownHover() === false) {
        return;
      }

      if (Plugin.getSubmenuMode(this) === "accordion") {
        return;
      }

      var item = this;
      var time = the.options.dropdown.timeout;

      var timeout = setTimeout(function () {
        if (item.getAttribute("data-hover") == "1") {
          Plugin.hideSubmenuDropdown(item, true);
        }
      }, time);

      item.setAttribute("data-hover", "1");
      item.setAttribute("data-timeout", timeout);
    },

    /**
     * Handles submenu click toggle
     * @returns {KTMenu}
     */
    handleSubmenuDropdownClick: function (e) {
      if (Plugin.getSubmenuMode(this) === "accordion") {
        return;
      }

      var item = this.closest(".menu-item");

      // Trigger click event handlers
      var result = Plugin.eventTrigger("submenuToggle", this, e);
      if (result === false) {
        return;
      }

      if (item.getAttribute("data-menu-submenu-mode") == "accordion") {
        return;
      }

      if (KTUtil.hasClass(item, "menu-item-hover") === false) {
        KTUtil.addClass(item, "menu-item-open-dropdown");
        Plugin.showSubmenuDropdown(item);
      } else {
        KTUtil.removeClass(item, "menu-item-open-dropdown");
        Plugin.hideSubmenuDropdown(item, true);
      }

      e.preventDefault();
    },

    /**
     * Handles tab click toggle
     * @returns {KTMenu}
     */
    handleSubmenuDropdownTabClick: function (e) {
      if (Plugin.getSubmenuMode(this) === "accordion") {
        return;
      }
      var item = this.closest(".menu-item");

      // Trigger click event handlers
      var result = Plugin.eventTrigger("submenuToggle", this, e);
      if (result === false) {
        return;
      }

      if (item.getAttribute("data-menu-submenu-mode") == "accordion") {
        return;
      }

      if (KTUtil.hasClass(item, "menu-item-hover") == false) {
        KTUtil.addClass(item, "menu-item-open-dropdown");
        Plugin.showSubmenuDropdown(item);
      }

      e.preventDefault();
    },

    /**
     * Handles link click
     * @returns {KTMenu}
     */
    handleLinkClick: function (e) {
      var submenu = this.closest(".menu-item.menu-item-submenu");

      // Trigger click event handlers
      var result = Plugin.eventTrigger("linkClick", this, e);
      if (result === false) {
        return;
      }

      if (submenu && Plugin.getSubmenuMode(submenu) === "dropdown") {
        Plugin.hideSubmenuDropdowns();
      }
    },

    /**
     * Handles submenu dropdown close on link click
     * @returns {KTMenu}
     */
    handleSubmenuDropdownClose: function (e, el) {
      // exit if its not submenu dropdown mode
      if (Plugin.getSubmenuMode(el) === "accordion") {
        return;
      }

      var shown = element.querySelectorAll(".menu-item.menu-item-submenu.menu-item-hover:not(.menu-item-tabs)");

      // check if currently clicked link's parent item ha
      if (
        shown.length > 0 &&
        KTUtil.hasClass(el, "menu-toggle") === false &&
        el.querySelectorAll(".menu-toggle").length === 0
      ) {
        // close opened dropdown menus
        for (var i = 0, len = shown.length; i < len; i++) {
          Plugin.hideSubmenuDropdown(shown[0], true);
        }
      }
    },

    /**
     * helper functions
     * @returns {KTMenu}
     */
    handleSubmenuAccordion: function (e, el) {
      var query;
      var item = el ? el : this;

      // Trigger click event handlers
      var result = Plugin.eventTrigger("submenuToggle", this, e);
      if (result === false) {
        return;
      }

      if (Plugin.getSubmenuMode(el) === "dropdown" && (query = item.closest(".menu-item"))) {
        if (query.getAttribute("data-menu-submenu-mode") != "accordion") {
          e.preventDefault();
          return;
        }
      }

      var li = item.closest(".menu-item");
      var submenu = KTUtil.child(li, ".menu-submenu, .menu-inner");

      if (KTUtil.hasClass(item.closest(".menu-item"), "menu-item-open-always")) {
        return;
      }

      if (li && submenu) {
        e.preventDefault();
        var speed = the.options.accordion.slideSpeed;
        var hasClosables = false;

        if (KTUtil.hasClass(li, "menu-item-open") === false) {
          // hide other accordions
          if (the.options.accordion.expandAll === false) {
            var subnav = item.closest(".menu-nav, .menu-subnav");
            var closables = KTUtil.children(
              subnav,
              ".menu-item.menu-item-open.menu-item-submenu:not(.menu-item-here):not(.menu-item-open-always)"
            );

            if (subnav && closables) {
              for (var i = 0, len = closables.length; i < len; i++) {
                var el_ = closables[0];
                var submenu_ = KTUtil.child(el_, ".menu-submenu");
                if (submenu_) {
                  KTUtil.slideUp(submenu_, speed, function () {
                    Plugin.scrollUpdate();
                    KTUtil.removeClass(el_, "menu-item-open");
                  });
                }
              }
            }
          }

          KTUtil.slideDown(submenu, speed, function () {
            Plugin.scrollToItem(item);
            Plugin.scrollUpdate();

            Plugin.eventTrigger("submenuToggle", submenu, e);
          });

          KTUtil.addClass(li, "menu-item-open");
        } else {
          KTUtil.slideUp(submenu, speed, function () {
            Plugin.scrollToItem(item);
            Plugin.scrollUpdate();
            Plugin.eventTrigger("submenuToggle", submenu, e);
          });

          KTUtil.removeClass(li, "menu-item-open");
        }
      }
    },

    /**
     * scroll to item function
     * @returns {KTMenu}
     */
    scrollToItem: function (item) {
      // handle auto scroll for accordion submenus
      if (
        KTUtil.isBreakpointUp("lg") &&
        the.options.accordion.autoScroll &&
        element.getAttribute("data-menu-scroll") !== "1"
      ) {
        KTUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
      }
    },

    /**
     * Hide submenu dropdown
     * @returns {KTMenu}
     */
    hideSubmenuDropdown: function (item, classAlso) {
      // remove submenu activation class
      if (classAlso) {
        KTUtil.removeClass(item, "menu-item-hover");
        KTUtil.removeClass(item, "menu-item-active-tab");
      }

      // clear timeout
      item.removeAttribute("data-hover");

      if (item.getAttribute("data-menu-toggle-class")) {
        KTUtil.removeClass(body, item.getAttribute("data-menu-toggle-class"));
      }

      var timeout = item.getAttribute("data-timeout");
      item.removeAttribute("data-timeout");
      clearTimeout(timeout);
    },

    /**
     * Hide submenu dropdowns
     * @returns {KTMenu}
     */
    hideSubmenuDropdowns: function () {
      var items;
      if (
        (items = element.querySelectorAll(
          '.menu-item-submenu.menu-item-hover:not(.menu-item-tabs):not([data-menu-toggle="tab"])'
        ))
      ) {
        for (var j = 0, cnt = items.length; j < cnt; j++) {
          Plugin.hideSubmenuDropdown(items[j], true);
        }
      }
    },

    /**
     * helper functions
     * @returns {KTMenu}
     */
    showSubmenuDropdown: function (item) {
      // close active submenus
      var list = element.querySelectorAll(
        ".menu-item-submenu.menu-item-hover, .menu-item-submenu.menu-item-active-tab"
      );

      if (list) {
        for (var i = 0, len = list.length; i < len; i++) {
          var el = list[i];
          if (item !== el && el.contains(item) === false && item.contains(el) === false) {
            Plugin.hideSubmenuDropdown(el, true);
          }
        }
      }

      // add submenu activation class
      KTUtil.addClass(item, "menu-item-hover");

      // Change the alignment of submenu is offscreen.
      var submenu = KTUtil.find(item, ".menu-submenu");

      if (submenu && submenu.hasAttribute("data-hor-direction") === false) {
        if (KTUtil.hasClass(submenu, "menu-submenu-left")) {
          submenu.setAttribute("data-hor-direction", "menu-submenu-left");
        } else if (KTUtil.hasClass(submenu, "menu-submenu-right")) {
          submenu.setAttribute("data-hor-direction", "menu-submenu-right");
        }
      }

      if (submenu && KTUtil.isOffscreen(submenu, "left", 15) === true) {
        KTUtil.removeClass(submenu, "menu-submenu-left");
        KTUtil.addClass(submenu, "menu-submenu-right");
      } else if (submenu && KTUtil.isOffscreen(submenu, "right", 15) === true) {
        KTUtil.removeClass(submenu, "menu-submenu-right");
        KTUtil.addClass(submenu, "menu-submenu-left");
      }

      if (item.getAttribute("data-menu-toggle-class")) {
        KTUtil.addClass(body, item.getAttribute("data-menu-toggle-class"));
      }
    },

    /**
     * Handles submenu slide toggle
     * @returns {KTMenu}
     */
    createSubmenuDropdownClickDropoff: function (el) {
      var query;
      var zIndex = (query = KTUtil.child(el, ".menu-submenu") ? KTUtil.css(query, "z-index") : 0) - 1;

      var dropoff = document.createElement(
        '<div class="menu-dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' +
          zIndex +
          '"></div>'
      );

      body.appendChild(dropoff);

      KTUtil.addEvent(dropoff, "click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        KTUtil.remove(this);
        Plugin.hideSubmenuDropdown(el, true);
      });
    },

    /**
     * Handles submenu hover toggle
     * @returns {KTMenu}
     */
    pauseDropdownHover: function (time) {
      var date = new Date();

      the.pauseDropdownHoverTime = date.getTime() + time;
    },

    /**
     * Handles submenu hover toggle
     * @returns {KTMenu}
     */
    resumeDropdownHover: function () {
      var date = new Date();

      return date.getTime() > the.pauseDropdownHoverTime ? true : false;
    },

    /**
     * Reset menu's current active item
     * @returns {KTMenu}
     */
    resetActiveItem: function (item) {
      var list;
      var parents;

      list = element.querySelectorAll(".menu-item-active");

      for (var i = 0, len = list.length; i < len; i++) {
        var el = list[0];
        KTUtil.removeClass(el, "menu-item-active");
        KTUtil.hide(KTUtil.child(el, ".menu-submenu"));
        parents = KTUtil.parents(el, ".menu-item-submenu") || [];

        for (var i_ = 0, len_ = parents.length; i_ < len_; i_++) {
          var el_ = parents[i];
          KTUtil.removeClass(el_, "menu-item-open");
          KTUtil.hide(KTUtil.child(el_, ".menu-submenu"));
        }
      }

      // close open submenus
      if (the.options.accordion.expandAll === false) {
        if ((list = element.querySelectorAll(".menu-item-open"))) {
          for (var i = 0, len = list.length; i < len; i++) {
            KTUtil.removeClass(parents[0], "menu-item-open");
          }
        }
      }
    },

    /**
     * Sets menu's active item
     * @returns {KTMenu}
     */
    setActiveItem: function (item) {
      // reset current active item
      Plugin.resetActiveItem();

      var parents = KTUtil.parents(item, ".menu-item-submenu") || [];
      for (var i = 0, len = parents.length; i < len; i++) {
        KTUtil.addClass(parents[i], "menu-item-open");
      }

      KTUtil.addClass(item, "menu-item-active");
    },

    /**
     * Returns page breadcrumbs for the menu's active item
     * @returns {KTMenu}
     */
    getBreadcrumbs: function (item) {
      var query;
      var breadcrumbs = [];
      var link = KTUtil.child(item, ".menu-link");

      breadcrumbs.push({
        text: (query = KTUtil.child(link, ".menu-text") ? query.innerHTML : ""),
        title: link.getAttribute("title"),
        href: link.getAttribute("href"),
      });

      var parents = KTUtil.parents(item, ".menu-item-submenu");
      for (var i = 0, len = parents.length; i < len; i++) {
        var submenuLink = KTUtil.child(parents[i], ".menu-link");

        breadcrumbs.push({
          text: (query = KTUtil.child(submenuLink, ".menu-text") ? query.innerHTML : ""),
          title: submenuLink.getAttribute("title"),
          href: submenuLink.getAttribute("href"),
        });
      }

      return breadcrumbs.reverse();
    },

    /**
     * Returns page title for the menu's active item
     * @returns {KTMenu}
     */
    getPageTitle: function (item) {
      var query;

      return (query = KTUtil.child(item, ".menu-text") ? query.innerHTML : "");
    },

    /**
     * Trigger events
     */
    eventTrigger: function (name, target, e) {
      for (var i = 0; i < the.events.length; i++) {
        var event = the.events[i];
        if (event.name == name) {
          if (event.one == true) {
            if (event.fired == false) {
              the.events[i].fired = true;
              return event.handler.call(this, target, e);
            }
          } else {
            return event.handler.call(this, target, e);
          }
        }
      }
    },

    addEvent: function (name, handler, one) {
      the.events.push({
        name: name,
        handler: handler,
        one: one,
        fired: false,
      });
    },

    removeEvent: function (name) {
      if (the.events[name]) {
        delete the.events[name];
      }
    },
  };

  //////////////////////////
  // ** Public Methods ** //
  //////////////////////////

  /**
   * Set default options
   */

  the.setDefaults = function (options) {
    defaultOptions = options;
  };

  /**
   * Update scroll
   */
  the.scrollUpdate = function () {
    return Plugin.scrollUpdate();
  };

  /**
   * Re-init scroll
   */
  the.scrollReInit = function () {
    return Plugin.scrollInit();
  };
};
