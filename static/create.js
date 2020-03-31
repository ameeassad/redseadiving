var displayLink = function(id){
    $("#link_container").empty()

    var link = "/view/"+id+"/"
    var add_link = $("<div id='link'>New item successfully created. <span><a href='"+link+"'> See it here. </a>")
    $("#link_container").append(add_link)
}

var displayError = function(errors){
    $("#link_container").empty()

    var error_msg = $("<div class='error'> Error: unable to save entry. </div>")
    $("#link_container").append(error_msg)


    if (errors.includes('sights')){
        $("#sights_error").append("Error: please enter sights.")
        $('#sights').focus();
    }
    if (errors.includes('maxdepth')){
        $("#maxdepth_error").append("Error: please enter a number.")
        $('#maxdepth').focus();
    }
    if (errors.includes('description')){
        $("#description_error").append("Error: please enter description.")
        $('#description').focus();
    }
    if (errors.includes('image')){
        $("#image_error").append("Error: please enter an image url.")
        $('#image').focus();
    }
    if (errors.includes('name')){
        $("#name_error").append("Error: please enter name.")
        $('#name').focus();
    }


}

var clearAll = function(){
    $("#link_container").empty()
    $("#name_error").empty()
    $("#image_error").empty()
    $("#description_error").empty()
    $("#maxdepth_error").empty()
    $("#sights_error").empty()
}


var save_entry = function(id, name, image, description, maxdepth, sights){ 
    var entry_to_save = {
        'id': id,
        'name': name,
        'image': image,
        'description': description, 
        'maxdepth': maxdepth,
        'sights': sights
    }
    $.ajax({
        type: "POST",
        url: "/save_entry",   
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(entry_to_save),
        success: function(result){
            var my_id = id
            displayLink(my_id)

            $("input:text").val("");
            $("textarea").val("");
            $('#name').focus();
        },
        error: function(request, status, error){
            //displayError();
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)

        }
    });
}

$(document).ready(function(){

    $('#submit_button').click(function() {
        clearAll();

        var id = $('#link_container').attr('data-id')
        var name = $('input[name ="name"]').val()
        var image = $('input[name ="image"]').val()
        var description = $('textarea[name ="description"]').val()
        var maxdepth = $('input[name ="maxdepth"]').val()
        var sights = $('input[name ="sights"]').val()

        var errors = []
        if (name.trim().length==0){
            errors.push('name')
        }
        if (image.trim().length==0){
            errors.push('image')
        }
        if (description.trim().length==0){
            errors.push('description');
        }
        if (maxdepth.trim().length==0 || !(/^\d+$/.test(maxdepth))){
            errors.push('maxdepth');
        }
        if (sights.trim().length==0){
            errors.push('sights');
        }

        if (errors.length==0){
            save_entry(id, name, image, description, maxdepth, sights);
        }
        else{
            displayError(errors);
        }
    });
})
