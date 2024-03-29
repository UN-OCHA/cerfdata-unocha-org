$(function() {
    LoadData();
});

function LoadData() {
    var year = $("select[id*='lstYear']").val();
    LoadCBPFSummary(year);
    LoadAmount();
    LoadDate();
    const event = new CustomEvent("d3ChartsYear", {
        detail: +year
    });
    document.body.dispatchEvent(event);
}


function LoadCBPFSummary(allocYear) {
    showLoader();
    fetch('https://cbpfgms.github.io/pfbi-data/cerf_sample_data/CERFSummary-' + allocYear + '.json')
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    //$div1_.textContent = JSON.stringify(data);
                    var obj = data;
                    $("span[id*='spnDonor']").text(obj.donors);
                    $("span[id*='spnPartners']").text(obj.partnersFunded);
                    $("span[id*='spnProjects']").text(obj.projectsFunded);
                    $("span[id*='spnContributed']").text(formatNumber(obj.contribTotalAmt));
                    $("span[id*='spnAllocated']").text(formatNumber(obj.allocAmt));

                });
            } else console.log('Network response was not ok.');

            hideLoader();
        })
        .catch(function(error) {
            hideLoader();
            console.log('Fetch error: ');
        });
}

function LoadDate() {

    fetch('https://cbpfapi.unocha.org/vo2/odata/LastModified')
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var obj = data;
                    $("span[id*='updatedOn']").text(ConvertJsonDateTime(obj.value[0].last_updated_date));

                });
            } else console.log('Network response was not ok.');

        })
        .catch(function(error) {
            console.log('Fetch error: ');
        });
}

function LoadAmount() {

    var allocYear = 2021;
    fetch('https://cbpfgms.github.io/pfbi-data/cerf_sample_data/CERFSummary-' + allocYear + '.json')
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    //$div1_.textContent = JSON.stringify(data);
                    var obj = data;
                    $("span[id*='spnAllocAmount']").text(formatNumber(obj.allocAmt));
                    $("span[id*='spnAllocPartner']").text(obj.partnersFunded);
                    $("span[id*='spnAllocProject']").text(obj.projectsFunded);

                });
            } else console.log('Network response was not ok.');
        })
        .catch(function(error) {
            console.log('Fetch error: ');
        });
}

function showLoader() {
    //$('.loading-panel').show();
    $.blockUI({
        message: $("#dvLoading"),
        overlayCSS: {
            backgroundColor: "#aaaaaa",
            opacity: "0.3"
        }
    });
}

function hideLoader() {
    //$('.loading-panel').hide();
    $.unblockUI();
}

function formatNumber(num, digits) {
    var si = [{
        value: 1,
        symbol: ""
    }, {
        value: 1E3,
        symbol: "k"
    }, {
        value: 1E6,
        symbol: "M"
    }, {
        value: 1E9,
        symbol: "B"
    }, {
        value: 1E12,
        symbol: "T"
    }, {
        value: 1E15,
        symbol: "P"
    }, {
        value: 1E18,
        symbol: "E"
    }];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function formatNumberWithoutSymbol(num, digits) {
    var si = [{
        value: 1,
        symbol: ""
    }, {
        value: 1E3,
        symbol: "k"
    }, {
        value: 1E6,
        symbol: "M"
    }, {
        value: 1E9,
        symbol: "B"
    }, {
        value: 1E12,
        symbol: "T"
    }, {
        value: 1E15,
        symbol: "P"
    }, {
        value: 1E18,
        symbol: "E"
    }];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "1");
}

function ConvertJsonDateTime(jsonDate) {
    var date = new Date(jsonDate);

    // Array of month names
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Extracting the month name based on the month number
    var month = monthNames[date.getMonth()];

    // Building the formatted date string
    return date.getDate() + " " + month + " " + date.getFullYear();
}
