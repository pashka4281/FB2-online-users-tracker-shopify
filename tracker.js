$(document).ready(function() {
  var shopId = "00000000"; // replace with your 8-digit unique shop identifier
  //============================================
  //==========================  HELPER FUNCTIONS
  //============================================
  Cookie = window.Cookie = {
    write: function (name, value, expirationDate) {
      var expires;
      if (expirationDate) {
        expires = "; expires=" + expirationDate.toGMTString();
      } else {
        expires = "";
      }
      document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    },
    read: function (name) {
      var nameEQ = encodeURIComponent(name) + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
          c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    remove: function(name) {
      this.write(name, "", -1);
    }
  };

  // genetrates UUID random token
  var guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  //==============================================
  //========================== END HELPER FUNCTIONS
  //==============================================


  // Shopify uses its own trekkie library for this purposes
  // it operates with 2 tokens: "visitToken" & "uniqToken"
  // (it sends lots more params but these are the main ones for the scope of this project).
  // Both are UUID random tokens, visitToken is used to track requests from the same user.
  // It gets expired in 30 min of inactivity; uniqToken expires in ~719 days (its purpose is unknown for me atm)
  var visitToken = Cookie.read('_s') || guid();
  var newVisitTokenDate = new Date(new Date().getTime() + 30*60000); // 30 min into future
  Cookie.write('_s', visitToken, newVisitTokenDate);

  var uniqToken = Cookie.read('_y') || guid();
  var newUniqTokenDate = new Date(new Date().getTime() + 719*24*60*60000); // 719 days into future
  Cookie.write('_y', uniqToken, newUniqTokenDate);

  $.ajax("https://v.shopify.com/storefront/page?visitToken="+ visitToken+"&uniqToken="+uniqToken+"&shopId=" + shopId, {
    type: "GET",
    dataType: 'jsonp',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    }
  });
});
