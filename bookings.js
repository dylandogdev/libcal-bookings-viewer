var baseUrl = "https://libcal.eku.edu/";
    
$(document).ready(function () {
    loadDate();
    getBookings();
});

function getBookings() {
    $(".table-success").remove();
    $(".table-warning").remove();
    $(".table-danger").remove();
    $.ajax({
        url: baseUrl + '1.1/oauth/token',
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            "client_id": "414",
            "client_secret": "2ac879b14faf5aaf1e8aba4b4e7ac0e4",
            "grant_type": "client_credentials"
        }),
        success: function (data) {
            var jsonData = JSON.parse(data);
            var token = jsonData.access_token;
            loadTable(token);
            lastUpdatedTime();
        }
    });
}

function loadTable(token) {
    $.ajax({
        url: baseUrl + '1.1/space/bookings',
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'BEARER ' + token);
        },
        success: function (data) {

            var i = 0;

            $.each(data, function (k, v) {
                var booking = '<td id="roomName' + v.eid + '-' + i + '">' + ' ' + '</td><td>' +
                    new Date(v.fromDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) + '</td><td>' + new Date(v.toDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) + '</td><td>' +
                    v.firstName + ' ' + v.lastName + '</td><td><a href="mailto:' + v.email + '">' +
                    v.email + '</a></td><td>' +
                    v.status + '</td></tr>';
                if (v.status.includes('Cancelled')) {
                    var row = '<tr class="table-danger">';
                } else if (v.status.includes('Confirmed') || v.status.includes('Approved')) {
                    var row = '<tr class="table-success">';
                } else if (v.status.includes('Tentative')) {
                    var row = '<tr class="table-warning">';
                } else {
                    var row = '<tr>';
                }
                booking = row + booking;
                $("tbody").append(booking);
                getRoomName(v.eid, i, token);
                i++;
            });
        }
    });
}

//get the cids for the configured array of locations 
function getRoomName(roomId, counter, token) {
    if(roomId == "18252") {
        document.getElementById("roomName" + roomId + "-" + counter).innerHTML = "Grand Reading Room";
    } else if (roomId == "18253") {
        document.getElementById("roomName" + roomId + "-" + counter).innerHTML = "First Floor Study";
    } else {
        $.ajax({
        url: baseUrl + '1.1/space/item/' + roomId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'BEARER ' + token);
        },
        success: function (data) {
            $.each(data, function (k, v) {
                document.getElementById("roomName" + roomId + "-" + counter).innerHTML = "<a href='" + baseUrl + "space/" + roomId + "'>" + v.name + "</a>";
            });
        }
    });
    }
}

function lastUpdatedTime() {
    $(".updatedTime").text(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    }));
}

function loadDate() {
    var date = new Date();
    var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    $(".todaysDate").append(date.toLocaleString('en-US', options));
}

