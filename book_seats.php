<?php
$servername = "localhost";
$username = "root";
$password = "1234"; // Your MySQL password
$dbname = "cinema_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$data = json_decode(file_get_contents('php://input'), true);
$selectedSeats = $data['selectedSeats'];
$movieId = $data['movieId'];

// Check if seats are already booked
$seatPlaceholders = implode(',', array_fill(0, count($selectedSeats), '?'));
$sql = "SELECT seat_index FROM booked_seats WHERE movie_id = ? AND seat_index IN ($seatPlaceholders)";
$stmt = $conn->prepare($sql);

// Bind parameters dynamically
$params = array_merge([$movieId], $selectedSeats);
$types = str_repeat('i', count($params));
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If any of the selected seats are already booked, return an error
    echo "Some seats are already booked.";
} else {
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO booked_seats (seat_index, movie_id) VALUES (?, ?)");

    // Book each selected seat
    foreach ($selectedSeats as $seatIndex) {
        $stmt->bind_param("ii", $seatIndex, $movieId);
        $stmt->execute();
    }

    echo "Seats booked successfully!";
}

$stmt->close();
$conn->close();
?>
