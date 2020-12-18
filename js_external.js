// declare global variables that need to pass between different functions
var totalprice = 0;
var discountApplied = 0; // flag to show if discount has been applied

// Validation of login details. Any name and password with required length accepted.
function loginValidate()
{
  var username = document.forms["loginForm"]["username"].value;
  var plength = document.forms["loginForm"]["pw"].value.length; // Gets length of input password

  if (username==null || username=="" )
  {
     alert("Username required.")
     return false;
  }

  else if (plength < 7 || plength==null)
  {
    alert("Password must be at least 7 characters. Please double-check password.");

  }
// Shows and hides required divs if password entered correctly.
  else {
    logindiv.className = "hide";
    orderdiv.className = "show";
    summarydiv.className = "show";
    checkoutdiv.className = "hide";
    welcome.className = "hide";
    title.style.fontSize = "5.5em";
  }
}

// Check if supersize is selected.
function superSelect()
{
  var size = document.forms["orderForm"]["size"].value;

  if (size=="Supersize")
  {
    sizeAlert(); // Calls this function if super size is selected.
  }
}

// Supersize warning function. Fixed position div slides in and rest of page has white overlay.
function sizeAlert(msg, myYes) {
       var warningBox = $("#warningOverlay");
       warningBox.find(".message").text(msg);
       warningBox.find(".yes").unbind().click(function() {
          warningBox.fadeOut();
       }); // Nested function to fade out warning when OK is clicked
       warningBox.find(".yes").click(myYes);
       warningBox.slideDown(); // warning slides in
       warningBox.effect( "shake" ); // warning shakes
    }

// Check if at least 1 pizza has been selected.
function addToOrder()
{
  var pizza = document.forms["orderForm"]["size"];
  var pizzatype = pizza.options[pizza.selectedIndex].value;
  var pquantity = document.forms["orderForm"]["pquantity"].value;
  var price;
  if (pquantity >= 1)
  // Calculate price based on quantity.
  {
    switch (pizzatype) {
      case "Large":
        price = 5 * pquantity;
        break;
      case "Extra-Large":
        price = 7 * pquantity;
        break;
      case "Supersize":
        price = 17 * pquantity;
      }
    // Insert pizza name, quantity and calculated price into cells.
    var table = document.getElementById("orderTable");
    var row = table.insertRow(table.rows.length-1); // Add to second last row, just before Total row.
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = pizzatype;
    cell2.innerHTML = pquantity;
    cell3.innerHTML = "\u20AC" + price; // Euro symbol added to price.
    cell4.insertAdjacentHTML("afterbegin", "<button type='button' onclick='removeRow()' > Remove</button>"); //single quotes needed as html is inside double quotes
    updateTotal(); // 'Remove' button inserted in 4th column.
    cell1.className = "leftcol"; // New columns are aligned as per design.
    cell2.className = "centercol";
    cell3.className = "rightcol";
  }
  // Error message if button pressed before pizza quantity selected.
  else
  {
    alert("Please add at least 1 pizza.")
  }
}

// Calcualte total of all pizzas added so far. Recalculated each time to allow for removal of pizzas.
function updateTotal()
{
  var table = document.getElementById("orderTable");
  var totalrow = document.getElementById("total");
  var totalcell = totalrow.deleteCell(2);
  var totalcell = totalrow.insertCell(2);
  totalprice = 0; // reset total each time function is called.
  if (table.rows.length > 2)
  {
    for (var i = 1; i < table.rows.length; i++)  // traverse cells adding totals for each row that has been added.
    {
      var itemcost = 0; // set item cost back to zero.
      var costnosymbol = 0;
      itemcost = table.rows[i].cells[2].innerHTML; //gets individual item cost from table
      costnosymbol = parseInt(+itemcost.substring(1)); //removes euro symbol by starting at 2nd character of string. +itemcost converts string to number.
      totalprice = totalprice + costnosymbol; // Add cost without euro symbol to running total.
    }
  }
  if (discountApplied == 1)
  {
    applyDiscount(); // this function checks if discount should be applied.
  }
  totalcell.innerHTML = "\u20AC" + totalprice; // Add euro symbol back to total.
}

