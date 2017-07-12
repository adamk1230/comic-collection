$("#searchButton").on("click", function() {
           

            // Pick-up search value
            var searchString = $("#searchString").val().trim();

            // Pick up radio button value
            var typeSearch = $('input[name="searchRadio"]:checked').val();

            // Determine which route to use for search based on radio button value
            console.log(searchString);

            var currentURL = window.location.origin;


            if (typeSearch == 'character') {



              $.ajax({
                url: currentURL+"/character",
                type: "post",
                data: "character="+searchString,
                success: function(res) {}
              })




                // $.post("/character", searchString)
                //     .done(function(data) {
                //         // Update listing
                //     });

            } else {

                $.post("/title", searchString)
                    .done(function(data) {
                        // Update listing
                    });

            }

});