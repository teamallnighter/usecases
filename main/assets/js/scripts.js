// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_3d-card
// Usage: codyhouse.co/license
(function() {
  var TdCard = function(element) {
    this.element = element;
    this.maxRotation = parseInt(this.element.getAttribute('data-rotation')) || 2; // rotation max value
    this.perspective = this.element.getAttribute('data-perspective') || '300px'; // perspective value
    this.rotateX = 0;
    this.rotateY = 0;
    this.partRotateX = 0;
    this.partRotateY = 0;
    this.deltaRotation = 0.3;
    this.animating = false;
    initTdEvents(this);
  };

  function initTdEvents(tdCard) {
    // detect mouse hovering over the card
    tdCard.element.addEventListener('mousemove', function(event){
      if(tdCard.animating) return;
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, false));
    });

    // detect mouse leaving the card
    tdCard.element.addEventListener('mouseleave', function(event){
      if(tdCard.animating) window.cancelAnimationFrame(tdCard.animating);
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, true));
    });
  };

  function moveCard(event, leaving) {
    // get final rotation values
    setRotationLevel(this, event, leaving);
    
    // update rotation values
    updateRotationLevel(this);
  };

  function setRotationLevel(tdCard, event, leaving) {
    if(leaving) {
      tdCard.rotateX = 0;
      tdCard.rotateY = 0;
      return;
    }

    var wrapperPosition = tdCard.element.getBoundingClientRect();
    var rotateY = 2*(tdCard.maxRotation/wrapperPosition.width)*(event.clientX - wrapperPosition.left - wrapperPosition.width/2);
    var rotateX = 2*(tdCard.maxRotation/wrapperPosition.height)*(wrapperPosition.top - event.clientY + wrapperPosition.height/2);

    if(rotateY > tdCard.maxRotation) rotateY = tdCard.maxRotation;
    if(rotateY < -1*tdCard.maxRotation) rotateY = -tdCard.maxRotation;
    if(rotateX > tdCard.maxRotation) rotateX = tdCard.maxRotation;
    if(rotateX < -1*tdCard.maxRotation) rotateX = -tdCard.maxRotation;

    tdCard.rotateX = rotateX;
    tdCard.rotateY = rotateY;
  };

  function updateRotationLevel(tdCard) {
    if( (tdCard.partRotateX == tdCard.rotateX) && (tdCard.partRotateY == tdCard.rotateY)) {
      tdCard.animating = false;
      return;
    }

    tdCard.partRotateX = getPartRotation(tdCard.partRotateX, tdCard.rotateX, tdCard.deltaRotation);
    tdCard.partRotateY = getPartRotation(tdCard.partRotateY, tdCard.rotateY, tdCard.deltaRotation);
    // set partial rotation
    rotateCard(tdCard);
    // keep rotating the card
    tdCard.animating = window.requestAnimationFrame(function(){
      updateRotationLevel(tdCard);
    });
  };

  function getPartRotation(start, end, delta) {
    if(start == end) return end;
    var newVal = start;
    if(start < end) {
      newVal = start + delta;
      if(newVal > end) newVal = end;
    } else if(start > end) {
      newVal = start - delta;
      if(newVal < end) newVal = end;
    }
    return newVal;
  }

  function rotateCard(tdCard) {
    tdCard.element.style.transform = 'perspective('+tdCard.perspective+') rotateX('+tdCard.partRotateX+'deg) rotateY('+tdCard.partRotateY+'deg)';
  };

  window.TdCard = TdCard;

  //initialize the TdCard objects
  var tdCards = document.getElementsByClassName('js-td-card');
  if( tdCards.length > 0 && Util.cssSupports('transform', 'translateZ(0px)')) {
    for( var i = 0; i < tdCards.length; i++) {
      (function(i){
        new TdCard(tdCards[i]);
      })(i);
    }
  };
}());
// File#: _1_3d-drawer
// Usage: codyhouse.co/license
(function() {
	var TdDrawer = function(element) {
    this.element = element;
    this.mianContent = document.getElementsByClassName('js-td-drawer-main');
		this.content = document.getElementsByClassName('js-td-drawer__body');
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
    this.showClass = "td-drawer--is-visible";
    this.showMainClass = "td-drawer-main--drawer-is-visible";
		initDrawer(this);
  };
  
  function initDrawer(drawer) {
    // open drawer when clicking on trigger buttons
		if ( drawer.triggers ) {
			for(var i = 0; i < drawer.triggers.length; i++) {
				drawer.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(drawer.element, drawer.showClass)) {
						closeDrawer(drawer);
						return;
					}
					drawer.selectedTrigger = event.target;
					showDrawer(drawer);
					initDrawerEvents(drawer);
				});
			}
		}
		
		// if drawer is already open -> we should initialize the drawer events
		if(Util.hasClass(drawer.element, drawer.showClass)) initDrawerEvents(drawer);
  };

  function showDrawer(drawer) {
    if(drawer.content.length  > 0 ) drawer.content[0].scrollTop = 0;
    if(drawer.mianContent.length  > 0 ) Util.addClass(drawer.mianContent[0], drawer.showMainClass);
		Util.addClass(drawer.element, drawer.showClass);
	  getFocusableElements(drawer);
		Util.moveFocus(drawer.element);
		// wait for the end of transitions before moving focus
		drawer.element.addEventListener("transitionend", function cb(event) {
			Util.moveFocus(drawer.element);
			drawer.element.removeEventListener("transitionend", cb);
		});
		emitDrawerEvents(drawer, 'drawerIsOpen');
  };

  function closeDrawer(drawer) {
    if(drawer.mianContent.length  > 0 ) Util.removeClass(drawer.mianContent[0], drawer.showMainClass);
    Util.removeClass(drawer.element, drawer.showClass);
		drawer.firstFocusable = null;
		drawer.lastFocusable = null;
		if(drawer.selectedTrigger) drawer.selectedTrigger.focus();
		//remove listeners
		cancelDrawerEvents(drawer);
		emitDrawerEvents(drawer, 'drawerIsClose');
  };

  function initDrawerEvents(drawer) {
    //add event listeners
    drawer.element.addEventListener('keydown', handleEvent.bind(drawer));
    drawer.element.addEventListener('click', handleEvent.bind(drawer));
  };

  function cancelDrawerEvents(drawer) {
		//remove event listeners
		drawer.element.removeEventListener('keydown', handleEvent.bind(drawer));
		drawer.element.removeEventListener('click', handleEvent.bind(drawer));
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };

  function initKeyDown(drawer, event) {
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close drawer window on esc
      closeDrawer(drawer);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside drawer
      trapFocus(drawer, event);
    }
  };

  function initClick(drawer, event) {
    //close drawer when clicking on close button or drawer bg layer 
		if( !event.target.closest('.js-td-drawer__close') && !Util.hasClass(event.target, 'js-td-drawer') ) return;
		event.preventDefault();
		closeDrawer(drawer);
  };

  function trapFocus(drawer, event) {
    if( drawer.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of drawer
			event.preventDefault();
			drawer.lastFocusable.focus();
		}
		if( drawer.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of drawer
			event.preventDefault();
			drawer.firstFocusable.focus();
		}
  };

  function getFocusableElements(drawer) {
    //get all focusable elements inside the drawer
		var allFocusable = drawer.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(drawer, allFocusable);
		getLastVisible(drawer, allFocusable);
  };

  function getFirstVisible(drawer, elements) {
    //get first visible focusable element inside the drawer
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				drawer.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastVisible(drawer, elements) {
    //get last visible focusable element inside the drawer
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				drawer.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function emitDrawerEvents(drawer, eventName) {
    var event = new CustomEvent(eventName, {detail: drawer.selectedTrigger});
		drawer.element.dispatchEvent(event);
  };

	//initialize the Drawer objects
	var drawer = document.getElementsByClassName('js-td-drawer');
	if( drawer.length > 0 ) {
		for( var i = 0; i < drawer.length; i++) {
			(function(i){new TdDrawer(drawer[i]);})(i);
		}
	}
}());
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_adaptive-navigation
// Usage: codyhouse.co/license
(function() {
  var AdaptNav = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-adapt-nav__list')[0];
    this.items = this.element.getElementsByClassName('js-adapt-nav__item');
    this.moreBtn = this.element.getElementsByClassName('js-adapt-nav__item--more')[0];
    this.dropdown = this.moreBtn.getElementsByTagName('ul')[0];
    this.dropdownItems = this.dropdown.getElementsByTagName('a');
    this.dropdownClass = 'adapt-nav__dropdown--is-visible';
    this.resizing = false;
    // check if items already outrun nav
    this.outrunIndex = this.items.length;
    // reset alignment
    this.resetAlignment = Util.hasClass(this.list, 'justify-end');
    initAdaptNav(this);
  };

  function initAdaptNav(nav) {
    nav.resizing = true;
    resetOutrun(nav, '', true); // initially hide all elements
    resetAdaptNav.bind(nav)(); // reset navigation based on available space

    // listen to resize
    window.addEventListener('resize', function(event){
      if(nav.resizing) return;
      nav.resizing = true;
      window.requestAnimationFrame(resetAdaptNav.bind(nav));
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.ready.then(function() {
        if(nav.resizing) return;
        nav.resizing = true;
        window.requestAnimationFrame(resetAdaptNav.bind(nav));
      });
    }

    /* dropdown behaviour */
    // init aria-labels
		Util.setAttributes(nav.moreBtn, {'aria-expanded': 'false', 'aria-haspopup': 'true', 'aria-controls': nav.dropdown.getAttribute('id')});
    
    // toggle dropdown on click
    nav.moreBtn.addEventListener('click', function(event){
      if( nav.dropdown.contains(event.target) ) return;
			event.preventDefault();
			toggleMoreDropdown(nav, !Util.hasClass(nav.dropdown, nav.dropdownClass), true);
    });

    // keyboard events 
		nav.dropdown.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				navigateItems(nav, event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				navigateItems(nav, event, 'prev');
			}
    });

		window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) { //close dropdown if focus is outside dropdown element
				if (!nav.moreBtn.contains(document.activeElement)) toggleMoreDropdown(nav, false, false);
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {// close menu on 'Esc'
        toggleMoreDropdown(nav, false, false);
			} 
		});
    
    // close menu when clicking outside it
		window.addEventListener('click', function(event){
			if( !nav.moreBtn.contains(event.target)) toggleMoreDropdown(nav, false);
		});
  };

  function resetAdaptNav() { // reset nav appearance
    var totalWidth = getListWidth(this.list),
      moreWidth = getFullWidth(this.moreBtn),
      maxPosition = totalWidth - moreWidth,
      cloneList = '',
      hideAll = false;

    // take care of possible right alignment
    if(this.resetAlignment) Util.removeClass(this.list, 'justify-end');

    cloneList = resetOutrun(this, cloneList, false);
    // loop through items -> create clone (if required) and append to dropdown
    for(var i = 0; i < this.outrunIndex; i++) {
      if( Util.hasClass(this.items[i], 'is-hidden')) {
        Util.addClass(this.items[i], 'adapt-nav__item--hidden');
        Util.removeClass(this.items[i], 'is-hidden');
      }
      var right = this.items[i].offsetWidth + this.items[i].offsetLeft + parseFloat(window.getComputedStyle(this.items[i]).getPropertyValue("margin-right"));
      if(right >= maxPosition || hideAll) {
        var clone = this.items[i].cloneNode(true);
        cloneList = cloneList + modifyClone(clone);
        Util.addClass(this.items[i], 'is-hidden');
        hideAll = true;
      } else {
        Util.removeClass(this.items[i], 'is-hidden');
      }
      Util.removeClass(this.items[i], 'adapt-nav__item--hidden');
    }

    if(this.resetAlignment) Util.addClass(this.list, 'justify-end');

    Util.toggleClass(this.moreBtn, 'adapt-nav__item--hidden', (cloneList == ''));
    this.dropdown.innerHTML = cloneList;
    Util.addClass(this.element, 'adapt-nav--is-visible');
    this.outrunIndex = this.items.length;
    this.resizing = false;
  };

  function resetOutrun(nav, cloneList, bool) {
    if(nav.items[0].offsetLeft < 0 || (bool && nav.outrunIndex > 1)) {
      nav.outrunIndex = nav.outrunIndex - 1;
      var clone = nav.items[nav.outrunIndex].cloneNode(true);
      Util.addClass(nav.items[nav.outrunIndex], 'is-hidden');
      cloneList = modifyClone(clone) + cloneList;
      return resetOutrun(nav, cloneList, bool);
    } else {
      if(bool) nav.outrunIndex = nav.items.length;
      return cloneList;
    }
  };

  function getListWidth(list) { // get total width of container minus right padding
    var style = window.getComputedStyle(list);
    return parseFloat(list.getBoundingClientRect().width) - parseFloat(style.getPropertyValue("padding-right"));
  };

  function getFullWidth(item) { // get width of 'More Links' button
    return parseFloat(window.getComputedStyle(item).getPropertyValue("width"));
  };

  function toggleMoreDropdown(nav, bool, moveFocus) { // toggle menu visibility
    Util.toggleClass(nav.dropdown, nav.dropdownClass, bool);
		if(bool) {
			nav.moreBtn.setAttribute('aria-expanded', 'true');
			Util.moveFocus(nav.dropdownItems[0]);
      nav.dropdown.addEventListener("transitionend", function(event) {Util.moveFocus(nav.dropdownItems[0]);}, {once: true});
      placeDropdown(nav);
		} else {
			nav.moreBtn.setAttribute('aria-expanded', 'false');
      if(moveFocus) Util.moveFocus(nav.moreBtn.getElementsByTagName('button')[0]);
      nav.dropdown.style.right = '';
		}
  };

  function placeDropdown(nav) { // make sure dropdown is visible the viewport
    var dropdownLeft = nav.dropdown.getBoundingClientRect().left;
    if(dropdownLeft < 0) nav.dropdown.style.right = (dropdownLeft - 4)+'px';
  };

  function navigateItems(nav, event, direction) { // navigate through dropdown items
    event.preventDefault();
		var index = Util.getIndexInArray(nav.dropdownItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = nav.dropdownItems.length - 1;
		if(nextIndex > nav.dropdownItems.length - 1) nextIndex = 0;
		Util.moveFocus(nav.dropdownItems[nextIndex]);
  };
  
  function modifyClone(clone) { // assign new classes to cloned elements inside the dropdown
    Util.addClass(clone, 'adapt-nav__dropdown-item');
    Util.removeClass(clone, 'js-adapt-nav__item is-hidden adapt-nav__item--hidden adapt-nav__item');
    var link = clone.getElementsByClassName('adapt-nav__link');
    if(link.length > 0) {
      Util.addClass(link[0], 'adapt-nav__dropdown-link js-tab-focus');
      link[0].style.outline = 'none';
      Util.removeClass(link[0], 'adapt-nav__link');
    }
    return clone.outerHTML;
  };

  //initialize the AdaptNav objects
  var adaptNavs = document.getElementsByClassName('js-adapt-nav'),
    flexSupported = Util.cssSupports('align-items', 'stretch');
	if( adaptNavs.length > 0) {
		for( var i = 0; i < adaptNavs.length; i++) {(function(i){
      if(flexSupported) new AdaptNav(adaptNavs[i]);
      else Util.addClass(adaptNavs[i], 'adapt-nav--is-visible');
    })(i);}
	}
}());
// File#: _1_alert
// Usage: codyhouse.co/license
(function() {
	var alertClose = document.getElementsByClassName('js-alert__close-btn');
	if( alertClose.length > 0 ) {
		for( var i = 0; i < alertClose.length; i++) {
			(function(i){initAlertEvent(alertClose[i]);})(i);
		}
	};
}());

function initAlertEvent(element) {
	element.addEventListener('click', function(event){
		event.preventDefault();
		Util.removeClass(element.closest('.js-alert'), 'alert--is-visible');
	});
};
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
  var backTop = document.getElementsByClassName('js-back-to-top')[0];
  if( backTop ) {
    var dataElement = backTop.getAttribute('data-element');
    var scrollElement = dataElement ? document.querySelector(dataElement) : window;
    var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
      scrollOffsetInit = parseInt(backTop.getAttribute('data-offset-in')) || parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
      scrollOffsetOutInit = parseInt(backTop.getAttribute('data-offset-out')) || 0, 
      scrollOffset = 0,
      scrollOffsetOut = 0,
      scrolling = false;

    // check if target-in/target-out have been set
    var targetIn = backTop.getAttribute('data-target-in') ? document.querySelector(backTop.getAttribute('data-target-in')) : false,
      targetOut = backTop.getAttribute('data-target-out') ? document.querySelector(backTop.getAttribute('data-target-out')) : false;

    updateOffsets();
    
    //detect click on back-to-top link
    backTop.addEventListener('click', function(event) {
      event.preventDefault();
      if(!window.requestAnimationFrame) {
        scrollElement.scrollTo(0, 0);
      } else {
        dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
      } 
      //move the focus to the #top-element - don't break keyboard navigation
      Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
    });
    
    //listen to the window scroll and update back-to-top visibility
    checkBackToTop();
    if (scrollOffset > 0 || scrollOffsetOut > 0) {
      scrollElement.addEventListener("scroll", function(event) {
        if( !scrolling ) {
          scrolling = true;
          (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
        }
      });
    }

    function checkBackToTop() {
      updateOffsets();
      var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
      if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
      var condition =  windowTop >= scrollOffset;
      if(scrollOffsetOut > 0) {
        condition = (windowTop >= scrollOffset) && (window.innerHeight + windowTop < scrollOffsetOut);
      }
      Util.toggleClass(backTop, 'back-to-top--is-visible', condition);
      scrolling = false;
    }

    function updateOffsets() {
      scrollOffset = getOffset(targetIn, scrollOffsetInit, true);
      scrollOffsetOut = getOffset(targetOut, scrollOffsetOutInit);
    }

    function getOffset(target, startOffset, bool) {
      var offset = 0;
      if(target) {
        var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
        if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
        var boundingClientRect = target.getBoundingClientRect();
        offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
        offset = offset + windowTop;
      }
      if(startOffset && startOffset) {
        offset = offset + parseInt(startOffset);
      }
      return offset;
    }
  }
}());
// File#: _1_col-table
// Usage: codyhouse.co/license
(function() {
  var ColTable = function(element) {
    this.element = element;
    this.header = this.element.getElementsByTagName('thead')[0];
    this.body = this.element.getElementsByTagName('tbody')[0];
    this.headerRows = this.header.getElementsByTagName('th');
    this.tableRows = this.body.getElementsByTagName('tr');
    this.collapsedLayoutClass = 'cl-table--collapsed';
    this.mainColCellClass = 'cl-table__th-inner';
    initTable(this);
  };

  function initTable(table) {
    // create additional table content + set table roles
    addTableContent(table);
    setTableRoles(table);

    // custom event emitted when window is resized
    table.element.addEventListener('update-col-table', function(event){
      checkTableLayour(table);
    });

    // mobile version - listent to click/key enter on the row -> expand it
    table.element.addEventListener('click', function(event){
      revealColDetails(table, event);
    });
    table.element.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        revealColDetails(table, event);
      }
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table.element, table.collapsedLayoutClass, layout != 'expanded');
  };

  function addTableContent(table) {
    // for the collapsed version, add a ul with list of details for each table column heading
    var content = [];
    for(var i = 0; i < table.tableRows.length; i++) {
      var cells = table.tableRows[i].getElementsByClassName('cl-table__cell');
      for(var j = 1; j < cells.length; j++) {
        if( i == 0) content[j] = '';
        content[j] = content[j] + '<li class="cl-table__item"><span class="cl-table__label">'+cells[0].innerHTML+':</span><span>'+cells[j].innerHTML+'</span></li>';
      }
    }
    // append new content to each col th
    for(var j = 1; j < table.headerRows.length; j++) {
      var colContent = '<input type="text" class="cl-table__input" aria-hidden="true"><span class="cl-table__th-inner">'+table.headerRows[j].innerHTML+'<i class="cl-table__th-icon" aria-hidden="true"></i></span><ul class="cl-table__list" aria-hidden="true">'+content[j]+'</ul>';
      table.headerRows[j].innerHTML = colContent;
      Util.addClass(table.headerRows[j], 'js-'+table.mainColCellClass);
    }
  };

  function setTableRoles(table) {
    var trElements = table.header.getElementsByTagName('tr');
    for(var i=0; i < trElements.length; i++) {
      trElements[i].setAttribute('role', 'row');
    }
    var thElements = table.header.getElementsByTagName('th');
    for(var i=0; i < thElements.length; i++) {
      thElements[i].setAttribute('role', 'cell');
    }
  };

  function revealColDetails(table, event) {
    var col = event.target.closest('.js-'+table.mainColCellClass);
    if(!col || event.target.closest('.cl-table__list')) return;
    Util.toggleClass(col, 'cl-table__cell--show-list', !Util.hasClass(col, 'cl-table__cell--show-list'));
  };

  //initialize the ColTable objects
	var colTables = document.getElementsByClassName('js-cl-table');
	if( colTables.length > 0 ) {
    var j = 0,
    colTablesArray = [];
		for( var i = 0; i < colTables.length; i++) {
      var beforeContent = getComputedStyle(colTables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){colTablesArray.push(new ColTable(colTables[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-col-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < colTablesArray.length; i++) {
          (function(i){colTablesArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
	}
}());
// File#: _1_color-swatches
// Usage: codyhouse.co/license
(function() {
  var ColorSwatches = function(element) {
    this.element = element;
    this.select = false;
    initCustomSelect(this); // replace <select> with custom <ul> list
    this.list = this.element.getElementsByClassName('js-color-swatches__list')[0];
    this.swatches = this.list.getElementsByClassName('js-color-swatches__option');
    this.labels = this.list.getElementsByClassName('js-color-swatch__label');
    this.selectedLabel = this.element.getElementsByClassName('js-color-swatches__color');
    this.focusOutId = false;
    initColorSwatches(this);
  };

  function initCustomSelect(element) {
    var select = element.element.getElementsByClassName('js-color-swatches__select');
    if(select.length == 0) return;
    element.select = select[0];
    var customContent = '';
    for(var i = 0; i < element.select.options.length; i++) {
      var ariaChecked = i == element.select.selectedIndex ? 'true' : 'false',
        customClass = i == element.select.selectedIndex ? ' color-swatches__item--selected' : '',
        customAttributes = getSwatchCustomAttr(element.select.options[i]);
      customContent = customContent + '<li class="color-swatches__item js-color-swatches__item'+customClass+'" role="radio" aria-checked="'+ariaChecked+'" data-value="'+element.select.options[i].value+'"><span class="js-color-swatches__option js-tab-focus" tabindex="0"'+customAttributes+'><span class="sr-only js-color-swatch__label">'+element.select.options[i].text+'</span><span aria-hidden="true" style="'+element.select.options[i].getAttribute('data-style')+'" class="color-swatches__swatch"></span></span></li>';
    }

    var list = document.createElement("ul");
    Util.setAttributes(list, {'class': 'color-swatches__list js-color-swatches__list', 'role': 'radiogroup'});

    list.innerHTML = customContent;
    element.element.insertBefore(list, element.select);
    Util.addClass(element.select, 'is-hidden');
  };

  function initColorSwatches(element) {
    // detect focusin/focusout event - update selected color label
    element.list.addEventListener('focusin', function(event){
      if(element.focusOutId) clearTimeout(element.focusOutId);
      updateSelectedLabel(element, document.activeElement);
    });
    element.list.addEventListener('focusout', function(event){
      element.focusOutId = setTimeout(function(){
        resetSelectedLabel(element);
      }, 200);
    });

    // mouse move events
    for(var i = 0; i < element.swatches.length; i++) {
      handleHoverEvents(element, i);
    }

    // --select variation only
    if(element.select) {
      // click event - select new option
      element.list.addEventListener('click', function(event){
        // update selected option
        resetSelectedOption(element, event.target);
      });

      // space key - select new option
      element.list.addEventListener('keydown', function(event){
        if( (event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') || (event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter')) {
          // update selected option
          resetSelectedOption(element, event.target);
        }
      });
    }
  };

  function handleHoverEvents(element, index) {
    element.swatches[index].addEventListener('mouseenter', function(event){
      updateSelectedLabel(element, element.swatches[index]);
    });
    element.swatches[index].addEventListener('mouseleave', function(event){
      resetSelectedLabel(element);
    });
  };

  function resetSelectedOption(element, target) { // for --select variation only - new option selected
    var option = target.closest('.js-color-swatches__item');
    if(!option) return;
    var selectedSwatch =  element.list.querySelector('.color-swatches__item--selected');
    if(selectedSwatch) {
      Util.removeClass(selectedSwatch, 'color-swatches__item--selected');
      selectedSwatch.setAttribute('aria-checked', 'false');
    }
    Util.addClass(option, 'color-swatches__item--selected');
    option.setAttribute('aria-checked', 'true');
    // update select element
    updateNativeSelect(element.select, option.getAttribute('data-value'));
  };

  function resetSelectedLabel(element) {
    var selectedSwatch =  element.list.getElementsByClassName('color-swatches__item--selected');
    if(selectedSwatch.length > 0 ) updateSelectedLabel(element, selectedSwatch[0]);
  };

  function updateSelectedLabel(element, swatch) {
    var newLabel = swatch.getElementsByClassName('js-color-swatch__label');
    if(newLabel.length == 0 ) return;
    element.selectedLabel[0].textContent = newLabel[0].textContent;
  };

  function updateNativeSelect(select, value) {
		for (var i = 0; i < select.options.length; i++) {
			if (select.options[i].value == value) {
				select.selectedIndex = i; // set new value
				select.dispatchEvent(new CustomEvent('change')); // trigger change event
				break;
			}
		}
  };
  
  function getSwatchCustomAttr(swatch) {
    var customAttrArray = swatch.getAttribute('data-custom-attr');
    if(!customAttrArray) return '';
    var customAttr = ' ',
      list = customAttrArray.split(',');
    for(var i = 0; i < list.length; i++) {
      var attr = list[i].split(':')
      customAttr = customAttr + attr[0].trim()+'="'+attr[1].trim()+'" ';
    }
    return customAttr;
  };

  //initialize the ColorSwatches objects
	var swatches = document.getElementsByClassName('js-color-swatches');
	if( swatches.length > 0 ) {
    for( var i = 0; i < swatches.length; i++) {
      new ColorSwatches(swatches[i]);
    }
  }
}());
// File#: _1_custom-cursor
// Usage: codyhouse.co/license
(function() {
  var CustomCursor = function(element) {
    this.element = element;
    this.targets = document.querySelectorAll('[data-custom-cursor="'+this.element.getAttribute('id')+'"]');
    this.target = false;
    this.moving = false;

    // cursor classes
    this.inClass = 'c-cursor--in';
    this.outClass = 'c-cursor--out';
    this.positionClass = 'c-cursor--';
  
    initCustomCursor(this);
  };

  function initCustomCursor(obj) {
    if(obj.targets.length == 0) return;
    // init events
    for( var i = 0; i < obj.targets.length; i++) {
      (function(i){
        obj.targets[i].addEventListener('mouseenter', handleEvent.bind(obj));
      })(i);
    }
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mouseenter': {
        initMouseEnter(this, event);
        break;
      }
      case 'mouseleave': {
        initMouseLeave(this, event);
        break;
      }
      case 'mousemove': {
        initMouseMove(this, event);
        break;
      }
    }
  };

  function initMouseEnter(obj, event) {
    removeTargetEvents(obj);
    obj.target = event.currentTarget;
    // listen for move and leave events
    obj.target.addEventListener('mousemove', handleEvent.bind(obj));
    obj.target.addEventListener('mouseleave', handleEvent.bind(obj));
    // show custom cursor
    toggleCursor(obj, true);
  };

  function initMouseLeave(obj, event) {
    removeTargetEvents(obj);
    toggleCursor(obj, false);
    if(obj.moving) {
      window.cancelAnimationFrame(obj.moving);
      obj.moving = false;
    }
  };

  function removeTargetEvents(obj) {
    if(obj.target) {
      obj.target.removeEventListener('mousemove', handleEvent.bind(obj));
		  obj.target.removeEventListener('mouseleave', handleEvent.bind(obj));
      obj.target = false;
    }
  };

  function initMouseMove(obj, event) {
    if(obj.moving) return;
    obj.moving = window.requestAnimationFrame(function(){
      moveCursor(obj, event);
    });
  };

  function moveCursor(obj, event) {
    obj.element.style.transform = 'translateX('+event.clientX+'px) translateY('+event.clientY+'px)';
    // set position classes
    updatePositionClasses(obj, event.clientX, event.clientY);
    obj.moving = false;
  };

  function updatePositionClasses(obj, xposition, yposition) {
    if(!obj.target) return;
    var targetBoundingRect = obj.target.getBoundingClientRect();
    var isLeft = xposition < (targetBoundingRect.left + targetBoundingRect.width/2),
      isTop = yposition < (targetBoundingRect.top + targetBoundingRect.height/2);

    // reset classes
    Util.toggleClass(obj.element, obj.positionClass+'left', isLeft);
    Util.toggleClass(obj.element, obj.positionClass+'right', !isLeft);
    Util.toggleClass(obj.element, obj.positionClass+'top', isTop);
    Util.toggleClass(obj.element, obj.positionClass+'bottom', !isTop);
  };

  function toggleCursor(obj, bool) {
    Util.toggleClass(obj.element, obj.outClass, !bool);
    Util.toggleClass(obj.element, obj.inClass, bool);
  };

  window.CustomCursor = CustomCursor;

  var cCursor = document.getElementsByClassName('js-c-cursor');
  if( cCursor.length > 0 && !Util.osHasReducedMotion()) {
    for( var i = 0; i < cCursor.length; i++) {
      (function(i){new CustomCursor(cCursor[i]);})(i);
    }
  }
}());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function() {
  // NOTE: you need the js code when using the --custom-dropdown/--minimal variation of the Custom Select component. Default version does nor require JS.
  
  var CustomSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.selectedOption = getSelectedOptionText(this);
    this.selectId = this.select.getAttribute('id');
    this.trigger = false;
    this.dropdown = false;
    this.customOptions = false;
    this.arrowIcon = this.element.getElementsByTagName('svg');
    this.label = document.querySelector('[for="'+this.selectId+'"]');

    this.optionIndex = 0; // used while building the custom dropdown

    initCustomSelect(this); // init markup
    initCustomSelectEvents(this); // init event listeners
  };
  
  function initCustomSelect(select) {
    // create the HTML for the custom dropdown element
    select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));
    
    // save custom elements
    select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
    select.trigger = select.element.getElementsByClassName('js-select__button')[0];
    select.customOptions = select.dropdown.getElementsByClassName('js-select__item');
    
    // hide default select
    Util.addClass(select.select, 'is-hidden');
    if(select.arrowIcon.length > 0 ) select.arrowIcon[0].style.display = 'none';

    // place dropdown
    placeDropdown(select);
  };

  function initCustomSelectEvents(select) {
    // option selection in dropdown
    initSelection(select);

    // click events
    select.trigger.addEventListener('click', function(){
      toggleCustomSelect(select, false);
    });
    if(select.label) {
      // move focus to custom trigger when clicking on <select> label
      select.label.addEventListener('click', function(){
        Util.moveFocus(select.trigger);
      });
    }
    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      }
    });
    // native <select> element has been updated -> update custom select as well
    select.element.addEventListener('select-updated', function(event){
      resetCustomSelect(select);
    });
  };

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
    if(bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    }
    select.trigger.setAttribute('aria-expanded', ariaExpanded);
    if(ariaExpanded == 'true') {
      var selectedOption = getSelectedOption(select);
      Util.moveFocus(selectedOption); // fallback if transition is not supported
      select.dropdown.addEventListener('transitionend', function cb(){
        Util.moveFocus(selectedOption);
        select.dropdown.removeEventListener('transitionend', cb);
      });
      placeDropdown(select); // place dropdown based on available space
    }
  };

  function placeDropdown(select) {
    // remove placement classes to reset position
    Util.removeClass(select.dropdown, 'select__dropdown--right select__dropdown--up');
    var triggerBoundingRect = select.trigger.getBoundingClientRect();
    Util.toggleClass(select.dropdown, 'select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
    // check if there's enough space up or down
    var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
    Util.toggleClass(select.dropdown, 'select__dropdown--up', moveUp);
    // check if we need to set a max width
    var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
    // set max-height based on available space
    select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px; width: '+triggerBoundingRect.width+'px;');
  };

  function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
    event.preventDefault();
    var index = Util.getIndexInArray(select.customOptions, document.activeElement);
    index = (direction == 'next') ? index + 1 : index - 1;
    if(index < 0) index = select.customOptions.length - 1;
    if(index >= select.customOptions.length) index = 0;
    Util.moveFocus(select.customOptions[index]);
  };

  function initSelection(select) { // option selection
    select.dropdown.addEventListener('click', function(event){
      var option = event.target.closest('.js-select__item');
      if(!option) return;
      selectOption(select, option);
    });
  };
  
  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
      select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
      option.setAttribute('aria-selected', 'true');
      select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
      select.trigger.setAttribute('aria-expanded', 'false');
      // new option has been selected -> update native <select> element _ arai-label of trigger <button>
      updateNativeSelect(select, option.getAttribute('data-index'));
      updateTriggerAria(select); 
    }
    // move focus back to trigger
    select.trigger.focus();
  };

  function updateNativeSelect(select, index) {
    select.select.selectedIndex = index;
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
  };

  function updateTriggerAria(select) {
    select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent);
  };

  function getSelectedOptionText(select) {// used to initialize the label of the custom select button
    var label = '';
    if('selectedIndex' in select.select) {
      label = select.options[select.select.selectedIndex].text;
    } else {
      label = select.select.querySelector('option[selected]').text;
    }
    return label;

  };
  
  function initButtonSelect(select) { // create the button element -> custom select trigger
    // check if we need to add custom classes to the button trigger
    var customClasses = select.element.getAttribute('data-trigger-class') ? ' '+select.element.getAttribute('data-trigger-class') : '';

    var label = select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent;
  
    var button = '<button type="button" class="js-select__button select__button'+customClasses+'" aria-label="'+label+'" aria-expanded="false" aria-controls="'+select.selectId+'-dropdown"><span aria-hidden="true" class="js-select__label select__label">'+select.selectedOption+'</span>';
    if(select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
      var clone = select.arrowIcon[0].cloneNode(true);
      Util.removeClass(clone, 'select__icon');
      button = button +clone.outerHTML;
    }
    
    return button+'</button>';

  };

  function initListSelect(select) { // create custom select dropdown
    var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="'+select.selectId+'-description" id="'+select.selectId+'-dropdown">';
    list = list + getSelectLabelSR(select);
    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName('option'),
          optGroupLabel = '<li><span class="select__item select__item--optgroup">'+select.optGroups[i].getAttribute('label')+'</span></li>';
        list = list + '<ul class="select__list" role="listbox">'+optGroupLabel+getOptionsList(select, optGroupList) + '</ul>';
      }
    } else {
      list = list + '<ul class="select__list" role="listbox">'+getOptionsList(select, select.options) + '</ul>';
    }
    return list;
  };

  function getSelectLabelSR(select) {
    if(select.label) {
      return '<p class="sr-only" id="'+select.selectId+'-description">'+select.label.textContent+'</p>'
    } else {
      return '';
    }
  };
  
  function resetCustomSelect(select) {
    // <select> element has been updated (using an external control) - update custom select
    var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
    if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
    var option = select.dropdown.querySelector('.js-select__item[data-index="'+select.select.selectedIndex+'"]');
    option.setAttribute('aria-selected', 'true');
    select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
    select.trigger.setAttribute('aria-expanded', 'false');
    updateTriggerAria(select); 
  };

  function getOptionsList(select, options) {
    var list = '';
    for(var i = 0; i < options.length; i++) {
      var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"',
        disabled = options[i].hasAttribute('disabled') ? ' disabled' : '';
      list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="'+options[i].value+'" '+selected+disabled+' data-index="'+select.optionIndex+'">'+options[i].text+'</button></li>';
      select.optionIndex = select.optionIndex + 1;
    };
    return list;
  };

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if(option) return option;
    else return select.dropdown.getElementsByClassName('js-select__item')[0];
  };

  function moveFocusToSelectTrigger(select) {
    if(!document.activeElement.closest('.js-select')) return
    select.trigger.focus();
  };
  
  function checkCustomSelectClick(select, target) { // close select when clicking outside it
    if( !select.element.contains(target) ) toggleCustomSelect(select, 'false');
  };
  
  //initialize the CustomSelect objects
  var customSelect = document.getElementsByClassName('js-select');
  if( customSelect.length > 0 ) {
    var selectArray = [];
    for( var i = 0; i < customSelect.length; i++) {
      (function(i){selectArray.push(new CustomSelect(customSelect[i]));})(i);
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close custom select on 'Esc'
        selectArray.forEach(function(element){
          moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
          toggleCustomSelect(element, 'false'); // close dropdown
        });
      } 
    });
    // close custom select when clicking outside it
    window.addEventListener('click', function(event){
      selectArray.forEach(function(element){
        checkCustomSelectClick(element, event.target);
      });
    });
  }
}());
// File#: _1_diagonal-movement
// Usage: codyhouse.co/license
/*
  Modified version of the jQuery-menu-aim plugin
  https://github.com/kamens/jQuery-menu-aim
  - Replaced jQuery with Vanilla JS
  - Minor changes
*/
(function() {
  var menuAim = function(opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend({
        menu: '',
        rows: false, //if false, get direct children - otherwise pass nodes list 
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: function(){},
        exit: function(){},
        activate: function(){},
        deactivate: function(){},
        exitMenu: function(){}
      }, opts),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mouseMoveFallback = function(event) {
      (!window.requestAnimationFrame) ? mousemoveDocument(event) : window.requestAnimationFrame(function(){mousemoveDocument(event);});
    };

    var mousemoveDocument = function(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
    mouseleaveRow = function() {
      options.exit(this);
    };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };  

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
      };

      var offset = getOffset(menu),
          upperLeft = {
              x: offset.left,
              y: offset.top - options.tolerance
          },
          upperRight = {
              x: offset.left + menu.offsetWidth,
              y: upperLeft.y
          },
          lowerLeft = {
              x: offset.left,
              y: offset.top + menu.offsetHeight + options.tolerance
          },
          lowerRight = {
              x: offset.left + menu.offsetWidth,
              y: lowerLeft.y
          },
          loc = mouseLocs[mouseLocs.length - 1],
          prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    var reset = function(triggerDeactivate) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (activeRow && triggerDeactivate) {
        options.deactivate(activeRow);
      }

      activeRow = null;
    };

    var destroyInstance = function() {
      menu.removeEventListener('mouseleave', mouseleaveMenu);  
      document.removeEventListener('mousemove', mouseMoveFallback);
      if(rows.length > 0) {
        for(var i = 0; i < rows.length; i++) {
          rows[i].removeEventListener('mouseenter', mouseenterRow);  
          rows[i].removeEventListener('mouseleave', mouseleaveRow);
          rows[i].removeEventListener('click', clickRow);  
        }
      }
      
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener('mouseleave', mouseleaveMenu);  
    var rows = (options.rows) ? options.rows : menu.children;
    if(rows.length > 0) {
      for(var i = 0; i < rows.length; i++) {(function(i){
        rows[i].addEventListener('mouseenter', mouseenterRow);  
        rows[i].addEventListener('mouseleave', mouseleaveRow);
        rows[i].addEventListener('click', clickRow);  
      })(i);}
    }

    document.addEventListener('mousemove', mouseMoveFallback);

    /* Reset/destroy menu */
    menu.addEventListener('reset', function(event){
      reset(event.detail);
    });
    menu.addEventListener('destroy', destroyInstance);
  };
}());


