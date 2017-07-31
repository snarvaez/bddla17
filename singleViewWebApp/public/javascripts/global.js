// customerlist data array for filling in info box
var customerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the customer table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    // TO-DO resolve /prod
    $.getJSON( '/prod/customers/customerList', function( data ) {

      // Stick our customer data array into a customerlist variable in the global object
      customerListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.policies.length + '</td>';
            tableContent += '<td><a href="/prod/customers/customerDetails?id=' + this._id.toString() + '" class="linkdetailscustomer" rel="' + this._id + '">details</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#customerList table tbody').html(tableContent);
    });
};
