function readURL(input) {
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

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function() {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function() {
    $('.image-upload-wrap').removeClass('image-dropping');
});

function showLogout(document) {
    $(".log-status").hide();
    $("#logout-status").show();
    $("#user-storage-status").text("🗷");
}

function showLogin(document) {
    $(".log-status").hide();
    $("#login-status").show();
    $("#user-storage-status").text("✔️");
}

function documentAddSigner(type) {
    var signer = $("#userId").value;
    $("#signer-list").append('<li userId="' + signer + '" userType="' + type + '">' + signer + ' - ' + type + '</li>');
    $("#userId").val("");

    if (type == "witness") {
        $("#document-add-witness").prop("disabled", true);
    }
}