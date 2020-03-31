var save_sighting = function(id, sighting){ 
    var sighting_to_save = {
        'id': id,
        'sighting': sighting
    }
    $.ajax({
        type: "POST",
        url: "/save_sighting",   
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(sighting_to_save),
        success: function(result){
            var all_sights = result['sights'];
            sights = all_sights;
            //$("#sights").load(location.href + " #sights");
            location.reload();

            $("#enter_sight").html("Add a sighting");
            $("#enter_sight").attr("id","add_sight");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}
var delete_sighting = function(id, sighting, index){ 
    var sighting_to_delete = {
        'id': id,
        'sighting': sighting  
    }      
    $.ajax({
        type: "POST",
        url: "/delete_sighting",   
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(sighting_to_delete),
        success: function(result){
            var all_sights = result['sights'];
            sights = all_sights;

            $("#sight_list").find("li:eq("+index+")").html("<button class='bold undo_delete' id='"+sighting+"'>Undo delete</button>")

        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}
var undo_delete_sighting = function(id, sighting){ 
    var sighting_to_undelete = {
        'id': id,
        'sighting': sighting  
    }      
    $.ajax({
        type: "POST",
        url: "/undo_delete_sighting",   
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(sighting_to_undelete),
        success: function(result){
            var all_sights = result['sights'];
            sights = all_sights;

            location.reload();

        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

var save_description = function(id, description){ 
    var descrip_to_save = {
        'id': id,
        'description': description
    }
    $.ajax({
        type: "POST",
        url: "/save_description",   
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(descrip_to_save),
        success: function(result){
            var new_description = result['description'];
            description = new_description;
            $("#description").html(new_description);

            $("#enter_description").html("Edit");
            $("#enter_description").attr("id","edit");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var description;

$(document).ready(function(){
    $(document).on('click','#edit', function(){
        description = $('#description').html();
        var editing = "<textarea id='edit_description' name='description' cols='80' rows='15' wrap='soft'>"+description+"</textarea>";
        $("#description").html(editing);
        $('#edit_description').focus();

        $("#edit").html("Enter");
        $("#edit").attr("id","enter_description");
    })
    $(document).on('click','#enter_description', function(){
        var new_description = $("#edit_description").val()
        var id = $("h1").attr('id');
        save_description(id, new_description);
    })


    $(document).on('click','#add_sight', function(){
        var adding = "<input type='text' id='new_sighting'>";
        $("#sight_list").append(adding);
        $('#new_sighting').focus();

        $("#add_sight").html("Enter");
        $("#add_sight").attr("id","enter_sight");

        $("#sight_options").append("<button id='discard_sight'>Discard changes</button>");
    })
    $(document).on('click','#enter_sight', function(){
        var new_sighting = $("#new_sighting").val()
        var id = $("h1").attr('id');
        if (new_sighting.length>0){
            save_sighting(id, new_sighting);
        }
        else{
            $('#new_sighting').focus();
        }
    })
    $(document).on('click','#discard_sight', function(){
        location.reload();
    })
    $(document).on('click','#discard_description', function(){
        $("#description").html(description);
        $("#enter_description").html("Edit");
        $("#enter_description").attr("id","edit");
    })

    $(document).on('click','.delete', function(){
        var id = $("h1").attr('id');
        var sighting = $(this).parent().text().slice(0, -2);
        var index = $(this).parent().index();

        delete_sighting(id, sighting, index);
    })
    $(document).on('click','.undo_delete', function(){
        var id = $("h1").attr('id');
        var sighting = $(this).attr('id');

        undo_delete_sighting(id, sighting);
    })

})
