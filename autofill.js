jQuery = $.noConflict();

jQuery( document ).ready(function() {

  jQuery( ".food_suggest, .bar_suggest, .food_or_bar_suggest" ).addClass( "foursquare_autofill" );

  jQuery( ".food_suggest" ).data( "foursquareCategory", "Food" );
  jQuery( ".bar_suggest" ).data( "foursquareCategory", "Nightlife Spot" );
  jQuery( ".food_or_bar_suggest" ).data( "foursquareCategory", "food_bar_combo" ); // Categories with this class show venues categorized as either "Food" or "Nightlife Spot" by Foursquare.
  
});

jQuery(function() {
  
  jQuery( ".foursquare_autofill" ).autocomplete({ 
    source: function( request, response ) {
      var foursquareCategory = jQuery(this.element).data( "foursquareCategory" );
      jQuery.ajax({
        url: "https://api.foursquare.com/v2/venues/suggestCompletion",
        dataType: "jsonp",
        data: {
          query: request.term,
          sw: "38.722349,-77.588196",
          ne: "39.236907,-76.772461",
          v: "20141202",
          client_id: client_id,
          client_secret: client_secret
        },
        success: function( data ) {
               response(jQuery.map(data.response.minivenues, function (item) {
                          var categories = item.categories;
                          var categoryNames = [];
                          for (i = 0; i < categories.length; i++) {
                            categoryNames.push(categories[i].name);
                          }
                          if (foursquareCategory == 'food_bar_combo') {
                            if (jQuery.inArray("Food",categoryNames) > -1 || jQuery.inArray("Nightlife Spot",categoryNames) > -1) {
                              return item.name;
                            }
                          }
                          else if (jQuery.inArray(foursquareCategory,categoryNames) > -1) {
                            return item.name;
                          }
                      }).uniq() // Removes duplicates, to prevent having "Burger King" show up multiple times, for example.
                        .sort());
        }
      });
    },
    minLength: 3,
    delay: 100
  });
});