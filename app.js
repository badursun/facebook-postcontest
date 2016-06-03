var access_token = "EAACEdEose0cBAFYncGZAU7SVeFKL1OZCcgGWvhvnWK5xYDX5NNWxGTDo5YbVjs3Q9kofobpbx1HQEBvZCmYgQQaJTgpt2Lrg7cA92PPLjIv1njsvbaLqW5AnPIfnky5qBqHubZCimbYp36ZAQdZAFxqyNysPgQnQaSr9tmKLFcINVqFZC1dYTsRxpjWWeG1MNMZD";
var post_id = "883580631770549";
var KatilimciSayisi = 0;

$(document).ready(function() {
    $.ajaxSetup({
        cache: true
    });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
        FB.init({
            appId: '150550038652128',
            version: 'v2.6' // or v2.0, v2.1, v2.2, v2.3
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(updateStatusCallback);
    });

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

});

function getAccessToken() {
    var answer = prompt("Erişim Jetonunu Girin", "");

    if (answer != null) {
        access_token = answer;
    }
}

function getPagePostID() {
    var answer = prompt("Post ID Girin", "");

    if (answer != null) {
        post_id = answer;
    }
}

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

function getJsonFromAPI() {
    $("#sonuclar").html("<h4>Çekilişe Katılanlar ve Mesajları</h4>");
    var APIBaseURL = "https://graph.facebook.com/v2.6/" + post_id + "?fields=comments&access_token=" + access_token + "";
    console.log('Facebook´a Bağlanıyor.');
    $.getJSON(APIBaseURL, function(datax) {
        console.log('Data Alınıyor.');
        $.each(datax.comments.data, function(key, val) {
            $("#sonuclar").append('<div class="row" id="User' + KatilimciSayisi + '"><div class="col-lg-2 col-md-2"><strong>' + val.from.name + '</strong></div><div class="col-lg-2 col-md-2">' + timeAgo(val.created_time) + '</div><div class="col-lg-8 col-md-8">' + val.message + '</div></div>');
            KatilimciSayisi++;
        });

        $("#User" + Math.floor(Math.random() * KatilimciSayisi) ).css("background-color","#F3C5C2");
    }).error(function(data) {
        var gelenJson = jQuery.parseJSON(data.responseText);
        $("#sonuclar").html("<strong style=color:red>Hata Oluştu.</strong><br /> Hata:" + gelenJson.error.message);
    });
}
