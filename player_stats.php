<?php
// Configuration
$servername = "localhost";
$username = "root";
$password = "ByHisGrace$30";
$dbname = "cricket";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to retrieve player data
$sql = "SELECT * FROM players ORDER BY RUNS DESC, WICKETS DESC";
$result = $conn->query($sql);

// Display player data
?>
<html>
  <head>
    <title>Player Statistics</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: transparent;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f0f0f0;
      }
    </style>
  </head>
  <body>
    <?php if ($result->num_rows > 0) { ?>
      <table>
        <tr><th>ID</th><th>Name</th><th>Runs</th><th>Wickets</th></tr>
        <?php while($row = $result->fetch_assoc()) { ?>
          <tr>
            <td><?php echo $row["ID"]; ?></td>
            <td><?php echo $row["FIRSTNAME"]; ?></td>
            <td><?php echo $row["RUNS"]; ?></td>
            <td><?php echo $row["WICKETS"]; ?></td>
          </tr>
        <?php } ?>
      </table>
    <?php } else { ?>
      No results found
    <?php } ?>
  </body>
</html>
<?php
// Close connection
$conn->close();
?>