$(window).on('load', function() {
    "use strict";

    /*=========================================================================
        Preloader
    =========================================================================*/
    $("#preloader").delay(350).fadeOut('slow');
    // Because only Chrome supports offset-path, feGaussianBlur for now
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if(!isChrome) {
        document.getElementsByClassName('infinityChrome')[0].style.display = "none";
        document.getElementsByClassName('infinity')[0].style.display = "block";
    }

    /*=========================================================================
     Wow Initialize
     =========================================================================*/
    // Here will be the WoW Js implementation.
    setTimeout(function(){new WOW().init();}, 0);

    var dynamicDelay = [
      200,
      400,
      600,
      800,
      1000,
      1200,
      1400,
      1600,
      1800,
      2000
    ];
    var fallbackValue = "200ms";
  
    $(".blog-item.wow").each(function(index) {
      $(this).attr("data-wow-delay", typeof dynamicDelay[index] === 'undefined' ? fallbackValue : dynamicDelay[index] + "ms");
    });

    /*=========================================================================
     Isotope
     =========================================================================*/
    $('.portfolio-filter').on( 'click', 'li', function() {
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
    });

    // change is-checked class on buttons
    $('.portfolio-filter').each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'li', function() {
            $buttonGroup.find('.current').removeClass('current');
            $( this ).addClass('current');
        });
    });

    var $container = $('.portfolio-wrapper');
    $container.imagesLoaded( function() {
      $('.portfolio-wrapper').isotope({
          // options
          itemSelector: '[class*="col-"]',
          percentPosition: true,
          masonry: {
              // use element for option
              columnWidth: '[class*="col-"]'
          }
      });
    });

    var bolbyPopup = function(){
      /*=========================================================================
              Magnific Popup
      =========================================================================*/
      $('.work-image').magnificPopup({
        type: 'image',
        closeBtnInside: false,
        mainClass: 'my-mfp-zoom-in',
      });

      $('.work-content').magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: false,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
      });

      $('.work-video').magnificPopup({
        type: 'iframe',
        closeBtnInside: false,
        iframe: {
            markup: '<div class="mfp-iframe-scaler">'+
                      '<div class="mfp-close"></div>'+
                      '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                    '</div>', 

            patterns: {
              youtube: {
                index: 'youtube.com/',

                id: 'v=',

                src: 'https://www.youtube.com/embed/%id%?autoplay=1'
              },
              vimeo: {
                index: 'vimeo.com/',
                id: '/',
                src: '//player.vimeo.com/video/%id%?autoplay=1'
              },
              gmaps: {
                index: '//maps.google.',
                src: '%id%&output=embed'
              }

            },

            srcAction: 'iframe_src',
          }
      });

      $('.gallery-link').on('click', function () {
          $(this).next().magnificPopup('open');
      });

      $('.gallery').each(function () {
          $(this).magnificPopup({
              delegate: 'a',
              type: 'image',
              closeBtnInside: false,
              gallery: {
                  enabled: true,
                  navigateByImgClick: true
              },
              fixedContentPos: false,
              mainClass: 'my-mfp-zoom-in',
          });
      });
    }

    bolbyPopup();

    /* ======= Mobile Filter ======= */

    // bind filter on select change
    $('.portfolio-filter-mobile').on( 'change', function() {
      // get filter value from option value
      var filterValue = this.value;
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $container.isotope({ filter: filterValue });
    });

    var filterFns = {
      // show if number is greater than 50
      numberGreaterThan50: function() {
        var number = $(this).find('.number').text();
        return parseInt( number, 10 ) > 50;
      },
      // show if name ends with -ium
      ium: function() {
        var name = $(this).find('.name').text();
        return name.match( /ium$/ );
      }
    };
});

