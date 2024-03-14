
// Names to be used for the buttons
var names = [
    "Abiy Teklearegay",
    "Alemayehu Tamire",
    "Aychew Fekede",
    "Dr.Dejene Haylu",
    "Gezahegn Gutema",
    "Mekonen Kebede",
    "Samuel Lema",
    "Samuel Tadesse",
    "Seife Gezahegn",
    "Thomas Getahun",
    "Weliyou Nasir",
    "interest" // Add Adonay here
  ];
  
  function generateButtons() {
    var buttonsContainer = document.getElementById("buttonsContainer");
    names.forEach(function(name) {
      var button = document.createElement("button");
      button.className = "addMoneyBtn";
      button.textContent = name;
      button.onclick = function() {
        openModal(name);
      };
      buttonsContainer.appendChild(button);
    });
  }
  
  // Get the modal
  var modal = document.getElementById("myModal");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // Open modal function
  function openModal(personName) {
    modal.style.display = "block";
    document.getElementById("personName").value = personName;
  }
  
  // Close modal function
  function closeModal() {
    modal.style.display = "none";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    closeModal();
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }
  
  // Handle form submission
  
  document.getElementById("moneyForm").onsubmit = function(event) {
    event.preventDefault(); // Prevent form submission
    var personName = document.getElementById("personName").value;
    var amount = parseInt(document.getElementById("amount").value);
    var transactionId = document.getElementById("transactionId").value;
    if (!isNaN(amount) && amount > 0 && transactionId.trim() !== "") {
      // Get existing transactions from local storage, or set to empty array if not exists
      var transactionsKey = "person_" + personName.replace(/\s/g, '') + "_transactions";
      var transactions = JSON.parse(localStorage.getItem(transactionsKey)) || [];
      // Add new transaction to the array
      var today = new Date();
      var transaction = {
        date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
        amount: amount,
        transactionId: transactionId
      };
      transactions.push(transaction);
      // Save updated transactions array to local storage
      localStorage.setItem(transactionsKey, JSON.stringify(transactions));
      closeModal();
      alert("Money added successfully!");
    } else {
      alert("Please enter a valid amount and transaction ID.");
    }
  }
  
  // Function to navigate to payments.html
  function goToPayments() {
    window.location.href = 'payments.html';
  }
  
  // Function to find non-payers
  function findNonPayers() {
    var nonPayers = [];
    names.forEach(function(name) {
      var transactionsKey = "person_" + name.replace(/\s/g, '') + "_transactions";
      var transactions = JSON.parse(localStorage.getItem(transactionsKey)) || [];
      var hasPaidThisMonth = transactions.some(function(transaction) {
        var transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === (new Date().getMonth());
      });
      if (!hasPaidThisMonth) {
        nonPayers.push(name);
      }
    });
    if (nonPayers.length > 0) {
      alert("The following individuals have not paid for this month: " + nonPayers.join(', '));
    } else {
      alert("Everyone has paid for this month!");
    }
  }

  // Generate buttons when the page loads
  generateButtons();
  
 // Function to calculate penalties and update payments
function calculatePenalties() {
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth(); // Month index starts from 0 (January is 0)
  var currentDay = currentDate.getDate(); // Day of the month

  // Check if today's date is on or after February 10th
  if ((currentDay >= 10) || currentMonth >= 2) { // February is month index 1
      names.forEach(function(name) {
          if (name !== "interest") { // Exclude Adonay from penalty calculations
              var transactionsKey = "person_" + name.replace(/\s/g, '') + "_transactions";
              var transactions = JSON.parse(localStorage.getItem(transactionsKey)) || [];

              // Check if the member has paid for the previous month
              var lastMonth = (currentMonth === 0) ? 11 : currentMonth - 1; // Calculate last month index
              var hasPaidLastMonth = transactions.some(function(transaction) {
                  var transactionDate = new Date(transaction.date);
                  return transactionDate.getMonth() === lastMonth && transactionDate.getFullYear() === currentDate.getFullYear();
              });

              // If the member hasn't paid for last month, apply penalty
              if (!hasPaidLastMonth) {
                  // Check if the member hasn't paid for more than penaltyDuration months
                  var penaltyMonths = 0;
                  for (var i = 1; i <= penaltyDuration; i++) {
                      var previousMonthIndex = (currentMonth - i >= 0) ? currentMonth - i : 12 + (currentMonth - i); // Calculate previous month index
                      var hasPaidPreviousMonth = transactions.some(function(transaction) {
                          var transactionDate = new Date(transaction.date);
                          return transactionDate.getMonth() === previousMonthIndex && transactionDate.getFullYear() === currentDate.getFullYear();
                      });
                      if (!hasPaidPreviousMonth) {
                          penaltyMonths++;
                      }
                  }

                  // Apply penalty if overdue for penaltyDuration months
                  if (penaltyMonths >= penaltyDuration) {
                      var penaltyAmountToApply = penaltyAmount * penaltyMonths;
                      // Apply penalty to the member (update their balance or add a penalty transaction)
                      // For example:
                      // Add penalty transaction:
                      var today = new Date();
                      var penaltyTransaction = {
                          date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                          amount: penaltyAmountToApply,
                          transactionId: "Penalty"
                      };
                      transactions.push(penaltyTransaction);
                      // Update localStorage with updated transactions
                      localStorage.setItem(transactionsKey, JSON.stringify(transactions));
                  }
              }
          }
      });
  }
}
calculatePenalties();
 // Select the input element by its ID
 var input = document.getElementById('amount');

 // Add an event listener to listen for input changes
 input.addEventListener('input', function(event) {
     // Get the current value of the input
     var value = event.target.value;

     // Remove any non-numeric characters except dot (.)
     value = value.replace(/[^0-9.]/g, '');

     // Update the input value
     event.target.value = value;
 });