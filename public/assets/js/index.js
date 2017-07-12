$("#searchButton").on("click", function() {
           

            // Pick-up search value
            var searchString = $("#searchString").val().trim();
            searchString = encodeURI(searchString);

            // Pick up radio button value
            var typeSearch = $('input[name="searchRadio"]:checked').val();

            // Determine which route to use for search based on radio button value
            console.log(searchString);

            var currentURL = window.location.origin;


            if (typeSearch == 'character') {
                var url = currentURL+'/character/'+searchString;
                // window.location.href = url;
                window.location.replace (url);
                // window.location.pathname = 'character/'+searchString;



              // $.ajax({
              //   url: currentURL+"/character/"+searchString,
              //   type: "get",
              //   success: function(res) {}
              // })




                // $.post("/character", searchString)
                //     .done(function(data) {
                //         // Update listing
                //     });

            } else {

                var url = currentURL+'/title/'+searchString;
                // window.location.href = url;
                window.location.replace (url);
                // window.location.pathname = 'character/'+searchString;


                // $.post("/title", searchString)
                //     .done(function(data) {
                //         // Update listing
                //     });

            }

});