/*=========================================================================
    Lightweight scroll motion
=========================================================================*/
(function () {
  "use strict";
  var motionItems = Array.prototype.slice.call(document.querySelectorAll(
    'section:not(.home) .section-title, #about .about-card, #about .fact-item, #services .service-box, #experience .timeline, #education .timeline, #works .portfolio-item, #blog .achievement-summary, #blog .achievement-card, #contact .contact-shell'
  ));
  motionItems.forEach(function (item) {
    item.classList.add('scroll-motion-item');
  });
  var activeMotionItems = new Set();
  if ('IntersectionObserver' in window) {
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeMotionItems.add(entry.target);
        } else {
          activeMotionItems.delete(entry.target);
        }
      });
      requestMotionFrame();
    }, { rootMargin: '30% 0px 30% 0px' });
    motionItems.forEach(function (item) {
      motionObserver.observe(item);
    });
  } else {
    motionItems.forEach(function (item) {
      activeMotionItems.add(item);
    });
  }

  var homeSection = document.getElementById('home');
  if (homeSection && 'IntersectionObserver' in window) {
    var homeObserver = new IntersectionObserver(function (entries) {
      homeSection.classList.toggle('is-visual-active', entries[0].isIntersecting);
    }, { threshold: 0.05 });
    homeObserver.observe(homeSection);
  } else if (homeSection) {
    homeSection.classList.add('is-visual-active');
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var frameRequested = false;

  function renderScrollMotion() {
    frameRequested = false;
    var useMotion = !reduceMotion.matches;

    activeMotionItems.forEach(function (item) {
      var itemRect = item.getBoundingClientRect();
      var itemFocus = itemRect.top + Math.min(itemRect.height, 360) * 0.5;
      var distance = (itemFocus - window.innerHeight * 0.54) / window.innerHeight;
      var clamped = Math.max(-1, Math.min(1, distance));
      var motionEnabled = useMotion && window.innerWidth > 768;
      var motionAmount = motionEnabled ? clamped : 0;
      var motionDepth = Math.min(1, Math.abs(motionAmount));

      item.style.setProperty('--motion-y', (motionAmount * 46).toFixed(2) + 'px');
      item.style.setProperty('--motion-tilt', (motionAmount * -2).toFixed(2) + 'deg');
      item.style.setProperty('--motion-scale', (1 - motionDepth * 0.022).toFixed(3));
      item.style.setProperty('--motion-opacity', (1 - motionDepth * 0.18).toFixed(3));
    });

  }

  function requestMotionFrame() {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(renderScrollMotion);
    }
  }

  window.addEventListener('scroll', requestMotionFrame, { passive: true });
  window.addEventListener('resize', requestMotionFrame);
  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', requestMotionFrame);
  }
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('page-paused', document.hidden);
    requestMotionFrame();
  });
  renderScrollMotion();
}());

/*=========================================================================
    Scroll-triggered typewriter accents
=========================================================================*/
(function () {
  "use strict";

  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-typewriter]:not([data-typewriter-load])'));
  var loadTargets = Array.prototype.slice.call(document.querySelectorAll('[data-typewriter-load]'));
  var allTargets = targets.concat(loadTargets);
  if (!allTargets.length) {
    return;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    allTargets.forEach(function (target) {
      target.classList.add('typewriter-complete');
    });
    return;
  }

  allTargets.forEach(function (target) {
    var text = target.textContent.trim();
    var textNode = document.createElement('span');
    var cursor = document.createElement('span');

    target.setAttribute('aria-label', text);
    target.dataset.typewriterText = text;
    target.textContent = '';
    textNode.className = 'typewriter-text';
    textNode.setAttribute('aria-hidden', 'true');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    target.appendChild(textNode);
    target.appendChild(cursor);
  });

  function renderTypedText(output, text, length, highlight) {
    var visibleText = text.slice(0, length);
    var highlightStart = highlight ? text.indexOf(highlight) : -1;
    output.textContent = '';

    if (highlightStart < 0 || length <= highlightStart) {
      output.textContent = visibleText;
      return;
    }

    var highlightEnd = highlightStart + highlight.length;
    output.appendChild(document.createTextNode(text.slice(0, highlightStart)));

    var highlightNode = document.createElement('span');
    highlightNode.className = 'hero-highlight';
    highlightNode.textContent = text.slice(highlightStart, Math.min(length, highlightEnd));
    output.appendChild(highlightNode);

    if (length > highlightEnd) {
      output.appendChild(document.createTextNode(text.slice(highlightEnd, length)));
    }
  }

  function typeTarget(target) {
    if (target.classList.contains('typewriter-complete') || target.classList.contains('is-typing')) {
      return;
    }

    var output = target.querySelector('.typewriter-text');
    var text = target.dataset.typewriterText;
    var highlight = target.dataset.typewriterHighlight || '';
    var index = 0;
    target.classList.add('is-typing');

    function typeNextCharacter() {
      index += 1;
      renderTypedText(output, text, index, highlight);

      if (index >= text.length) {
        target.classList.remove('is-typing');
        target.classList.add('typewriter-complete');
        return;
      }

      var character = text.charAt(index - 1);
      var delay = /[,.!?]/.test(character) ? 115 : 42;
      window.setTimeout(typeNextCharacter, delay);
    }

    typeNextCharacter();
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        typeTarget(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.55, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (target) {
    observer.observe(target);
  });

  function startLoadTypewriters() {
    window.setTimeout(function () {
      loadTargets.forEach(typeTarget);
    }, 900);
  }

  if (document.readyState === 'complete') {
    startLoadTypewriters();
  } else {
    window.addEventListener('load', startLoadTypewriters, { once: true });
  }
}());

