// const { default: axios } = require("axios")
// console.log(axios)
const openbtns = document.querySelectorAll('.openbtn')
	const divi = document.querySelector('.ocard')
	const divi2 = document.querySelector('.container2')
	const bookingCard = document.querySelector('.ocard1')
	const pdetails = document.querySelector('#passengerDetails')
	bookingCard.style.display='none'
	pdetails.style.display='none'
	const closebtn1 = document.querySelector('.closebtn1')
	const closebtn2 = document.querySelector('.closebtn2')
	for (i = 0; i < openbtns.length; i++) {
		openbtns[i].addEventListener('click', function (event) {
	var clickedButton = event.target; // Get the clicked button element
    var parentDiv = clickedButton.closest('.icard');
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
	bookingCard.querySelector('#arr').innerHTML=pt[8].textContent
	bookingCard.querySelector('#dept').innerHTML=pt[7].textContent

	 //Add passenger button
	 document.getElementById('addPassengerBtn').addEventListener('click', function() {
		var container = document.getElementById('passengerContainer');
		var newPassengerDiv = document.createElement('div');
		newPassengerDiv.classList.add('passenger');
		newPassengerDiv.innerHTML = `
		  <input type="text" name="name[]" placeholder="Passenger Name">
		  <input type="text" name="age[]" placeholder="Passenger Age">
		  <input type="text" name="gender[]" placeholder="Passenger Gender">
		  <div class="del"><i class="fa-solid fa-trash"></i></div>
		`;
		container.appendChild(newPassengerDiv);

		var delPassengerBtn = newPassengerDiv.querySelector(".del");
  delPassengerBtn.addEventListener("click", function () {
    container.removeChild(newPassengerDiv);})
	  });
	  
	  document.getElementById('passengerForm').addEventListener('submit', function(event) {
		event.preventDefault();
	  });


	const passengerDetails = document.querySelector('.passengerDetails')
	passengerDetails.addEventListener('click',()=>{
		pdetails.style.display='block'

	})
	
	// Creating document definition
	const print = document.querySelector(".pdf");
	print.addEventListener('click',()=>{
		const details = pdetails.querySelectorAll('input')
		console.log(details)
	var docDefinition = {
  pageOrientation:'auto',
  pageMargins: [40, 40, 40, 60],
  content: [
    {
      text: 'IRCTC',
      style: 'irc'
    },
    {
      text: 'Booking Details',
      style: 'header1'
    },
    {
		style:'data',
		text: 'Train Number: ' + pt[0].textContent.replace('\n','').trim()+'\tTrain Name: ' + pt[1].textContent.replace('\n','').trim()+'\tBoarding At: ' + pt[4].textContent.replace('\n','').trim()+'\tDate of Journey : ' + pt[2].textContent.replace('\n','').trim()
    },
    {
		style:'data',
		text: 'Destination: ' + pt[5].textContent.replace('\n','').trim()+'\tDeparture: ' + pt[7].textContent.replace('\n','').trim()+'\tArrival: ' + pt[8].textContent.replace('\n','').trim()+'\tClass: A1' 
    },
	{
		text: 'Passenger Details',
		style: 'header2'
    },
	{
	table: {
		style:table,
        headerRows: 1,
        widths: [ '*', 'auto', 100, '*' ],

        body: [
          [ {text:'Name',style:'header'},{text:'Age',style:'header'},{text:'Gender',style:'header'},{text:'Berth No.',style:'header'}],
        ]
      }
	},
  ],
  styles: {
    header: {
      fontSize: 14,
      bold: true,
	  fillColor:'blueviolet',
	  alignment:'center',
	  color:'white'
    },
    header1: {
      fontSize: 18,
      bold: true,
      marginBottom: 10,
	  decoration:'underline'
    },
	irc:{
		fontSize:20,
		bold:true,
		marginLeft:220,
		marginBottom:10,
		fillColor:'blueviolet',
	},
	passenger:{
		marginLeft:240,
		marginBottom:5,
		fontSize:10
	},
	header2:{
		fontSize: 18,
      bold: true,
      marginBottom: 10,
	  decoration:'underline',
	},
	data:{
		fontSize:10,
		marginBottom:5
	},
	table:{
		alignment:'center'
	},
	cell:{
		fillColor:'cyan',
		alignment:'center'
	}
  }
};
//Entering passenger details into table

var tableBody = docDefinition.content.find(item => item.table && item.table.body);
  if (tableBody) {
    for (var i = 0; i < details.length; i += 3) {
      tableBody.table.body.push([{text:details[i].value,style:'cell'},{text:details[i+1].value,style:'cell'},{text:details[i+2].value,style:'cell'},{text:`A1 ${i+50}`,style:'cell'}]);
    }
  }

      // Generate the PDF document
      pdfMake.createPdf(docDefinition).open();
    //   pdfMake.createPdf(docDefinition).download('Ticket');
	})

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
			border-collapse: collapse;padding:3px;background-color:gray">Class: ${generalFares[j].classType}</th>`;
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
	closebtn1.addEventListener('click',()=>{
		
			divi.style.opacity = 1;
			divi2.style.opacity = 1;
			bookingCard.style.display = 'none';
			pdetails.style.display = 'none';
		
	})
	closebtn2.addEventListener('click',()=>{
		
			divi.style.opacity = 0.2;
			divi2.style.opacity = 0.2;
			// bookingCard.style.display = 'none';
			pdetails.style.display = 'none';
		
	})