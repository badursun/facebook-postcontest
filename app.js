var access_token = "";
var post_id = "";
var TotalContestUser = 1;
var NextPageLink = "";
var ParsebleData = {};
var LoopCount = 0;
var checkLoginState;

/*
    Document Ready Process
*/
$(document).ready(function() {
    $.ajaxSetup({
        cache: true
    });
    $.getScript('https://connect.facebook.net/tr_TR/sdk.js', function() {
        FB.init({
            appId: '150550038652128',
            cookie: true,
            xfbml: true,
            version: 'v2.6'
        });

        $('#loginbutton,#feedbutton').removeAttr('disabled');

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                $.LoadingOverlay("show");
                var accessToken = response.authResponse.accessToken;
                console.log("access_token: " + accessToken);

                access_token = accessToken;

                if (access_token == "") {
                    getAccessToken();
                }
                if (post_id == "") {
                    getPagePostID();
                }
                if (access_token == "" || post_id == "") {
                    $("#sonuclar").html("Gerekli Bilgiler Girilmedi !");
                } else {
                    getJsonFromAPI();
                }
            }
        });
    });

});

/*
    Get Access Token From Facebook
*/
function getAccessToken() {
    var answer = prompt("Erişim Jetonunu Girin", "");

    if (answer != null) {
        access_token = answer;
    }
}

/*
    Request Facebook PostID  
*/
function getPagePostID() {
    var answer = prompt("Post ID Girin", "882918638503415");

    if (answer != null) {
        post_id = answer;
    }
}

/*
  Time converter  
*/
function timeAgo(time) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
        return;

    return day_diff == 0 && (
            diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
        day_diff == 1 && "Yesterday" ||
        day_diff < 7 && day_diff + " days ago" ||
        day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
}

/*
  Load JSON From API  
*/
var LoadJson = function(URL) {
    $.getJSON(URL, function(datax) {
        if (LoopCount == 0) {
            NextPageLink = datax.comments.paging.next;
        } else {
            NextPageLink = datax.paging.next;

            if (typeof(NextPageLink) == "undefined") {
                NextPageLink = "";
            }
        }
        console.log(NextPageLink);

        if (LoopCount == 0) { ParsebleData = datax.comments.data } else { ParsebleData = datax.data }
        $.each(ParsebleData, function(key, val) {
            $("#sonuclar").append('<div class="row" id="User' + TotalContestUser + '"><div class="col-lg-2 col-md-2"><strong>' + TotalContestUser + ') ' + val.from.name + '</strong></div><div class="col-lg-2 col-md-2">' + timeAgo(val.created_time) + '</div><div class="col-lg-8 col-md-8">' + val.message + '</div></div>');
            TotalContestUser++;
        });

    }).success(function(data) {
        if (NextPageLink !== "") {
            LoopCount++;
            LoadJson(NextPageLink);
        } else {
            SelectAnUser();
        }
    }).error(function(data) {
        var gelenJson = jQuery.parseJSON(data.responseText);
        $("#sonuclar").html("<strong style=color:red>Hata Oluştu.</strong><br /> Hata:" + gelenJson.error.message);
    });
}

/*
  JSON Request INIT.  
*/
function getJsonFromAPI() {
    $("#sonuclar").html('<h4 id="reset">Çekilişe Katılanlar ve Mesajları - Seçilen Kişi: <span id="rndks">?</span> Numara</h4>');
    var APIBaseURL = "https://graph.facebook.com/v2.6/" + post_id + "?pretty=1&fields=comments&access_token=" + access_token + "";
    console.log('Facebook´a Bağlanıyor.');
    console.log('Data Alınıyor.');
    $("#reset").click(function() {
        SelectAnUser();
    })
    LoadJson(APIBaseURL);
}

/*
  Select 1 User  
*/
function SelectAnUser() {
    $("div.row").each(function(index) {
        $(this).removeClass("selected");
    });

    console.log('Katılımcı Seçiliyor...');
    var SelectRandomNumber = Math.floor(Math.random() * TotalContestUser);
    console.log(SelectRandomNumber + '. Numaralı Kişi Seçildi.');
    $("#rndks").html(SelectRandomNumber);
    $("#User" + SelectRandomNumber).addClass("selected");
    $.LoadingOverlay("hide");
}
