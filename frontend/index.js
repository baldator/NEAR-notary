import "./import-jquery";
import "jquery-ui-dist/jquery-ui.js";

window.readURL = function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function(e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}

window.removeUpload = function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

window.showLogout = function showLogout(document) {
    $(".log-status").hide();
    $("#logout-status").show();
    $("#user-storage-status").text("🗷");
}

window.showLogin = function showLogin(document) {
    $(".log-status").hide();
    $("#login-status").show();
    $("#user-storage-status").text("✔️");
}

window.documentAddSigner = function documentAddSigner(type) {
    var signer = $("#userId").val();
    $("#signer-list").append('<li userId="' + signer + '" userType="' + type + '">' + signer + ' - ' + type + '</li>');
    $("#userId").val("");

    if (type == "witness") {
        $("#document-add-witness").prop("disabled", true);
        // set witness to true
        $("#near-withness-status").text("✔️");
    }
    const count = parseInt($("#near-signer-count").text()) + 1;
    $("#near-signer-count").text(count);
}