;$(function() {
	var init = function() {
		initBuyBtn();
		$('#addToCart').click(addProtuctToCart);
		$('#addProductPopup .count').change(calculateCost);
		$('#loadMore').click(loadMoreProducts);
		$('#goSearch').click(goSearch);
		$('.remove-product').click(removeProductFromCart);
		initSearchForm();
	};

	var showAddProductPopup = function() {
		var idProduct = $(this).attr('data-id-product');
		var product = $('#product' + idProduct);
		$('#addProductPopup').attr('data-id-product', product);
		$('#addProductPopup .product-image').attr('src', product.find('.thumbnail img').attr('src'));
		$('#addProductPopup .name').text(product.find('.name').text());
		var price = product.find('.price').text()
		$('#addProductPopup .price').text(price);
		$('#addProductPopup .category').text(product.find('.category').text());
		$('#addProductPopup .producer').text(product.find('.producer').text());
		$('#addProductPopup .count').val(1);
		$('#addProductPopup .cost').text(price);
		$('#addToCart').removeClass('hidden');
		$('#addToCartIndicator').addClass('hidden');
		$('#addProductPopup').modal({
			show: true
		});
	};

	var initBuyBtn = function() {
		$('.buy-btn').click(showAddProductPopup);
	};

	var addProtuctToCart = function() {
		var idProduct = $('#addProductPopup').attr('data-id-product');
		var count = $('#addProductPopup .count').val();
		$('#addToCart').addClass('hidden');
		$('#addToCartIndicator').removeClass('hidden');
		setTimeout(function() {
			var data = {
				totalCount: count,
				totalCost: 2000
			};
			$('#currentShoppingCart .total-count').text(data.totalCount);
			$('#currentShoppingCart .total-cost').text(data.totalCost);
			$('#currentShoppingCart').removeClass('hidden');
			$('#addProductPopup').modal('hide');
		}, 800);
	};

	var calculateCost = function() {
		var priceStr = $('#addProductPopup .price').text();
		var price = parseFloat(priceStr.replace('$', ''));
		var count = parseInt($('#addProductPopup .count').val());
		var min = parseInt($('#addProductPopup .count').attr('min'));
		var max = parseInt($('#addProductPopup .count').attr('max'));
		if (count >= min && count <= max) {
			var cost = price * count;
			$('#addProductPopup .cost').text('$ ' + cost);
		} else {
			$('#addProductPopup .count').val(1);
			$('#addProductPopup .cost').text(priceStr);
		}
	};

	var loadMoreProducts = function() {
		$('#loadMore').addClass('hidden');
		$('#loadMoreIndicator').removeClass('hidden');
		setTimeout(function() {
			$('#loadMoreIndicator').addClass('hidden');
			$('#loadMore').removeClass('hidden');
		}, 800);
	};

	var initSearchForm = function() {
		$('#allCategories').click(function() {
			$('.categories .search-option').prop('checked', $(this).is(':checked'));
		});
		$('.categories .search-option').click(function() {
			$('#allCategories').prop('checked', false);
		});
		$('#allProducers').click(function() {
			$('.producers .search-option').prop('checked', $(this).is(':checked'));
		});
		$('.producers .search-option').click(function() {
			$('#allProducers').prop('checked', false);
		});
	};

	var goSearch = function() {
		var isAllSelected = function(selector) {
			var uncheked = 0;
			$(selector).each(function(index, value) {
				if (!$(value).is(':checked')) {
					uncheked++;
				}
			});
			return uncheked === 0;
		};

		if (isAllSelected('.categories .search-option')) {
			$('.categories .search-option').prop('checked', false);
		}
		if (isAllSelected('.producers .search-option')) {
			$('.producers .search-option').prop('checked', false);
		}
		$('form.search').submit();
	};

	var confirm = function(msg, okFunction) {
		if (window.confirm(msg)) {
			okFunction();
		}
	};

	var removeProductFromCart = function() {
		var btn = $(this);
		confirm('Are you shure?', function() {
			executeRemoveProduct(btn);
		});
	};

	var refrechTotalCost = function() {
		var total = 0;
		$('#shoppingCart .item').each(function(index, value) {
			var count = parseInt($(value).find('.count').text());
			var price = parseFloat($(value).find('.price').text().replace('$', ''));
			total = count * price;
		});
		$('#shoppingCart .total').text('$' + total);
	};

	var executeRemoveProduct = function(btn) {
		var idProduct = btn.attr('data-id-product');
		var count = btn.attr('data-count');
		btn.removeClass('btn-danger');
		btn.removeClass('btn');
		btn.addClass('load-indicator');
		var text = btn.text();
		btn.text('')
		btn.off('click');

		setTimeout(function() {
			var data = {
				totalCount: 1,
				totalCost: 1
			};

			if (data.totalCount === 0) {
				window.location.href = 'products.html';
			} else {
				var prevCount = parseInt($('#product' + idProduct + " .count").text());
				var remCount = parseInt(count);

				if (remCount === prevCount) {
					$('#product' + idProduct).remove();
					//
					if ($('#shoppingCart .item').length === 0) {
						window.location.href = 'products.html';
					}
					//
				} else {
					btn.removeClass('load-indicator');
					btn.addClass('btn');
					btn.addClass('btn-danger');
					btn.text(text);
					btn.click(removeProductFromCart);
					$('#product' + idProduct + ' .count').text(prevCount - remCount);
					if (prevCount - remCount == 1) {
						$('#product' + idProduct + ' a.remove-product.all').remove();
					}
				}
				refrechTotalCost();
			}
		}, 800);
	};

	init();
});