// Removes row if customer changes order.
function removeRow()
{
    var td = event.target.parentNode; // Cell where button was clicked.
    var tr = td.parentNode; // Row of cells parent.
    tr.parentNode.removeChild(tr);  // Remove child row of parent element of child row (required row)
    updateTotal(); // recalculated total
}

// Checks that at least 1 pizza has been added before proceeding to payment screen.
function checkout()
{
  if (totalprice==0)
  {
     alert("Please choose a pizza.")
  }

  else // display required divs for payment screen.
  {
    logindiv.className = "hide";
    orderdiv.className = "hide";
    summarydiv.className = "show";
    checkoutdiv.className = "show";
    checkoutButton.className = "hide";
    paymentdiv.className = "show";
    cashdiv.className = "show";
    cash.checked = true;
    var i;
    for (i = 1; i<orderTable.rows.length-1; i++) {
      orderTable.rows[i].cells[3].className = "hide";
    } // hide 'remove' option in final screen.
  }
}

// check if promo code matches 'extracheese'
function discountCheck()
{
  var dcode = document.forms["checkoutForm"]["discount"].value;
  if (dcode == 'extracheese')
  {
      discountApplied = 1; // turns on discount applied flag so 10% will be taken off whenever total is calculated
      updateTotal();
      checkoutdiv.className="hide"; // hide discount code input field
      discountdiv.className="show"; // message to confirm discount applied.
  }
  else
  {
    alert("Sorry. That is not a valid discount code.");
  }
}

// take 10% off total when discount code has been entered.
function applyDiscount()
{
  totalprice = totalprice - (totalprice * .1);
}

// show CC form and hide cash on delivery confirmation
function showCCPayment()
{
    ccformdiv.className="show";
    cashdiv.className="hide";
    window.location = "#ccformdiv"; // scroll down to cc form
}

// hide cc form and show cash on delivery confirmation.
function hideCCPayment()
{
    ccformdiv.className="hide";
    cashdiv.className="show";
}

// check CC details are required length. Any name, any number more than 12 digits. Any date. CVV max 3 digits.
function ccValidation()
{
  var ccName = document.forms["ccForm"]["ccName"].value;
  var ccNumber = document.forms["ccForm"]["ccNumber"].value;
  var expiryDate = document.forms["ccForm"]["expiryDate"].value;
  var cvv = document.forms["ccForm"]["cvv"].value;
  if (ccName==null || ccName=="" )
  {
     alert("Please enter cardholder's name.");
  }
  else if (ccNumber==null || ccNumber=="" )
  {
     alert("Please enter credit card number.");
  }
  else if (ccNumber.length<12)
  {
     alert("Please enter a valid credit card number.");
  }
  else if (expiryDate==null || expiryDate=="" )
  {
     alert("Please enter expiry date.");
  }
  else if (cvv==null || cvv=="" )
  {
     alert("Please enter CVV number.");
  }
  else if (cvv.length!=3)
  {
     alert("Please enter a valid CCV number. This is the last 3 digits on the back of your card.");
  }
  else // show required divs if card entered correctly
  {
    ccformdiv.className="hide";
    cardProcessing.className ="show"; // Show card processing message if details accepted
    confirmationdiv.className="show";
    discountdiv.className = "hide";
    confirmation();
    window.location = "#top"; // scroll back to top of page to give confirmation message

  }
}

// Show required divs if customer wants to return to order input page.
 function backToOrder()
 {
     logindiv.className = "hide";
     orderdiv.className = "show";
     summarydiv.className = "show";
     checkoutdiv.className = "hide";
     checkoutButton.className = "show";
     paymentdiv.className = "hide";
     ccformdiv.className="hide";
     cashdiv.className ="hide";
     for (i = 1; i<orderTable.rows.length-1; i++) {
       orderTable.rows[i].cells[3].className = "show";
     } // remove order button from all rows
 }

// Confirm order on its way.
 function confirmation()
 {
   confirmationdiv.className = "show";
   paymentdiv.className="hide";
   checkoutdiv.className = "hide";
   cashdiv.className ="hide";
   summarydiv.className="hide";
   discountdiv.className="hide";
   returnToLogin.className="show";

 }