// File#: _1_expandable-table
// Usage: codyhouse.co/license
(function() {
  var ExTable = function(element) {
    this.element = element;
    this.rows = this.element.getElementsByClassName('js-ex-table__body')[0].getElementsByTagName('tr');
    this.layout = '';
    getTableLayout(this);
    initTable(this);
  };

  function initTable(table) {
    // init aria-expanded attributes for 'More' buttons
    var moreButtons = table.element.getElementsByClassName('js-ex-table__btn');
    for(var i = 0; i < moreButtons.length; i++) {
      var rowExpanded = moreButtons[i].closest('.ex-table__row--show-more-content') ? true : false;
      moreButtons[i].setAttribute('aria-expanded', rowExpanded);
    }
    
    // custom event emitted when window is resized
    table.element.addEventListener('update-table', function(event){
      checkTableLayout(table);
      resetTableStyle(table);
    });

    // detect click on more Button - toggle additional table content
    table.element.addEventListener('click', function(event){
      var button = event.target.closest('.js-ex-table__btn');
      if(!button) return;
      var tableRow = button.parentNode.parentNode,
        showMore = !Util.hasClass(tableRow, 'ex-table__row--show-more-content');
      Util.toggleClass(tableRow, 'ex-table__row--show-more-content', showMore);
      button.setAttribute('aria-expanded', showMore);
      if(!showMore) resetRowStyle(table, tableRow, showMore);
      resetTableStyle(table);
    });
  };

  function getTableLayout(table) {
    table.layout = getComputedStyle(table.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
  };

  function checkTableLayout(table) { // check table layout
    getTableLayout(table);
    Util.toggleClass(table.element, tableExpandedLayoutClass, table.layout != 'collapsed');
    Util.addClass(table.element, 'ex-table--loaded');
  };

  function resetTableStyle(table) { // update table style according to layout
    for(var i = 0; i < table.rows.length; i++) {
      if( Util.hasClass(table.rows[i], 'ex-table__row--show-more-content')) {
        resetRowStyle(table, table.rows[i], true);
      }
    }
  };

  function resetRowStyle(table, row, showBool) {
    var content = row.getElementsByClassName('js-ex-table__more-content');
    if(content.length== 0 ) return;
    if(table.layout == 'expanded') {
      resetExpandedRowStyle(table, row, content[0], showBool);
    } else {
      resetCompressedRowStyle(row, content[0]);
    }
  };

  function resetExpandedRowStyle(table, row, content, showBool) {
    // row style applied when table layout is expanded
    if(showBool) {
      var offsetHeight = content.offsetHeight,
        cells = row.children;
      for(var i = 0; i < cells.length; i++) {
        cells[i].setAttribute('style', 'border-bottom-width:'+offsetHeight+'px;');
      }
      content.setAttribute('style', 'top: '+parseFloat(row.offsetHeight + row.offsetTop - offsetHeight)+'px;');
    } else {
      resetCompressedRowStyle(row, content);
    }
  };

  function resetCompressedRowStyle(row, content) {
    // row style applied when table layout is compressed
    content.removeAttribute('style');
    var cells = row.children;
    for(var i = 0; i < cells.length; i++) {
      cells[i].removeAttribute('style');
    }
  };

  var tables = document.getElementsByClassName('js-ex-table'),
    tableExpandedLayoutClass = 'ex-table--expanded';
  if( tables.length > 0 ) {
    var j = 0,
      arrayTables = [];
    for( var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){ arrayTables.push(new ExTable(tables[i]));})(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], 'ex-table--loaded');
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-table');
      window.addEventListener('resize', function(event){ // update table layout on resize
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < arrayTables.length; i++) {
          (function(i){arrayTables[i].element.dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init tables
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
}());
// File#: _1_filter
// Usage: codyhouse.co/license

(function() {
  var Filter = function(opts) {
    this.options = Util.extend(Filter.defaults , opts); // used to store custom filter/sort functions
    this.element = this.options.element;
    this.elementId = this.element.getAttribute('id');
    this.items = this.element.querySelectorAll('.js-filter__item');
    this.controllers = document.querySelectorAll('[aria-controls="'+this.elementId+'"]'); // controllers wrappers
    this.fallbackMessage = document.querySelector('[data-fallback-gallery-id="'+this.elementId+'"]');
    this.filterString = []; // combination of different filter values
    this.sortingString = '';  // sort value - will include order and type of argument (e.g., number or string)
    // store info about sorted/filtered items
    this.filterList = []; // list of boolean for each this.item -> true if still visible , otherwise false
    this.sortingList = []; // list of new ordered this.item -> each element is [item, originalIndex]
    
    // store grid info for animation
    this.itemsGrid = []; // grid coordinates
    this.itemsInitPosition = []; // used to store coordinates of this.items before animation
    this.itemsIterPosition = []; // used to store coordinates of this.items before animation - intermediate state
    this.itemsFinalPosition = []; // used to store coordinates of this.items after filtering
    
    // animation off
    this.animateOff = this.element.getAttribute('data-filter-animation') == 'off';
    // used to update this.itemsGrid on resize
    this.resizingId = false;
    // default acceleration style - improve animation
    this.accelerateStyle = 'will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;';

    // handle multiple changes
    this.animating = false;
    this.reanimate = false;

    initFilter(this);
  };

  function initFilter(filter) {
    resetFilterSortArray(filter, true, true); // init array filter.filterList/filter.sortingList
    createGridInfo(filter); // store grid coordinates in filter.itemsGrid
    initItemsOrder(filter); // add data-orders so that we can reset the sorting

    // events handling - filter update
    for(var i = 0; i < filter.controllers.length; i++) {
      filter.filterString[i] = ''; // reset filtering

      // get proper filter/sorting string based on selected controllers
      (function(i){
        filter.controllers[i].addEventListener('change', function(event) {  
          if(event.target.tagName.toLowerCase() == 'select') { // select elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.value, event.target.options[event.target.selectedIndex])
              : setFilterString(filter, i, 'select');
          } else if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'radio' || event.target.getAttribute('type') == 'checkbox') ) { // input (radio/checkboxed) elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.getAttribute('data-sort'), event.target)
              : setFilterString(filter, i, 'input');
          } else {
            // generic inout element
            (!filter.controllers[i].getAttribute('data-filter'))
              ? setSortingString(filter, filter.controllers[i].getAttribute('data-sort'), filter.controllers[i])
              : setFilterString(filter, i, 'custom');
          }

          updateFilterArray(filter);
        });

        filter.controllers[i].addEventListener('click', function(event) { // retunr if target is select/input elements
          var filterEl = event.target.closest('[data-filter]');
          var sortEl = event.target.closest('[data-sort]');
          if(!filterEl && !sortEl) return;
          if(filterEl && ( filterEl.tagName.toLowerCase() == 'input' || filterEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && (sortEl.tagName.toLowerCase() == 'input' || sortEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && Util.hasClass(sortEl, 'js-filter__custom-control')) return;
          if(filterEl && Util.hasClass(filterEl, 'js-filter__custom-control')) return;
          // this will be executed only for a list of buttons -> no inputs
          event.preventDefault();
          resetControllersList(filter, i, filterEl, sortEl);
          sortEl 
            ? setSortingString(filter, sortEl.getAttribute('data-sort'), sortEl)
            : setFilterString(filter, i, 'button');
          updateFilterArray(filter);
        });

        // target search inputs -> update them on 'input'
        filter.controllers[i].addEventListener('input', function(event) {
          if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'search' || event.target.getAttribute('type') == 'text') ) {
            setFilterString(filter, i, 'custom');
            updateFilterArray(filter);
          }
        });
      })(i);
    }

    // handle resize - update grid coordinates in filter.itemsGrid
    window.addEventListener('resize', function() {
      clearTimeout(filter.resizingId);
      filter.resizingId = setTimeout(function(){createGridInfo(filter)}, 300);
    });

    // check if there are filters/sorting values already set
    checkInitialFiltering(filter);

    // reset filtering results if filter selection was changed by an external control (e.g., form reset) 
    filter.element.addEventListener('update-filter-results', function(event){
      // reset filters first
      for(var i = 0; i < filter.controllers.length; i++) filter.filterString[i] = '';
      filter.sortingString = '';
      checkInitialFiltering(filter);
    });
  };

  function checkInitialFiltering(filter) {
    for(var i = 0; i < filter.controllers.length; i++) { // check if there's a selected option
      // buttons list
      var selectedButton = filter.controllers[i].getElementsByClassName('js-filter-selected');
      if(selectedButton.length > 0) {
        var sort = selectedButton[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, selectedButton[0].getAttribute('data-sort'), selectedButton[0])
          : setFilterString(filter, i, 'button');
        continue;
      }

      // input list
      var selectedInput = filter.controllers[i].querySelectorAll('input:checked');
      if(selectedInput.length > 0) {
        var sort = selectedInput[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, sort, selectedInput[0])
          : setFilterString(filter, i, 'input');
        continue;
      }
      // select item
      if(filter.controllers[i].tagName.toLowerCase() == 'select') {
        var sort = filter.controllers[i].getAttribute('data-sort');
        sort
          ? setSortingString(filter, filter.controllers[i].value, filter.controllers[i].options[filter.controllers[i].selectedIndex])
          : setFilterString(filter, i, 'select');
         continue;
      }
      // check if there's a generic custom input
      var radioInput = filter.controllers[i].querySelector('input[type="radio"]'),
        checkboxInput = filter.controllers[i].querySelector('input[type="checkbox"]');
      if(!radioInput && !checkboxInput) {
        var sort = filter.controllers[i].getAttribute('data-sort');
        var filterString = filter.controllers[i].getAttribute('data-filter');
        if(sort) setSortingString(filter, sort, filter.controllers[i]);
        else if(filterString) setFilterString(filter, i, 'custom');
      }
    }

    updateFilterArray(filter);
  };

  function setSortingString(filter, value, item) { 
    // get sorting string value-> sortName:order:type
    var order = item.getAttribute('data-sort-order') ? 'desc' : 'asc';
    var type = item.getAttribute('data-sort-number') ? 'number' : 'string';
    filter.sortingString = value+':'+order+':'+type;
  };

  function setFilterString(filter, index, type) { 
    // get filtering array -> [filter1:filter2, filter3, filter4:filter5]
    if(type == 'input') {
      var checkedInputs = filter.controllers[index].querySelectorAll('input:checked');
      filter.filterString[index] = '';
      for(var i = 0; i < checkedInputs.length; i++) {
        filter.filterString[index] = filter.filterString[index] + checkedInputs[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'select') {
      if(filter.controllers[index].multiple) { // select with multiple options
        filter.filterString[index] = getMultipleSelectValues(filter.controllers[index]);
      } else { // select with single option
        filter.filterString[index] = filter.controllers[index].value;
      }
    } else if(type == 'button') {
      var selectedButtons = filter.controllers[index].querySelectorAll('.js-filter-selected');
      filter.filterString[index] = '';
      for(var i = 0; i < selectedButtons.length; i++) {
        filter.filterString[index] = filter.filterString[index] + selectedButtons[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'custom') {
      filter.filterString[index] = filter.controllers[index].getAttribute('data-filter');
    }
  };

  function resetControllersList(filter, index, target1, target2) {
    // for a <button>s list -> toggle js-filter-selected + custom classes
    var multi = filter.controllers[index].getAttribute('data-filter-checkbox'),
      customClass = filter.controllers[index].getAttribute('data-selected-class');
    
    customClass = (customClass) ? 'js-filter-selected '+ customClass : 'js-filter-selected';
    if(multi == 'true') { // multiple options can be on
      (target1) 
        ? Util.toggleClass(target1, customClass, !Util.hasClass(target1, 'js-filter-selected'))
        : Util.toggleClass(target2, customClass, !Util.hasClass(target2, 'js-filter-selected'));
    } else { // only one element at the time
      // remove the class from all siblings
      var selectedOption = filter.controllers[index].querySelector('.js-filter-selected');
      if(selectedOption) Util.removeClass(selectedOption, customClass);
      (target1) 
        ? Util.addClass(target1, customClass)
        : Util.addClass(target2, customClass);
    }
  };

  function updateFilterArray(filter) { // sort/filter strings have been updated -> so you can update the gallery
    if(filter.animating) {
      filter.reanimate = true;
      return;
    }
    filter.animating = true;
    filter.reanimate = false;
    createGridInfo(filter); // get new grid coordinates
    sortingGallery(filter); // update sorting list 
    filteringGallery(filter); // update filter list
    resetFallbackMessage(filter, true); // toggle fallback message
    if(reducedMotion || filter.animateOff) {
      resetItems(filter);
    } else {
      updateItemsAttributes(filter);
    }
  };

  function sortingGallery(filter) {
    // use sorting string to reorder gallery
    var sortOptions = filter.sortingString.split(':');
    if(sortOptions[0] == '' || sortOptions[0] == '*') {
      // no sorting needed
      restoreSortOrder(filter);
    } else { // need to sort
      if(filter.options[sortOptions[0]]) { // custom sort function -> user takes care of it
        filter.sortingList = filter.options[sortOptions[0]](filter.sortingList);
      } else {
        filter.sortingList.sort(function(left, right) {
          var leftVal = left[0].getAttribute('data-sort-'+sortOptions[0]),
          rightVal = right[0].getAttribute('data-sort-'+sortOptions[0]);
          if(sortOptions[2] == 'number') {
            leftVal = parseFloat(leftVal);
            rightVal = parseFloat(rightVal);
          }
          if(sortOptions[1] == 'desc') return leftVal <= rightVal ? 1 : -1;
          else return leftVal >= rightVal ? 1 : -1;
        });
      }
    }
  };

  function filteringGallery(filter) {
    // use filtering string to reorder gallery
    resetFilterSortArray(filter, true, false);
    // we can have multiple filters
    for(var i = 0; i < filter.filterString.length; i++) {
      //check if multiple filters inside the same controller
      if(filter.filterString[i] != '' && filter.filterString[i] != '*' && filter.filterString[i] != ' ') {
        singleFilterGallery(filter, filter.filterString[i].split(':'));
      }
    }
  };

  function singleFilterGallery(filter, subfilter) {
    if(!subfilter || subfilter == '' || subfilter == '*') return;
    // check if we have custom options
    var customFilterArray = [];
    for(var j = 0; j < subfilter.length; j++) {
      if(filter.options[subfilter[j]]) { // custom function
        customFilterArray[subfilter[j]] = filter.options[subfilter[j]](filter.items);
      }
    }

    for(var i = 0; i < filter.items.length; i++) {
      var filterValues = filter.items[i].getAttribute('data-filter').split(' ');
      var present = false;
      for(var j = 0; j < subfilter.length; j++) {
        if(filter.options[subfilter[j]] && customFilterArray[subfilter[j]][i]) { // custom function
          present = true;
          break;
        } else if(subfilter[j] == '*' || filterValues.indexOf(subfilter[j]) > -1) {
          present = true;
          break;
        }
      }
      filter.filterList[i] = !present ? false : filter.filterList[i];
    }
  };

  function updateItemsAttributes(filter) { // set items before triggering the update animation
    // get offset of all elements before animation
    storeOffset(filter, filter.itemsInitPosition);
    // set height of container
    filter.element.setAttribute('style', 'height: '+parseFloat(filter.element.offsetHeight)+'px; width: '+parseFloat(filter.element.offsetWidth)+'px;');

    for(var i = 0; i < filter.items.length; i++) { // remove is-hidden class from items now visible and scale to zero
      if( Util.hasClass(filter.items[i], 'is-hidden') && filter.filterList[i]) {
        filter.items[i].setAttribute('data-scale', 'on');
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: scale(0.5); opacity: 0;')
        Util.removeClass(filter.items[i], 'is-hidden');
      }
    }
    // get new elements offset
    storeOffset(filter, filter.itemsIterPosition);
    // translate items so that they are in the right initial position
    for(var i = 0; i < filter.items.length; i++) {
      if( filter.items[i].getAttribute('data-scale') != 'on') {
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: translateX('+parseInt(filter.itemsInitPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsInitPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
      }
    }

    animateItems(filter)
  };

  function animateItems(filter) {
    var transitionValue = 'transform '+filter.options.duration+'ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity '+filter.options.duration+'ms';

    // get new index of items in the list
    var j = 0;
    for(var i = 0; i < filter.sortingList.length; i++) {
      var item = filter.items[filter.sortingList[i][1]];
        
      if(Util.hasClass(item, 'is-hidden') || !filter.filterList[filter.sortingList[i][1]]) {
        // item is hidden or was previously hidden -> final position equal to first one
        filter.itemsFinalPosition[filter.sortingList[i][1]] = filter.itemsIterPosition[filter.sortingList[i][1]];
        if(item.getAttribute('data-scale') == 'on') j = j + 1; 
      } else {
        filter.itemsFinalPosition[filter.sortingList[i][1]] = [filter.itemsGrid[j][0], filter.itemsGrid[j][1]]; // left/top
        j = j + 1; 
      }
    } 

    setTimeout(function(){
      for(var i = 0; i < filter.items.length; i++) {
        if(filter.filterList[i] && filter.items[i].getAttribute('data-scale') == 'on') { // scale up item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px) scale(1); opacity: 1;');
        } else if(filter.filterList[i]) { // translate item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
        } else { // scale down item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: scale(0.5); opacity: 0;');
        }
      };
    }, 50);  
    
    // wait for the end of transition of visible elements
    setTimeout(function(){
      resetItems(filter);
    }, (filter.options.duration + 100));
  };

  function resetItems(filter) {
    // animation was off or animation is over -> reset attributes
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].removeAttribute('style');
      Util.toggleClass(filter.items[i], 'is-hidden', !filter.filterList[i]);
      filter.items[i].removeAttribute('data-scale');
    }
    
    for(var i = 0; i < filter.items.length; i++) {// reorder
      filter.element.appendChild(filter.items[filter.sortingList[i][1]]);
    }

    filter.items = [];
    filter.items = filter.element.querySelectorAll('.js-filter__item');
    resetFilterSortArray(filter, false, true);
    filter.element.removeAttribute('style');
    filter.animating = false;
    if(filter.reanimate) {
      updateFilterArray(filter);
    }

    resetFallbackMessage(filter, false); // toggle fallback message

    // emit custom event - end of filtering
    filter.element.dispatchEvent(new CustomEvent('filter-selection-updated'));
  };

  function resetFilterSortArray(filter, filtering, sorting) {
    for(var i = 0; i < filter.items.length; i++) {
      if(filtering) filter.filterList[i] = true;
      if(sorting) filter.sortingList[i] = [filter.items[i], i];
    }
  };

  function createGridInfo(filter) {
    var containerWidth = parseFloat(window.getComputedStyle(filter.element).getPropertyValue('width')),
      itemStyle, itemWidth, itemHeight, marginX, marginY, colNumber;

    // get offset first visible element
    for(var i = 0; i < filter.items.length; i++) {
      if( !Util.hasClass(filter.items[i], 'is-hidden') ) {
        itemStyle = window.getComputedStyle(filter.items[i]),
        itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
        itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
        marginX = parseFloat(itemStyle.getPropertyValue('margin-left')) + parseFloat(itemStyle.getPropertyValue('margin-right')),
        marginY = parseFloat(itemStyle.getPropertyValue('margin-bottom')) + parseFloat(itemStyle.getPropertyValue('margin-top'));
        if(marginX == 0 && marginY == 0) {
          // grid is set using the gap property and not margins
          var margins = resetMarginValues(filter);
          marginX = margins[0];
          marginY = margins[1];
        }
        var colNumber = parseInt((containerWidth + marginX)/(itemWidth+marginX));
        filter.itemsGrid[0] = [filter.items[i].offsetLeft, filter.items[i].offsetTop]; // left, top
        break;
      }
    }

    for(var i = 1; i < filter.items.length; i++) {
      var x = i < colNumber ? i : i % colNumber,
        y = i < colNumber ? 0 : Math.floor(i/colNumber);
      filter.itemsGrid[i] = [filter.itemsGrid[0][0] + x*(itemWidth+marginX), filter.itemsGrid[0][1] + y*(itemHeight+marginY)];
    }
  };

  function storeOffset(filter, array) {
    for(var i = 0; i < filter.items.length; i++) {
      array[i] = [filter.items[i].offsetLeft, filter.items[i].offsetTop];
    }
  };

  function initItemsOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].setAttribute('data-init-sort-order', i);
    }
  };

  function restoreSortOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.sortingList[parseInt(filter.items[i].getAttribute('data-init-sort-order'))] = [filter.items[i], i];
    }
  };

  function resetFallbackMessage(filter, bool) {
    if(!filter.fallbackMessage) return;
    var show = true;
    for(var i = 0; i < filter.filterList.length; i++) {
      if(filter.filterList[i]) {
        show = false;
        break;
      }
    };
    if(bool) { // reset visibility before animation is triggered
      if(!show) Util.addClass(filter.fallbackMessage, 'is-hidden');
      return;
    }
    Util.toggleClass(filter.fallbackMessage, 'is-hidden', !show);
  };

  function getMultipleSelectValues(multipleSelect) {
    // get selected options of a <select multiple> element
    var options = multipleSelect.options,
      value = '';
    for(var i = 0; i < options.length; i++) {
      if(options[i].selected) {
        if(value != '') value = value + ':';
        value = value + options[i].value;
      }
    }
    return value;
  };

  function resetMarginValues(filter) {
    var gapX = getComputedStyle(filter.element).getPropertyValue('--gap-x'),
      gapY = getComputedStyle(filter.element).getPropertyValue('--gap-y'),
      gap = getComputedStyle(filter.element).getPropertyValue('--gap'),
      gridGap = [0, 0];
    // if the gap property is used to create the grid (not margin left/right) -> get gap values rather than margins
    // check if the --gap/--gap-x/--gap-y
    var newDiv = document.createElement('div'),
      cssText = 'position: absolute; opacity: 0; width: 0px; height: 0px';
    if(gapX && gapY) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: '+gapY;
    } else if(gap) {
      cssText = 'position: absolute; opacity: 0; width: '+gap+'; height: '+gap;
    } else if(gapX) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: 0px';
    } else if(gapY) {
      cssText = 'position: absolute; opacity: 0; width: 0px; height: '+gapY;
    }
    newDiv.style.cssText = cssText;
    filter.element.appendChild(newDiv);
    var boundingRect = newDiv.getBoundingClientRect();
    gridGap = [boundingRect.width, boundingRect.height];
    filter.element.removeChild(newDiv);
    return gridGap;
  };

  Filter.defaults = {
    element : false,
    duration: 400
  };

  window.Filter = Filter;

  // init Filter object
  var filterGallery = document.getElementsByClassName('js-filter'),
    reducedMotion = Util.osHasReducedMotion();
  if( filterGallery.length > 0 ) {
    for( var i = 0; i < filterGallery.length; i++) {
      var duration = filterGallery[i].getAttribute('data-filter-duration');
      if(!duration) duration = Filter.defaults.duration;
      new Filter({element: filterGallery[i], duration: duration});
    }
  }
}());
// File#: _1_image-magnifier
// Usage: codyhouse.co/license

