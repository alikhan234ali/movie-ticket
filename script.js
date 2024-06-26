const container = document.querySelector(".container");
const count = document.getElementById("count");
const amount = document.getElementById("amount");
const select = document.getElementById("movie");
const seats = document.querySelectorAll(".seat:not(.reserved)");

getFromLocalStorage();
calculateTotal();

container.addEventListener("click", function(e){
    if(e.target.classList.contains('seat') && !e.target.classList.contains('reserved') ) {
        e.target.classList.toggle("selected");
        calculateTotal();        
    }
});

select.addEventListener("change", function (e) { 
    calculateTotal();
 });

 function calculateTotal() {
     const selectedSeats = container.querySelectorAll('.seat.selected');
    
     const selectedSeatsArr = [];
     const seatsArr=[];

     selectedSeats.forEach(function(seat) {
        selectedSeatsArr.push(seat);
     });

     seats.forEach(function(seat) {
        seatsArr.push(seat);
     });

     let selectedSeatIndexs = selectedSeatsArr.map(function(seat) {
        return seatsArr.indexOf(seat);
     });

    let selectedSeatCount = selectedSeats.length;
    count.innerText = selectedSeatCount;
    amount.innerText = selectedSeatCount*select.value;

    saveToLocalStorage(selectedSeatIndexs); 
 }

 function getFromLocalStorage() { 
    const selectedSeats =JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats != null && selectedSeats.length > 0) {
        seats.forEach(function(seat, index) {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add("selected");
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex != null) {
        select.selectedIndex = selectedMovieIndex;
    }
  }

 function saveToLocalStorage(indexs) {
     localStorage.setItem('selectedSeats', JSON.stringify(indexs));
     localStorage.setItem('selectedMovieIndex', select.selectedIndex);
 }


//  button code

// const bookButton = document.getElementById("bookButton");

// bookButton.addEventListener("click", function() {
//     const selectedSeats = container.querySelectorAll('.seat.selected');
//     if(selectedSeats.length > 0) {
//         // Perform booking logic here, such as sending a request to a server
//         alert("Seats booked successfully!");
//     } else {
//         alert("Please select at least one seat to book.");
//     }
// });
const bookButton = document.getElementById("bookButton");

bookButton.addEventListener("click", function() {
    const selectedSeats = Array.from(container.querySelectorAll('.seat.selected'));
    const movieId = select.value;
    const seatIndices = selectedSeats.map(seat => Array.from(seats).indexOf(seat));

    if(seatIndices.length > 0) {
        // Send booking request to the server
        fetch('book_seats.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedSeats: seatIndices, movieId: movieId })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            // Optionally, refresh the page or update the UI to show booked seats
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please select at least one seat to book.");
    }
});




// prevent booking 


