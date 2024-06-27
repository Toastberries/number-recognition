<?php
require "db.php";

if (isset($_POST["submit"])) {
	$user = $_POST["user"];
	$guess = isset($_COOKIE["lastPrediction"]) ? $_COOKIE["lastPrediction"] : -1;
	$number = $_POST["number"];

	$query = "INSERT INTO `stats` VALUES (NULL, NULL, IFNULL((SELECT id FROM `users` WHERE `username` = '$user'), 0), '$guess', '$number');";
	mysqli_query($conn, $query);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Digit Recognition</title>
	<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"></script>
	<script src="js/chart.min.js"></script>
	<script src="js/cookie.js"></script>
	<link rel="stylesheet" type="text/css" href="/style.css">
</head>

<body>
	<div class="row">
		<div class="center">
			<h1>Please draw a number!</h1>
			<div id="canvas_box"></div>
			<button id="predict-button">Predict</button>
			<button id="clear-button">Clear</button>
		</div>
		<div id="secondPhase" class="center">
			<h1>
				I think it's... <span class="prediction-text"></span>!
			</h1>

			<form method="post">
				<label>Your name: </label>
				<br>
				<input name="user" required value="">
				<br><br>
				<label for="">What did you draw (1-9)?</label>
				<br>
				<input name="number" pattern="[1-9]">
				<br><br>
				<button type="submit" name="submit">Submit</button>
			</form>
		</div>
	</div>

	<div class="row">
		<div id="result_box">
			<canvas id="chart_box"></canvas>
		</div>
	</div>

	<script src="js/digit-recognition.js"></script>
</body>

</html>