(function() {
  var ImageMagnifier = function(element) {
    this.element = element;
    this.asset = this.element.getElementsByClassName('js-img-mag__asset')[0];
    this.ready = false;
    this.scale = 1;
    this.intervalId = false;
    this.moving = false;
    this.moveEvent = false;
    initImageMagnifier(this);
  };

  function initImageMagnifier(imgMag) {
    // wait for the image to be loaded
    imgMag.asset.addEventListener('load', function(){
      initImageMagnifierMove(imgMag);
    });
    if(imgMag.asset.complete) {
      initImageMagnifierMove(imgMag);
    }
  };

  function initImageMagnifierMove(imgMag) {
    if(imgMag.ready) return;
    imgMag.ready = true;
    initImageMagnifierScale(imgMag); // get image scale
    // listen to mousenter event
    imgMag.element.addEventListener('mouseenter', handleEvent.bind(imgMag));
  };

  function initImageMagnifierScale(imgMag) {
    var customScale = imgMag.element.getAttribute('data-scale');
    if(customScale) { // use custom scale set in HTML
      imgMag.scale = customScale;
    } else { // use natural width of image to get the scale value
      imgMag.scale = imgMag.asset.naturalWidth/imgMag.element.offsetWidth;
      // round to 2 places decimal
      imgMag.scale = Math.floor((imgMag.scale*100))/100;
      if(imgMag.scale > 1.2)  imgMag.scale = imgMag.scale - 0.2;
    }
  };

  function initImageMove(imgMag) { // add move event listeners
    imgMag.moveEvent = handleEvent.bind(imgMag);
    imgMag.element.addEventListener('mousemove', imgMag.moveEvent);
    imgMag.element.addEventListener('mouseleave', imgMag.moveEvent);
  };

  function cancelImageMove(imgMag) { // remove move event listeners
		if(imgMag.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(imgMag.intervalId) : window.cancelAnimationFrame(imgMag.intervalId);
			imgMag.intervalId = false;
    }
    if(imgMag.moveEvent) {
      imgMag.element.removeEventListener('mousemove', imgMag.moveEvent);
      imgMag.element.removeEventListener('mouseleave', imgMag.moveEvent);
      imgMag.moveEvent = false;
    }
  };

  function handleEvent(event) {
		switch(event.type) {
			case 'mouseenter':
				startMove(this, event);
				break;
			case 'mousemove':
				move(this, event);
				break;
			case 'mouseleave':
				endMove(this);
				break;
		}
  };
  
  function startMove(imgMag, event) {
    imgMag.moving = true;
    initImageMove(imgMag); // listen to mousemove event
    zoomImageMagnifier(imgMag, event);
  };

  function move(imgMag, event) {
    if(!imgMag.moving || imgMag.intervalId) return;
    (!window.requestAnimationFrame) 
      ? imgMag.intervalId = setTimeout(function(){zoomImageMagnifier(imgMag, event);}, 250)
      : imgMag.intervalId = window.requestAnimationFrame(function(){zoomImageMagnifier(imgMag, event);});
  };

  function endMove(imgMag) {
    imgMag.moving = false;
    cancelImageMove(imgMag); // remove event listeners
    imgMag.asset.removeAttribute('style'); // reset image style
  };

  function zoomImageMagnifier(imgMag, event) { // zoom effect on mousemove
    var elementRect = imgMag.element.getBoundingClientRect();
    var translateX = (elementRect.left - event.clientX);
    var translateY = (elementRect.top - event.clientY);
    if(translateX > 0) translateX = 0;if(translateX < -1*elementRect.width) translateX = -1*elementRect.width;
    if(translateY > 0) translateY = 0;if(translateY < -1*elementRect.height) translateX = -1*elementRect.height;
    var transform = 'translateX('+translateX*(imgMag.scale - 1)+'px) translateY('+translateY*(imgMag.scale - 1)+'px) scale('+imgMag.scale+')';
    imgMag.asset.setAttribute('style', 'transform: '+transform+';');
    imgMag.intervalId = false;
  };

  // init ImageMagnifier object
  var imageMag = document.getElementsByClassName('js-img-mag');
  if( imageMag.length > 0 ) {
    for( var i = 0; i < imageMag.length; i++) {
      new ImageMagnifier(imageMag[i]);
    }
  }
}());
// File#: _1_main-header
// Usage: codyhouse.co/license
(function() {
	var mainHeader = document.getElementsByClassName('js-header');
	if( mainHeader.length > 0 ) {
		var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
			nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		//detect click on nav trigger
		trigger.addEventListener("click", function(event) {
			event.preventDefault();
			toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'));
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
					focusMenu = trigger; // move focus to menu trigger when menu is close
					trigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(trigger) && Util.hasClass(mainHeader[0], 'header--expanded')) toggleNavigation(false); 
		};
	}

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};

	function toggleNavigation(bool) { // toggle navigation visibility on small device
		Util.toggleClass(nav, 'header__nav--is-visible', bool);
		Util.toggleClass(mainHeader[0], 'header--expanded', bool);
		trigger.setAttribute('aria-expanded', bool);
		if(bool) { //opening menu -> move focus to first element inside nav
			nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
		} else if(focusMenu) {
			focusMenu.focus();
			focusMenu = false;
		}
	};
}());
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
	var Menu = function(element) {
		this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.menuItems = this.element.getElementsByClassName('js-menu__content');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
		this.menuIsOpen = false;
		this.initMenu();
		this.initMenuEvents();
	};	

	Menu.prototype.initMenu = function() {
		// init aria-labels
		for(var i = 0; i < this.trigger.length; i++) {
			Util.setAttributes(this.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
		// init tabindex
		for(var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].setAttribute('tabindex', '0');
		}
	};

	Menu.prototype.initMenuEvents = function() {
		var self = this;
		for(var i = 0; i < this.trigger.length; i++) {(function(i){
			self.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(self.element, 'menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
					self.toggleMenu(false, false); // close menu
				}
				// toggle menu
				self.selectedTrigger = self.trigger[i];
				self.toggleMenu(!Util.hasClass(self.element, 'menu--is-visible'), true);
			});
		})(i);}
		
		// keyboard events
		this.element.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( !Util.hasClass(event.target, 'js-menu__content') ) return;
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				self.navigateItems(event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				self.navigateItems(event, 'prev');
			}
		});
	};

	Menu.prototype.toggleMenu = function(bool, moveFocus) {
		var self = this;
		// toggle menu visibility
		Util.toggleClass(this.element, 'menu--is-visible', bool);
		this.menuIsOpen = bool;
		if(bool) {
			this.selectedTrigger.setAttribute('aria-expanded', 'true');
			Util.moveFocus(this.menuItems[0]);
			this.element.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
			// position the menu element
			this.positionMenu();
			// add class to menu trigger
			Util.addClass(this.selectedTrigger, 'menu-control--active');
		} else if(this.selectedTrigger) {
			this.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(this.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(this.selectedTrigger, 'menu-control--active');
			this.selectedTrigger = false;
		}
	};

	Menu.prototype.positionMenu = function(event, direction) {
		var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
			menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			// menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
		this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};

	Menu.prototype.navigateItems = function(event, direction) {
		event.preventDefault();
		var index = Util.getIndexInArray(this.menuItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
		if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
		Util.moveFocus(this.menuItems[nextIndex]);
	};

	Menu.prototype.checkMenuFocus = function() {
		var menuParent = document.activeElement.closest('.js-menu');
		if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
	};

	Menu.prototype.checkMenuClick = function(target) {
		if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
	};

	window.Menu = Menu;

	//initialize the Menu objects
	var menus = document.getElementsByClassName('js-menu');
	if( menus.length > 0 ) {
		var menusArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < menus.length; i++) {
			(function(i){
				menusArray.push(new Menu(menus[i]));
				var scrollableElement = menus[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
				//close menu if focus is outside menu element
				menusArray.forEach(function(element){
					element.checkMenuFocus();
				});
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close menu on 'Esc'
				menusArray.forEach(function(element){
					element.toggleMenu(false, false);
				});
			} 
		});
		// close menu when clicking outside it
		window.addEventListener('click', function(event){
			menusArray.forEach(function(element){
				element.checkMenuClick(event.target);
			});
		});
		// on resize -> close all menu elements
		window.addEventListener('resize', function(event){
			menusArray.forEach(function(element){
				element.toggleMenu(false, false);
			});
		});
		// on scroll -> close all menu elements
		window.addEventListener('scroll', function(event){
			menusArray.forEach(function(element){
				if(element.menuIsOpen) element.toggleMenu(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					menusArray.forEach(function(element){
						if(element.menuIsOpen) element.toggleMenu(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.target;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		console.log('close')
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	window.Modal = Modal;

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_newsletter-input
// Usage: codyhouse.co/license
(function() {
  var NewsInput = function(opts) {
    this.options = Util.extend(NewsInput.defaults, opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-news-form__input');
    this.button = this.element.getElementsByClassName('js-news-form__btn');
    this.submitting = false;
    initNewsInput(this);
  };

  function initNewsInput(element) {
    if(element.input.length < 1 || element.input.button < 1) return;
    // check email value
    element.input[0].addEventListener('input', function(event){
      // hide success/error messages
      Util.removeClass(element.element, 'news-form--success news-form--error');
      // enable/disable form
      checkEmailFormat(element);
    });

    // animate newsletter when submitting form 
    element.element.addEventListener('submit', function(event){
      event.preventDefault();
      if(element.submitting) return;
      element.submitting = true;
      element.response = false;
      
      // start button animation
      Util.addClass(element.element, 'news-form--loading news-form--circle-loop');
      // at the end of each animation cicle, restart animation if there was no response from the submit function yet
      element.element.addEventListener('animationend', function cb(event){
        if(element.response) { // complete button animation
          element.element.removeEventListener('animationend', cb);
          showResponseMessage(element, element.response);
        } else { // keep loading animation going
          Util.removeClass(element.element, 'news-form--circle-loop');
          element.element.offsetWidth;
          Util.addClass(element.element, 'news-form--circle-loop');
        }
      });
      
      // custom submit function
      element.options.submit(element.input[0].value, function(response){
        element.response = response;
        element.submitting = false;
        if(!animationSupported) showResponseMessage(element, response);
      });
    });
  };

  function showResponseMessage(element, response) {
    Util.removeClass(element.element, 'news-form--loading news-form--circle-loop');
    (response == 'success')
      ? Util.addClass(element.element, 'news-form--success')
      : Util.addClass(element.element, 'news-form--error');
  };

  function checkEmailFormat(element) {
    var email = element.input[0].value;
    var atPosition = email.indexOf("@"),
      dotPosition = email.lastIndexOf("."); 
    var enableForm = (atPosition >= 1 && dotPosition >= atPosition + 2 && dotPosition < email.length - 1);
    if(enableForm) {
      Util.addClass(element.element, 'news-form--enabled');
      element.button[0].removeAttribute('disabled');
    } else {
      Util.removeClass(element.element, 'news-form--enabled');
      element.button[0].setAttribute('disabled', true);
    }
  };

  window.NewsInput = NewsInput;

  NewsInput.defaults = {
    element : '',
    submit: false, // function used to return results
  };

  var animationSupported = Util.cssSupports('animation', 'name');
}());
// File#: _1_number-input
// Usage: codyhouse.co/license
(function() {
	var InputNumber = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('js-number-input__value')[0];
		this.min = parseFloat(this.input.getAttribute('min'));
		this.max = parseFloat(this.input.getAttribute('max'));
		this.step = parseFloat(this.input.getAttribute('step'));
		if(isNaN(this.step)) this.step = 1;
		this.precision = getStepPrecision(this.step);
		initInputNumberEvents(this);
	};

	function initInputNumberEvents(input) {
		// listen to the click event on the custom increment buttons
		input.element.addEventListener('click', function(event){ 
			var increment = event.target.closest('.js-number-input__btn');
			if(increment) {
				event.preventDefault();
				updateInputNumber(input, increment);
			}
		});

		// when input changes, make sure the new value is acceptable
		input.input.addEventListener('focusout', function(event){
			var value = parseFloat(input.input.value);
			if( value < input.min ) value = input.min;
			if( value > input.max ) value = input.max;
			// check value is multiple of step
			value = checkIsMultipleStep(input, value);
			if( value != parseFloat(input.input.value)) input.input.value = value;

		});
	};

	function getStepPrecision(step) {
		// if step is a floating number, return its precision
		return (step.toString().length - Math.floor(step).toString().length - 1);
	};

	function updateInputNumber(input, btn) {
		var value = ( Util.hasClass(btn, 'number-input__btn--plus') ) ? parseFloat(input.input.value) + input.step : parseFloat(input.input.value) - input.step;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		if( value < input.min ) value = input.min;
		if( value > input.max ) value = input.max;
		input.input.value = value;
		input.input.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function checkIsMultipleStep(input, value) {
		// check if the number inserted is a multiple of the step value
		var remain = (value*10*input.precision)%(input.step*10*input.precision);
		if( remain != 0) value = value - remain;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		return value;
	};

	//initialize the InputNumber objects
	var inputNumbers = document.getElementsByClassName('js-number-input');
	if( inputNumbers.length > 0 ) {
		for( var i = 0; i < inputNumbers.length; i++) {
			(function(i){new InputNumber(inputNumbers[i]);})(i);
		}
	}
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });

		// custom events -> open/close popover
		popover.element.addEventListener('openPopover', function(event){
			togglePopover(popover, true);
		});

		popover.element.addEventListener('closePopover', function(event){
			togglePopover(popover, false, event.detail);
		});
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_pre-header
// Usage: codyhouse.co/license
(function() {
	var preHeader = document.getElementsByClassName('js-pre-header');
	if(preHeader.length > 0) {
		for(var i = 0; i < preHeader.length; i++) {
			(function(i){ addPreHeaderEvent(preHeader[i]);})(i);
		}

		function addPreHeaderEvent(element) {
			var close = element.getElementsByClassName('js-pre-header__close-btn')[0];
			if(close) {
				close.addEventListener('click', function(event) {
					event.preventDefault();
					Util.addClass(element, 'pre-header--is-hidden');
				});
			}
		}
	}
}());
// File#: _1_product-tour
// Usage: codyhouse.co/license
(function() {
  var PTour = function(element, bool) {
    this.element = element;
    this.pin = this.element.getElementsByClassName('js-p-tour__pin');
    this.bg = this.element.getElementsByClassName('js-p-tour__background');
    this.steps = this.element.getElementsByClassName('js-p-tour__step');
    this.targets = [];
    this.targetPositions = [];
    this.showPTour = bool;
    this.visibleStep = 0;
    this.isMobile = false;
    this.resizingId = false;
    this.stepTimeout = false;
    // trigger of the entire tour
    this.tourTriggers = document.getElementsByClassName('js-p-tour-start');
    initPTour(this);
  };

  // public methods
  PTour.prototype.show = function() {
    updateLayout(this);
    resetTour(this);
		showTour(this);
	};

  PTour.prototype.hide = function() {
		closeTour(this);
	};

  // private methods
  function initPTour(element) {
    // define position functions
    setPositionFn(element);

    // collect all targets
    collectTargets(element);

    // set layout type
    updateLayout(element);

    // detect click on tour element
    element.element.addEventListener('click', function(event) {
      // check if we need to close tour
      var closeBtn = event.target.closest('.js-p-tour__close');
      if(closeBtn) closeTour(element);

      // check if this was a next/prev button
      var nextStep = event.target.closest('.js-p-tour__btn-next');
      if(nextStep) updateSteps(element, 'next');
      var prevStep = event.target.closest('.js-p-tour__btn-prev');
      if(prevStep) updateSteps(element, 'prev');
    });

    // toggle tour visibility
    element.showPTour ? showTour(element) : closeTour(element);

    // on resize -> update layout type
    window.addEventListener('resize', function(event){
      clearTimeout(element.resizingId);
      element.resizingId = setTimeout(function(){
        updateLayout(element);
        if(!element.mobile) showSelectedStep(element);
      }, 200);
    });

    // start tour using a trigger button
    if(element.tourTriggers.length > 0) {
      for(var i = 0; i < element.tourTriggers.length; i++) {
        element.tourTriggers[i].addEventListener('click', function(event) {
          updateLayout(element);
          resetTour(element);
		      showTour(element);
        });
      }
    }

    // add loaded class
    Util.addClass(element.element, 'p-tour--loaded');
  };

  function setPositionFn(element) {
    element['tooltipBottom'] = tooltipBottom;
    element['tooltipTop'] = tooltipTop;
    element['tooltipLeft'] = tooltipLeft;
    element['tooltipRight'] = tooltipRight;
    element['tooltipBottomLeft'] = tooltipBottomLeft;
    element['tooltipBottomRight'] = tooltipBottomRight;
    element['tooltipTopLeft'] = tooltipTopLeft;
    element['tooltipTopRight'] = tooltipTopRight;
  };

  function collectTargets(element) {
    for(var i = 0; i < element.steps.length; i++) {
      element.targets.push(document.querySelector('[data-p-tour-target="'+(i + 1)+'"]'));
      element.targetPositions.push(element.targets[i].getAttribute('data-p-tour-position') || 'center');
    };
  };

  function showTour(element) {
    Util.removeClass(element.element, 'p-tour--is-hidden');
    // reveal step
    showSelectedStep(element);
    // show background
    animateBg(element);
  };

  function closeTour(element) {
    Util.addClass(element.element, 'p-tour--is-hidden');
    element.element.addEventListener('transitionend', function cb(){
      element.visibleStep = 0;
      element.element.removeEventListener('transitionend', cb);
      updateLayout(element);
      resetTour(element);
    });
  };

  function updateSteps(element, direction) {
    // clear timeout
    if(element.stepTimeout) {
      clearTimeout(element.stepTimeout);
      element.stepTimeout = false;
    }
    var newIndex = direction == 'next' ? element.visibleStep + 1 : element.visibleStep - 1;
    if(newIndex < 0) newIndex = element.steps.length - 1;
    if(newIndex >= element.steps.length) newIndex = 0;
    // reset bg class
    Util.removeClass(element.bg[0], 'p-tour__background--animate');
    // hide old step
    hideStep(element, direction, function(){
      // update index
      element.visibleStep = newIndex;
      // show new step
      showSelectedStep(element, direction);
      // trigger bg animation
      animateBg(element);
    });
  };

  function hideStep(element, direction, cb) {
    Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--current');
    if(element.isMobile) {
      // small screen animation
      var isNext = (direction == 'next');
      Util.toggleClass(element.steps[element.visibleStep], 'p-tour__step--m-right', !isNext);
      Util.toggleClass(element.steps[element.visibleStep], 'p-tour__step--m-left', isNext);
    } else {
      Util.addClass(element.pin[0], 'p-tour__pin--out');
    }
    if(element.isMobile) cb();
    else {
      element.stepTimeout = setTimeout(cb, 300);
    }
  };

  function showSelectedStep(element, direction) {
    // get pin position
    var position = getPinPosition(element); // position = [top, left]
    // update pin position
    setPosition(element.pin[0], position);
    // show pin
    Util.removeClass(element.pin[0], 'p-tour__pin--out');
    // get class position of new step (e.g., p-tour__step--right)
    var classPosition = setTooltipPosition(element, position); 
    // remove all position classes
    Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--top p-tour__step--bottom p-tour__step--left p-tour__step--right p-tour__step--bottom-right p-tour__step--bottom-left p-tour__step--top-right p-tour__step--top-left');
    if(element.isMobile) {
      Util.addClass(element.steps[element.visibleStep], 'p-tour__step--current');
    } else {
      Util.addClass(element.steps[element.visibleStep], 'p-tour__step--current '+classPosition);
    }
    
    if(direction) {
      // mobile animation
      Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--m-left p-tour__step--m-right');
    }
    // move focus to first action button
    var btnAction = element.steps[element.visibleStep].querySelector('button');
    if(btnAction) btnAction.focus();
  };

  function animateBg(element) {
    Util.addClass(element.bg[0], 'p-tour__background--animate');
  };

  function updateLayout(element) {
    var layout = getComputedStyle(element.element).getPropertyValue('--p-tour-layout').replace(/'/g, '').replace(/"/g, '').trim();
    // on resize -> check tour layout type
    element.isMobile = (layout == 'mobile');
    // init steps
    initStepsPosition(element);
  };

  function initStepsPosition(element) {
    if(!element.isMobile) {
      for(var i = 0; i < element.steps.length; i++) Util.removeClass(element.steps[i], 'p-tour__step--m-left p-tour__step--m-right');
    } else {
      for(var i = 0; i < element.steps.length; i++) {
        element.steps[i].style.top = '';
        element.steps[i].style.left = '';
        if(i < element.visibleStep) {
          Util.addClass(element.steps[i], 'p-tour__step--m-left');
          Util.removeClass(element.steps[i], 'p-tour__step--m-right');
        } else if(i > element.visibleStep) {
          Util.addClass(element.steps[i], 'p-tour__step--m-right');
          Util.removeClass(element.steps[i], 'p-tour__step--m-left');
        } else {
          Util.removeClass(element.steps[i], 'p-tour__step--m-right');
          Util.removeClass(element.steps[i], 'p-tour__step--m-left');
        }
      }
    }
  };

  function resetTour(element) {
    for(var i = 0; i < element.steps.length; i++) {
      Util.removeClass(element.steps[i], 'p-tour__step--current');
    }
    Util.removeClass(element.bg[0], 'p-tour__background--animate');
  };

  function getPinPosition(element) {
    var tourPosition = element.targetPositions[element.visibleStep],
      stepTargetPosition = element.targets[element.visibleStep].getBoundingClientRect();
    var position = [0, 0]; // [top, left]

    switch (tourPosition) {
      case 'bottom':
        position[0] = stepTargetPosition.bottom;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'top':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'left':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left;
        break;
      case 'right':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'center':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'bottom-right':
        position[0] = stepTargetPosition.top + stepTargetPosition.height;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'bottom-left':
        position[0] = stepTargetPosition.top + stepTargetPosition.height;
        position[1] = stepTargetPosition.left;
        break;
      case 'top-right':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'top-left':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left;
        break;
    }
    return position;
  };

  function setPosition(element, position) {
    // position = [top, left]
    if(position[0] !== false) element.style.top = position[0]+'px';
    if(position[1] !== false) element.style.left = position[1]+'px';
  };

  function setTooltipPosition(element, position) {
    if(element.isMobile) return false;
    var layout = element.targetPositions[element.visibleStep];
    if(layout == 'center') layout == 'top';
    var tooltipInfo = getTooltipInfo(element, layout, position);
    setPosition(element.steps[element.visibleStep], tooltipInfo[1]);
    return 'p-tour__step--'+tooltipInfo[0];
  };

  function getTooltipInfo(element, layout, position) {
    switch (layout) {
      case 'bottom':
      case 'center':
        var result = checkPosition(element, 'tooltipBottom', 'tooltipTop', 'tooltipLeft', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'top':
        var result = checkPosition(element, 'tooltipTop', 'tooltipBottom', 'tooltipLeft', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'left':
      case 'bottom-left':
      case 'top-left':
        var result = checkPosition(element, 'tooltipLeft', 'tooltipTop', 'tooltipBottom', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'right':
      case 'bottom-right':
      case 'top-right':
        var result = checkPosition(element, 'tooltipRight', 'tooltipLeft', 'tooltipTop', 'tooltipBottom', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
    }
    return [result[1], result[0]];
  };

  function checkPosition(element, pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, position) {
    var result = element[pos1](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos2](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos3](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos4](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos5](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos6](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos7](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos8](element, position);
    if(result[0]) return [result[1], result[2]];
    return [[position[0], position[1] - element.steps[element.visibleStep].getBoundingClientRect().width], 'bottom'];
  };

  function tooltipBottom(element, position) {
    // check if tooltip can be placed below the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(tooltipBox.height + position[0] > window.innerHeight && position[0] > tooltipBox.height) {
      return [false, false, false]; 
    }
    if(position[1] - tooltipBox.width/2 < 0 && position[1] + tooltipBox.width < window.innerWidth) {
      return [false, false, false]; 
    }

    if(position[1] + tooltipBox.width > window.innerWidth && position[1] - tooltipBox.width > 0) {
      return [false, false, false]; 
    }
    return [true, [position[0], position[1] - tooltipBox.width/2], 'bottom'];
  };

  function tooltipTop(element, position) {
    // check if tooltip can be placed on top of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if( position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) {
      return [false, false, false]; 
    }
    if(position[1] - tooltipBox.width/2 < 0 && position[1] + tooltipBox.width < window.innerWidth) {
      return [false, false, false]; 
    }
    
    if(position[1] + tooltipBox.width/2 > window.innerWidth && position[1] - tooltipBox.width > 0) {
      return [false, false, false]; 
    }
    return [true, [position[0] - tooltipBox.height, position[1] - tooltipBox.width/2], 'top'];
  };

  function tooltipLeft(element, position) {
    // check if tooltip can be placed to the left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] < tooltipBox.height/2 && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    if(position[0] + tooltipBox.height/2 >  window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0] - tooltipBox.height/2, position[1] - tooltipBox.width], 'left'];
  };

  function tooltipRight(element, position) {
    // check if tooltip can be placed to the right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] < tooltipBox.height/2 && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    if(position[0] + tooltipBox.height/2 >  window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0] - tooltipBox.height/2, position[1]], 'right'];
  };

  function tooltipBottomLeft(element, position) {
    // check if tooltip can be placed to the bottom-left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] + tooltipBox.height > window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0], position[1] - tooltipBox.width], 'bottom-left'];
  };

  function tooltipTopLeft(element, position) {
    // check if tooltip can be placed to the top-left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    return [true, [position[0] - tooltipBox.height, position[1] - tooltipBox.width], 'top-left'];
  };

  function tooltipBottomRight(element, position) {
    // check if tooltip can be placed to the bottom-right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] + tooltipBox.height > window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0], position[1]], 'bottom-right'];
  };

  function tooltipTopRight(element, position) {
    // check if tooltip can be placed to the top-right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    return [true, [position[0] - tooltipBox.height, position[1]], 'top-right'];
  };

  window.PTour = PTour;

  //initialize the PTour objects
	var pTour = document.getElementsByClassName('js-p-tour');
	if( pTour.length > 0 ) {
		for( var i = 0; i < pTour.length; i++) {
			(function(i){new PTour(pTour[i], true);})(i);
		}
	};
}());
// File#: _1_rating
// Usage: codyhouse.co/license
(function() {
	var Rating = function(element) {
		this.element = element;
		this.icons = this.element.getElementsByClassName('js-rating__control')[0];
		this.iconCode = this.icons.children[0].parentNode.innerHTML;
		this.initialRating = [];
		this.initialRatingElement = this.element.getElementsByClassName('js-rating__value')[0];
		this.ratingItems;
		this.selectedRatingItem;
    this.readOnly = Util.hasClass(this.element, 'js-rating--read-only');
		this.ratingMaxValue = 5;
		this.getInitialRating();
		this.initRatingHtml();
	};

	Rating.prototype.getInitialRating = function() {
		// get the rating of the product
		if(!this.initialRatingElement || !this.readOnly) {
			this.initialRating = [0, false];
			return;
		}

		var initialValue = Number(this.initialRatingElement.textContent);
		if(isNaN(initialValue)) {
			this.initialRating = [0, false];
			return;
		}

		var floorNumber = Math.floor(initialValue);
		this.initialRating[0] = (floorNumber < initialValue) ? floorNumber + 1 : floorNumber;
		this.initialRating[1] = (floorNumber < initialValue) ? Math.round((initialValue - floorNumber)*100) : false;
	};

	Rating.prototype.initRatingHtml = function() {
		//create the star elements
		var iconsList = this.readOnly ? '<ul>' : '<ul role="radiogroup">';
		
		//if initial rating value is zero -> add a 'zero' item 
		if(this.initialRating[0] == 0 && !this.initialRating[1]) {
			iconsList = iconsList+ '<li class="rating__item--zero rating__item--checked"></li>';
		}

		// create the stars list 
		for(var i = 0; i < this.ratingMaxValue; i++) { 
			iconsList = iconsList + this.getStarHtml(i);
		}
		iconsList = iconsList + '</ul>';

		// --default variation only - improve SR accessibility including a legend element 
		if(!this.readOnly) {
			var labelElement = this.element.getElementsByTagName('label');
			if(labelElement.length > 0) {
				var legendElement = '<legend class="'+labelElement[0].getAttribute('class')+'">'+labelElement[0].textContent+'</legend>';
				iconsList = '<fieldset>'+legendElement+iconsList+'</fieldset>';
				Util.addClass(labelElement[0], 'is-hidden');
			}
		}

		this.icons.innerHTML = iconsList;
		
		//init object properties
		this.ratingItems = this.icons.getElementsByClassName('js-rating__item');
		this.selectedRatingItem = this.icons.getElementsByClassName('rating__item--checked')[0];

		//show the stars
		Util.removeClass(this.icons, 'rating__control--is-hidden');

		//event listener
		!this.readOnly && this.initRatingEvents();// rating vote enabled
	};

	Rating.prototype.getStarHtml = function(index) {
		var listItem = '';
		var checked = (index+1 == this.initialRating[0]) ? true : false,
			itemClass = checked ? ' rating__item--checked' : '',
			tabIndex = (checked || (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0) ) ? 0 : -1,
			showHalf = checked && this.initialRating[1] ? true : false,
			iconWidth = showHalf ? ' rating__item--half': '';
		if(!this.readOnly) {
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'" role="radio" aria-label="'+(index+1)+'" aria-checked="'+checked+'" tabindex="'+tabIndex+'"><div class="rating__icon">'+this.iconCode+'</div></li>';
		} else {
			var starInner = showHalf ? '<div class="rating__icon">'+this.iconCode+'</div><div class="rating__icon rating__icon--inactive">'+this.iconCode+'</div>': '<div class="rating__icon">'+this.iconCode+'</div>';
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'">'+starInner+'</li>';
		}
		return listItem;
	};

	Rating.prototype.initRatingEvents = function() {
		var self = this;

		//click on a star
		this.icons.addEventListener('click', function(event){
			var trigger = event.target.closest('.js-rating__item');
			self.resetSelectedIcon(trigger);
		});

		//keyboard navigation -> select new star
		this.icons.addEventListener('keydown', function(event){
			if( event.keyCode && (event.keyCode == 39 || event.keyCode == 40 ) || event.key && (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'arrowdown') ) {
				self.selectNewIcon('next'); //select next star on arrow right/down
			} else if(event.keyCode && (event.keyCode == 37 || event.keyCode == 38 ) || event.key && (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'arrowup')) {
				self.selectNewIcon('prev'); //select prev star on arrow left/up
			} else if(event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') {
				self.selectFocusIcon(); // select focused star on Space
			}
		});
	};

	Rating.prototype.selectNewIcon = function(direction) {
		var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
		index = (direction == 'next') ? index + 1 : index - 1;
		if(index < 0) index = this.ratingItems.length - 1;
		if(index >= this.ratingItems.length) index = 0;	
		this.resetSelectedIcon(this.ratingItems[index]);
		this.ratingItems[index].focus();
	};

	Rating.prototype.selectFocusIcon = function(direction) {
		this.resetSelectedIcon(document.activeElement);
	};

	Rating.prototype.resetSelectedIcon = function(trigger) {
		if(!trigger) return;
		Util.removeClass(this.selectedRatingItem, 'rating__item--checked');
		Util.setAttributes(this.selectedRatingItem, {'aria-checked': false, 'tabindex': -1});
		Util.addClass(trigger, 'rating__item--checked');
		Util.setAttributes(trigger, {'aria-checked': true, 'tabindex': 0});
		this.selectedRatingItem = trigger; 
		// update select input value
		var select = this.element.getElementsByTagName('select');
		if(select.length > 0) {
			select[0].value = trigger.getAttribute('aria-label');
		}
	};
	
	//initialize the Rating objects
	var ratings = document.getElementsByClassName('js-rating');
	if( ratings.length > 0 ) {
		for( var i = 0; i < ratings.length; i++) {
			(function(i){new Rating(ratings[i]);})(i);
		}
	};
}());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function() {
  var ReadMore = function(element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName('js-read-more__content');
    this.count = this.element.getAttribute('data-characters') || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute('data-btn-class');
    this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
    this.btnShowLabel = 'Read more';
    this.btnHideLabel = 'Read less';
    this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
    if( this.moreContent.length == 0 ) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) { 
    splitChildren(readMore.element, readMore); // iterate through children and hide content
  };

  function splitChildren(parent, readMore) {
    if(readMore.counting >= readMore.count) {
      Util.addClass(parent, 'js-read-more__content');
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = '';
    for(var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  };

  function wrapText(element, readMore) {
    var content = element.textContent;
    if(content.replace(/\s/g,'').length == 0) return '';// check if content is empty
    if(readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + '</span>';
    }
    if(readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
  };

  function setBtnLabels(readMore) { // set custom labels for read More/Less btns
    var btnLabels = readMore.element.getAttribute('data-btn-labels');
    if(btnLabels) {
      var labelsArray = btnLabels.split(',');
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  };

  function initReadMore(readMore) { // add read more/read less buttons to the markup
    readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
    if( readMore.moreContent.length == 0 ) {
      Util.addClass(readMore.element, 'read-more--loaded');
      return;
    }
    var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
    var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
    if(readMore.ellipsis) {
      btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
    readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  };

  function resetAppearance(readMore) { // hide part of the content
    for(var i = 0; i < readMore.moreContent.length; i++) Util.addClass(readMore.moreContent[i], 'is-hidden');
    Util.addClass(readMore.element, 'read-more--loaded'); // show entire component
  };

  function initEvents(readMore) { // listen to the click on the read more/less btn
    readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
    readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');

    readMore.btnToggle[0].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  };

  function updateVisibility(readMore, visibile) {
    for(var i = 0; i < readMore.moreContent.length; i++) Util.toggleClass(readMore.moreContent[i], 'is-hidden', !visibile);
    // reset btns appearance
    Util.toggleClass(readMore.btnToggle[0], 'is-hidden', visibile);
    Util.toggleClass(readMore.btnToggle[1], 'is-hidden', !visibile);
    if(readMore.ellipsis.length > 0 ) Util.toggleClass(readMore.ellipsis[0], 'is-hidden', visibile);
    if(!readMore.toggleOff) Util.addClass(readMore.btn, 'is-hidden');
    // move focus
    if(visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
      Util.moveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      Util.moveFocus(readMore.btnToggle[0]);
    }
  };

  function resetFocusTarget(target, tabindex) {
    if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}
  };

  //initialize the ReadMore objects
	var readMore = document.getElementsByClassName('js-read-more');
	if( readMore.length > 0 ) {
		for( var i = 0; i < readMore.length; i++) {
			(function(i){new ReadMore(readMore[i]);})(i);
		}
	};
}());
// File#: _1_responsive-sidebar
// Usage: codyhouse.co/license
(function() {
  var Sidebar = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.contentReadyClass = "sidebar-loaded:show";
    this.layout = false; // this will be static or mobile
    this.preventScrollEl = getPreventScrollEl(this);
    getCustomStaticClass(this); // custom classes for static version
    initSidebar(this);
  };

  function getPreventScrollEl(element) {
		var scrollEl = false;
		var querySelector = element.element.getAttribute('data-sidebar-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute('data-static-class');
    if(customClasses) element.customStaticClass = ' '+customClasses;
  };
  
  function initSidebar(sidebar) {
    initSidebarResize(sidebar); // handle changes in layout -> mobile to static and viceversa
    
		if ( sidebar.triggers ) { // open sidebar when clicking on trigger buttons - mobile layout only
			for(var i = 0; i < sidebar.triggers.length; i++) {
				sidebar.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(sidebar.element, sidebar.showClass)) {
            sidebar.selectedTrigger = event.target;
            closeSidebar(sidebar);
            return;
          }
					sidebar.selectedTrigger = event.target;
					showSidebar(sidebar);
					initSidebarEvents(sidebar);
				});
			}
		}
  };

  function showSidebar(sidebar) { // mobile layout only
		Util.addClass(sidebar.element, sidebar.showClass);
		getFocusableElements(sidebar);
		Util.moveFocus(sidebar.element);
    // change the overflow of the preventScrollEl
		if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = 'hidden';
  };

  function closeSidebar(sidebar) { // mobile layout only
		Util.removeClass(sidebar.element, sidebar.showClass);
		sidebar.firstFocusable = null;
		sidebar.lastFocusable = null;
    if(sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute('tabindex');
		//remove listeners
		cancelSidebarEvents(sidebar);
    // change the overflow of the preventScrollEl
		if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = '';
	};

  function initSidebarEvents(sidebar) { // mobile layout only
    //add event listeners
		sidebar.element.addEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.addEventListener('click', handleEvent.bind(sidebar));
  };

  function cancelSidebarEvents(sidebar) { // mobile layout only
    //remove event listeners
		sidebar.element.removeEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.removeEventListener('click', handleEvent.bind(sidebar));
  };

  function handleEvent(event) { // mobile layout only
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };

  function initKeyDown(sidebar, event) { // mobile layout only
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close sidebar window on esc
      closeSidebar(sidebar);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside sidebar
      trapFocus(sidebar, event);
    }
  };

  function initClick(sidebar, event) { // mobile layout only
    //close sidebar when clicking on close button or sidebar bg layer 
		if( !event.target.closest('.js-sidebar__close-btn') && !Util.hasClass(event.target, 'js-sidebar') ) return;
		event.preventDefault();
		closeSidebar(sidebar);
  };

  function trapFocus(sidebar, event) { // mobile layout only
    if( sidebar.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.lastFocusable.focus();
		}
		if( sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.firstFocusable.focus();
		}
  };

  function initSidebarResize(sidebar) {
    // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
    var beforeContent = getComputedStyle(sidebar.element, ':before').getPropertyValue('content');
    if(beforeContent && beforeContent !='' && beforeContent !='none') {
      checkSidebarLayout(sidebar);

      sidebar.element.addEventListener('update-sidebar', function(event){
        checkSidebarLayout(sidebar);
      });
    } 
    // check if there a main element to show
    var mainContent = document.getElementsByClassName(sidebar.contentReadyClass);
    if(mainContent.length > 0) Util.removeClass(mainContent[0], sidebar.contentReadyClass);
    Util.addClass(sidebar.element, sidebar.readyClass);
  };

  function checkSidebarLayout(sidebar) {
    var layout = getComputedStyle(sidebar.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if(layout == sidebar.layout) return;
    sidebar.layout = layout;
    if(layout != 'static') Util.addClass(sidebar.element, 'is-hidden');
    Util.toggleClass(sidebar.element, sidebar.staticClass + sidebar.customStaticClass, layout == 'static');
    if(layout != 'static') setTimeout(function(){Util.removeClass(sidebar.element, 'is-hidden')});
    // reset element role 
    (layout == 'static') ? sidebar.element.removeAttribute('role', 'alertdialog') :  sidebar.element.setAttribute('role', 'alertdialog');
    // reset mobile behaviour
    if(layout == 'static' && Util.hasClass(sidebar.element, sidebar.showClass)) closeSidebar(sidebar);
  };

  function getFocusableElements(sidebar) {
    //get all focusable elements inside the drawer
		var allFocusable = sidebar.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(sidebar, allFocusable);
		getLastVisible(sidebar, allFocusable);
  };

  function getFirstVisible(sidebar, elements) {
		//get first visible focusable element inside the sidebar
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.firstFocusable = elements[i];
				return true;
			}
		}
	};

	function getLastVisible(sidebar, elements) {
		//get last visible focusable element inside the sidebar
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.lastFocusable = elements[i];
				return true;
			}
		}
  };

  //initialize the Sidebar objects
	var sidebar = document.getElementsByClassName('js-sidebar');
	if( sidebar.length > 0 ) {
		for( var i = 0; i < sidebar.length; i++) {
			(function(i){new Sidebar(sidebar[i]);})(i);
    }
    // switch from mobile to static layout
    var customEvent = new CustomEvent('update-sidebar');
    window.addEventListener('resize', function(event){
      (!window.requestAnimationFrame) ? setTimeout(function(){resetLayout();}, 250) : window.requestAnimationFrame(resetLayout);
    });

    (window.requestAnimationFrame) // init sidebar layout
      ? window.requestAnimationFrame(resetLayout)
      : resetLayout();

    function resetLayout() {
      for( var i = 0; i < sidebar.length; i++) {
        (function(i){sidebar[i].dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);
		window.addEventListener('restartAll', fxRestart);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].getAttribute('class').split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].setAttribute('class', classes.join(" ").trim());
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};

		function fxRestart() {
      // restart the reveal effect -> hide all elements and re-init the observer
      if (Util.osHasReducedMotion() || !intersectionObserverSupported || fxDisabled(fxElements[0])) {
        return;
      }
      // check if we need to add the event listensers back
      if(fxElements.length <= fxRevealedItems.length) {
        window.addEventListener('load', fxReveal);
        window.addEventListener('resize', fxResize);
      }
      // remove observer and reset the observer array
      for(var i = 0; i < observer.length; i++) {
        if(observer[i]) observer[i].disconnect();
      }
      observer = [];
      // remove visible class
      for(var i = 0; i < fxElements.length; i++) {
        Util.removeClass(fxElements[i], 'reveal-fx--is-visible');
      }
      // reset fxRevealedItems array
      fxRevealedItems = [];
      // restart observer
      initObserver();
    };
	}
}());
// File#: _1_row-table
// Usage: codyhouse.co/license
(function() {
	var RowTable = function(element) {
    this.element = element;
    this.headerRows = this.element.getElementsByTagName('thead')[0].getElementsByTagName('th');
    this.tableRows = this.element.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    this.collapsedLayoutClass = 'row-table--collapsed';
    this.mainRowCellClass = 'row-table__th-inner';
    initTable(this);
  };

  function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout

    // create additional table content
    addTableContent(table);

    // custom event emitted when window is resized
    table.element.addEventListener('update-row-table', function(event){
      checkTableLayour(table);
    });

    // mobile version - listent to click/key enter on the row -> expand it
    table.element.addEventListener('click', function(event){
      revealRowDetails(table, event);
    });
    table.element.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        revealRowDetails(table, event);
      }
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table.element, table.collapsedLayoutClass, layout == 'expanded');
  };

  function addTableContent(table) {
    // for the expanded version, add a ul with list of details for each table row
    for(var i = 0; i < table.tableRows.length; i++) {
      var content = '';
      var cells = table.tableRows[i].getElementsByClassName('row-table__cell');
      for(var j = 0; j < cells.length; j++) {
        if(j == 0 ) {
          Util.addClass(cells[j], 'js-'+table.mainRowCellClass);
          var cellLabel = cells[j].getElementsByClassName('row-table__th-inner');
          if(cellLabel.length > 0 ) cellLabel[0].innerHTML = cellLabel[0].innerHTML + '<i class="row-table__th-icon" aria-hidden="true"></i>'
        } else {
          content = content + '<li class="row-table__item"><span class="row-table__label">'+table.headerRows[j].innerHTML+':</span><span>'+cells[j].innerHTML+'</span></li>';
        }
      }
      content = '<ul class="row-table__list" aria-hidden="true">'+content+'</ul>';
      cells[0].innerHTML = '<input type="text" class="row-table__input" aria-hidden="true">'+cells[0].innerHTML + content;
    }
  };

  function revealRowDetails(table, event) {
    if(!event.target.closest('.js-'+table.mainRowCellClass) || event.target.closest('.row-table__list')) return;
    var row = event.target.closest('.js-'+table.mainRowCellClass);
    Util.toggleClass(row, 'row-table__cell--show-list', !Util.hasClass(row, 'row-table__cell--show-list'));
  };

  //initialize the RowTable objects
	var rowTables = document.getElementsByClassName('js-row-table');
	if( rowTables.length > 0 ) {
    var j = 0,
    rowTablesArray = [];
		for( var i = 0; i < rowTables.length; i++) {
      var beforeContent = getComputedStyle(rowTables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){rowTablesArray.push(new RowTable(rowTables[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-row-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < rowTablesArray.length; i++) {
          (function(i){rowTablesArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
	}
}());
// File#: _1_scrolling-animations
// Usage: codyhouse.co/license
(function() {
  var ScrollFx = function(element, scrollableSelector) {
    this.element = element;
    this.options = [];
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    this.scrollingFx = [];
    this.animating = [];
    this.deltaScrolling = [];
    this.observer = [];
    this.scrollableSelector = scrollableSelector; // if the scrollable element is not the window 
    this.scrollableElement = false;
    initScrollFx(this);
    // ToDo - option to pass two selectors to target the element start and stop animation scrolling values -> to be used for sticky/fixed elements
  };

  function initScrollFx(element) {
    // do not animate if reduced motion is on
    if(Util.osHasReducedMotion()) return;
    // get scrollable element
    setScrollableElement(element);
    // get animation params
    var animation = element.element.getAttribute('data-scroll-fx');
    if(animation) {
      element.options.push(extractAnimation(animation));
    } else {
      getAnimations(element, 1);
    }
    // set Intersection Observer
    initObserver(element);
    // update params on resize
    initResize(element);
  };

  function setScrollableElement(element) {
    if(element.scrollableSelector) element.scrollableElement = document.querySelector(element.scrollableSelector);
  };

  function initObserver(element) {
    for(var i = 0; i < element.options.length; i++) {
      (function(i){
        element.scrollingFx[i] = false;
        element.deltaScrolling[i] = getDeltaScrolling(element, i);
        element.animating[i] = false;

        element.observer[i] = new IntersectionObserver(
          function(entries, observer) { 
            scrollFxCallback(element, i, entries, observer);
          },
          {
            rootMargin: (element.options[i][5] -100)+"% 0px "+(0 - element.options[i][4])+"% 0px"
          }
        );
    
        element.observer[i].observe(element.element);

        // set initial value
        setTimeout(function(){
          animateScrollFx.bind(element, i)();
        })
      })(i);
    }
  };

  function scrollFxCallback(element, index, entries, observer) {
		if(entries[0].isIntersecting) {
      if(element.scrollingFx[index]) return; // listener for scroll event already added
      // reset delta
      resetDeltaBeforeAnim(element, index);
      triggerAnimateScrollFx(element, index);
    } else {
      if(!element.scrollingFx[index]) return; // listener for scroll event already removed
      window.removeEventListener('scroll', element.scrollingFx[index]);
      element.scrollingFx[index] = false;
    }
  };

  function triggerAnimateScrollFx(element, index) {
    element.scrollingFx[index] = animateScrollFx.bind(element, index);
    (element.scrollableElement)
      ? element.scrollableElement.addEventListener('scroll', element.scrollingFx[index])
      : window.addEventListener('scroll', element.scrollingFx[index]);
  };

  function animateScrollFx(index) {
    // if window scroll is outside the proper range -> return
    if(getScrollY(this) < this.deltaScrolling[index][0]) {
      setCSSProperty(this, index, this.options[index][1]);
      return;
    }
    if(getScrollY(this) > this.deltaScrolling[index][1]) {
      setCSSProperty(this, index, this.options[index][2]);
      return;
    }
    if(this.animating[index]) return;
    this.animating[index] = true;
    window.requestAnimationFrame(updatePropertyScroll.bind(this, index));
  };

  function updatePropertyScroll(index) { // get value
    // check if this is a theme value or a css property
    if(isNaN(this.options[index][1])) {
      // this is a theme value to update
      (getScrollY(this) >= this.deltaScrolling[index][1]) 
        ? setCSSProperty(this, index, this.options[index][2])
        : setCSSProperty(this, index, this.options[index][1]);
    } else {
      // this is a CSS property
      var value = this.options[index][1] + (this.options[index][2] - this.options[index][1])*(getScrollY(this) - this.deltaScrolling[index][0])/(this.deltaScrolling[index][1] - this.deltaScrolling[index][0]);
      // update css property
      setCSSProperty(this, index, value);
    }
    
    this.animating[index] = false;
  };

  function setCSSProperty(element, index, value) {
    if(isNaN(value)) {
      // this is a theme value that needs to be updated
      setThemeValue(element, value);
      return;
    }
    if(element.options[index][0] == '--scroll-fx-skew' || element.options[index][0] == '--scroll-fx-scale') {
      // set 2 different CSS properties for the transformation on both x and y axis
      element.element.style.setProperty(element.options[index][0]+'-x', value+element.options[index][3]);
      element.element.style.setProperty(element.options[index][0]+'-y', value+element.options[index][3]);
    } else {
      // set single CSS property
      element.element.style.setProperty(element.options[index][0], value+element.options[index][3]);
    }
  };

  function setThemeValue(element, value) {
    // if value is different from the theme in use -> update it
    if(element.element.getAttribute('data-theme') != value) {
      Util.addClass(element.element, 'scroll-fx--theme-transition');
      element.element.offsetWidth;
      element.element.setAttribute('data-theme', value);
      element.element.addEventListener('transitionend', function cb(){
        element.element.removeEventListener('transitionend', cb);
        Util.removeClass(element.element, 'scroll-fx--theme-transition');
      });
    }
  };

  function getAnimations(element, index) {
    var option = element.element.getAttribute('data-scroll-fx-'+index);
    if(option) {
      // multiple animations for the same element - iterate through them
      element.options.push(extractAnimation(option));
      getAnimations(element, index+1);
    } 
    return;
  };

  function extractAnimation(option) {
    var array = option.split(',').map(function(item) {
      return item.trim();
    });
    var propertyOptions = getPropertyValues(array[1], array[2]);
    var animation = [getPropertyLabel(array[0]), propertyOptions[0], propertyOptions[1], propertyOptions[2], parseInt(array[3]), parseInt(array[4])];
    return animation;
  };

  function getPropertyLabel(property) {
    var propertyCss = '--scroll-fx-';
    for(var i = 0; i < property.length; i++) {
      propertyCss = (property[i] == property[i].toUpperCase())
        ? propertyCss + '-'+property[i].toLowerCase()
        : propertyCss +property[i];
    }
    if(propertyCss == '--scroll-fx-rotate') {
      propertyCss = '--scroll-fx-rotate-z';
    } else if(propertyCss == '--scroll-fx-translate') {
      propertyCss = '--scroll-fx-translate-x';
    }
    return propertyCss;
  };

  function getPropertyValues(val1, val2) {
    var nbVal1 = parseFloat(val1), 
      nbVal2 = parseFloat(val2),
      unit = val1.replace(nbVal1, '');
    if(isNaN(nbVal1)) {
      // property is a theme value
      nbVal1 = val1;
      nbVal2 = val2;
      unit = '';
    }
    return [nbVal1, nbVal2, unit];
  };

  function getDeltaScrolling(element, index) {
    // this retrieve the max and min scroll value that should trigger the animation
    var topDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][4]/100) + element.boundingRect.top,
      bottomDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][5]/100) + element.boundingRect.top;
    return [topDelta, bottomDelta];
  };

  function initResize(element) {
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(resetResize.bind(element), 500);
    });
    // emit custom event -> elements have been initialized
    var event = new CustomEvent('scrollFxReady');
		element.element.dispatchEvent(event);
  };

  function resetResize() {
    // on resize -> make sure to update all scrolling delta values
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    for(var i = 0; i < this.deltaScrolling.length; i++) {
      this.deltaScrolling[i] = getDeltaScrolling(this, i);
      animateScrollFx.bind(this, i)();
    }
    // emit custom event -> elements have been resized
    var event = new CustomEvent('scrollFxResized');
		this.element.dispatchEvent(event);
  };

  function resetDeltaBeforeAnim(element, index) {
    element.boundingRect = element.element.getBoundingClientRect();
    element.windowHeight = window.innerHeight;
    element.deltaScrolling[index] = getDeltaScrolling(element, index);
  };

  function getScrollY(element) {
    if(!element.scrollableElement) return window.scrollY;
    return element.scrollableElement.scrollTop;
  }

  window.ScrollFx = ScrollFx;

  var scrollFx = document.getElementsByClassName('js-scroll-fx');
  for(var i = 0; i < scrollFx.length; i++) {
    (function(i){
      var scrollableElement = scrollFx[i].getAttribute('data-scrollable-element');
      new ScrollFx(scrollFx[i], scrollableElement);
    })(i);
  }
}());
// File#: _1_slider
// Usage: codyhouse.co/license
(function() {
	var Slider = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.value = this.element.getElementsByClassName('js-slider__value'); 
		this.floatingValue = this.element.getElementsByClassName('js-slider__value--floating'); 
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		this.isInputVar = (this.value[0].tagName.toLowerCase() == 'input');
		this.isFloatingVar = this.floatingValue.length > 0;
		if(this.isFloatingVar) {
			this.floatingValueLeft = window.getComputedStyle(this.floatingValue[0]).getPropertyValue('left');
		}
		initSlider(this);
	};

	function initSlider(slider) {
		updateLabelValues(slider);// update label/input value so that it is the same as the input range
		updateLabelPosition(slider, false); // update label position if floating variation
		updateRangeColor(slider, false); // update range bg color
		checkRangeSupported(slider); // hide label/input value if input range is not supported
		
		// listen to change in the input range
		for(var i = 0; i < slider.rangeInput.length; i++) {
			(function(i){
				slider.rangeInput[i].addEventListener('input', function(event){
					updateSlider(slider, i);
				});
				slider.rangeInput[i].addEventListener('change', function(event){ // fix issue on IE where input event is not emitted
					updateSlider(slider, i);
				});
			})(i);
		}

		// if there's an input text, listen for changes in value, validate it and then update slider
		if(slider.isInputVar) {
			for(var i = 0; i < slider.value.length; i++) {
				(function(i){
					slider.value[i].addEventListener('change', function(event){
						updateRange(slider, i);
					});
				})(i);
			}
		}

		// native <input> element has been updated (e.g., form reset) -> update custom appearance
		slider.element.addEventListener('slider-updated', function(event){
			for(var i = 0; i < slider.value.length; i++) {updateSlider(slider, i);}
		});

		// custom events - emitted if slider has allows for multi-values
		slider.element.addEventListener('inputRangeLimit', function(event){
			updateLabelValues(slider);
			updateLabelPosition(slider, event.detail);
		});
	};

	function updateSlider(slider, index) {
		updateLabelValues(slider);
		updateLabelPosition(slider, index);
		updateRangeColor(slider, index);
	};

	function updateLabelValues(slider) {
		for(var i = 0; i < slider.rangeInput.length; i++) {
			slider.isInputVar ? slider.value[i].value = slider.rangeInput[i].value : slider.value[i].textContent = slider.rangeInput[i].value;
		}
	};

	function updateLabelPosition(slider, index) {
		if(!slider.isFloatingVar) return;
		var i = index ? index : 0,
			j = index ? index + 1: slider.rangeInput.length;
		for(var k = i; k < j; k++) {
			var percentage = (slider.rangeInput[k].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin);
			slider.floatingValue[k].style.left = 'calc(0.5 * '+slider.floatingValueLeft+' + '+percentage+' * ( '+slider.sliderWidth+' - '+slider.floatingValueLeft+' ))';
		}
	};

	function updateRangeColor(slider, index) {
		if(slider.rangeInput.length > 1) {slider.element.dispatchEvent(new CustomEvent('updateRange', {detail: index}));return;}
		var percentage = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			fill = 'calc('+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			empty = 'calc('+slider.sliderWidth+' - '+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value', fill);
		slider.rangeWrapper[0].style.setProperty('--slider-empty-value', empty);
	};

	function updateRange(slider, index) {
		var newValue = parseFloat(slider.value[index].value);
		if(isNaN(newValue)) {
			slider.value[index].value = slider.rangeInput[index].value;
			return;
		} else {
			if(newValue < slider.rangeMin) newValue = slider.rangeMin;
			if(newValue > slider.rangeMax) newValue = slider.rangeMax;
			slider.rangeInput[index].value = newValue;
			var inputEvent = new Event('change');
			slider.rangeInput[index].dispatchEvent(inputEvent);
		}
	};

	function checkRangeSupported(slider) {
		var input = document.createElement("input");
		input.setAttribute("type", "range");
		Util.toggleClass(slider.element, 'slider--range-not-supported', input.type !== "range");
	};

	//initialize the Slider objects
	var sliders = document.getElementsByClassName('js-slider');
	if( sliders.length > 0 ) {
		for( var i = 0; i < sliders.length; i++) {
			(function(i){new Slider(sliders[i]);})(i);
		}
	}
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function() {
	var SmoothScroll = function(element) {
		if(!('CSS' in window) || !CSS.supports('color', 'var(--color-var)')) return;
		this.element = element;
		this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
		this.dataElementY = this.element.getAttribute('data-scrollable-element-y') || this.element.getAttribute('data-scrollable-element') || this.element.getAttribute('data-element');
		this.scrollElementY = this.dataElementY ? document.querySelector(this.dataElementY) : window;
		this.dataElementX = this.element.getAttribute('data-scrollable-element-x');
		this.scrollElementX = this.dataElementY ? document.querySelector(this.dataElementX) : window;
		this.initScroll();
	};

	SmoothScroll.prototype.initScroll = function() {
		var self = this;

		//detect click on link
		this.element.addEventListener('click', function(event){
			event.preventDefault();
			var targetId = event.target.closest('.js-smooth-scroll').getAttribute('href').replace('#', ''),
				target = document.getElementById(targetId),
				targetTabIndex = target.getAttribute('tabindex'),
				windowScrollTop = self.scrollElementY.scrollTop || document.documentElement.scrollTop;

			// scroll vertically
			if(!self.dataElementY) windowScrollTop = window.scrollY || document.documentElement.scrollTop;

			var scrollElementY = self.dataElementY ? self.scrollElementY : false;

			var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
			Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop - fixedHeight, self.scrollDuration, function() {
				// scroll horizontally
				self.scrollHorizontally(target, fixedHeight);
				//move the focus to the target element - don't break keyboard navigation
				Util.moveFocus(target);
				history.pushState(false, false, '#'+targetId);
				self.resetTarget(target, targetTabIndex);
			}, scrollElementY);
		});
	};

	SmoothScroll.prototype.scrollHorizontally = function(target, delta) {
    var scrollEl = this.dataElementX ? this.scrollElementX : false;
    var windowScrollLeft = this.scrollElementX ? this.scrollElementX.scrollLeft : document.documentElement.scrollLeft;
    var final = target.getBoundingClientRect().left + windowScrollLeft - delta,
      duration = this.scrollDuration;

    var element = scrollEl || window;
    var start = element.scrollLeft || document.documentElement.scrollLeft,
      currentTime = null;

    if(!scrollEl) start = window.scrollX || document.documentElement.scrollLeft;
		// return if there's no need to scroll
    if(Math.abs(start - final) < 5) return;
        
    var animateScroll = function(timestamp){
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeInOutQuad(progress, start, final-start, duration);
      element.scrollTo({
				left: val,
			});
      if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

	SmoothScroll.prototype.resetTarget = function(target, tabindex) {
		if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}	
	};

	SmoothScroll.prototype.getFixedElementHeight = function() {
		var scrollElementY = this.dataElementY ? this.scrollElementY : document.documentElement;
    var fixedElementDelta = parseInt(getComputedStyle(scrollElementY).getPropertyValue('scroll-padding'));
		if(isNaN(fixedElementDelta) ) { // scroll-padding not supported
			fixedElementDelta = 0;
			var fixedElement = document.querySelector(this.element.getAttribute('data-fixed-element'));
			if(fixedElement) fixedElementDelta = parseInt(fixedElement.getBoundingClientRect().height);
		}
		return fixedElementDelta;
	};
	
	//initialize the Smooth Scroll objects
	var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
	if( smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
		// you need javascript only if css scroll-behavior is not supported
		for( var i = 0; i < smoothScrollLinks.length; i++) {
			(function(i){new SmoothScroll(smoothScrollLinks[i]);})(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
// File#: _1_table
// Usage: codyhouse.co/license
(function() {
  function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout
    Util.addClass(table, 'table--loaded'); // show table

    // custom event emitted when window is resized
    table.addEventListener('update-table', function(event){
      checkTableLayour(table);
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
  };

  var tables = document.getElementsByClassName('js-table'),
    tableExpandedLayoutClass = 'table--expanded';
  if( tables.length > 0 ) {
    var j = 0;
    for( var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){initTable(tables[i]);})(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], 'table--loaded');
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < tables.length; i++) {
          (function(i){tables[i].dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
}());
// File#: _1_tabs
// Usage: codyhouse.co/license
(function() {
	var Tab = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
		this.hideClass = 'is-hidden';
		this.customShowClass = this.element.getAttribute('data-show-panel-class') ? this.element.getAttribute('data-show-panel-class') : false;
		this.layout = this.element.getAttribute('data-tabs-layout') ? this.element.getAttribute('data-tabs-layout') : 'horizontal';
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init tabs
		this.initTab();
	};

	Tab.prototype.initTab = function() {
		//set initial aria attributes
		this.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == 0),
				panelId = this.panels[i].getAttribute('id');
			this.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(this.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(this.triggers[i], 'js-tabs__trigger'); 
			Util.setAttributes(this.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
			Util.toggleClass(this.panels[i], this.hideClass, !bool);

			if(!bool) this.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		this.initTabEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Tab.prototype.initTabEvents = function() {
		var self = this;
		//click on a new tab -> select content
		this.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs__trigger') ) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		this.tabList.addEventListener('keydown', function(event) {
			;
			if( !event.target.closest('.js-tabs__trigger') ) return;
			if( tabNavigateNext(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('next');
			} else if( tabNavigatePrev(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('prev');
			}
		});
	};

	Tab.prototype.selectNewTab = function(direction) {
		var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
			index = Util.getIndexInArray(this.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = this.listItems.length - 1;
		if(index >= this.listItems.length) index = 0;	
		this.triggerTab(this.triggers[index]);
		this.triggers[index].focus();
	};

	Tab.prototype.triggerTab = function(tabTrigger, event) {
		var self = this;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(this.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(this.triggers[index].getAttribute('aria-selected') == 'true') return;
		
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(this.panels[i], this.hideClass, !bool);
			if(this.customShowClass) Util.toggleClass(this.panels[i], this.customShowClass, bool);
			this.triggers[i].setAttribute('aria-selected', bool);
			bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
		}

		// update url if deepLink is on
		if(this.deepLinkOn) {
			history.replaceState(null, '', '#'+tabTrigger.getAttribute('aria-controls'));
		}
	};

	Tab.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		var self = this;
		if(!hash || hash == '') return;
		for(var i = 0; i < this.panels.length; i++) {
			if(this.panels[i].getAttribute('id') == hash) {
				this.triggerTab(this.triggers[i], false);
				setTimeout(function(){self.panels[i].scrollIntoView(true);});
				break;
			}
		};
	};

	function tabNavigateNext(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 40 || event.key && event.key == 'ArrowDown')) {return true;}
		else {return false;}
	};

	function tabNavigatePrev(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 38 || event.key && event.key == 'ArrowUp')) {return true;}
		else {return false;}
	};
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new Tab(tabs[i]);})(i);
		}
	}
}());
// File#: _1_tilted-img-slideshow
// Usage: codyhouse.co/license
(function() {
  var TiltedSlideshow = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-tilted-slideshow__list')[0];
    this.images = this.list.getElementsByClassName('js-tilted-slideshow__item');
    this.selectedIndex = 0;
    this.animating = false;
    // classes
    this.orderClasses = ['tilted-slideshow__item--top', 'tilted-slideshow__item--middle', 'tilted-slideshow__item--bottom'];
    this.moveClasses = ['tilted-slideshow__item--move-out', 'tilted-slideshow__item--move-in'];
    this.interactedClass = 'tilted-slideshow--interacted';
    initTiltedSlideshow(this);
  };

  function initTiltedSlideshow(slideshow) {
    if(!animateImgs) removeTransitions(slideshow);
    
    slideshow.list.addEventListener('click', function(event) {
      Util.addClass(slideshow.element, slideshow.interactedClass);
      animateImgs ? animateImages(slideshow) : switchImages(slideshow);
    });
  };

  function removeTransitions(slideshow) {
    // if reduced motion is on or css variables are not supported -> do not animate images
    for(var i = 0; i < slideshow.images.length; i++) {
      slideshow.images[i].style.transition = 'none';
    }
  };

  function switchImages(slideshow) {
    // if reduced motion is on or css variables are not supported -> switch images without animation
    resetOrderClasses(slideshow);
    resetSelectedIndex(slideshow);
  };

  function resetSelectedIndex(slideshow) {
    // update the index of the top image
    slideshow.selectedIndex = resetIndex(slideshow, slideshow.selectedIndex + 1);
  };

  function resetIndex(slideshow, index) {
    // make sure index is < 3
    if(index >= slideshow.images.length) index = index - slideshow.images.length;
    return index;
  };

  function resetOrderClasses(slideshow) {
    // update the orderClasses for each images
    if(!animateImgs) {
      // top image -> remove top class and add bottom class
      Util.addClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[2]);
      Util.removeClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[0]);
    }

    // middle image -> remove middle class and add top class
    var middleImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 1)];
    Util.addClass(middleImage, slideshow.orderClasses[0]);
    Util.removeClass(middleImage, slideshow.orderClasses[1]);

    // bottom image -> remove bottom class and add middle class
    var bottomImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 2)];
    Util.addClass(bottomImage, slideshow.orderClasses[1]);
    Util.removeClass(bottomImage, slideshow.orderClasses[2]);
  };

  function animateImages(slideshow) {
    if(slideshow.animating) return;
    slideshow.animating = true;

    // reset order classes for middle/bottom images
    resetOrderClasses(slideshow);
    
    // animate top image
    var topImage = slideshow.images[slideshow.selectedIndex];
    // remove top class and add move out class
    Util.removeClass(topImage, slideshow.orderClasses[0]);
    Util.addClass(topImage, slideshow.moveClasses[0]);
    
    topImage.addEventListener('transitionend', function cb(event) {
      // remove transition
			topImage.style.transition = 'none';
			topImage.removeEventListener("transitionend", cb);
      
      setTimeout(function(){
        // add bottom + move-in class, remove move-out class
        Util.removeClass(topImage, slideshow.moveClasses[0]);
        Util.addClass(topImage, slideshow.moveClasses[1]+' '+ slideshow.orderClasses[2]);
        setTimeout(function(){
          topImage.style.transition = '';
          // remove move-in class
          Util.removeClass(topImage, slideshow.moveClasses[1]);
          topImage.addEventListener('transitionend', function cbn(event) {
            // reset animating property and selectedIndex index
            resetSelectedIndex(slideshow);
            slideshow.animating = false;
            topImage.removeEventListener("transitionend", cbn);
          });
        }, 10);
      }, 10);
		});
  };

  var tiltedSlideshow = document.getElementsByClassName('js-tilted-slideshow'),
    animateImgs = !Util.osHasReducedMotion() && ('CSS' in window) && CSS.supports('color', 'var(--color-var)');
  if(tiltedSlideshow.length > 0) {
    for(var i = 0; i < tiltedSlideshow.length; i++) {
      new TiltedSlideshow(tiltedSlideshow[i]);
    }
  }
}());
// File#: _1_tooltip
// Usage: codyhouse.co/license
(function() {
	var Tooltip = function(element) {
		this.element = element;
		this.tooltip = false;
		this.tooltipIntervalId = false;
		this.tooltipContent = this.element.getAttribute('title');
		this.tooltipPosition = (this.element.getAttribute('data-tooltip-position')) ? this.element.getAttribute('data-tooltip-position') : 'top';
		this.tooltipClasses = (this.element.getAttribute('data-tooltip-class')) ? this.element.getAttribute('data-tooltip-class') : false;
		this.tooltipId = 'js-tooltip-element'; // id of the tooltip element -> trigger will have the same aria-describedby attr
		// there are cases where you only need the aria-label -> SR do not need to read the tooltip content (e.g., footnotes)
		this.tooltipDescription = (this.element.getAttribute('data-tooltip-describedby') && this.element.getAttribute('data-tooltip-describedby') == 'false') ? false : true; 

		this.tooltipDelay = 300; // show tooltip after a delay (in ms)
		this.tooltipDelta = 10; // distance beetwen tooltip and trigger element (in px)
		this.tooltipTriggerHover = false;
		// tooltp sticky option
		this.tooltipSticky = (this.tooltipClasses && this.tooltipClasses.indexOf('tooltip--sticky') > -1);
		this.tooltipHover = false;
		if(this.tooltipSticky) {
			this.tooltipHoverInterval = false;
		}
		// tooltip triangle - css variable to control its position
		this.tooltipTriangleVar = '--tooltip-triangle-translate';
		resetTooltipContent(this);
		initTooltip(this);
	};

	function resetTooltipContent(tooltip) {
		var htmlContent = tooltip.element.getAttribute('data-tooltip-title');
		if(htmlContent) {
			tooltip.tooltipContent = htmlContent;
		}
	};

	function initTooltip(tooltipObj) {
		// reset trigger element
		tooltipObj.element.removeAttribute('title');
		tooltipObj.element.setAttribute('tabindex', '0');
		// add event listeners
		tooltipObj.element.addEventListener('mouseenter', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('focus', handleEvent.bind(tooltipObj));
	};

	function removeTooltipEvents(tooltipObj) {
		// remove event listeners
		tooltipObj.element.removeEventListener('mouseleave',  handleEvent.bind(tooltipObj));
		tooltipObj.element.removeEventListener('blur',  handleEvent.bind(tooltipObj));
	};

	function handleEvent(event) {
		// handle events
		switch(event.type) {
			case 'mouseenter':
			case 'focus':
				showTooltip(this, event);
				break;
			case 'mouseleave':
			case 'blur':
				checkTooltip(this);
				break;
			case 'newContent':
				changeTooltipContent(this, event);
				break;
		}
	};

	function showTooltip(tooltipObj, event) {
		// tooltip has already been triggered
		if(tooltipObj.tooltipIntervalId) return;
		tooltipObj.tooltipTriggerHover = true;
		// listen to close events
		tooltipObj.element.addEventListener('mouseleave', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('blur', handleEvent.bind(tooltipObj));
		// custom event to reset tooltip content
		tooltipObj.element.addEventListener('newContent', handleEvent.bind(tooltipObj));

		// show tooltip with a delay
		tooltipObj.tooltipIntervalId = setTimeout(function(){
			createTooltip(tooltipObj);
		}, tooltipObj.tooltipDelay);
	};

	function createTooltip(tooltipObj) {
		tooltipObj.tooltip = document.getElementById(tooltipObj.tooltipId);
		
		if( !tooltipObj.tooltip ) { // tooltip element does not yet exist
			tooltipObj.tooltip = document.createElement('div');
			document.body.appendChild(tooltipObj.tooltip);
		} 

		// remove data-reset attribute that is used when updating tooltip content (newContent custom event)
		tooltipObj.tooltip.removeAttribute('data-reset');
		
		// reset tooltip content/position
		Util.setAttributes(tooltipObj.tooltip, {'id': tooltipObj.tooltipId, 'class': 'tooltip tooltip--is-hidden js-tooltip', 'role': 'tooltip'});
		tooltipObj.tooltip.innerHTML = tooltipObj.tooltipContent;
		if(tooltipObj.tooltipDescription) tooltipObj.element.setAttribute('aria-describedby', tooltipObj.tooltipId);
		if(tooltipObj.tooltipClasses) Util.addClass(tooltipObj.tooltip, tooltipObj.tooltipClasses);
		if(tooltipObj.tooltipSticky) Util.addClass(tooltipObj.tooltip, 'tooltip--sticky');
		placeTooltip(tooltipObj);
		Util.removeClass(tooltipObj.tooltip, 'tooltip--is-hidden');

		// if tooltip is sticky, listen to mouse events
		if(!tooltipObj.tooltipSticky) return;
		tooltipObj.tooltip.addEventListener('mouseenter', function cb(){
			tooltipObj.tooltipHover = true;
			if(tooltipObj.tooltipHoverInterval) {
				clearInterval(tooltipObj.tooltipHoverInterval);
				tooltipObj.tooltipHoverInterval = false;
			}
			tooltipObj.tooltip.removeEventListener('mouseenter', cb);
			tooltipLeaveEvent(tooltipObj);
		});
	};

	function tooltipLeaveEvent(tooltipObj) {
		tooltipObj.tooltip.addEventListener('mouseleave', function cb(){
			tooltipObj.tooltipHover = false;
			tooltipObj.tooltip.removeEventListener('mouseleave', cb);
			hideTooltip(tooltipObj);
		});
	};

	function placeTooltip(tooltipObj) {
		// set top and left position of the tooltip according to the data-tooltip-position attr of the trigger
		var dimention = [tooltipObj.tooltip.offsetHeight, tooltipObj.tooltip.offsetWidth],
			positionTrigger = tooltipObj.element.getBoundingClientRect(),
			position = [],
			scrollY = window.scrollY || window.pageYOffset;
		
		position['top'] = [ (positionTrigger.top - dimention[0] - tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['bottom'] = [ (positionTrigger.bottom + tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['left'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.left - dimention[1] - tooltipObj.tooltipDelta];
		position['right'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.right + tooltipObj.tooltipDelta];
		
		var direction = tooltipObj.tooltipPosition;
		if( direction == 'top' && position['top'][0] < scrollY) direction = 'bottom';
		else if( direction == 'bottom' && position['bottom'][0] + tooltipObj.tooltipDelta + dimention[0] > scrollY + window.innerHeight) direction = 'top';
		else if( direction == 'left' && position['left'][1] < 0 )  direction = 'right';
		else if( direction == 'right' && position['right'][1] + dimention[1] > window.innerWidth ) direction = 'left';

		// reset tooltip triangle translate value
		tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, '0px');
		
		if(direction == 'top' || direction == 'bottom') {
			var deltaMarg = 5;
			if(position[direction][1] < 0 ) {
				position[direction][1] = deltaMarg;
				// make sure triangle is at the center of the tooltip trigger
				tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, (positionTrigger.left + 0.5*positionTrigger.width - 0.5*dimention[1] - deltaMarg)+'px');
			}
			if(position[direction][1] + dimention[1] > window.innerWidth ) {
				position[direction][1] = window.innerWidth - dimention[1] - deltaMarg;
				// make sure triangle is at the center of the tooltip trigger
				tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, (0.5*dimention[1] - (window.innerWidth - positionTrigger.right) - 0.5*positionTrigger.width + deltaMarg)+'px');
			}
		}
		tooltipObj.tooltip.style.top = position[direction][0]+'px';
		tooltipObj.tooltip.style.left = position[direction][1]+'px';
		Util.addClass(tooltipObj.tooltip, 'tooltip--'+direction);
	};

	function checkTooltip(tooltipObj) {
		tooltipObj.tooltipTriggerHover = false;
		if(!tooltipObj.tooltipSticky) hideTooltip(tooltipObj);
		else {
			if(tooltipObj.tooltipHover) return;
			if(tooltipObj.tooltipHoverInterval) return;
			tooltipObj.tooltipHoverInterval = setTimeout(function(){
				hideTooltip(tooltipObj); 
				tooltipObj.tooltipHoverInterval = false;
			}, 300);
		}
	};

	function hideTooltip(tooltipObj) {
		if(tooltipObj.tooltipHover || tooltipObj.tooltipTriggerHover) return;
		clearInterval(tooltipObj.tooltipIntervalId);
		if(tooltipObj.tooltipHoverInterval) {
			clearInterval(tooltipObj.tooltipHoverInterval);
			tooltipObj.tooltipHoverInterval = false;
		}
		tooltipObj.tooltipIntervalId = false;
		if(!tooltipObj.tooltip) return;
		// hide tooltip
		removeTooltip(tooltipObj);
		// remove events
		removeTooltipEvents(tooltipObj);
	};

	function removeTooltip(tooltipObj) {
		if(tooltipObj.tooltipContent == tooltipObj.tooltip.innerHTML || tooltipObj.tooltip.getAttribute('data-reset') == 'on') {
			Util.addClass(tooltipObj.tooltip, 'tooltip--is-hidden');
			tooltipObj.tooltip.removeAttribute('data-reset');
		}
		if(tooltipObj.tooltipDescription) tooltipObj.element.removeAttribute('aria-describedby');
	};

	function changeTooltipContent(tooltipObj, event) {
		if(tooltipObj.tooltip && tooltipObj.tooltipTriggerHover && event.detail) {
			tooltipObj.tooltip.innerHTML = event.detail;
			tooltipObj.tooltip.setAttribute('data-reset', 'on');
			placeTooltip(tooltipObj);
		}
	};

	window.Tooltip = Tooltip;

	//initialize the Tooltip objects
	var tooltips = document.getElementsByClassName('js-tooltip-trigger');
	if( tooltips.length > 0 ) {
		for( var i = 0; i < tooltips.length; i++) {
			(function(i){new Tooltip(tooltips[i]);})(i);
		}
	}
}());
// File#: _2_dropdown
// Usage: codyhouse.co/license
(function() {
	var Dropdown = function(element) {
		this.element = element;
		this.trigger = this.element.getElementsByClassName('js-dropdown__trigger')[0];
		this.dropdown = this.element.getElementsByClassName('js-dropdown__menu')[0];
		this.triggerFocus = false;
		this.dropdownFocus = false;
		this.hideInterval = false;
		// sublevels
		this.dropdownSubElements = this.element.getElementsByClassName('js-dropdown__sub-wrapper');
		this.prevFocus = false; // store element that was in focus before focus changed
		this.addDropdownEvents();
	};
	
	Dropdown.prototype.addDropdownEvents = function(){
		//place dropdown
		var self = this;
		this.placeElement();
		this.element.addEventListener('placeDropdown', function(event){
			self.placeElement();
		});
		// init dropdown
		this.initElementEvents(this.trigger, this.triggerFocus); // this is used to trigger the primary dropdown
		this.initElementEvents(this.dropdown, this.dropdownFocus); // this is used to trigger the primary dropdown
		// init sublevels
		this.initSublevels(); // if there are additional sublevels -> bind hover/focus events
	};

	Dropdown.prototype.placeElement = function() {
		// remove inline style first
		this.dropdown.removeAttribute('style');
		// check dropdown position
		var triggerPosition = this.trigger.getBoundingClientRect(),
			isRight = (window.innerWidth < triggerPosition.left + parseInt(getComputedStyle(this.dropdown).getPropertyValue('width')));

		var xPosition = isRight ? 'right: 0px; left: auto;' : 'left: 0px; right: auto;';
		this.dropdown.setAttribute('style', xPosition);
	};

	Dropdown.prototype.initElementEvents = function(element, bool) {
		var self = this;
		element.addEventListener('mouseenter', function(){
			bool = true;
			self.showDropdown();
		});
		element.addEventListener('focus', function(){
			self.showDropdown();
		});
		element.addEventListener('mouseleave', function(){
			bool = false;
			self.hideDropdown();
		});
		element.addEventListener('focusout', function(){
			self.hideDropdown();
		});
	};

	Dropdown.prototype.showDropdown = function(){
		if(this.hideInterval) clearInterval(this.hideInterval);
		// remove style attribute
		this.dropdown.removeAttribute('style');
		this.placeElement();
		this.showLevel(this.dropdown, true);
	};

	Dropdown.prototype.hideDropdown = function(){
		var self = this;
		if(this.hideInterval) clearInterval(this.hideInterval);
		this.hideInterval = setTimeout(function(){
			var dropDownFocus = document.activeElement.closest('.js-dropdown'),
				inFocus = dropDownFocus && (dropDownFocus == self.element);
			// if not in focus and not hover -> hide
			if(!self.triggerFocus && !self.dropdownFocus && !inFocus) {
				self.hideLevel(self.dropdown, true);
				// make sure to hide sub/dropdown
				self.hideSubLevels();
				self.prevFocus = false;
			}
		}, 300);
	};

	Dropdown.prototype.initSublevels = function(){
		var self = this;
		var dropdownMenu = this.element.getElementsByClassName('js-dropdown__menu');
		for(var i = 0; i < dropdownMenu.length; i++) {
			var listItems = dropdownMenu[i].children;
			// bind hover
	    new menuAim({
	      menu: dropdownMenu[i],
	      activate: function(row) {
	      	var subList = row.getElementsByClassName('js-dropdown__menu')[0];
	      	if(!subList) return;
	      	Util.addClass(row.querySelector('a'), 'dropdown__item--hover');
	      	self.showLevel(subList);
	      },
	      deactivate: function(row) {
	      	var subList = row.getElementsByClassName('dropdown__menu')[0];
	      	if(!subList) return;
	      	Util.removeClass(row.querySelector('a'), 'dropdown__item--hover');
	      	self.hideLevel(subList);
	      },
	      submenuSelector: '.js-dropdown__sub-wrapper',
	    });
		}
		// store focus element before change in focus
		this.element.addEventListener('keydown', function(event) { 
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				self.prevFocus = document.activeElement;
			}
		});
		// make sure that sublevel are visible when their items are in focus
		this.element.addEventListener('keyup', function(event) {
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				// focus has been moved -> make sure the proper classes are added to subnavigation
				var focusElement = document.activeElement,
					focusElementParent = focusElement.closest('.js-dropdown__menu'),
					focusElementSibling = focusElement.nextElementSibling;

				// if item in focus is inside submenu -> make sure it is visible
				if(focusElementParent && !Util.hasClass(focusElementParent, 'dropdown__menu--is-visible')) {
					self.showLevel(focusElementParent);
				}
				// if item in focus triggers a submenu -> make sure it is visible
				if(focusElementSibling && !Util.hasClass(focusElementSibling, 'dropdown__menu--is-visible')) {
					self.showLevel(focusElementSibling);
				}

				// check previous element in focus -> hide sublevel if required 
				if( !self.prevFocus) return;
				var prevFocusElementParent = self.prevFocus.closest('.js-dropdown__menu'),
					prevFocusElementSibling = self.prevFocus.nextElementSibling;
				
				if( !prevFocusElementParent ) return;
				
				// element in focus and element prev in focus are siblings
				if( focusElementParent && focusElementParent == prevFocusElementParent) {
					if(prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
					return;
				}

				// element in focus is inside submenu triggered by element prev in focus
				if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;
				
				// shift tab -> element in focus triggers the submenu of the element prev in focus
				if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;
				
				var focusElementParentParent = focusElementParent.parentNode.closest('.js-dropdown__menu');
				
				// shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
				if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
					if(prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
					return;
				}
				
				if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'dropdown__menu--is-visible')) {
					self.hideLevel(prevFocusElementParent);
				}
			}
		});
	};

	Dropdown.prototype.hideSubLevels = function(){
		var visibleSubLevels = this.dropdown.getElementsByClassName('dropdown__menu--is-visible');
		if(visibleSubLevels.length == 0) return;
		while (visibleSubLevels[0]) {
			this.hideLevel(visibleSubLevels[0]);
	 	}
	 	var hoveredItems = this.dropdown.getElementsByClassName('dropdown__item--hover');
	 	while (hoveredItems[0]) {
			Util.removeClass(hoveredItems[0], 'dropdown__item--hover');
	 	}
	};

	Dropdown.prototype.showLevel = function(level, bool){
		if(bool == undefined) {
			//check if the sublevel needs to be open to the left
			Util.removeClass(level, 'dropdown__menu--left');
			var boundingRect = level.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'dropdown__menu--left');
		}
		Util.addClass(level, 'dropdown__menu--is-visible');
		Util.removeClass(level, 'dropdown__menu--is-hidden');
	};

	Dropdown.prototype.hideLevel = function(level, bool){
		if(!Util.hasClass(level, 'dropdown__menu--is-visible')) return;
		Util.removeClass(level, 'dropdown__menu--is-visible');
		Util.addClass(level, 'dropdown__menu--is-hidden');
		
		level.addEventListener('transitionend', function cb(event){
			if(event.propertyName != 'opacity') return;
			level.removeEventListener('transitionend', cb);
			if(Util.hasClass(level, 'dropdown__menu--is-hidden')) Util.removeClass(level, 'dropdown__menu--is-hidden dropdown__menu--left');
			if(bool && !Util.hasClass(level, 'dropdown__menu--is-visible')) level.setAttribute('style', 'width: 0px; overflow: hidden;');
		});
	};

	window.Dropdown = Dropdown;

	var dropdown = document.getElementsByClassName('js-dropdown');
	if( dropdown.length > 0 ) { // init Dropdown objects
		for( var i = 0; i < dropdown.length; i++) {
			(function(i){new Dropdown(dropdown[i]);})(i);
		}
	}
}());
// File#: _2_points-of-interest
// Usage: codyhouse.co/license
(function() {
  function initPoi(element) {
    element.addEventListener('click', function(event){
      var poiItem = event.target.closest('.js-poi__item');
      if(poiItem) Util.addClass(poiItem, 'poi__item--visited');
    });
  };

  var poi = document.getElementsByClassName('js-poi');
  for(var i = 0; i < poi.length; i++) {
    (function(i){initPoi(poi[i]);})(i);
  }
}());
// File#: _2_image-zoom
// Usage: codyhouse.co/license

(function() {
  var ImageZoom = function(element, index) {
    this.element = element;
    this.lightBoxId = 'img-zoom-lightbox--'+index;
    this.imgPreview = this.element.getElementsByClassName('js-image-zoom__preview')[0];
    
    initImageZoomHtml(this); // init markup
    
    this.lightbox = document.getElementById(this.lightBoxId);
    this.imgEnlg = this.lightbox.getElementsByClassName('js-image-zoom__fw')[0];
    this.input = this.element.getElementsByClassName('js-image-zoom__input')[0];
    this.animate = this.element.getAttribute('data-morph') != 'off';
    
    initImageZoomEvents(this); //init events
  };

  function initImageZoomHtml(imageZoom) {
    // get zoomed image url
    var url = imageZoom.element.getAttribute('data-img');
    if(!url) url = imageZoom.imgPreview.getAttribute('src');

    var lightBox = document.createElement('div');
    Util.setAttributes(lightBox, {class: 'image-zoom__lightbox js-image-zoom__lightbox', id: imageZoom.lightBoxId, 'aria-hidden': 'true'});
    lightBox.innerHTML = '<img src="'+url+'" class="js-image-zoom__fw"></img>';
    document.body.appendChild(lightBox);
    
    var keyboardInput = '<input aria-hidden="true" type="checkbox" class="image-zoom__input js-image-zoom__input"></input>';
    imageZoom.element.insertAdjacentHTML('afterbegin', keyboardInput);

  };

  function initImageZoomEvents(imageZoom) {
    // toggle lightbox on click
    imageZoom.imgPreview.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, true);
      imageZoom.input.checked = true;
    });
    imageZoom.lightbox.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // detect swipe down to close lightbox
    new SwipeContent(imageZoom.lightbox);
    imageZoom.lightbox.addEventListener('swipeDown', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // keyboard accessibility
    imageZoom.input.addEventListener('change', function(event){
      toggleFullWidth(imageZoom, imageZoom.input.checked);
    });
    imageZoom.input.addEventListener('keydown', function(event){
      if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
        imageZoom.input.checked = !imageZoom.input.checked;
        toggleFullWidth(imageZoom, imageZoom.input.checked);
      }
    });
  };

  function toggleFullWidth(imageZoom, bool) {
    if(animationSupported && imageZoom.animate) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateZoomImage(imageZoom, bool);
      });
    } else { // show lightbox without animation
      Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  function animateZoomImage(imageZoom, bool) {
    // get img preview position and dimension for the morphing effect
    var rect = imageZoom.imgPreview.getBoundingClientRect(),
      finalWidth = imageZoom.lightbox.getBoundingClientRect().width;
    var init = (bool) ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth],
      final = (bool) ? [-rect.top, -rect.left, parseFloat(finalWidth/rect.width)] : [rect.top + imageZoom.lightbox.scrollTop, rect.left, parseFloat(rect.width/finalWidth)];
    
    if(bool) {
      imageZoom.imgEnlg.setAttribute('style', 'top: '+init[0]+'px; left:'+init[1]+'px; width:'+init[2]+'px;');
    }
    
    // show modal
    Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');

    imageZoom.imgEnlg.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(!bool) Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');
      Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
      imageZoom.imgEnlg.removeAttribute('style');
      imageZoom.imgEnlg.removeEventListener('transitionend', cb);
    });
    
    // animate image and bg
    imageZoom.imgEnlg.style.transform = 'translateX('+final[1]+'px) translateY('+final[0]+'px) scale('+final[2]+')';
    Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  // init ImageZoom object
  var imageZoom = document.getElementsByClassName('js-image-zoom'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( imageZoom.length > 0 ) {
    var imageZoomArray = [];
    for( var i = 0; i < imageZoom.length; i++) {
      imageZoomArray.push(new ImageZoom(imageZoom[i], i));
    }

    // close Zoom Image lightbox on Esc
    window.addEventListener('keydown', function(event){
      if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'esc')) {
        for( var i = 0; i < imageZoomArray.length; i++) {
          imageZoomArray[i].input.checked = false;
          if(Util.hasClass(imageZoomArray[i].lightbox, 'image-zoom__lightbox--is-visible')) toggleFullWidth(imageZoomArray[i], false);
        }
      }
    });
  }
}());
// File#: _2_menu-bar
// Usage: codyhouse.co/license
(function() {
  var MenuBar = function(element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, 'menu-bar__item');
    this.mobHideItems = this.element.getElementsByClassName('menu-bar__item--hide');
    this.moreItemsTrigger = this.element.getElementsByClassName('js-menu-bar__trigger');
    initMenuBar(this);
  };

  function initMenuBar(menu) {
    setMenuTabIndex(menu); // set correct tabindexes for menu item
    initMenuBarMarkup(menu); // create additional markup
    checkMenuLayout(menu); // set menu layout
    Util.addClass(menu.element, 'menu-bar--loaded'); // reveal menu

    // custom event emitted when window is resized
    menu.element.addEventListener('update-menu-bar', function(event){
      checkMenuLayout(menu);
      if(menu.menuInstance) menu.menuInstance.toggleMenu(false, false); // close dropdown
    });

    // keyboard events 
    // open dropdown when pressing Enter on trigger element
    if(menu.moreItemsTrigger.length > 0) {
      menu.moreItemsTrigger[0].addEventListener('keydown', function(event) {
        if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
          if(!menu.menuInstance) return;
          menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
          menu.menuInstance.toggleMenu(!Util.hasClass(menu.subMenu, 'menu--is-visible'), true);
        }
      });

      // close dropdown on esc
      menu.subMenu.addEventListener('keydown', function(event) {
        if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) { // close submenu on esc
          if(menu.menuInstance) menu.menuInstance.toggleMenu(false, true);
        }
      });
    }
    
    // navigate menu items using left/right arrows
    menu.element.addEventListener('keydown', function(event) {
      if( (event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright') ) {
        navigateItems(menu.items, event, 'next');
      } else if( (event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft') ) {
        navigateItems(menu.items, event, 'prev');
      }
    });
  };

  function setMenuTabIndex(menu) { // set tabindexes for the menu items to allow keyboard navigation
    var nextItem = false;
    for(var i = 0; i < menu.items.length; i++ ) {
      if(i == 0 || nextItem) menu.items[i].setAttribute('tabindex', '0');
      else menu.items[i].setAttribute('tabindex', '-1');
      if(i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
      else nextItem = false;
    }
  };

  function initMenuBarMarkup(menu) {
    if(menu.mobHideItems.length == 0 ) { // no items to hide on mobile - remove trigger
      if(menu.moreItemsTrigger.length > 0) menu.element.removeChild(menu.moreItemsTrigger[0]);
      return;
    }

    if(menu.moreItemsTrigger.length == 0) return;

    // create the markup for the Menu element
    var content = '';
    menu.menuControlId = 'submenu-bar-'+Date.now();
    for(var i = 0; i < menu.mobHideItems.length; i++) {
      var item = menu.mobHideItems[i].cloneNode(true),
        svg = item.getElementsByTagName('svg')[0],
        label = item.getElementsByClassName('menu-bar__label')[0];

      svg.setAttribute('class', 'icon menu__icon');
      content = content + '<li role="menuitem"><span class="menu__content js-menu__content">'+svg.outerHTML+'<span>'+label.innerHTML+'</span></span></li>';
    }

    Util.setAttributes(menu.moreItemsTrigger[0], {'role': 'button', 'aria-expanded': 'false', 'aria-controls': menu.menuControlId, 'aria-haspopup': 'true'});

    var subMenu = document.createElement('menu'),
      customClass = menu.element.getAttribute('data-menu-class');
    Util.setAttributes(subMenu, {'id': menu.menuControlId, 'class': 'menu js-menu '+customClass});
    subMenu.innerHTML = content;
    document.body.appendChild(subMenu);

    menu.subMenu = subMenu;
    menu.subItems = subMenu.getElementsByTagName('li');

    menu.menuInstance = new Menu(menu.subMenu); // this will handle the dropdown behaviour
  };

  function checkMenuLayout(menu) { // switch from compressed to expanded layout and viceversa
    var layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(menu.element, 'menu-bar--collapsed', layout == 'collapsed');
  };

  function navigateItems(list, event, direction, prevIndex) { // keyboard navigation among menu items
    event.preventDefault();
    var index = (typeof prevIndex !== 'undefined') ? prevIndex : Util.getIndexInArray(list, event.target),
      nextIndex = direction == 'next' ? index + 1 : index - 1;
    if(nextIndex < 0) nextIndex = list.length - 1;
    if(nextIndex > list.length - 1) nextIndex = 0;
    // check if element is visible before moving focus
    (list[nextIndex].offsetParent === null) ? navigateItems(list, event, direction, nextIndex) : Util.moveFocus(list[nextIndex]);
  };

  function checkMenuClick(menu, target) { // close dropdown when clicking outside the menu element
    if(menu.menuInstance && !menu.moreItemsTrigger[0].contains(target) && !menu.subMenu.contains(target)) menu.menuInstance.toggleMenu(false, false);
  };

  // init MenuBars objects
  var menuBars = document.getElementsByClassName('js-menu-bar');
  if( menuBars.length > 0 ) {
    var j = 0,
      menuBarArray = [];
    for( var i = 0; i < menuBars.length; i++) {
      var beforeContent = getComputedStyle(menuBars[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){menuBarArray.push(new MenuBar(menuBars[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-menu-bar');
      // update Menu Bar layout on resize  
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 150);
      });

      // close menu when clicking outside it
      window.addEventListener('click', function(event){
        menuBarArray.forEach(function(element){
          checkMenuClick(element, event.target);
        });
      });

      function doneResizing() {
        for( var i = 0; i < menuBars.length; i++) {
          (function(i){menuBars[i].dispatchEvent(customEvent)})(i);
        };
      };
    }
  }
}());
// File#: _2_pricing-table-v2
// Usage: codyhouse.co/license
(function() {
	var pTable = document.getElementsByClassName('js-p-table-v2');
	if(pTable.length > 0) {
		for(var i = 0; i < pTable.length; i++) {
			(function(i){ addPTableEvent(pTable[i]);})(i);
		}

		function addPTableEvent(element) {
			// switcher monthly/yearly plan
      var pSwitch = element.getElementsByClassName('js-p-table-v2__switch');
			if(pSwitch.length > 0) {
				pSwitch[0].addEventListener('change', function(event) {
          Util.toggleClass(element, 'p-table-v2--monthly-plan', (event.target.value == 'monthly'));
				});
			}

			// volume selector for multiple-users plan
			var pSelect = element.getElementsByClassName('js-p-table-v2__select'),
				pVolumeBtn = element.getElementsByClassName('js-p-table-v2__btn-volume');
			if(pSelect.length > 0 && pVolumeBtn.length > 0) {
				var volumeOptions = pVolumeBtn[0].querySelectorAll('[data-value]');
				updatePTableTeam(volumeOptions, pSelect[0].value); // init multiple-users plan price
				pSelect[0].addEventListener('change', function(event) {
          updatePTableTeam(volumeOptions, pSelect[0].value);
				});
			}
		}

		function updatePTableTeam(volumeOpt, value) {
			for(var i = 0; i < volumeOpt.length; i++) {
				volumeOpt[i].getAttribute('data-value') == value
					? volumeOpt[i].removeAttribute('style')
					: volumeOpt[i].setAttribute('style', 'display: none;');
			}
		};
	}
}());
// File#: _2_pricing-table
// Usage: codyhouse.co/license
(function() {
	// NOTE: you need the js code only when using the --has-switch variation of the pricing table
	// default version does not require js
	var pTable = document.getElementsByClassName('js-p-table--has-switch');
	if(pTable.length > 0) {
		for(var i = 0; i < pTable.length; i++) {
			(function(i){ addPTableEvent(pTable[i]);})(i);
		}

		function addPTableEvent(element) {
			var pSwitch = element.getElementsByClassName('js-p-table__switch')[0];
			if(pSwitch) {
				pSwitch.addEventListener('change', function(event) {
          Util.toggleClass(element, 'p-table--yearly', (event.target.value == 'yearly'));
				});
			}
		}
	}
}());
// File#: _2_slider-multi-value
// Usage: codyhouse.co/license
(function() {
	var SliderMulti = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		initSliderMulti(this);
	};

	function initSliderMulti(slider) {
		// toggle custom class based on browser support
		toggleMsClass(slider);

		// init bg color of the slider
		updateRangeColor(slider);

		slider.element.addEventListener('updateRange', function(event){
			checkRangeValues(slider, event.detail);
			updateRangeColor(slider);
		});

		// custom event emitted after window resize
		slider.element.addEventListener('update-slider-multi-value', function(event){
			slider.sliderWidth = window.getComputedStyle(slider.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
			updateRangeColor(slider);
		});
	};

	function checkRangeValues(slider, index) {
		// if min value was changed -> make sure min value is smaller than max value 
		// if max value was changed -> make sure max value is bigger than min value 
		var i = (index == 0) ? 1 : 0,
			limit = parseFloat(slider.rangeInput[i].value);
		if( (index == 0 && slider.rangeInput[0].value >= limit) || (index == 1 && slider.rangeInput[1].value <= limit) ) {
			slider.rangeInput[index].value = limit;
			slider.element.dispatchEvent(new CustomEvent('inputRangeLimit', {detail: index}))
		}
	};

	function updateRangeColor(slider) { // update background fill color of the slider
		var percentageStart = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			percentageEnd = parseInt((slider.rangeInput[1].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100), 
			start = 'calc('+percentageStart+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			end = 'calc('+percentageEnd+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-start', start);
		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-end', end);
	};

	function toggleMsClass(slider) {
		var cssVariablesSupport = Util.cssSupports('--color-value', 'red'),
			imeAlignSuport = Util.cssSupports('-ms-ime-align', 'auto');
		if(imeAlignSuport || !cssVariablesSupport) Util.addClass(slider.element, 'slider--ms-fallback'); // IE and Edge (<=18) Fallback
	};

	//initialize the SliderMulti objects
	var slidersMulti = document.getElementsByClassName('js-slider');
	if( slidersMulti.length > 0 ) {
		var slidersMultiArray = [];
		for( var i = 0; i < slidersMulti.length; i++) {(function(i){
			if(slidersMulti[i].getElementsByClassName('slider__input').length > 1) slidersMultiArray.push(new SliderMulti(slidersMulti[i]));
		})(i);}
		if(slidersMultiArray.length > 0) {
			var resizingId = false,
        customEvent = new CustomEvent('update-slider-multi-value');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for( var i = 0; i < slidersMultiArray.length; i++) {
          (function(i){slidersMultiArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
		}
	}
}());
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
	var Slideshow = function(opts) {
		this.options = Util.extend(Slideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');
		this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
		this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
		this.animatingClass = 'slideshow--is-animating';
		initSlideshow(this);
		initSlideshowEvents(this);
		initAnimationEndEvents(this);
	};

	Slideshow.prototype.showNext = function() {
		showNewItem(this, this.selectedSlide + 1, 'next');
	};

	Slideshow.prototype.showPrev = function() {
		showNewItem(this, this.selectedSlide - 1, 'prev');
	};

	Slideshow.prototype.showItem = function(index) {
		showNewItem(this, index, false);
	};

	Slideshow.prototype.startAutoplay = function() {
		var self = this;
		if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
			self.autoplayId = setInterval(function(){
				self.showNext();
			}, self.options.autoplayInterval);
		}
	};

	Slideshow.prototype.pauseAutoplay = function() {
		var self = this;
		if(this.options.autoplay) {
			clearInterval(self.autoplayId);
			self.autoplayId = false;
		}
	};

	function initSlideshow(slideshow) { // basic slideshow settings
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
	};

	function initSlideshowEvents(slideshow) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			// check if navigation has already been included
			if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
				var navigation = document.createElement('ol'),
					navChildren = '';

				var navClasses = slideshow.options.navigationClass+' js-slideshow__navigation';
				if(slideshow.items.length <= 1) {
					navClasses = navClasses + ' is-hidden';
				}
				
				navigation.setAttribute('class', navClasses);
				for(var i = 0; i < slideshow.items.length; i++) {
					var className = (i == slideshow.selectedSlide) ? 'class="'+slideshow.options.navigationItemClass+' '+slideshow.options.navigationItemClass+'--selected js-slideshow__nav-item"' :  'class="'+slideshow.options.navigationItemClass+' js-slideshow__nav-item"',
						navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
					navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
				}
				navigation.innerHTML = navChildren;
				slideshow.element.appendChild(navigation);
			}
			
			slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
			slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

			var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

			dotsNavigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			dotsNavigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		// slideshow arrow controls
		if(slideshow.controls.length > 0) {
			// hide controls if one item available
			if(slideshow.items.length <= 1) {
				Util.addClass(slideshow.controls[0], 'is-hidden');
				Util.addClass(slideshow.controls[1], 'is-hidden');
			}
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showPrev();
				updateAriaLive(slideshow);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showNext();
				updateAriaLive(slideshow);
			});
		}
		// swipe events
		if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				slideshow.showNext();
			});
			slideshow.element.addEventListener('swipeRight', function(event){
				slideshow.showPrev();
			});
		}
		// autoplay
		if(slideshow.options.autoplay) {
			slideshow.startAutoplay();
			// pause autoplay if user is interacting with the slideshow
			if(!slideshow.options.autoplayOnHover) {
				slideshow.element.addEventListener('mouseenter', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('mouseleave', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
			if(!slideshow.options.autoplayOnFocus) {
				slideshow.element.addEventListener('focusin', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('focusout', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
		}
		// detect if external buttons control the slideshow
		var slideshowId = slideshow.element.getAttribute('id');
		if(slideshowId) {
			var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
			for(var i = 0; i < externalControls.length; i++) {
				(function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
			}
		}
		// custom event to trigger selection of a new slide element
		slideshow.element.addEventListener('selectNewItem', function(event){
			// check if slide is already selected
			if(event.detail) {
				if(event.detail - 1 == slideshow.selectedSlide) return;
				showNewItem(slideshow, event.detail - 1, false);
			}
		});

		// keyboard navigation
		slideshow.element.addEventListener('keydown', function(event){
			if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
				slideshow.showNext();
			} else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
				slideshow.showPrev();
			}
		});
	};

	function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow navigation -> update visible slide
		var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
			slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
			slideshow.moveFocus = true;
			updateAriaLive(slideshow);
		}
	};

	function initAnimationEndEvents(slideshow) {
		// remove animation classes at the end of a slide transition
		for( var i = 0; i < slideshow.items.length; i++) {
			(function(i){
				slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
				slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
			})(i);
		}
	};

	function resetAnimationEnd(slideshow, item) {
		setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
			if(Util.hasClass(item,'slideshow__item--selected')) {
				if(slideshow.moveFocus) Util.moveFocus(item);
				emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
				slideshow.moveFocus = false;
			}
			Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
			item.removeAttribute('aria-hidden');
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass); 
		}, 100);
	};

	function showNewItem(slideshow, index, bool) {
		if(slideshow.items.length <= 1) return;
		if(slideshow.animating && slideshow.supportAnimation) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass); 
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// skip slideshow item if it is hidden
		if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
			slideshow.animating = false;
			index = bool == 'next' ? index + 1 : index - 1;
			showNewItem(slideshow, index, bool);
			return;
		}
		// index of new slide is equal to index of slide selected item
		if(index == slideshow.selectedSlide) {
			slideshow.animating = false;
			return;
		}
		var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
		var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
		// transition between slides
		if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
		Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
		slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
		if(slideshow.animationOff) {
			Util.addClass(slideshow.items[index], 'slideshow__item--selected');
		} else {
			Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
		}
		// reset slider navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		slideshow.selectedSlide = index;
		// reset autoplay
		slideshow.pauseAutoplay();
		slideshow.startAutoplay();
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
		// emit event
		emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
		if(slideshow.animationOff) {
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
		}
	};

	function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
		}
		return className;
	};

	function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
		}
		return className;
	};

	function resetSlideshowNav(slideshow, newIndex, oldIndex) {
		if(slideshow.navigation) {
			Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};

	function resetSlideshowTheme(slideshow, newIndex) {
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

	function emitSlideshowEvent(slideshow, eventName, detail) {
		var event = new CustomEvent(eventName, {detail: detail});
		slideshow.element.dispatchEvent(event);
	};

	function updateAriaLive(slideshow) {
		slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
	};

	function externalControlSlide(slideshow, button) { // control slideshow using external element
		button.addEventListener('click', function(event){
			var index = button.getAttribute('data-index');
			if(!index || index == slideshow.selectedSlide + 1) return;
			event.preventDefault();
			showNewItem(slideshow, index - 1, false);
		});
	};

	Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
		autoplayOnHover: false,
		autoplayOnFocus: false,
    autoplayInterval: 5000,
		navigationItemClass: 'slideshow__nav-item',
    navigationClass: 'slideshow__navigation',
    swipe: false
  };

	window.Slideshow = Slideshow;
	
	//initialize the Slideshow objects
	var slideshows = document.getElementsByClassName('js-slideshow');
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
					autoplayOnFocus = (slideshows[i].getAttribute('data-autoplay-focus') && slideshows[i].getAttribute('data-autoplay-focus') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
					navigationItemClass = slideshows[i].getAttribute('data-navigation-item-class') ? slideshows[i].getAttribute('data-navigation-item-class') : 'slideshow__nav-item',
          navigationClass = slideshows[i].getAttribute('data-navigation-class') ? slideshows[i].getAttribute('data-navigation-class') : 'slideshow__navigation';
				new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayOnFocus: autoplayOnFocus, autoplayInterval : autoplayInterval, swipe : swipe, navigationItemClass: navigationItemClass, navigationClass: navigationClass});
			})(i);
		}
	}
}());
// File#: _2_svg-slideshow
// Usage: codyhouse.co/license
(function() {
  var ImgSlideshow = function(opts) {
    this.options = Util.extend(ImgSlideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-svg-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-svg-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.animating = false;
		this.animatingClass = 'svg-slideshow--is-animating';
    // store svg animation paths
		this.masks = this.element.getElementsByClassName('js-svg-slideshow__mask');
    this.maskNext = getMaskPoints(this, 'next');
		this.maskPrev = getMaskPoints(this, 'prev');
		// random number for mask id
		this.maskId = getRandomInt(0, 10000);
		initSlideshow(this);
		initSlideshowEvents(this);
		revealSlideshow(this);
  };

  function getMaskPoints(slideshow, direction) { // store the path points - will be used to transition between slides
    var array = [];
		var index = direction == 'next' ? 0 : 1;
		var groupElements = slideshow.masks[index].getElementsByTagName('g');
		for(var j = 0; j < groupElements.length; j++) {
			array[j] = [];
			var paths =  groupElements[j].getElementsByTagName('path');
			for(var i = 0; i < paths.length; i++) {
				array[j].push(paths[i].getAttribute('d'));
			}
		}
    return array;
	};
	
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};
  
  function initSlideshow(slideshow) { // basic slideshow settings
    // reset slide items content -> replace img element with svg
    for(var i = 0; i < slideshow.items.length; i++) {
      initSlideContent(slideshow, slideshow.items[i], i);
    }
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('svg-slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'svg-slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('svg-slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-svg-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
  };

  function initSlideContent(slideshow, slide, index) {
		// replace each slide content with a svg element including image + clip-path
		var imgElement = slide.getElementsByTagName('img')[0],
			imgPath = imgElement.getAttribute('src'),
      imgAlt =  imgElement.getAttribute('alt'),
			viewBox = slideshow.masks[0].getAttribute('viewBox').split(' '),
      imageCode = '<image height="'+viewBox[3]+'px" width="'+viewBox[2]+'px" clip-path="url(#img-slide-'+slideshow.maskId+'-'+index+')" xlink:href="'+imgPath+'" href="'+imgPath+'"></image>';
		
			var slideContent = '<svg aria-hidden="true" viewBox="0 0 '+viewBox[2]+' '+viewBox[3]+'"><defs><clipPath id="img-slide-'+slideshow.maskId+'-'+index+'">';

			for(var i = 0; i < slideshow.maskNext.length; i++) {
				slideContent = slideContent + '<path d="'+slideshow.maskNext[i][slideshow.maskNext[i].length - 1]+'"></path>';
			}

			slideContent = slideContent + '</clipPath></defs>'+imageCode+'</svg>';

    slide.innerHTML = imgElement.outerHTML + slideContent;
    if(imgAlt) slide.setAttribute('aria-label', imgAlt);
  };

  function initSlideshowEvents(slideshow) {
    // if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			var navigation = document.createElement('ol'),
				navChildren = '';
			
			navigation.setAttribute('class', 'svg-slideshow__navigation');
			for(var i = 0; i < slideshow.items.length; i++) {
				var className = (i == slideshow.selectedSlide) ? 'class="svg-slideshow__nav-item svg-slideshow__nav-item--selected js-svg-slideshow__nav-item"' :  'class="svg-slideshow__nav-item js-svg-slideshow__nav-item"',
					navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-svg-slideshow__nav-current-label">Current Item</span>' : '';
				navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
			}

			navigation.innerHTML = navChildren;
			slideshow.navCurrentLabel = navigation.getElementsByClassName('js-svg-slideshow__nav-current-label')[0]; 
			slideshow.element.appendChild(navigation);
			slideshow.navigation = slideshow.element.getElementsByClassName('js-svg-slideshow__nav-item');

			navigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			navigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
    // slideshow arrow controls
		if(slideshow.controls.length > 0) {
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				showNewItem(slideshow, slideshow.selectedSlide - 1, 'prev', true);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
        showNewItem(slideshow, slideshow.selectedSlide + 1, 'next', true);
			});
    }
    // swipe events
    if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				showNewItem(slideshow, slideshow.selectedSlide + 1, 'next');
			});
			slideshow.element.addEventListener('swipeRight', function(event){
        showNewItem(slideshow, slideshow.selectedSlide - 1, 'prev');
			});
		}
    // autoplay
		if(slideshow.options.autoplay) {
			startAutoplay(slideshow);
			// pause autoplay if user is interacting with the slideshow
			slideshow.element.addEventListener('mouseenter', function(event){
				pauseAutoplay(slideshow);
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('focusin', function(event){
				pauseAutoplay(slideshow);
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('mouseleave', function(event){
				slideshow.autoplayPaused = false;
				startAutoplay(slideshow);
			});
			slideshow.element.addEventListener('focusout', function(event){
				slideshow.autoplayPaused = false;
				startAutoplay(slideshow);
			});
		}
		// init slide theme colors
		resetSlideshowTheme(slideshow, slideshow.selectedSlide);
	};
	
	function revealSlideshow(slideshow) {
		Util.addClass(slideshow.element, 'svg-slideshow--loaded');
	};

  function showNewItem(slideshow, index, direction, bool) { // update visible slide
		if(slideshow.animating) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass);
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// reset dot navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		// animate slide
		newItemAnimate(slideshow, index, slideshow.selectedSlide, direction);
		// if not autoplay, announce new slide to SR
    if(bool) updateAriaLive(slideshow, index); 
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
  };

  function newItemAnimate(slideshow, newIndex, oldIndex, direction) {
    // start slide transition
    var path = slideshow.items[newIndex].getElementsByTagName('path'),
			mask = direction == 'next' ? slideshow.maskNext : slideshow.maskPrev;
		for(var i = 0; i < path.length; i++) {
			path[i].setAttribute('d', mask[i][0]);
		}
    
    Util.addClass(slideshow.items[newIndex], 'svg-slideshow__item--animating');
    morphPath(path, mask, slideshow.options.transitionDuration, function(){ // morph callback function
      slideshow.items[oldIndex].setAttribute('aria-hidden', 'true');
      slideshow.items[newIndex].removeAttribute('aria-hidden');
      Util.addClass(slideshow.items[newIndex], 'svg-slideshow__item--selected');
      Util.removeClass(slideshow.items[newIndex], 'svg-slideshow__item--animating');
      Util.removeClass(slideshow.items[oldIndex], 'svg-slideshow__item--selected');
      slideshow.selectedSlide = newIndex;
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
      // reset autoplay
      pauseAutoplay(slideshow);
      startAutoplay(slideshow);
    });
  };

	function morphPath(path, points, duration, cb) { // morph 
		if(reducedMotion || !animeJSsupported) { // if reducedMotion on or JS animation not supported -> do not animate
			for(var i = 0; i < path.length; i++) {
				path[i].setAttribute('d', points[i][points[i].length - 1]);
			}
			cb();
      return;
		}
		for(var i = 0; i < path.length; i++) {
			var delay = i*100,
				cbFunction = (i == path.length - 1) ? cb : false;
			morphSinglePath(path[i], points[i], delay, duration, cbFunction);
		}
	};
	
	function morphSinglePath(path, points, delay, duration, cb) {
		var dAnimation = (points.length == 3) 
			? [{ value: [points[0], points[1]]}, { value: [points[1], points[2]]}]
			: [{ value: [points[0], points[1]]}];
    anime({
			targets: path,
			d: dAnimation,
      easing: 'easeOutQuad',
			duration: duration,
			delay: delay,
      complete: function() {
        if(cb) cb();
      }
    });
	};

  function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow dot navigation -> update visible slide
		var target = event.target.closest('.js-svg-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'svg-slideshow__nav-item--selected')) {
      var index = Util.getIndexInArray(slideshow.navigation, target),
        direction = slideshow.selectedSlide < index ? 'next' : 'prev';
      showNewItem(slideshow, index, direction, true);
		}
	};
  
  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if(slideshow.navigation) { // update selected dot
			Util.removeClass(slideshow.navigation[oldIndex], 'svg-slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'svg-slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};
	
	function resetSlideshowTheme(slideshow, newIndex) { 
		// apply to controls/dot navigation, the same color-theme of the selected slide
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

  function updateAriaLive(slideshow, index) { // announce new selected slide to SR
    var announce = 'Item '+(index + 1)+' of '+slideshow.items.length,
      label = slideshow.items[index].getAttribute('aria-label');
    if(label) announce = announce+' '+label;
		slideshow.ariaLive.innerHTML = announce;
  };

  function startAutoplay(slideshow) {
		if(slideshow.options.autoplay && !slideshow.autoplayId && !slideshow.autoplayPaused) {
			slideshow.autoplayId = setInterval(function(){
				showNewItem(slideshow, slideshow.selectedSlide + 1, 'next');
			}, slideshow.options.autoplayInterval);
		}
  };

  function pauseAutoplay(slideshow) {
    if(slideshow.options.autoplay) {
			clearInterval(slideshow.autoplayId);
			slideshow.autoplayId = false;
		}
  };
  
  //initialize the ImgSlideshow objects
  var slideshows = document.getElementsByClassName('js-svg-slideshow'),
		reducedMotion = Util.osHasReducedMotion(),
		animeJSsupported = window.Map; // test if the library used for the animation works
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
					transitionDuration = (slideshows[i].getAttribute('data-transition-duration')) ? slideshows[i].getAttribute('data-transition-duration') : 400;
				new ImgSlideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, transitionDuration: transitionDuration});
			})(i);
		}
	}
}());
// File#: _2_table-of-contents
// Usage: codyhouse.co/license
(function() {
  var Toc = function(element) {
		this.element = element;
    this.list = this.element.getElementsByClassName('js-toc__list')[0];
    this.anchors = this.list.querySelectorAll('a[href^="#"]');
    this.sections = getSections(this);
    this.controller = this.element.getElementsByClassName('js-toc__control');
    this.controllerLabel = this.element.getElementsByClassName('js-toc__control-label');
    this.content = getTocContent(this);
    this.clickScrolling = false;
    this.intervalID = false;
    this.staticLayoutClass = 'toc--static';
    this.contentStaticLayoutClass = 'toc-content--toc-static';
    this.expandedClass = 'toc--expanded';
    this.isStatic = Util.hasClass(this.element, this.staticLayoutClass);
    this.layout = 'static';
    initToc(this);
  };

  function getSections(toc) {
    var sections = [];
    // get all content sections
    for(var i = 0; i < toc.anchors.length; i++) {
      var section = document.getElementById(toc.anchors[i].getAttribute('href').replace('#', ''));
      if(section) sections.push(section);
    }
    return sections;
  };

  function getTocContent(toc) {
    if(toc.sections.length < 1) return false;
    var content = toc.sections[0].closest('.js-toc-content');
    return content;
  };

  function initToc(toc) {
    checkTocLayour(toc); // switch between mobile and desktop layout
    if(toc.sections.length > 0) {
      // listen for click on anchors
      toc.list.addEventListener('click', function(event){
        var anchor = event.target.closest('a[href^="#"]');
        if(!anchor) return;
        // reset link apperance 
        toc.clickScrolling = true;
        resetAnchors(toc, anchor);
        // close toc if expanded on mobile
        toggleToc(toc, true);
      });

      // check when a new section enters the viewport
      var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
      if(intersectionObserverSupported) {
        var observer = new IntersectionObserver(
          function(entries, observer) { 
            entries.forEach(function(entry){
              if(!toc.clickScrolling) { // do not update classes if user clicked on a link
                getVisibleSection(toc);
              }
            });
          }, 
          {
            threshold: [0, 0.1],
            rootMargin: "0px 0px -70% 0px"
          }
        );

        for(var i = 0; i < toc.sections.length; i++) {
          observer.observe(toc.sections[i]);
        }
      }

      // detect the end of scrolling -> reactivate IntersectionObserver on scroll
      toc.element.addEventListener('toc-scroll', function(event){
        toc.clickScrolling = false;
      });
    }

    // custom event emitted when window is resized
    toc.element.addEventListener('toc-resize', function(event){
      checkTocLayour(toc);
    });

    // collapsed version only (mobile)
    initCollapsedVersion(toc);
  };

  function resetAnchors(toc, anchor) {
    if(!anchor) return;
    for(var i = 0; i < toc.anchors.length; i++) Util.removeClass(toc.anchors[i], 'toc__link--selected');
    Util.addClass(anchor, 'toc__link--selected');
  };

  function getVisibleSection(toc) {
    if(toc.intervalID) {
      clearInterval(toc.intervalID);
    }
    toc.intervalID = setTimeout(function(){
      var halfWindowHeight = window.innerHeight/2,
      index = -1;
      for(var i = 0; i < toc.sections.length; i++) {
        var top = toc.sections[i].getBoundingClientRect().top;
        if(top < halfWindowHeight) index = i;
      }
      if(index > -1) {
        resetAnchors(toc, toc.anchors[index]);
      }
      toc.intervalID = false;
    }, 100);
  };

  function checkTocLayour(toc) {
    if(toc.isStatic) return;
    toc.layout = getComputedStyle(toc.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(toc.element, toc.staticLayoutClass, toc.layout == 'static');
    if(toc.content) Util.toggleClass(toc.content, toc.contentStaticLayoutClass, toc.layout == 'static');
  };

  function initCollapsedVersion(toc) { // collapsed version only (mobile)
    if(toc.controller.length < 1) return;
    
    // toggle nav visibility
    toc.controller[0].addEventListener('click', function(event){
      var isOpen = Util.hasClass(toc.element, toc.expandedClass);
      toggleToc(toc, isOpen);
    });

    // close expanded version on esc
    toc.element.addEventListener('keydown', function(event){
      if(toc.layout == 'static') return;
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape') ) {
        toggleToc(toc, true);
        toc.controller[0].focus();
      }
    });
  };

  function toggleToc(toc, bool) { // collapsed version only (mobile)
    // toggle mobile version
    Util.toggleClass(toc.element, toc.expandedClass, !bool);
    bool ? toc.controller[0].removeAttribute('aria-expanded') : toc.controller[0].setAttribute('aria-expanded', 'true');
    if(!bool && toc.anchors.length > 0) {
      toc.anchors[0].focus();
    }
  };
  
  var tocs = document.getElementsByClassName('js-toc');

  var tocsArray = [];
	if( tocs.length > 0) {
		for( var i = 0; i < tocs.length; i++) {
			(function(i){ tocsArray.push(new Toc(tocs[i])); })(i);
    }

    // listen to window scroll -> reset clickScrolling property
    var scrollId = false,
      resizeId = false,
      scrollEvent = new CustomEvent('toc-scroll'),
      resizeEvent = new CustomEvent('toc-resize');
      
    window.addEventListener('scroll', function() {
      clearTimeout(scrollId);
      scrollId = setTimeout(doneScrolling, 100);
    });

    window.addEventListener('resize', function() {
      clearTimeout(resizeId);
      scrollId = setTimeout(doneResizing, 100);
    });

    function doneScrolling() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(scrollEvent)})(i);
      };
    };

    function doneResizing() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(resizeEvent)})(i);
      };
    };
  }
}());
// File#: _3_advanced-filter
// Usage: codyhouse.co/license
(function() {
  // the AdvFilter object is used to handle: 
  // - number of results
  // - form reset
  // - filtering sections label (to show a preview of the option selected by the users)
  var AdvFilter = function(element) {
    this.element = element; 
    this.form = this.element.getElementsByClassName('js-adv-filter__form');
    this.resultsList = this.element.getElementsByClassName('js-adv-filter__gallery')[0];
    this.resultsCount = this.element.getElementsByClassName('js-adv-filter__results-count');
    initAdvFilter(this);
  };

  function initAdvFilter(filter) {
    if(filter.form.length > 0) {
      // reset form
      filter.form[0].addEventListener('reset', function(event){
        setTimeout(function(){
          resetFilters(filter);
          resetGallery(filter);
        });
      });
      // update section labels on form change
      filter.form[0].addEventListener('change', function(event){
        var section = event.target.closest('.js-adv-filter__item');
        if(section) resetSelection(filter, section);
        else if( Util.is(event.target, '.js-adv-filter__form') ) {
          // reset the entire form lables
          var sections = filter.form[0].getElementsByClassName('js-adv-filter__item');
          for(var i = 0; i < sections.length; i++) resetSelection(filter, sections[i]);
        }
      });
    }

    // reset results count
    if(filter.resultsCount.length > 0) {
      filter.resultsList.addEventListener('filter-selection-updated', function(event){
        updateResultsCount(filter);
      });
    }
  };

  function resetFilters(filter) {
    // check if there are custom form elemets - reset appearance
    // custom select
    var customSelect = filter.element.getElementsByClassName('js-select');
    if(customSelect.length > 0) {
      for(var i = 0; i < customSelect.length; i++) customSelect[i].dispatchEvent(new CustomEvent('select-updated'));
    }
    // custom slider
    var customSlider = filter.element.getElementsByClassName('js-slider');
    if(customSlider.length > 0) {
      for(var i = 0; i < customSlider.length; i++) customSlider[i].dispatchEvent(new CustomEvent('slider-updated'));
    }
  };

  function resetSelection(filter, section) {
    // change label value based on input types
    var labelSelection = section.getElementsByClassName('js-adv-filter__selection');
    if(labelSelection.length == 0) return;
    // select
    var select = section.getElementsByTagName('select');
    if(select.length > 0) {
      labelSelection[0].textContent = getSelectLabel(section, select[0]);
      return;
    }
    // input number
    var number = section.querySelectorAll('input[type="number"]');
    if(number.length > 0) {
      labelSelection[0].textContent = getNumberLabel(section, number);
      return;
    }
    // input range
    var slider = section.querySelectorAll('input[type="range"]');
    if(slider.length > 0) {
      labelSelection[0].textContent = getSliderLabel(section, slider);
      return;
    }
    // radio/checkboxes
    var radio = section.querySelectorAll('input[type="radio"]'),
      checkbox = section.querySelectorAll('input[type="checkbox"]');
    if(radio.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, radio);
      return;
    } else if(checkbox.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, checkbox);
      return;
    }
  };

  function getSelectLabel(section, select) {
    if(select.multiple) {
      var label = '',
        counter = 0;
      for (var i = 0; i < select.options.length; i++) {
        if(select.options[i].selected) {
          label = label + '' + select.options[i].text;
          counter = counter + 1;
        } 
        if(counter > 1) label = section.getAttribute('data-multi-select-text').replace('{n}', counter);
      }
      return label;
    } else {
      return select.options[select.selectedIndex].text;
    }
  };

  function getNumberLabel(section, number) {
    var counter = 0;
    for(var i = 0; i < number.length; i++) {
      if(number[i].value != number[i].min) counter = counter + 1;
    }
    if(number.length > 1) { // multiple input number in this section
      if(counter > 0) {
        return section.getAttribute('data-multi-select-text').replace('{n}', counter);
      } else {
        return section.getAttribute('data-default-text');
      }
      
    } else {
      if(number[0].value == number[0].min) return section.getAttribute('data-default-text');
      else return section.getAttribute('data-number-format').replace('{n}', number[0].value);
    }
  };

  function getSliderLabel(section, slider) {
    var label = '',
      labelFormat = section.getAttribute('data-number-format');
    for(var i = 0; i < slider.length; i++) {
      if(i != 0 ) label = label+' - ';
      label = label + labelFormat.replace('{n}', slider[i].value);
    }
    return label;
  };

  function getInputListLabel(section, inputs) {
    var counter = 0;
      label = '';
    for(var i = 0; i < inputs.length; i++) {
      if(inputs[i].checked) {
        var labelElement = inputs[i].parentNode.getElementsByTagName('label');
        if(labelElement.length > 0) label = labelElement[0].textContent;
        counter = counter + 1;
      }
    }
    if(counter > 1) return section.getAttribute('data-multi-select-text').replace('{n}', counter);
    else if(counter == 0 ) return section.getAttribute('data-default-text');
    else return label;
  };

  function resetGallery(filter) {
    // emit change event + reset filtering 
    filter.form[0].dispatchEvent(new CustomEvent('change'));
    filter.resultsList.dispatchEvent(new CustomEvent('update-filter-results'));
  };

  function updateResultsCount(filter) {
    var resultItems = filter.resultsList.children,
      counter = 0;
    for(var i = 0; i < resultItems.length; i++) {
      if(isVisible(resultItems[i])) counter = counter + 1;
    }
    filter.resultsCount[0].textContent = counter;
  };

  function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};
  
  //initialize the AdvFilter objects
	var advFilter = document.getElementsByClassName('js-adv-filter');
	if( advFilter.length > 0 ) {
		for( var i = 0; i < advFilter.length; i++) {
			(function(i){new AdvFilter(advFilter[i]);})(i);
		}
  }

  // Remove the code below if you want to use a custom filtering function (e.g., you need to fetch your results from a database)
  
  // The code below is used for filtering of page content (animation of DOM elements, no fetching results from database).  
  // It uses the Filter component (https://codyhouse.co/ds/components/app/filter) - you can modify the custom filtering functions based on your needs
  // Check the info page of the component for info on how to use it: https://codyhouse.co/ds/components/info/filter
  var gallery = document.getElementById('adv-filter-gallery');
  if(gallery) {
    new Filter({
      element: gallery, // this is your gallery element
      priceRange: function(items){ // this is the price custom function
        var filteredArray = [],
          minVal = document.getElementById('slider-min-value').value,
          maxVal = document.getElementById('slider-max-value').value;
        for(var i = 0; i < items.length; i++) {
          var price = parseInt(items[i].getAttribute('data-price'));
          filteredArray[i] = (price >= minVal) && (price <= maxVal);
        } 
        return filteredArray;
      },
      indexValue: function(items){ // this is the index custom function
        var filteredArray = [],
          value = document.getElementById('index-value').value;
        for(var i = 0; i < items.length; i++) {
          var index = parseInt(items[i].getAttribute('data-sort-index'));
          filteredArray[i] = index >= value;
        } 
        return filteredArray;
      },
      searchInput: function(items) {
        var filteredArray = [],
          value = document.getElementById('search-products').value;
        for(var i = 0; i < items.length; i++) {
          var searchFilter = items[i].getAttribute('data-search');
          filteredArray[i] = searchFilter == '' || searchFilter.toLowerCase().indexOf(value.toLowerCase()) > -1;
        } 
        return filteredArray;
      }
    });
  }
}());
// File#: _3_expandable-img-gallery
// Usage: codyhouse.co/license

