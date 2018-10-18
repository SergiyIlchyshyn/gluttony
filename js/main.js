window.onload = function () {
	let cart = {}; // корзина
	let goods = {}; // товари

	// завантаження кошика із localStorage
	function loadCartFromStorage() {
		if (localStorage.getItem('cart') != undefined) {
			cart = JSON.parse(localStorage.getItem('cart'));
		}
		console.log(cart);
	}
	loadCartFromStorage();
	// ==================================
	// послать запрос
	let getJSON = function (url, callback) {
		// 1. Создаём новый объект XMLHttpRequest
		let xhr = new XMLHttpRequest();
		// 2. Конфигурируем его: GET-запрос на URL
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function () {
			let status = xhr.status;
			// 4. Если код ответа сервера не 200, то это ошибка
			if (status == 200) {
				// вывести результат
				callback(null, xhr.response)
			}
			else {
				// обработать ошибку
				callback(status, xhr.response);
			}
		};
		// 3. Отсылаем запрос
		xhr.send();
	}
	getJSON('http://spreadsheets.google.com/feeds/list/1gbLFBNrY1uC27_3qdXmx4gelQXe3EzCDWf9j6fbEOLQ/od6/public/values?alt=json', function (err, data) {
		console.log(data);
		if (err !== null) {
			console.log('Error: ' + err);
		}
		else {
			data = data['feed']['entry'];
			console.log(data);
			goods = arrayHelper(data);
			console.log(goods);
			document.querySelector('.shop-field').innerHTML = showGoods(data);
			showCart(); // показуємо кошик
			
		}
	});
	// ==================================
	function showGoods(data) {  // відображає товари
		let out = '';
		for (let key in data) {
			if (data[key]['gsx$show']['$t'] != 0) {
				out += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 filter">`;
				out += `<div class="card mb-4 shadow-sm goods">`;
				out += `	<img class="card-img-top" src="${data[key]['gsx$image']['$t']}" alt="">`;
				out += `	<div class="card-body text-center">`;
				out += `		<h5 class="card-title">${data[key]['gsx$name']['$t']}</h5>`;
				out += `		<p class="coast">Ціна: ${data[key]['gsx$coast']['$t']}  &#8372;</p>`;
				out += `		<p class="coast">Кількість: ${data[key]['gsx$kg']['$t']}</p>`;
				out += `		<p class="coast"><button type="button" class="btn btn-success" name="add-to-cart" data="${data[key]['gsx$id']['$t']}">Купити</button></p>`;
				out += `	</div>`;
				out += `</div>`;
				out += `</div>`;
			}
		}
		return out;
	}
	// ==================================
	document.onclick = function (e) {
		if (e.target.attributes.name != undefined) {
			if (e.target.attributes.name.nodeValue == 'add-to-cart') {
				addToCart(e.target.attributes.data.nodeValue);
			}
			else if (e.target.attributes.name.nodeValue == 'delete-goods') {
				delete cart[e.target.attributes.data.nodeValue];
				showCart();
				localStorage.setItem('cart', JSON.stringify(cart));
				// console.log(cart);
			}
			else if (e.target.attributes.name.nodeValue == 'plus-goods') {
				cart[e.target.attributes.data.nodeValue]++;
				showCart();
				localStorage.setItem('cart', JSON.stringify(cart));
				// console.log(cart);
			}
			else if (e.target.attributes.name.nodeValue == 'minus-goods') {
				if (cart[e.target.attributes.data.nodeValue] - 1 == 0) {
					delete cart[e.target.attributes.data.nodeValue];
				}
				else {
					cart[e.target.attributes.data.nodeValue]--;
				}
				showCart();
				localStorage.setItem('cart', JSON.stringify(cart));
				console.log(cart);
			}
			else if (e.target.attributes.name.nodeValue == 'buy') {
				// let name = document.getElementById('customer-name').value;
				// let email = document.getElementById('customer-email').value;
				// let phone = document.getElementById('customer-phone').value;
				// console.log(name+email+phone);
				let data = {
					name: document.getElementById('customer-name').value,
					email: document.getElementById('customer-email').value,
					phone: document.getElementById('customer-phone').value,
					adress: document.getElementById('customer-adress').value,
					cart: emailArray()
				};
				emailArray();

				fetch("php_mail/mail.php",
				{
					method: "POST",
					body: JSON.stringify(data)
				})
				.then(function (res) {
					console.log(res);
					if (res) {
						alert('Ваше замовлення обробляється, чекайте дзвінка!');
					}
					else {
						alert('Помилка при замовлені!');
					}
				})
			}
		}
		return false;
	}
	// ==================================
	// додаємо active до кнопок категорій
	let btns = document.querySelectorAll("#btnContainer .categoty__btn");
	// Loop through the buttons and add the active class to the current/clicked button
	for (let i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			let current = document.getElementsByClassName("active");
			current[0].className = current[0].className.replace(" active", "");
			this.className += " active";
		});
	}
	

	// for (let i = 0; i < btns.length; i++) {
	// 	btns[i].addEventListener("click", function () {
	// 		let category = btns[i].getAttribute('data-filter');
	// 		console.log(category);
	// 		for (let key in data) {
	// 			if (data[key]['gsx$category']['$t'] == category) {
	// 				document.getElementsByClassName('filter').style.display = 'none';
	// 			}
	// 		}
	// 	});
	// }
	// ==================================
	function emailArray() {
		let emailArray = {};
		// console.log("cart = ", cart);
		for (let key in cart) {
			// key - id товару cart[key] - кі-сть
			let temp = {};
			temp.name = goods[key]['name'];
			temp.coast = goods[key]['coast'];
			temp.articul = goods[key]['articul'];
			temp.count = cart[key];
			emailArray[key] = temp;
		}
		console.log(emailArray);
		return emailArray;
	}
	// ==================================
	function addToCart(elem) {			// додаємо в кошик
		if (cart[elem] !== undefined) {
			cart[elem]++;
		} else {
			cart[elem] = 1;
		}
		console.log(cart);
		showCart();
		localStorage.setItem('cart', JSON.stringify(cart))
	}
	// ==================================
	function arrayHelper(arr) { // для кращого відображення товарів
		let out = {};
		for (let i = 0; i < arr.length; i++) {
			let temp = {};
			temp['articul'] = arr[i]['gsx$articul']['$t'];
			temp['name'] = arr[i]['gsx$name']['$t'];
			temp['category'] = arr[i]['gsx$category']['$t'];
			temp['coast'] = arr[i]['gsx$coast']['$t'];
			temp['image'] = arr[i]['gsx$image']['$t'];
			temp['description'] = arr[i]['gsx$description']['$t'];
			out[arr[i]['gsx$id']['$t']] = temp;
		}
		return out;
	}
	// ==================================
	function showCart() {			// відображаємо кошик 
		let ul = document.querySelector('.cart');
		ul.innerHTML = '';
		let sum = 0;
		for (let key in cart) {
			let li = '<li>';
			li += goods[key]['name'] + ' ';
			li += ` <button type="button" class="btn btn-outline-secondary" name="minus-goods" data="${key}">-</button>` + ' ';
			li += cart[key] + ' шт ';
			li += ` <button type="button" class="btn btn-outline-secondary" name="plus-goods" data="${key}">+</button>` + ' ';
			li += goods[key]['coast'] * cart[key] + ' &#8372;';
			li += ` <button type="button" class="btn btn-outline-secondary" name="delete-goods" data="${key}">X</button>`;
			li += '</li>';
			sum += goods[key]['coast'] * cart[key];
			ul.innerHTML += li;
		}
		ul.innerHTML += '<span class="cart-sum">Разом: ' + sum + ' &#8372;</span>';

	}
	// ==================================
}




