// const { default: axios } = require("axios")
// console.log(axios)
const openbtns = document.querySelectorAll('.openbtn')
	const divi = document.querySelector('.ocard')
	const divi2 = document.querySelector('.container2')
	const bookingCard = document.querySelector('.ocard2')
	bookingCard.style.display='none'
	const closebtn = document.querySelector('.closebtn')
	for (i = 0; i < openbtns.length; i++) {
		openbtns[i].addEventListener('click', function (event) {
	const clickedButton = event.target; // Get the clicked button element
    const parentDiv = clickedButton.closest('.icard');
	const pt = parentDiv.querySelectorAll('span')
	pt.forEach(element => {
	console.log(element.textContent)
	
	 });
	 divi.style.opacity = 0.2;
	 divi2.style.opacity = 0.2;
	 bookingCard.style.display = 'block';
	//Passing train data and ticket fares to the over div
	bookingCard.querySelector('#trno').innerHTML=pt[0].textContent
	bookingCard.querySelector('#trname').innerHTML=pt[1].textContent
	bookingCard.querySelector('#src').innerHTML=pt[4].textContent
	bookingCard.querySelector('#dst').innerHTML=pt[5].textContent
	bookingCard.querySelector('#arr').innerHTML=pt[7].textContent
	bookingCard.querySelector('#dept').innerHTML=pt[8].textContent
	
	// Create a document definition
	const print = document.querySelector(".pdf");
	print.addEventListener('click',()=>{
	var docDefinition = {
        content: [
          'Booking Details'
		  
        ]
      };

      // Generate the PDF document
      pdfMake.createPdf(docDefinition).open();})

	 /*Without Using Ticket Fares API*/

	// bookingCard.querySelector('#a1').innerHTML=fare.data.general[0].fare
	fare = {
  status: true,
  message: 'Success',
  timestamp: 1686982817620,
  data: {
    general: [
      { classType: '1A', fare: 1170, breakup: [Array] },
      { classType: '3A', fare: 500, breakup: [Array] },
      { classType: '2A', fare: 705, breakup: [Array] },
      { classType: 'SL', fare: 145, breakup: [Array] }
    ],
    tatkal: [
      { classType: '1A', fare: '', breakup: [] },
      { classType: '3A', fare: 1105, breakup: [Array] },
      { classType: '2A', fare: 1540, breakup: [Array] },
      { classType: 'SL', fare: 395, breakup: [Array] }
    ]
  }
	}
    // Iterate over the general fares and display them
    const generalFares = fare.data.general;
    const generalFaresElement = bookingCard.querySelector('#fares');
    generalFaresElement.innerHTML = ''; // Clear previous entries
	 table = `<table style="border: 2px solid black;
			border-collapse: collapse;padding:3px">`
    for (let j = 0; j < generalFares.length; j++) {
      table += `<th style="border: 2px solid black;
			border-collapse: collapse;padding:3px">Class: ${generalFares[j].classType}</th>`;
    }
	table+=`<tr>`
		for (let j = 0; j < generalFares.length; j++) {
		  table += `<td style="border: 2px solid black;
			border-collapse: collapse;padding:3px">Fare: ₹${generalFares[j].fare}/-</td>`;
		}

	table+=`</tr>`
	table+=`<tr><td style="border: 2px solid black;border-collapse: collapse;padding:3px;text-align:center">GNWL4</td>
	<td style="border: 2px solid black;border-collapse: collapse;padding:3px;text-align:center">GNWL9</td>
	<td style="border: 2px solid black;border-collapse: collapse;padding:3px;text-align:center">GNWL1</td>
	<td style="border: 2px solid black;border-collapse: collapse;padding:3px;text-align:center">Available-0006</td></tr>`
	table+=`</table>`
	generalFaresElement.innerHTML = table;
	// 	})	
	// }
	
		
		/*Using Ticket Fares API
	// const axios = require('axios');
		const options = {
		method: 'GET',
		url: 'https://irctc1.p.rapidapi.com/api/v2/getFare',
		params: {
			// trainNo: pt[0],
			// fromStationCode: pt[4],
			// toStationCode: pt[5]
			trainNo: '17063',
			fromStationCode: 'NZB',
			toStationCode: 'SC'
		},
		headers: {
			// 'X-RapidAPI-Key': 'bea9d496e2msh8e936fd3b850333p186413jsn2c7e6fe355b9',
			'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
			'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
		}
		};

		axios.request(options).then(function (response) {
			console.log(response.data);
		//   console.log(response.data.data)
		//   console.log(response.data.data.general)
		//   console.log(response.data.data.general[0])
		const fare = response.data

		
		const generalFares = fare.data.general;
    const generalFaresElement = bookingCard.querySelector('#fares');
    generalFaresElement.innerHTML = ''; // Clear previous entries
	 table = `<table style="border: 2px solid black;
			border-collapse: collapse;padding:3px">`
    for (let j = 0; j < generalFares.length; j++) {
      table += `<th style="border: 2px solid black;
			border-collapse: collapse;padding:3px">Class: ${generalFares[j].classType}</th>`;
    }
	table+=`<tr>`
		for (let j = 0; j < generalFares.length; j++) {
		  table += `<td style="border: 2px solid black;
			border-collapse: collapse;padding:3px">Fare: ₹${generalFares[j].fare}/-</td>`;
		}

	table+=`</tr>`
	table+=`</table>`
	generalFaresElement.innerHTML = table;
	}).catch(function (error) {
			console.error(error);
		});*/
		})	
	}


	//Close the booking div
	closebtn.addEventListener('click',()=>{
		
			divi.style.opacity = 1;
			divi2.style.opacity = 1;
			bookingCard.style.display = 'none';
		
	})