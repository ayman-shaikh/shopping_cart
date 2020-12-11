function generateTableHead(data) {
	let thead = document.querySelector("thead");
	let row = thead.insertRow();
	for (let key of data) {
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		th.appendChild(text);
		row.appendChild(th);
	}
}

function update_totals(total_count, total_amount) {
	let tfoot = document.querySelector("tfoot");
	let tds = tfoot.getElementsByTagName('td');
	tds[0].innerHTML = total_count;
	tds[1].innerHTML = total_amount;
}

function generateTable(data) {
	let tbody = document.querySelector("tbody");
	let total_count = 0;
	let total_amount = 0;
	for (let element of data) {
		let row = tbody.insertRow();
		for (key in element) {
		let cell = row.insertCell();
		let value = element[key];
		let text = document.createTextNode(value);
		cell.appendChild(text);
		if(key == "count")
			total_count += value;
		if(key == "amount")
			total_amount += value;
		}
	}
	update_totals(total_count, total_amount);
}

function delete_table() {
	let count = table.rows.length;
	for(let i = 1; i < count-1; i++)
		table.deleteRow(1);
}

let table = document.querySelector("table");
let data = ["id", "name", "count", "price", "amount"];
generateTableHead(data);

function get_data() {
	axios.get('https://r6liyuam8g.execute-api.ap-south-1.amazonaws.com/dev')
	.then(response => {
		console.log(response);
		generateTable(response.data); 
	});
}

function delete_data() {
	axios.get('https://jkxmlaceh9.execute-api.ap-south-1.amazonaws.com/dev1')
	.then(response => {
		console.log(response)
		delete_table();
		update_totals(0, 0);
	});
}

function send_email_and_sms() {
	let dets_form = document.querySelector("form");
	let inputs = dets_form.getElementsByTagName('input');
	let tfoot = document.querySelector("tfoot");
	let tds = tfoot.getElementsByTagName('td');
	params = {
		"name" : inputs[0].value,
		"email" : inputs[1].value,
		"phone_number" : "91" + parseInt(inputs[2].value),
		"total_amount" : parseInt(tds[1].innerHTML)
	}
	console.log(params);
	
	let one = "https://bppf7h57o6.execute-api.ap-south-1.amazonaws.com/dev2"
	let two = "https://3q6pz1mocl.execute-api.ap-south-1.amazonaws.com/dev3"

	const requestOne = axios.post(one, params);
	const requestTwo = axios.post(two, params);

	axios.all([requestOne, requestTwo])
	.then(axios.spread((...responses) => {
	  console.log(responses) 
	}));
}

function openTheForm() {
  document.getElementById("popupForm").style.display = "block";
}

function closeTheForm() {
  document.getElementById("popupForm").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if(event.target.className === "modal") {
	  closeTheForm();
	}
}

function ValidateEmail(email) {
	let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if(email.match(mailformat))
		return true;
	else {
		alert("Please enter a valid email address.");
		return false;
	}
}

function ValidatePhoneNumber(phone_number) {
	if(phone_number.length == 10)
		return true;
	else {
		alert("Please enter a valid phone number.");
		return false;
	}
}

function validate_form() {
	let dets_form = document.querySelector("form");
	let inputs = dets_form.getElementsByTagName('input');
	//console.log(inputs);
	if(inputs[0].value=='') {
		alert("Please enter your name.");
		return false;
	}
	if(ValidateEmail(inputs[1].value) && ValidatePhoneNumber(inputs[2].value))
		return true;
	return false;
}

document.getElementById("refresh").addEventListener("click", function () {
	delete_table();
	get_data();
});

document.getElementById("submit").addEventListener("click", function () {
	if(validate_form()) {
		send_email_and_sms();
		closeTheForm();
		delete_data();
		console.log("Paid");
		alert('Thank you for shopping with us!');
	}
});

window.onload = function(){ get_data();} 