$(function(){
    "use strict";

    /*=========================================================================
            Mobile Menu Toggle
    =========================================================================*/
    $('.menu-icon button').on( 'click', function() {
        $('header.desktop-header-1, main.content, header.mobile-header-1').toggleClass('open');
		var isOpen = $('header.desktop-header-1').hasClass('open');
		$(this).attr('aria-expanded', isOpen).attr('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    $('main.content').on( 'click', function() {
        $('header.desktop-header-1, main.content, header.mobile-header-1').removeClass('open');
		$('.mobile-header-1 .menu-icon button').attr('aria-expanded', 'false').attr('aria-label', 'Open navigation menu');
    });

    $('.vertical-menu li a').on( 'click', function() {
        $('header.desktop-header-1, main.content, header.mobile-header-1').removeClass('open');
		$('.mobile-header-1 .menu-icon button').attr('aria-expanded', 'false').attr('aria-label', 'Open navigation menu');
    });

    $('.menu-icon button').on( 'click', function() {
        $('header.desktop-header-2, main.content-2, header.mobile-header-2').toggleClass('open');
    });

    $('main.content-2').on( 'click', function() {
        $('header.desktop-header-2, main.content-2, header.mobile-header-2').removeClass('open');
    });

    $('.vertical-menu li a').on( 'click', function() {
        $('header.desktop-header-2, main.content-2, header.mobile-header-2').removeClass('open');
    });

    /*=========================================================================
     One Page Scroll with jQuery
     =========================================================================*/
    $('a[href^="#"]:not([href="#"]').on('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top
      }, 800, 'easeInOutQuad');
      event.preventDefault();
    });

    /*=========================================================================
     Parallax layers
     =========================================================================*/
     if ($('.parallax').length > 0) { 
      var scene = $('.parallax').get(0);
      var parallax = new Parallax(scene, { 
        relativeInput: true,
      });
    }

     /*=========================================================================
     Text Rotating
     =========================================================================*/
    $(".text-rotating").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: "bounceIn",
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: ",",
        // The delay between the changing of each phrase in milliseconds.
        speed: 4000,
        complete: function () {
            // Called after the entrance animation is executed.
        }
    });

    /*=========================================================================
     Add (nav-link) class to main menu.
     =========================================================================*/
    $('.vertical-menu li a').addClass('nav-link');

    /*=========================================================================
     Bootstrap Scrollspy
     =========================================================================*/
    $("body").scrollspy({ target: ".scrollspy"});

    /*=========================================================================
     Counterup JS for facts
     =========================================================================*/
    $('.count').counterUp({
      delay: 10,
      time: 2000
    });

    /*=========================================================================
     Progress bar animation with Waypoint JS
     =========================================================================*/
    if ($('.skill-item').length > 0) { 
      var waypoint = new Waypoint({
        element: document.getElementsByClassName('skill-item'),
        handler: function(direction) {
          
          $('.progress-bar').each(function() {
            var bar_value = $(this).attr('aria-valuenow') + '%';                
            $(this).animate({ width: bar_value }, { easing: 'linear' });
          });

          this.destroy()
        },
        offset: '50%'
      });
    }

    /*=========================================================================
     Spacer with Data Attribute
     =========================================================================*/
    var list = document.getElementsByClassName('spacer');

    for (var i = 0; i < list.length; i++) {
      var size = list[i].getAttribute('data-height');
      list[i].style.height = "" + size + "px";
    }

    /*=========================================================================
     Background Color with Data Attribute
     =========================================================================*/
     var list = document.getElementsByClassName('data-background');

     for (var i = 0; i < list.length; i++) {
       var color = list[i].getAttribute('data-color');
       list[i].style.backgroundColor = "" + color + "";
     }

    /*=========================================================================
            Main Menu
    =========================================================================*/
    $( ".submenu" ).before( '<i class="ion-md-add switch"></i>' );

    $(".vertical-menu li i.switch").on( 'click', function() {
        var $submenu = $(this).next(".submenu");
        $submenu.slideToggle(300);
        $submenu.parent().toggleClass("openmenu");
    });

    /*=========================================================================
            Scroll to Top
    =========================================================================*/
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 350) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
    $('#return-to-top').on('click', function(event) {     // When arrow is clicked
      event.preventDefault();
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 400);
    });

	$('#copyright-year').text(new Date().getFullYear());

});