(function() {
  var ExpGallery = function(element) {
    this.element = element;
    this.slideshow = this.element.getElementsByClassName('js-exp-lightbox__body')[0];
    this.slideshowList = this.element.getElementsByClassName('js-exp-lightbox__slideshow')[0];
    this.slideshowId = this.element.getAttribute('id')
    this.gallery = document.querySelector('[data-controls="'+this.slideshowId+'"]');
    this.galleryItems = this.gallery.getElementsByClassName('js-exp-gallery__item');
    this.lazyload = this.gallery.getAttribute('data-placeholder');
    this.animationRunning = false;
    // menu bar
    this.menuBar = this.element.getElementsByClassName('js-menu-bar');
    initNewContent(this);
    initLightboxMarkup(this);
    lazyLoadLightbox(this);
    initSlideshow(this);
    initModal(this);
    initModalEvents(this);
  };

  function initNewContent(gallery) {
    // if the gallery uses the infinite load - make sure to update the modal gallery when new content is loaded
    gallery.infiniteScrollParent = gallery.gallery.closest('[data-container]');
    
    if(!gallery.infiniteScrollParent && Util.hasClass(gallery.gallery, 'js-infinite-scroll')) {
      gallery.infiniteScrollParent = gallery.gallery;
    }
    
    if(gallery.infiniteScrollParent) {
      gallery.infiniteScrollParent.addEventListener('content-loaded', function(event){
        initLightboxMarkup(gallery);
        initSlideshow(gallery);
      });
    }
  };

  function initLightboxMarkup(gallery) {
    // create items inside lightbox - modal slideshow
    var slideshowContent = '';
    for(var i = 0; i < gallery.galleryItems.length; i++) {
      var caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption'),
        image = gallery.galleryItems[i].getElementsByTagName('img')[0],
        caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption');
      // details
      var src = image.getAttribute('data-modal-src');
      if(!src) src = image.getAttribute('data-src');
      if(!src) src = image.getAttribute('src');
      var altAttr = image.getAttribute('alt')
      altAttr = altAttr ? 'alt="'+altAttr+'"' : '';
      var draggable = gallery.slideshow.getAttribute('data-swipe') == 'on' ? 'draggable="false" ondragstart="return false;"' : '';
      var imgBlock = gallery.lazyload 
        ? '<img data-src="'+src+'" data-loading="lazy" src="'+gallery.lazyload+'" '+altAttr+' '+draggable+' class=" pointer-events-auto">'
        : '<img src="'+src+'" data-loading="lazy" '+draggable+' class=" pointer-events-auto">';

      var captionBlock = caption.length > 0
        ? '<figcaption class="exp-lightbox__caption pointer-events-auto">'+caption[0].textContent+'</figcaption>'
        : '';

      slideshowContent = slideshowContent + '<li class="slideshow__item js-slideshow__item"><figure class="exp-lightbox__media"><div class="exp-lightbox__media-outer"><div class="exp-lightbox__media-inner">'+imgBlock+'</div></div>'+captionBlock+'</li>';
    }
    gallery.slideshowList.innerHTML = slideshowContent;
    gallery.slides = gallery.slideshowList.getElementsByClassName('js-slideshow__item');

    // append the morphing image - we will animate it from the selected slide to the final position (and viceversa)
    var imgMorph = document.createElement("div");
    Util.setAttributes(imgMorph, {'aria-hidden': 'true', 'class': 'exp-lightbox__clone-img-wrapper js-exp-lightbox__clone-img-wrapper', 'data-exp-morph': gallery.slideshowId});
    imgMorph.innerHTML = '<svg><defs><clipPath id="'+gallery.slideshowId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+gallery.slideshowId+'-clip)"></image></svg>';
    document.body.appendChild(imgMorph);
    gallery.imgMorph = document.querySelector('.js-exp-lightbox__clone-img-wrapper[data-exp-morph="'+gallery.slideshowId+'"]');
    gallery.imgMorphSVG = gallery.imgMorph.getElementsByTagName('svg')[0];
    gallery.imgMorphRect = gallery.imgMorph.getElementsByTagName('rect')[0];
    gallery.imgMorphImg = gallery.imgMorph.getElementsByTagName('image')[0];
    
    // append image for zoom in effect
    if(gallery.slideshow.getAttribute('data-zoom') == 'on') {
      var zoomImg = document.createElement("div");
      Util.setAttributes(zoomImg, {'aria-hidden': 'true', 'class': 'exp-lightbox__zoom exp-lightbox__zoom--no-transition js-exp-lightbox__zoom'});
      zoomImg.innerHTML = '<img>';
      gallery.element.appendChild(zoomImg);
      gallery.zoomImg = gallery.element.getElementsByClassName('js-exp-lightbox__zoom')[0];
    }
  };

  function lazyLoadLightbox(gallery) {
    // lazyload media of selected slide/prev slide/next slide
    gallery.slideshow.addEventListener('newItemSelected', function(event){
      // 'newItemSelected' is emitted by the Slideshow object when a new slide is selected
      gallery.selectedSlide = event.detail;
      lazyLoadSlide(gallery);
      // menu element - trigger new slide event
      triggerMenuEvent(gallery);
    });
  };

  function lazyLoadSlide(gallery) {
    setSlideMedia(gallery, gallery.selectedSlide);
    setSlideMedia(gallery, gallery.selectedSlide + 1);
    setSlideMedia(gallery, gallery.selectedSlide - 1);
  };

  function setSlideMedia(gallery, index) {
    if(index < 0) index = gallery.slides.length - 1;
    if(index > gallery.slides.length - 1) index = 0;
    var imgs = gallery.slides[index].querySelectorAll('img[data-src]');
    for(var i = 0; i < imgs.length; i++) {
      imgs[i].src = imgs[i].getAttribute('data-src');
    }
  };

  function initSlideshow(gallery) { 
    // reset slideshow navigation
    resetSlideshowControls(gallery);
    gallery.slideshowNav = gallery.element.getElementsByClassName('js-slideshow__control');

    if(gallery.slides.length <= 1) {
      toggleSlideshowElements(gallery, true);
      return;
    } 
    var swipe = (gallery.slideshow.getAttribute('data-swipe') && gallery.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
    gallery.slideshowObj = new Slideshow({element: gallery.slideshow, navigation: false, autoplay : false, swipe : swipe});
  };

  function resetSlideshowControls(gallery) {
    var arrowControl = gallery.element.getElementsByClassName('js-slideshow__control');
    if(arrowControl.length == 0) return;
    var controlsWrapper = arrowControl[0].parentElement;
    if(!controlsWrapper) return;
    controlsWrapper.innerHTML = controlsWrapper.innerHTML;
  };

  function toggleSlideshowElements(gallery, bool) { // hide slideshow controls if gallery is composed by one item only
    if(gallery.slideshowNav.length > 0) {
      for(var i = 0; i < gallery.slideshowNav.length; i++) {
        bool ? Util.addClass(gallery.slideshowNav[i], 'is-hidden') : Util.removeClass(gallery.slideshowNav[i], 'is-hidden');
      }
    }
  };

  function initModal(gallery) {
    Util.addClass(gallery.element, 'exp-lightbox--no-transition'); // add no-transition class to lightbox - used to select the first visible slide
    gallery.element.addEventListener('modalIsClose', function(event){ // add no-transition class
      Util.addClass(gallery.element, 'exp-lightbox--no-transition');
      gallery.imgMorph.style = '';
    });
    // trigger modal lightbox
    gallery.gallery.addEventListener('click', function(event){
      openModalLightbox(gallery, event);
    });
  };

  function initModalEvents(gallery) {
   if(gallery.zoomImg) { // image zoom
      gallery.slideshow.addEventListener('click', function(event){
        if(event.target.tagName.toLowerCase() == 'img' && event.target.closest('.js-slideshow__item') && !gallery.modalSwiping) modalZoomImg(gallery, event.target);
      });

      gallery.zoomImg.addEventListener('click', function(event){
        modalZoomImg(gallery, false);
      });

      gallery.element.addEventListener('modalIsClose', function(event){
        modalZoomImg(gallery, false); // close zoom-in image if open
        closeModalAnimation(gallery);
      });
    }

    if(!gallery.slideshowObj) return;

    if(gallery.slideshowObj.options.swipe) { // close gallery when you swipeUp/SwipeDown
      gallery.slideshowObj.element.addEventListener('swipeUp', function(event){
        closeModal(gallery);
      });
      gallery.slideshowObj.element.addEventListener('swipeDown', function(event){
        closeModal(gallery);
      });
    }
    
    if(gallery.zoomImg && gallery.slideshowObj.options.swipe) {
      gallery.slideshowObj.element.addEventListener('swipeLeft', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('swipeRight', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('newItemVisible', function(event){
        gallery.modalSwiping = false;
      });
    }
  };

  function openModalLightbox(gallery, event) {
    var item = event.target.closest('.js-exp-gallery__item');
    if(!item) return;
    // reset slideshow items visibility
    resetSlideshowItemsVisibility(gallery);
    gallery.selectedSlide = Util.getIndexInArray(gallery.galleryItems, item);
    setSelectedItem(gallery);
    lazyLoadSlide(gallery);
    if(animationSupported) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateSelectedImage(gallery);
        openModal(gallery, item);
      });
    } else { // no expanding animation -> show modal
      openModal(gallery, item);
      Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
    }
    // menu element - trigger new slide event
    triggerMenuEvent(gallery);
  };

  function resetSlideshowItemsVisibility(gallery) {
    var index = 0;
    for(var i = 0; i < gallery.galleryItems.length; i++) {
      var itemVisible = isVisible(gallery.galleryItems[i]);
      if(itemVisible) {
        index = index + 1;
        Util.removeClass(gallery.slides[i], 'is-hidden');
      } else {
        Util.addClass(gallery.slides[i], 'is-hidden');
      }
    }
    toggleSlideshowElements(gallery, index < 2);
  };

  function setSelectedItem(gallery) {
    // if a specific slide was selected -> make sure to show that item first
    var lastSelected = gallery.slideshow.getElementsByClassName('slideshow__item--selected');
    if(lastSelected.length > 0 ) Util.removeClass(lastSelected[0], 'slideshow__item--selected');
    Util.addClass(gallery.slides[gallery.selectedSlide], 'slideshow__item--selected');
    if(gallery.slideshowObj) gallery.slideshowObj.selectedSlide = gallery.selectedSlide;
  };

  function openModal(gallery, item) {
    gallery.element.dispatchEvent(new CustomEvent('openModal', {detail: item}));
    gallery.modalSwiping = false;
  };

  function closeModal(gallery) {
    gallery.modalSwiping = true;
    modalZoomImg(gallery, false);
    gallery.element.dispatchEvent(new CustomEvent('closeModal'));
  };

  function closeModalAnimation(gallery) { // modal is already closing -> start image closing animation
    gallery.selectedSlide = gallery.slideshowObj ? gallery.slideshowObj.selectedSlide : 0;
    // on close - make sure last selected image (of the gallery) is in the viewport
    var boundingRect = gallery.galleryItems[gallery.selectedSlide].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
    // animate on close
    animateSelectedImage(gallery, true);
  };

  function modalZoomImg(gallery, img) { // toggle zoom-in image
    if(!gallery.zoomImg) return;
    var bool = false;
    if(img) { // open zoom-in image
      gallery.originImg = img;
      gallery.zoomImg.children[0].setAttribute('src', img.getAttribute('src'));
      bool = true;
    }
    (animationSupported) 
      ? requestAnimationFrame(function(){animateZoomImg(gallery, bool)})
      : Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
  };

  function animateZoomImg(gallery, bool) {
    if(!gallery.originImg) return;
    
    var originImgPosition = gallery.originImg.getBoundingClientRect(),
      originStyle = 'translateX('+originImgPosition.left+'px) translateY('+(originImgPosition.top + gallery.zoomImg.scrollTop)+'px) scale('+ originImgPosition.width/gallery.zoomImg.scrollWidth+')',
      finalStyle = 'scale(1)';

    if(bool) {
      gallery.zoomImg.children[0].style.transform = originStyle;
    } else {
      gallery.zoomImg.addEventListener('transitionend', function cb(){
        Util.addClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
        gallery.zoomImg.scrollTop = 0;
        gallery.zoomImg.removeEventListener('transitionend', cb);
      });
    }
    setTimeout(function(){
      Util.removeClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
      Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
      gallery.zoomImg.children[0].style.transform = (bool) ? finalStyle : originStyle;
    }, 50);
  };

  function animateSelectedImage(gallery, bool) { // create morphing image effect
    var imgInit = gallery.galleryItems[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgInitPosition = imgInit.getBoundingClientRect(),
      imgFinal = gallery.slides[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgFinalPosition = imgFinal.getBoundingClientRect();

    if(bool) {
      runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
    } else {
      imgFinal.style.visibility = 'hidden';
      gallery.animationRunning = false;
      var image = new Image();
      image.onload = function () {
        if(gallery.animationRunning) return;
        imgFinalPosition = imgFinal.getBoundingClientRect();
        runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
      }
      image.src = imgFinal.getAttribute('data-src') ? imgFinal.getAttribute('data-src') : imgFinal.getAttribute('src');
      if(image.complete) {
        gallery.animationRunning = true;
        imgFinalPosition = imgFinal.getBoundingClientRect();
        runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool);
      }
    }
  };

  function runAnimation(gallery, imgInit, imgInitPosition, imgFinal, imgFinalPosition, bool) {
    // retrieve all animation params
    var scale = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.height/imgInitPosition.height : imgFinalPosition.width/imgInitPosition.width;
    var initHeight = imgFinalPosition.width > imgFinalPosition.height ? imgInitPosition.height : imgFinalPosition.height/scale,
      initWidth = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.width/scale : imgInitPosition.width;

    var initTranslateY = (imgInitPosition.height - initHeight)/2,
      initTranslateX = (imgInitPosition.width - initWidth)/2,
      initTop = imgInitPosition.top + initTranslateY,
      initLeft = imgInitPosition.left + initTranslateX;

    // get final states
    var translateX = imgFinalPosition.left - imgInitPosition.left,
      translateY = imgFinalPosition.top - imgInitPosition.top;

    var finTranslateX = translateX - initTranslateX,
    finTranslateY = translateY - initTranslateY;

    var initScaleX = imgInitPosition.width/initWidth,
      initScaleY = imgInitPosition.height/initHeight,
      finScaleX = 1,
      finScaleY = 1;

    if(bool) { // update params if this is a closing animation
      scale = 1/scale;
      finScaleX = initScaleX;
      finScaleY = initScaleY;
      initScaleX = 1;
      initScaleY = 1;
      finTranslateX = -1*finTranslateX;
      finTranslateY = -1*finTranslateY;
      initTop = imgFinalPosition.top;
      initLeft = imgFinalPosition.left;
      initHeight = imgFinalPosition.height;
      initWidth = imgFinalPosition.width;
    }
    
    if(!bool) {
      imgFinal.style.visibility = ''; // reset visibility
    }

    // set initial status
    gallery.imgMorph.setAttribute('style', 'height: '+initHeight+'px; width: '+initWidth+'px; top: '+initTop+'px; left: '+initLeft+'px;');
    gallery.imgMorphSVG.setAttribute('viewbox', '0 0 '+initWidth+' '+initHeight);
    Util.setAttributes(gallery.imgMorphImg, {'xlink:href': imgInit.getAttribute('src'), 'href': imgInit.getAttribute('src')});
    Util.setAttributes(gallery.imgMorphRect, {'style': 'height: '+initHeight+'px; width: '+initWidth+'px;', 'transform': 'translate('+(initWidth/2)*(1 - initScaleX)+' '+(initHeight/2)*(1 - initScaleY)+') scale('+initScaleX+','+initScaleY+')'});

    // reveal image and start animation
    Util.addClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
    Util.addClass(gallery.slideshowList, 'slideshow__content--is-hidden');
    Util.addClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');

    gallery.imgMorph.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(event.propertyName.indexOf('transform') < 0) return;
			Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
      Util.removeClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
      Util.removeClass(gallery.slideshowList, 'slideshow__content--is-hidden');
      gallery.imgMorph.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('transform');
      gallery.imgMorphImg.removeAttribute('href');
      gallery.imgMorphImg.removeAttribute('xlink:href');
      Util.removeClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');
			gallery.imgMorph.removeEventListener('transitionend', cb);
    });

    // trigger expanding/closing animation
    gallery.imgMorph.style.transform = 'translateX('+finTranslateX+'px) translateY('+finTranslateY+'px) scale('+scale+')';
    animateRectScale(gallery.imgMorphRect, initScaleX, initScaleY, finScaleX, finScaleY, initWidth, initHeight);
  };

  function animateRectScale(rect, scaleX, scaleY, finScaleX, finScaleY, width, height) {
    var currentTime = null,
      duration =  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--exp-gallery-animation-duration'))*1000 || 300;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      var valX = easeOutQuad(progress, scaleX, finScaleX-scaleX, duration),
        valY = easeOutQuad(progress, scaleY, finScaleY-scaleY, duration);

      rect.setAttribute('transform', 'translate('+(width/2)*(1 - valX)+' '+(height/2)*(1 - valY)+') scale('+valX+','+valY+')');
      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      }
    };

    function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t*(t-2) + b;
    };
    
    window.requestAnimationFrame(animateScale);
  };

  function keyboardNavigateLightbox(gallery, direction) {
    if(!Util.hasClass(gallery.element, 'modal--is-visible')) return;
    if(!document.activeElement.closest('.js-exp-lightbox__body') && document.activeElement.closest('.js-modal')) return;
    if(!gallery.slideshowObj) return;
    (direction == 'next') ? gallery.slideshowObj.showNext() : gallery.slideshowObj.showPrev();
  };

  function triggerMenuEvent(gallery) {
    if(gallery.menuBar.length < 1) return;
    var event = new CustomEvent('update-menu', 
      {detail: {
        index: gallery.selectedSlide,
        item: gallery.slides[gallery.selectedSlide]
      }});
    gallery.menuBar[0].dispatchEvent(event);
  };

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };

  window.ExpGallery = ExpGallery;

  // init ExpGallery objects
  var expGalleries = document.getElementsByClassName('js-exp-lightbox'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( expGalleries.length > 0 ) {
    var expGalleriesArray = [];
    for( var i = 0; i < expGalleries.length; i++) {
      (function(i){ expGalleriesArray.push(new ExpGallery(expGalleries[i]));})(i);

      // Lightbox gallery navigation with keyboard
      window.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          updateLightbox('next');
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          updateLightbox('prev');
        }
      });

      function updateLightbox(direction) {
        for( var i = 0; i < expGalleriesArray.length; i++) {
          (function(i){keyboardNavigateLightbox(expGalleriesArray[i], direction);})(i);
        };
      };
    }
  }
}());
// File#: _3_interactive-table
// Usage: codyhouse.co/license
(function() {
  var IntTable = function(element) {
    this.element = element;
    this.header = this.element.getElementsByClassName('js-int-table__header')[0];
    this.headerCols = this.header.getElementsByTagName('tr')[0].children;
    this.body = this.element.getElementsByClassName('js-int-table__body')[0];
    this.sortingRows = this.element.getElementsByClassName('js-int-table__sort-row');
    initIntTable(this);
  };

  function initIntTable(table) {
    // check if table has actions
    initIntTableActions(table);
    // check if there are checkboxes to select/deselect a row/all rows
    var selectAll = table.element.getElementsByClassName('js-int-table__select-all');
    if(selectAll.length > 0) initIntTableSelection(table, selectAll);
    // check if there are sortable columns
    table.sortableCols = table.element.getElementsByClassName('js-int-table__cell--sort');
    if(table.sortableCols.length > 0) {
      // add a data-order attribute to all rows so that we can reset the order
      setDataRowOrder(table);
      // listen to the click event on a sortable column
      table.header.addEventListener('click', function(event){
        var selectedCol = event.target.closest('.js-int-table__cell--sort');
        if(!selectedCol || event.target.tagName.toLowerCase() == 'input') return;
        sortColumns(table, selectedCol);
      });
      table.header.addEventListener('change', function(event){ // detect change in selected checkbox (SR only)
        var selectedCol = event.target.closest('.js-int-table__cell--sort');
        if(!selectedCol) return;
        sortColumns(table, selectedCol, event.target.value);
      });
      table.header.addEventListener('keydown', function(event){ // keyboard navigation - change sorting on enter
        if( event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
          var selectedCol = event.target.closest('.js-int-table__cell--sort');
          if(!selectedCol) return;
          sortColumns(table, selectedCol);
        }
      });

      // change cell style when in focus
      table.header.addEventListener('focusin', function(event){
        var closestCell = document.activeElement.closest('.js-int-table__cell--sort');
        if(closestCell) Util.addClass(closestCell, 'int-table__cell--focus');
      });
      table.header.addEventListener('focusout', function(event){
        for(var i = 0; i < table.sortableCols.length; i++) {
          Util.removeClass(table.sortableCols[i], 'int-table__cell--focus');
        }
      });
    }
  };

  function initIntTableActions(table) {
    // check if table has actions and store them
    var tableId = table.element.getAttribute('id');
    if(!tableId) return;
    var tableActions = document.querySelector('[data-table-controls="'+tableId+'"]');
    if(!tableActions) return;
    table.actionsSelection = tableActions.getElementsByClassName('js-int-table-actions__items-selected');
    table.actionsNoSelection = tableActions.getElementsByClassName('js-int-table-actions__no-items-selected');
  };

  function initIntTableSelection(table, select) { // checkboxes for rows selection
    table.selectAll = select[0];
    table.selectRow = table.element.getElementsByClassName('js-int-table__select-row');
    // select/deselect all rows
    table.selectAll.addEventListener('click', function(event){ // we cannot use the 'change' event as on IE/Edge the change from "indeterminate" to either "checked" or "unchecked"  does not trigger that event
      toggleRowSelection(table);
    });
    // select/deselect single row - reset all row selector 
    table.body.addEventListener('change', function(event){
      if(!event.target.closest('.js-int-table__select-row')) return;
      toggleAllSelection(table);
    });
    // toggle actions
    toggleActions(table, table.element.getElementsByClassName('int-table__row--checked').length > 0);
  };

  function toggleRowSelection(table) { // 'Select All Rows' checkbox has been selected/deselected
    var status = table.selectAll.checked;
    for(var i = 0; i < table.selectRow.length; i++) {
      table.selectRow[i].checked = status;
      Util.toggleClass(table.selectRow[i].closest('.int-table__row'), 'int-table__row--checked', status);
    }
    toggleActions(table, status);
  };

  function toggleAllSelection(table) { // Single row has been selected/deselected
    var allChecked = true,
      oneChecked = false;
    for(var i = 0; i < table.selectRow.length; i++) {
      if(!table.selectRow[i].checked) {allChecked = false;}
      else {oneChecked = true;}
      Util.toggleClass(table.selectRow[i].closest('.int-table__row'), 'int-table__row--checked', table.selectRow[i].checked);
    }
    table.selectAll.checked = oneChecked;
    // if status if false but one input is checked -> set an indeterminate state for the 'Select All' checkbox
    if(!allChecked) {
      table.selectAll.indeterminate = oneChecked;
    } else if(allChecked && oneChecked) {
      table.selectAll.indeterminate = false;
    }
    toggleActions(table, oneChecked);
  };

  function setDataRowOrder(table) { // add a data-order to rows element - will be used when resetting the sorting 
    var rowsArray = table.body.getElementsByTagName('tr');
    for(var i = 0; i < rowsArray.length; i++) {
      rowsArray[i].setAttribute('data-order', i);
    }
  };

  function sortColumns(table, selectedCol, customOrder) {
    // determine sorting order (asc/desc/reset)
    var order = customOrder || getSortingOrder(selectedCol),
      colIndex = Util.getIndexInArray(table.headerCols, selectedCol);
    // sort table
    sortTableContent(table, order, colIndex, selectedCol);
    
    // reset appearance of the th column that was previously sorted (if any) 
    for(var i = 0; i < table.headerCols.length; i++) {
      Util.removeClass(table.headerCols[i], 'int-table__cell--asc int-table__cell--desc');
    }
    // reset appearance for the selected th column
    if(order == 'asc') Util.addClass(selectedCol, 'int-table__cell--asc');
    if(order == 'desc') Util.addClass(selectedCol, 'int-table__cell--desc');
    // reset checkbox selection
    if(!customOrder) selectedCol.querySelector('input[value="'+order+'"]').checked = true;
  };

  function getSortingOrder(selectedCol) { // determine sorting order
    if( Util.hasClass(selectedCol, 'int-table__cell--asc') ) return 'desc';
    if( Util.hasClass(selectedCol, 'int-table__cell--desc') ) return 'none';
    return 'asc';
  };

  function sortTableContent(table, order, index, selctedCol) { // determine the new order of the rows
    var rowsArray = table.body.getElementsByTagName('tr'),
      switching = true,
      i = 0,
      shouldSwitch;
    while (switching) {
      switching = false;
      for (i = 0; i < rowsArray.length - 1; i++) {
        var contentOne = (order == 'none') ? rowsArray[i].getAttribute('data-order') : rowsArray[i].children[index].textContent.trim(),
          contentTwo = (order == 'none') ? rowsArray[i+1].getAttribute('data-order') : rowsArray[i+1].children[index].textContent.trim();

        shouldSwitch = compareValues(contentOne, contentTwo, order, selctedCol);
        if(shouldSwitch) {
          table.body.insertBefore(rowsArray[i+1], rowsArray[i]);
          switching = true;
          break;
        }
      }
    }
  };

  function compareValues(val1, val2, order, selctedCol) {
    var compare,
      dateComparison = selctedCol.getAttribute('data-date-format');
    if( dateComparison && order != 'none') { // comparing dates
      compare =  (order == 'asc' || order == 'none') ? parseCustomDate(val1, dateComparison) > parseCustomDate(val2, dateComparison) : parseCustomDate(val2, dateComparison) > parseCustomDate(val1, dateComparison);
    } else if( !isNaN(val1) && !isNaN(val2) ) { // comparing numbers
      compare =  (order == 'asc' || order == 'none') ? Number(val1) > Number(val2) : Number(val2) > Number(val1);
    } else { // comparing strings
      compare =  (order == 'asc' || order == 'none') 
        ? val2.toString().localeCompare(val1) < 0
        : val1.toString().localeCompare(val2) < 0;
    }
    return compare;
  };

  function parseCustomDate(date, format) {
    var parts = date.match(/(\d+)/g), 
      i = 0, fmt = {};
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

    return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
  };

  function toggleActions(table, selection) {
    if(table.actionsSelection && table.actionsSelection.length > 0) {
      Util.toggleClass(table.actionsSelection[0], 'is-hidden', !selection);
    }
    if(table.actionsNoSelection && table.actionsNoSelection.length > 0) {
      Util.toggleClass(table.actionsNoSelection[0], 'is-hidden', selection);
    }
  };

  //initialize the IntTable objects
	var intTable = document.getElementsByClassName('js-int-table');
	if( intTable.length > 0 ) {
		for( var i = 0; i < intTable.length; i++) {
			(function(i){new IntTable(intTable[i]);})(i);
    }
  }
}());
// File#: _3_lightbox
// Usage: codyhouse.co/license

