/*
 fieldHint for jQuery Plugin v1.0.0
 http://fieldhint.eddyluten.com/

 Copyright (c) 2012 Eddy Luten, http://eddyluten.com/

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($) {
	"use strict";
	$.fn.fieldHint = function (options) {
		var $elements = false,

			// Checks if a certain option exists in the parameter obj,
			// if obj is not defined, falls back to the global options.
			hasOption = function (option, obj) {
				return (obj || options || {}).hasOwnProperty(option);
			},

			// Checks if an object's value equals its hint.
			valIsHint = function (o) {
				return $(o).val() === $(o).data('fieldHint').hint;
			},

			// Checks if an object's value equals an empty string.
			valIsEmpty = function (o) {
				return $(o).val() === '';
			};

		// Handler for elements' onfocus events.
		$.fn.fieldHint.focus = $.fn.fieldHint.focus || function () {
			var $this = $(this),
				origOptions = $this.data('fieldHint').options;

			if (valIsHint($this)) {
				$this.val('');
			}

			if (hasOption('hintClass', origOptions)) {
				$this.removeClass(origOptions.hintClass.toString());
			}
		};

		// Handler for elements' onblur events.
		$.fn.fieldHint.blur = $.fn.fieldHint.blur || function () {
			var $this = $(this),
				origOptions = $this.data('fieldHint').options;

			if (valIsEmpty($this)) {
				$this.val($this.data('fieldHint').hint);

				if (hasOption('hintClass', origOptions)) {
					$this.addClass(origOptions.hintClass.toString());
				}
			}
		};

		// Handler for elements' closest forms' onsubmit events.
		$.fn.fieldHint.submit = $.fn.fieldHint.submit || function () {
			// Find elements inside of the form that have field hints
			$('[fieldHint]', this).each(function () {
				var $this = $(this);

				if (valIsHint($this)) {
					$this.val('');
				}
			});
		};

		// Get the elements that can have field hints and store them
		$elements = (function (obj) {
			var out = [];
			$(obj).each(function () {
				if ($(this).is('input[type=text],textarea')) {
					out.push(this);
				}
			});
			return $(out);
		}(this));

		// If the string 'destroy' was passed as an option, remove any of fieldHint's
		// effects from the selected elements.
		if (!!options && 'destroy' === options) {
			$elements
				.unbind('focus', $.fn.fieldHint.focus)
				.unbind('blur', $.fn.fieldHint.blur)
				.each(function () {
					var $this = $(this),
						origOptions = $this.data('fieldHint').options;

					if (hasOption('hintClass', origOptions)) {
						$this.removeClass(origOptions.hintClass.toString());
					}

					if (hasOption('removeTitle', origOptions)) {
						$this.attr('title', $this.data('fieldHint').title);
					}

					if (valIsHint($this)) {
						$this.val('');
					}

					$this.removeData('fieldHint');
				})
				.removeAttr('fieldHint')
				.closest('form').unbind('submit', $.fn.fieldHint.submit);

			return this;
		}

		// Bind the event handlers to the elements and initialize them
		$elements
			.bind('focus', $.fn.fieldHint.focus)
			.bind('blur', $.fn.fieldHint.blur)
			.each(function () {
				var $this = $(this),
					data =  {
						options: options,
						title: $this.attr('title').toString(),
						hint: hasOption('hint') ? options.hint.toString() : $this.attr('title')
					};

				$this.data('fieldHint', data);

				if (hasOption('removeTitle')) {
					$this.removeAttr('title');
				}

				if (valIsEmpty($this)) {
					$this.val(data.hint);

					if (hasOption('hintClass')) {
						$this.addClass(options.hintClass.toString());
					}
				}
			})
			.attr('fieldHint', '');

		if (hasOption('clearOnSubmit') && !!options.clearOnSubmit) {
			$elements.closest('form').bind('submit', $.fn.fieldHint.submit);
		}

		return this;
	};
}(jQuery));