(function() {
  var Lightbox = function(element) {
    this.element = element;
    this.id = this.element.getAttribute('id');
    this.slideshow = this.element.getElementsByClassName('js-lightbox__body')[0];
    this.slides = this.slideshow.getElementsByClassName('js-slideshow__item');
    this.thumbWrapper = this.element.getElementsByClassName('js-lightbox_thumb-list');
    lazyLoadLightbox(this);
    initSlideshow(this);
    initThumbPreview(this);
    initThumbEvents(this);
  }

  function lazyLoadLightbox(modal) {
    // add no-transition class to lightbox - used to select the first visible slide
    Util.addClass(modal.element, 'lightbox--no-transition');
    //load first slide media when modal is open
    modal.element.addEventListener('modalIsOpen', function(event){
      setSelectedItem(modal, event);
      var selectedSlide = modal.slideshow.getElementsByClassName('slideshow__item--selected');
      modal.selectedSlide = Util.getIndexInArray(modal.slides, selectedSlide[0]);
      if(selectedSlide.length > 0) {
        if(modal.slideshowObj) modal.slideshowObj.selectedSlide = modal.selectedSlide;
        lazyLoadSlide(modal);
        resetVideos(modal, false);
        resetIframes(modal, false);
        updateThumb(modal);
      }
      Util.removeClass(modal.element, 'lightbox--no-transition');
    });
    modal.element.addEventListener('modalIsClose', function(event){ // add no-transition class
      Util.addClass(modal.element, 'lightbox--no-transition');
    });
    // lazyload media of selected slide/prev slide/next slide
    modal.slideshow.addEventListener('newItemSelected', function(event){
      // 'newItemSelected' is emitted by the Slideshow object when a new slide is selected
      var prevSelected = modal.selectedSlide;
      modal.selectedSlide = event.detail;
      lazyLoadSlide(modal);
      resetVideos(modal, prevSelected); // pause video of previous visible slide and start new video (if present)
      resetIframes(modal, prevSelected);
      updateThumb(modal);
    });
  };

  function lazyLoadSlide(modal) {
    setSlideMedia(modal, modal.selectedSlide);
    setSlideMedia(modal, modal.selectedSlide + 1);
    setSlideMedia(modal, modal.selectedSlide - 1);
  };

  function setSlideMedia(modal, index) {
    if(index < 0) index = modal.slides.length - 1;
    if(index > modal.slides.length - 1) index = 0;
    setSlideImgs(modal, index);
    setSlidesVideos(modal, index, 'video');
    setSlidesVideos(modal, index, 'iframe');
  };

  function setSlideImgs(modal, index) {
    var imgs = modal.slides[index].querySelectorAll('img[data-src]');
    for(var i = 0; i < imgs.length; i++) {
      imgs[i].src = imgs[i].getAttribute('data-src');
    }
  };

  function setSlidesVideos(modal, index, type) {
    var videos = modal.slides[index].querySelectorAll(type+'[data-src]');
    for(var i = 0; i < videos.length; i++) {
      videos[0].src = videos[0].getAttribute('data-src');
      videos[0].removeAttribute('data-src');
    }
  };

  function initSlideshow(modal) { 
    if(modal.slides.length <= 1) {
      hideSlideshowElements(modal);
      return;
    } 
    var swipe = (modal.slideshow.getAttribute('data-swipe') && modal.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
    modal.slideshowObj = new Slideshow({element: modal.slideshow, navigation: false, autoplay : false, swipe : swipe});
  };

  function hideSlideshowElements(modal) { // hide slideshow controls if gallery is composed by one item only
    var slideshowNav = modal.element.getElementsByClassName('js-slideshow__control');
    if(slideshowNav.length > 0) {
      for(var i = 0; i < slideshowNav.length; i++) Util.addClass(slideshowNav[i], 'is-hidden');
    }
    var slideshowThumbs = modal.element.getElementsByClassName('js-lightbox_footer');
    if(slideshowThumbs.length > 0) Util.addClass(slideshowThumbs[0], 'is-hidden');
  };

  function resetVideos(modal, index) {
    if(index) {
      var actualVideo = modal.slides[index].getElementsByTagName('video');
      if(actualVideo.length > 0 ) actualVideo[0].pause();
    }
    var newVideo = modal.slides[modal.selectedSlide].getElementsByTagName('video');
    if(newVideo.length > 0 ) {
      setVideoWidth(modal, modal.selectedSlide, newVideo[0]);
      newVideo[0].play();
    }
  };

  function resetIframes(modal, index) {
    if(index) {
      var actualIframe = modal.slides[index].getElementsByTagName('iframe');
      if(actualIframe.length > 0 ) {
        actualIframe[0].setAttribute('data-src', actualIframe[0].src);
        actualIframe[0].removeAttribute('src');
      }
    }
    var newIframe = modal.slides[modal.selectedSlide].getElementsByTagName('iframe');
    if(newIframe.length > 0 ) {
      setVideoWidth(modal, modal.selectedSlide, newIframe[0]);
    }
  };

  function resizeLightbox(modal) { // executed when window has been resized
    if(!modal.selectedSlide) return; // modal not active
    var video = modal.slides[modal.selectedSlide].getElementsByTagName('video');
    if(video.length > 0 ) setVideoWidth(modal, modal.selectedSlide, video[0]);
    var iframe = modal.slides[modal.selectedSlide].getElementsByTagName('iframe');
    if(iframe.length > 0 ) setVideoWidth(modal, modal.selectedSlide, iframe[0]);
  };

  function setVideoWidth(modal, index, video) {
    var videoContainer = modal.slides[index].getElementsByClassName('js-lightbox__media-outer');
    if(videoContainer.length == 0 ) return;
    var videoWrapper = videoContainer[0].getElementsByClassName('js-lightbox__media-inner');
    var maxWidth = (video.offsetWidth/video.offsetHeight)*videoContainer[0].offsetHeight;
    if(maxWidth < modal.slides[index].offsetWidth) {
      videoWrapper[0].style.width = maxWidth+'px';
      videoWrapper[0].style.paddingBottom = videoContainer[0].offsetHeight+'px';
    } else {
      videoWrapper[0].removeAttribute('style')
    }
  };

  function initThumbPreview(modal) {
    if(modal.thumbWrapper.length < 1) return;
    var content = '';
    for(var i = 0; i < modal.slides.length; i++) {
      var activeClass = Util.hasClass(modal.slides[i], 'slideshow__item--selected') ? ' lightbox__thumb--active': '';
      content = content + '<li class="lightbox__thumb js-lightbox__thumb'+activeClass+'"><img src="'+modal.slides[i].querySelector('[data-thumb]').getAttribute('data-thumb')+'">'+'</li>';
    }
    modal.thumbWrapper[0].innerHTML = content;
  };

  function initThumbEvents(modal) {
    if(modal.thumbWrapper.length < 1) return;
    modal.thumbSlides = modal.thumbWrapper[0].getElementsByClassName('js-lightbox__thumb');
    modal.thumbWrapper[0].addEventListener('click', function(event){
      var selectedThumb = event.target.closest('.js-lightbox__thumb');
      if(!selectedThumb || Util.hasClass(selectedThumb, 'lightbox__thumb--active')) return;
      modal.slideshowObj.showItem(Util.getIndexInArray(modal.thumbSlides, selectedThumb));
    });
  };

  function updateThumb(modal) {
    if(modal.thumbWrapper.length < 1) return;
    // update selected thumb classes
    var selectedThumb = modal.thumbWrapper[0].getElementsByClassName('lightbox__thumb--active');
    if(selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'lightbox__thumb--active');
    Util.addClass(modal.thumbSlides[modal.selectedSlide], 'lightbox__thumb--active');
    // update thumb list position (if selected thumb is outside viewport)
    var offsetThumb = modal.thumbSlides[modal.selectedSlide].getBoundingClientRect(),
      offsetThumbList = modal.thumbWrapper[0].getBoundingClientRect();
    if(offsetThumb.left < offsetThumbList.left) {
      modal.thumbWrapper[0].scrollTo(modal.thumbSlides[modal.selectedSlide].offsetLeft - offsetThumbList.left, 0);
    } else if(offsetThumb.right > offsetThumbList.right) {
      modal.thumbWrapper[0].scrollTo( (offsetThumb.right - offsetThumbList.right) + modal.thumbWrapper[0].scrollLeft, 0);
    }
  };

  function keyboardNavigateLightbox(modal, direction) {
    if(!Util.hasClass(modal.element, 'modal--is-visible')) return;
    if(!document.activeElement.closest('.js-lightbox__body') && document.activeElement.closest('.js-modal')) return
    (direction == 'next') ? modal.slideshowObj.showNext() : modal.slideshowObj.showPrev();
  };

  function setSelectedItem(modal, event) {
    // if a specific slide was selected -> make sure to show that item first
    var selectedItemId = false;
    if(event.detail) {
      var elTarget = event.detail.closest('[aria-controls="'+modal.id+'"]');
      if(elTarget) selectedItemId = elTarget.getAttribute('data-lightbox-item');
    } 
   
    if(!selectedItemId || !modal.slideshowObj) return;
    var selectedItem = document.getElementById(selectedItemId);
    if(!selectedItem) return;
    var lastSelected = modal.slideshow.getElementsByClassName('slideshow__item--selected');
    if(lastSelected.length > 0 ) Util.removeClass(lastSelected[0], 'slideshow__item--selected');
    Util.addClass(selectedItem, 'slideshow__item--selected');
  };

  window.Lightbox = Lightbox;

  // init Lightbox objects
  var lightBoxes = document.getElementsByClassName('js-lightbox');
  if( lightBoxes.length > 0 ) {
    var lightBoxArray = [];
    for( var i = 0; i < lightBoxes.length; i++) {
      (function(i){ lightBoxArray.push(new Lightbox(lightBoxes[i]));})(i);
      
      // resize video/iframe
      var resizingId = false;
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < lightBoxArray.length; i++) {
          (function(i){resizeLightbox(lightBoxArray[i]);})(i);
        };
      };

      // Lightbox gallery navigation with keyboard
      window.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          updateLightbox('next');
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          updateLightbox('prev');
        }
      });

      function updateLightbox(direction) {
        for( var i = 0; i < lightBoxArray.length; i++) {
          (function(i){keyboardNavigateLightbox(lightBoxArray[i], direction);})(i);
        };
      };
    }
  }
}());
// File#: _3_looping-slideshow
// Usage: codyhouse.co/license
(function() {
  var LoopSlideshow = function(element) {
    this.element = element;
    this.slideshowObj = false;
    this.navItems = this.element.getElementsByClassName('js-slideshow__nav-item');
    this.autoplayInterval = 5000;
    this.autoplayPaused = false;
    this.fillingCSS = '--loop-slideshow-filling';
    this.pauseBtnClass = 'js-loop-slideshow__pause-btn';
    this.pauseBtn = this.element.getElementsByClassName(this.pauseBtnClass);
    this.animating = false;
    this.currentTime = false;

    initLoopSlideshow(this);
    initEvents(this);
  };

  function initLoopSlideshow(obj) {
    var autoplay = true,
			autoplayInterval = (obj.element.getAttribute('data-autoplay-interval')) ? obj.element.getAttribute('data-autoplay-interval') : obj.autoplayInterval,
			swipe = (obj.element.getAttribute('data-swipe') && obj.element.getAttribute('data-swipe') == 'on') ? true : false;
		obj.slideshowObj = new Slideshow({element: obj.element, navigation: true, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, navigationClass: 'loop-slideshow__navigation', navigationItemClass: 'loop-slideshow__nav-item', autoplayOnHover: true, autoplayOnFocus: true});
    // update autoplay interval
    obj.autoplayInterval = autoplayInterval;
    // filling effect for first item
    initFilling(obj, obj.slideshowObj.selectedSlide);
  };

  function initEvents(obj) {
    obj.element.addEventListener('newItemSelected', function(event){
      // new slide has been selected
      initFilling(obj, event.detail);
      toggleAutoplay(obj, false);
    });

    // custom click on image -> animate slideshow
    obj.element.addEventListener('click', function(event){
      if(event.target.closest('.js-loop-slideshow__pause-btn')) {
        toggleAutoplay(obj, !obj.autoplayPaused); // pause/play autoplay
      } else if(event.target.closest('.js-slideshow__item')) {
        showNewSlide(obj, event);
      }
    });
  };

  function initFilling(obj, index) {
    cancelFilling(obj);

    for(var i = 0; i < obj.navItems.length; i++) {
      setFilling(obj.navItems[i], obj.fillingCSS, 0);
    }
    // trigger animation
    obj.currentTime = false;
    animateFilling(obj, index);
  };

  function cancelFilling(obj) {
    if(obj.animating) { // clear previous animation
      window.cancelAnimationFrame(obj.animating);
      obj.animating = false;
    }
  };

  function animateFilling(obj, index) {
    obj.animating = window.requestAnimationFrame(function(timestamp){
      if(!obj.currentTime) obj.currentTime = timestamp;
      var progress = timestamp - obj.currentTime;
      if(progress > obj.autoplayInterval) progress = obj.autoplayInterval;
      setFilling(obj.navItems[index], obj.fillingCSS, (progress/obj.autoplayInterval).toFixed(3));
      
      if(progress < obj.autoplayInterval) {
        animateFilling(obj, index);
      } else {
        // animation is over
        obj.animating = false;
        obj.currentTime = false;
      }
    });
  };

  function setFilling(element, property, value) {
    element.style.setProperty(property, value);
  };

  function showNewSlide(obj, event) {
    // check if we should go next or prev
    var boundingRect = obj.element.getBoundingClientRect(),
      isNext = event.clientX > boundingRect.left + boundingRect.width/2;

    isNext ? obj.slideshowObj.showNext() : obj.slideshowObj.showPrev();
  };

  function toggleAutoplay(obj, bool) {
    obj.autoplayPaused = bool;
    if(obj.autoplayPaused) {
      cancelFilling(obj);
      obj.slideshowObj.pauseAutoplay();
    } else {
      obj.slideshowObj.startAutoplay();
      initFilling(obj, obj.slideshowObj.selectedSlide);
    }
    if(obj.pauseBtn.length > 0) {
      // update btn appearance
      Util.toggleClass(obj.pauseBtn[0], 'btn-states--state-b', obj.autoplayPaused);
      // update pressed status 
      obj.autoplayPaused ? obj.pauseBtn[0].setAttribute('aria-pressed', 'true'): obj.pauseBtn[0].setAttribute('aria-pressed', 'false');
    }
  };

  //initialize the ThumbSlideshow objects
	var slideshow = document.getElementsByClassName('js-loop-slideshow');
  if( slideshow.length > 0 ) {
    for( var i = 0; i < slideshow.length; i++) {
      (function(i){
        new LoopSlideshow(slideshow[i]);
      })(i);
    }
  }
}());
// File#: _3_mega-site-navigation
// Usage: codyhouse.co/license
(function() {
  var MegaNav = function(element) {
    this.element = element;
    this.search = this.element.getElementsByClassName('js-mega-nav__search');
    this.searchActiveController = false;
    this.menu = this.element.getElementsByClassName('js-mega-nav__nav');
    this.menuItems = this.menu[0].getElementsByClassName('js-mega-nav__item');
    this.menuActiveController = false;
    this.itemExpClass = 'mega-nav__item--expanded';
    this.classIconBtn = 'mega-nav__icon-btn--state-b';
    this.classSearchVisible = 'mega-nav__search--is-visible';
    this.classNavVisible = 'mega-nav__nav--is-visible';
    this.classMobileLayout = 'mega-nav--mobile';
    this.classDesktopLayout = 'mega-nav--desktop';
    this.layout = 'mobile';
    // store dropdown elements (if present)
    this.dropdown = this.element.getElementsByClassName('js-dropdown');
    // expanded class - added to header when subnav is open
    this.expandedClass = 'mega-nav--expanded';
    // check if subnav should open on hover
    this.hover = this.element.getAttribute('data-hover') && this.element.getAttribute('data-hover') == 'on';
    initMegaNav(this);
  };

  function initMegaNav(megaNav) {
    setMegaNavLayout(megaNav); // switch between mobile/desktop layout
    initSearch(megaNav); // controll search navigation
    initMenu(megaNav); // control main menu nav - mobile only
    initSubNav(megaNav); // toggle sub navigation visibility
    
    megaNav.element.addEventListener('update-menu-layout', function(event){
      setMegaNavLayout(megaNav); // window resize - update layout
    });
  };

  function setMegaNavLayout(megaNav) {
    var layout = getComputedStyle(megaNav.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if(layout == megaNav.layout) return;
    megaNav.layout = layout;
    Util.toggleClass(megaNav.element, megaNav.classDesktopLayout, megaNav.layout == 'desktop');
    Util.toggleClass(megaNav.element, megaNav.classMobileLayout, megaNav.layout != 'desktop');
    if(megaNav.layout == 'desktop') {
      closeSubNav(megaNav, false);
      // if the mega navigation has dropdown elements -> make sure they are in the right position (viewport awareness)
      triggerDropdownPosition(megaNav);
    } 
    closeSearch(megaNav, false);
    resetMegaNavOffset(megaNav); // reset header offset top value
    resetNavAppearance(megaNav); // reset nav expanded appearance
  };

  function resetMegaNavOffset(megaNav) {
    document.documentElement.style.setProperty('--mega-nav-offset-y', megaNav.element.getBoundingClientRect().top+'px');
  };

  function closeNavigation(megaNav) { // triggered by Esc key press
    // close search
    closeSearch(megaNav);
    // close nav
    if(Util.hasClass(megaNav.menu[0], megaNav.classNavVisible)) {
      toggleMenu(megaNav, megaNav.menu[0], 'menuActiveController', megaNav.classNavVisible, megaNav.menuActiveController, true);
    }
    //close subnav 
    closeSubNav(megaNav, false);
    resetNavAppearance(megaNav); // reset nav expanded appearance
  };

  function closeFocusNavigation(megaNav) { // triggered by Tab key pressed
    // close search when focus is lost
    if(Util.hasClass(megaNav.search[0], megaNav.classSearchVisible) && !document.activeElement.closest('.js-mega-nav__search')) {
      toggleMenu(megaNav, megaNav.search[0], 'searchActiveController', megaNav.classSearchVisible, megaNav.searchActiveController, true);
    }
    // close nav when focus is lost
    if(Util.hasClass(megaNav.menu[0], megaNav.classNavVisible) && !document.activeElement.closest('.js-mega-nav__nav')) {
      toggleMenu(megaNav, megaNav.menu[0], 'menuActiveController', megaNav.classNavVisible, megaNav.menuActiveController, true);
    }
    // close subnav when focus is lost
    for(var i = 0; i < megaNav.menuItems.length; i++) {
      if(!Util.hasClass(megaNav.menuItems[i], megaNav.itemExpClass)) continue;
      var parentItem = document.activeElement.closest('.js-mega-nav__item');
      if(parentItem && parentItem == megaNav.menuItems[i]) continue;
      closeSingleSubnav(megaNav, i);
    }
    resetNavAppearance(megaNav); // reset nav expanded appearance
  };

  function closeSearch(megaNav, bool) {
    if(megaNav.search.length < 1) return;
    if(Util.hasClass(megaNav.search[0], megaNav.classSearchVisible)) {
      toggleMenu(megaNav, megaNav.search[0], 'searchActiveController', megaNav.classSearchVisible, megaNav.searchActiveController, bool);
    }
  } ;

  function initSearch(megaNav) {
    if(megaNav.search.length == 0) return;
    // toggle search
    megaNav.searchToggles = document.querySelectorAll('[aria-controls="'+megaNav.search[0].getAttribute('id')+'"]');
    for(var i = 0; i < megaNav.searchToggles.length; i++) {(function(i){
      megaNav.searchToggles[i].addEventListener('click', function(event){
        // toggle search
        toggleMenu(megaNav, megaNav.search[0], 'searchActiveController', megaNav.classSearchVisible, megaNav.searchToggles[i], true);
        // close nav if it was open
        if(Util.hasClass(megaNav.menu[0], megaNav.classNavVisible)) {
          toggleMenu(megaNav, megaNav.menu[0], 'menuActiveController', megaNav.classNavVisible, megaNav.menuActiveController, false);
        }
        // close subnavigation if open
        closeSubNav(megaNav, false);
        resetNavAppearance(megaNav); // reset nav expanded appearance
      });
    })(i);}
  };

  function initMenu(megaNav) {
    if(megaNav.menu.length == 0) return;
    // toggle nav
    megaNav.menuToggles = document.querySelectorAll('[aria-controls="'+megaNav.menu[0].getAttribute('id')+'"]');
    for(var i = 0; i < megaNav.menuToggles.length; i++) {(function(i){
      megaNav.menuToggles[i].addEventListener('click', function(event){
        // toggle nav
        toggleMenu(megaNav, megaNav.menu[0], 'menuActiveController', megaNav.classNavVisible, megaNav.menuToggles[i], true);
        // close search if it was open
        if(Util.hasClass(megaNav.search[0], megaNav.classSearchVisible)) {
          toggleMenu(megaNav, megaNav.search[0], 'searchActiveController', megaNav.classSearchVisible, megaNav.searchActiveController, false);
        }
        resetNavAppearance(megaNav); // reset nav expanded appearance
      });
    })(i);}
  };

  function toggleMenu(megaNav, element, controller, visibleClass, toggle, moveFocus) {
    var menuIsVisible = Util.hasClass(element, visibleClass);
    Util.toggleClass(element, visibleClass, !menuIsVisible);
    Util.toggleClass(toggle, megaNav.classIconBtn, !menuIsVisible);
    menuIsVisible ? toggle.removeAttribute('aria-expanded') : toggle.setAttribute('aria-expanded', 'true');
    if(menuIsVisible) {
      if(toggle && moveFocus) toggle.focus();
      megaNav[controller] = false;
    } else {
      if(toggle) megaNav[controller] = toggle;
			getFirstFocusable(element).focus(); // move focus to first focusable element
    }
  };

  function getFirstFocusable(element) {
    var focusableEle = element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
		  firstFocusable = false;
    for(var i = 0; i < focusableEle.length; i++) {
      if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
        firstFocusable = focusableEle[i];
        break;
      }
    }
    return firstFocusable;
  };

  function initSubNav(megaNav) {
    // toggle subnavigation visibility
    megaNav.element.addEventListener('click', function(event){
      toggleSubNav(megaNav, event, 'click');
    });

    if(megaNav.hover) { // data-hover="on" => use mouse events 
      megaNav.element.addEventListener('mouseover', function(event) {
        if(megaNav.layout != 'desktop') return;
        toggleSubNav(megaNav, event, 'mouseover')
      });

      megaNav.element.addEventListener('mouseout', function(event){
        if(megaNav.layout != 'desktop') return;
        var mainItem = event.target.closest('.js-mega-nav__item');
        if(!mainItem) return;
        var triggerBtn = mainItem.getElementsByClassName('js-mega-nav__control');
        if(triggerBtn.length < 1) return;
        var itemExpanded = Util.hasClass(mainItem, megaNav.itemExpClass);
        if(!itemExpanded) return;
        var mainItemHover = event.relatedTarget;
        if(mainItemHover && mainItem.contains(mainItemHover)) return;
        
        Util.toggleClass(mainItem, megaNav.itemExpClass, !itemExpanded);
        itemExpanded ? triggerBtn[0].removeAttribute('aria-expanded') : triggerBtn[0].setAttribute('aria-expanded', 'true');
      });
    }
  };

  function toggleSubNav(megaNav, event, eventType) {
    var triggerBtn = event.target.closest('.js-mega-nav__control');
    if(!triggerBtn) return;
    var mainItem = triggerBtn.closest('.js-mega-nav__item');
    if(!mainItem) return;
    var itemExpanded = Util.hasClass(mainItem, megaNav.itemExpClass);
    if(megaNav.hover && itemExpanded && megaNav.layout == 'desktop' && eventType != 'click') return;
    Util.toggleClass(mainItem, megaNav.itemExpClass, !itemExpanded);
    itemExpanded ? triggerBtn.removeAttribute('aria-expanded') : triggerBtn.setAttribute('aria-expanded', 'true');
    if(megaNav.layout == 'desktop' && !itemExpanded) closeSubNav(megaNav, mainItem);
    // close search if open
    closeSearch(megaNav, false);
    resetNavAppearance(megaNav); // reset nav expanded appearance
  };

  function closeSubNav(megaNav, selectedItem) {
    // close subnav when a new sub nav element is open
    if(megaNav.menuItems.length == 0 ) return;
    for(var i = 0; i < megaNav.menuItems.length; i++) {
      if(megaNav.menuItems[i] != selectedItem) closeSingleSubnav(megaNav, i);
    }
  };

  function closeSingleSubnav(megaNav, index) {
    Util.removeClass(megaNav.menuItems[index], megaNav.itemExpClass);
    var triggerBtn = megaNav.menuItems[index].getElementsByClassName('js-mega-nav__control');
    if(triggerBtn.length > 0) triggerBtn[0].removeAttribute('aria-expanded');
  };

  function triggerDropdownPosition(megaNav) {
    // emit custom event to properly place dropdown elements - viewport awarness
    if(megaNav.dropdown.length == 0) return;
    for(var i = 0; i < megaNav.dropdown.length; i++) {
      megaNav.dropdown[i].dispatchEvent(new CustomEvent('placeDropdown'));
    }
  };

  function resetNavAppearance(megaNav) {
    ( (megaNav.element.getElementsByClassName(megaNav.itemExpClass).length > 0 && megaNav.layout == 'desktop') || megaNav.element.getElementsByClassName(megaNav.classSearchVisible).length > 0 ||(megaNav.element.getElementsByClassName(megaNav.classNavVisible).length > 0 && megaNav.layout == 'mobile'))
      ? Util.addClass(megaNav.element, megaNav.expandedClass)
      : Util.removeClass(megaNav.element, megaNav.expandedClass);
  };

  //initialize the MegaNav objects
  var megaNav = document.getElementsByClassName('js-mega-nav');
  if(megaNav.length > 0) {
    var megaNavArray = [];
    for(var i = 0; i < megaNav.length; i++) {
      (function(i){megaNavArray.push(new MegaNav(megaNav[i]));})(i);
    }

    // key events
    window.addEventListener('keyup', function(event){
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) { // listen for esc key events
        for(var i = 0; i < megaNavArray.length; i++) {(function(i){
          closeNavigation(megaNavArray[i]);
        })(i);}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) { // close search or nav if it looses focus
        for(var i = 0; i < megaNavArray.length; i++) {(function(i){
          closeFocusNavigation(megaNavArray[i]);
        })(i);}
			}
    });

    window.addEventListener('click', function(event){
      if(!event.target.closest('.js-mega-nav')) closeNavigation(megaNavArray[0]);
    });
    
    // resize - update menu layout
    var resizingId = false,
      customEvent = new CustomEvent('update-menu-layout');
    window.addEventListener('resize', function(event){
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 200);
    });

    function doneResizing() {
      for( var i = 0; i < megaNavArray.length; i++) {
        (function(i){megaNavArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };

    (window.requestAnimationFrame) // init mega site nav layout
      ? window.requestAnimationFrame(doneResizing)
      : doneResizing();
  }
}());
// File#: _3_thumbnail-slideshow
// Usage: codyhouse.co/license
(function() {
	var ThumbSlideshow = function(element) {
		this.element = element;
		this.slideshow = this.element.getElementsByClassName('slideshow')[0];
		this.slideshowItems = this.slideshow.getElementsByClassName('js-slideshow__item');
		this.carousel = this.element.getElementsByClassName('thumbslide__nav-wrapper')[0];
		this.carouselList = this.carousel.getElementsByClassName('thumbslide__nav-list')[0];
		this.carouselListWrapper = this.carousel.getElementsByClassName('thumbslide__nav')[0];
		this.carouselControls = this.element.getElementsByClassName('js-thumbslide__tb-control');
		// custom obj
		this.slideshowObj = false;
		// thumb properties
		this.thumbItems = false;
		this.thumbOriginalWidth = false;
		this.thumbOriginalHeight = false;
		this.thumbVisibItemsNb = false;
		this.itemsWidth = false;
		this.itemsHeight = false;
		this.itemsMargin = false;
		this.thumbTranslateContainer = false;
		this.thumbTranslateVal = 0;
		// vertical variation
		this.thumbVertical = Util.hasClass(this.element, 'thumbslide--vertical');
		// recursive update 
		this.recursiveDirection = false;
		// drag events 
		this.thumbDragging = false;
		this.dragStart = false;
		// resize
		this.resize = false;
		// image load -> store info about thumb image being loaded
		this.loaded = false;
		initThumbs(this);
		initSlideshow(this);
		checkImageLoad(this);
	};

	function initThumbs(thumbSlider) { // create thumb items
		var carouselItems = '';
		for(var i = 0; i < thumbSlider.slideshowItems.length; i++) {
			var url = thumbSlider.slideshowItems[i].getAttribute('data-thumb'),
				alt = thumbSlider.slideshowItems[i].getAttribute('data-alt');
			if(!alt) alt = 'Image Preview';
			carouselItems = carouselItems + '<li class="thumbslide__nav-item"><img src="'+url+'" alt="'+alt+'">'+'</li>';
		}
		thumbSlider.carouselList.innerHTML = carouselItems;
		if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
		else loadThumbsVerticalLayout(thumbSlider);
	};

	function initThumbsLayout(thumbSlider) {  // set thumbs visible numbers + width
		// evaluate size of single elements + number of visible elements
		thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
		
		var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
			itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
			itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-left')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width'));

    if( !thumbSlider.thumbOriginalWidth) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
      itemWidth = thumbSlider.thumbOriginalWidth;
    }
    // get proper width of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerWidth - 2*containerPadding + itemMargin)/(itemWidth+itemMargin));
    thumbSlider.itemsWidth = ((containerWidth - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsWidth+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) thumbSlider.carouselList.style.width = (thumbSlider.itemsWidth + itemMargin)*thumbSlider.slideshowItems.length+'px';
		setThumbsWidth(thumbSlider);
	};

	function checkImageLoad(thumbSlider) {
		if(!thumbSlider.thumbVertical) { // no need to wait for image load, we already have their width
			updateVisibleThumb(thumbSlider, 0);
			updateThumbControls(thumbSlider);
			initTbSlideshowEvents(thumbSlider);
		} else { // wait for image to be loaded -> need to know the right height
			var image = new Image();
			image.onload = function () {thumbSlider.loaded = true;}
			image.onerror = function () {thumbSlider.loaded = true;}
			image.src = thumbSlider.slideshowItems[0].getAttribute('data-thumb');
		}
	};

	function loadThumbsVerticalLayout(thumbSlider) {
		// this is the vertical layout -> we need to make sure the thumb are loaded before checking the value of their height
		if(thumbSlider.loaded) {
			initThumbsVerticalLayout(thumbSlider);
			updateVisibleThumb(thumbSlider, 0);
			updateThumbControls(thumbSlider);
			initTbSlideshowEvents(thumbSlider);
		} else { // wait for thumbs to be loaded
			setTimeout(function(){
				loadThumbsVerticalLayout(thumbSlider);
			}, 100);
		}
	}

	function initThumbsVerticalLayout(thumbSlider) {
		// evaluate size of single elements + number of visible elements
		thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
		
		var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
			itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
			itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
			itemRatio = itemWidth/itemHeight,
			itemMargin = parseFloat(itemStyle.getPropertyValue('margin-bottom')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-top')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width')),
      containerHeight = parseFloat(containerStyle.getPropertyValue('height'));

    if(!flexSupported) containerHeight = parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('height'));
    
    if( !thumbSlider.thumbOriginalHeight ) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalHeight = itemHeight;
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
    	resetOriginalSize(thumbSlider);
      itemHeight = thumbSlider.thumbOriginalHeight;
    }
    // get proper height of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerHeight - 2*containerPadding + itemMargin)/(itemHeight+itemMargin));
    thumbSlider.itemsHeight = ((containerHeight - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.itemsWidth = thumbSlider.itemsHeight*itemRatio,
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsHeight+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) {
    	thumbSlider.carousel.style.height = (thumbSlider.itemsHeight + itemMargin)*thumbSlider.slideshowItems.length+'px';
			thumbSlider.carouselListWrapper.style.height = containerHeight+'px';
    }
		setThumbsWidth(thumbSlider);
	};

	function setThumbsWidth(thumbSlider) { // set thumbs width
    for(var i = 0; i < thumbSlider.thumbItems.length; i++) {
      thumbSlider.thumbItems[i].style.width = thumbSlider.itemsWidth+"px";
      if(thumbSlider.thumbVertical) thumbSlider.thumbItems[i].style.height = thumbSlider.itemsHeight+"px";
    }

    if(thumbSlider.thumbVertical) {
    	var padding = parseFloat(window.getComputedStyle(thumbSlider.carouselListWrapper).getPropertyValue('padding-left'));
    	thumbSlider.carousel.style.width = (thumbSlider.itemsWidth + 2*padding)+"px";
    	if(!flexSupported) thumbSlider.slideshow.style.width = (parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('width')) - (thumbSlider.itemsWidth + 2*padding) - 10) + 'px';
    }
  };

	function initSlideshow(thumbSlider) { // for the main slideshow, we are using the Slideshow component -> we only need to initialize the object
		var autoplay = (thumbSlider.slideshow.getAttribute('data-autoplay') && thumbSlider.slideshow.getAttribute('data-autoplay') == 'on') ? true : false,
			autoplayInterval = (thumbSlider.slideshow.getAttribute('data-autoplay-interval')) ? thumbSlider.slideshow.getAttribute('data-autoplay-interval') : 5000,
			swipe = (thumbSlider.slideshow.getAttribute('data-swipe') && thumbSlider.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
		thumbSlider.slideshowObj = new Slideshow({element: thumbSlider.slideshow, navigation: false, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe});
	};

	function initTbSlideshowEvents(thumbSlider) {
    // listen for new slide selection -> 'newItemSelected' custom event is emitted each time a new slide is selected
    thumbSlider.slideshowObj.element.addEventListener('newItemSelected', function(event){
			updateVisibleThumb(thumbSlider, event.detail);
    });

		// click on a thumbnail -> update slide in slideshow
		thumbSlider.carouselList.addEventListener('click', function(event){
			if(thumbSlider.thumbDragging) return;
			var selectedOption = event.target.closest('.thumbslide__nav-item');
			if(!selectedOption || Util.hasClass(selectedOption, 'thumbslide__nav-item--active')) return;
			thumbSlider.slideshowObj.showItem(Util.getIndexInArray(thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item'), selectedOption));
		});

		// reset thumbnails on resize
    window.addEventListener('resize', function(event){
    	if(thumbSlider.resize) return;
    	thumbSlider.resize = true;
      window.requestAnimationFrame(resetThumbsResize.bind(thumbSlider));
    });

    // enable drag on thumbnails
		new SwipeContent(thumbSlider.carouselList);
		thumbSlider.carouselList.addEventListener('dragStart', function(event){
			var coordinate =  getDragCoordinate(thumbSlider, event);
			thumbSlider.dragStart = coordinate;
			thumbDragEnd(thumbSlider);
		});
		thumbSlider.carouselList.addEventListener('dragging', function(event){
			if(!thumbSlider.dragStart) return;
			var coordinate =  getDragCoordinate(thumbSlider, event);
			if(thumbSlider.slideshowObj.animating || Math.abs(coordinate - thumbSlider.dragStart) < 20) return;
			Util.addClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
			thumbSlider.thumbDragging = true;
			Util.addClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
			var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
			setTranslate(thumbSlider, translate+'('+(thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart)+'px)');
		});
	};

	function thumbDragEnd(thumbSlider) {
		thumbSlider.carouselList.addEventListener('dragEnd', function cb(event){
			var coordinate = getDragCoordinate(thumbSlider, event);
			thumbSlider.thumbTranslateVal = resetTranslateToRound(thumbSlider, thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart);
			thumbShowNewItems(thumbSlider, false);
			thumbSlider.dragStart = false;
			Util.removeClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
			thumbSlider.carouselList.removeEventListener('dragEnd', cb);
			setTimeout(function(){
				thumbSlider.thumbDragging = false;
			}, 50);
			Util.removeClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
		});
	};

	function getDragCoordinate(thumbSlider, event) { // return the drag value based on direction of thumbs navugation
		return thumbSlider.thumbVertical ? event.detail.y : event.detail.x;
	}

	function resetTranslateToRound(thumbSlider, value) { // at the ed of dragging -> set translate of coontainer to right value
		var dimension = getItemDimension(thumbSlider);
		return Math.round(value/(dimension+thumbSlider.itemsMargin))*(dimension+thumbSlider.itemsMargin);
	};

	function resetThumbsResize() { // reset thumbs width on resize
		var thumbSlider = this;
		if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
		else initThumbsVerticalLayout(thumbSlider);
    setThumbsWidth(thumbSlider);
    var dimension = getItemDimension(thumbSlider);
    // reset the translate value of the thumbs container as well
    if( (-1)*thumbSlider.thumbTranslateVal % (dimension + thumbSlider.itemsMargin) > 0 ) {
			thumbSlider.thumbTranslateVal = -1 * parseInt(((-1)*thumbSlider.thumbTranslateVal)/(dimension + thumbSlider.itemsMargin)) * (dimension + thumbSlider.itemsMargin); 
    	thumbShowNewItems(thumbSlider, false);
    }
    thumbSlider.resize = false;
	};

	function thumbShowNewItems(thumbSlider, direction) { // when a new slide is selected -> update position of thumbs navigation
		var dimension = getItemDimension(thumbSlider);
		if(direction == 'next') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal - thumbSlider.thumbTranslateContainer;
		else if(direction == 'prev') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal + thumbSlider.thumbTranslateContainer;
		// make sure translate value is correct
		if(-1*thumbSlider.thumbTranslateVal >= (thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin)) thumbSlider.thumbTranslateVal = -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin));
		if(thumbSlider.thumbTranslateVal > 0) thumbSlider.thumbTranslateVal = 0;

		var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
		setTranslate(thumbSlider, translate+'('+thumbSlider.thumbTranslateVal+'px)');
		updateThumbControls(thumbSlider);
	};

	function updateVisibleThumb(thumbSlider, index) { // update selected thumb
		// update selected thumbnails
		var selectedThumb = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item--active');
		if(selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'thumbslide__nav-item--active');
		Util.addClass(thumbSlider.thumbItems[index], 'thumbslide__nav-item--active');
		// update carousel translate value if new thumb is not visible
		recursiveUpdateThumb(thumbSlider, index);
	};

	function recursiveUpdateThumb(thumbSlider, index) { // recursive function used to update the position of thumbs navigation (eg when going from last slide to first one)
		var dimension = getItemDimension(thumbSlider);
		if( ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) || ( index*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal <= 0 && thumbSlider.thumbTranslateVal < 0) ) {
			var increment = ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) ? 1 : -1;
			if( !thumbSlider.recursiveDirection || thumbSlider.recursiveDirection == increment) {
				thumbSlider.thumbTranslateVal = -1 * increment * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal;
				thumbSlider.recursiveDirection = increment;
				recursiveUpdateThumb(thumbSlider, index);
			} else {
				thumbSlider.recursiveDirection = false;
				thumbShowNewItems(thumbSlider, false);
			}
		} else {
			thumbSlider.recursiveDirection = false;
			thumbShowNewItems(thumbSlider, false);
		}
	}

	function updateThumbControls(thumbSlider) { // reset thumb controls style
		var dimension = getItemDimension(thumbSlider);
		Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-start', (thumbSlider.thumbTranslateVal != 0));
		Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-end', (thumbSlider.thumbTranslateVal != -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))) && (thumbSlider.thumbItems.length > thumbSlider.thumbVisibItemsNb));
		if(thumbSlider.carouselControls.length == 0) return;
		Util.toggleClass(thumbSlider.carouselControls[0], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == 0));
		Util.toggleClass(thumbSlider.carouselControls[1], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))));
	};

	function getItemDimension(thumbSlider) {
		return thumbSlider.thumbVertical ? thumbSlider.itemsHeight : thumbSlider.itemsWidth;
	}

	function setTranslate(thumbSlider, translate) {
    thumbSlider.carouselList.style.transform = translate;
    thumbSlider.carouselList.style.msTransform = translate;
  };

  function resetOriginalSize(thumbSlider) {
		if( !Util.cssSupports('color', 'var(--var-name)') ) return;
		var thumbWidth = parseInt(getComputedStyle(thumbSlider.element).getPropertyValue('--thumbslide-thumbnail-auto-size'));
		if(thumbWidth == thumbSlider.thumbOriginalWidth) return;
		thumbSlider.thumbOriginalHeight = parseFloat((thumbSlider.thumbOriginalHeight)*(thumbWidth/thumbSlider.thumbOriginalWidth));
  	thumbSlider.thumbOriginalWidth = thumbWidth;
  };
	
	//initialize the ThumbSlideshow objects
	var thumbSlideshows = document.getElementsByClassName('js-thumbslide'),
		flexSupported = Util.cssSupports('align-items', 'stretch');
	if( thumbSlideshows.length > 0 ) {
		for( var i = 0; i < thumbSlideshows.length; i++) {
			(function(i){
				new ThumbSlideshow(thumbSlideshows[i]);
			})(i);
		}
	}
}());
// File#: _4_product-v2
// Usage: codyhouse.co/license
(function() {
  function initColorSwatches(product) {
    var slideshow = product.getElementsByClassName('js-product-v2__slideshow'),
      colorSwatches = product.getElementsByClassName('js-color-swatches__select');
    if(slideshow.length == 0 || colorSwatches.length == 0) return; // no slideshow available

    var slideshowItems = slideshow[0].getElementsByClassName('js-slideshow__item'); // slideshow items
    
    colorSwatches[0].addEventListener('change', function(event){ // new color has been selected
      selectNewSlideshowItem(colorSwatches[0].options[colorSwatches[0].selectedIndex].value, slideshow[0], slideshowItems);
    });
  };

  function selectNewSlideshowItem(value, slideshow, items){
    var selectedItem = document.getElementById('item-'+value);
    if(!selectedItem) return;
    var event = new CustomEvent('selectNewItem', {detail: Util.getIndexInArray(items, selectedItem) + 1});
    slideshow.dispatchEvent(event); // reveal new slide
  };

  var productV2 = document.getElementsByClassName('js-product-v2');
  if(productV2.length > 0) {
    for(var i = 0; i < productV2.length; i++) {(function(i){
      initColorSwatches(productV2[i]);
    })(i);}
  }
}());