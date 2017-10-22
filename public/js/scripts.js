 document.getElementById("btn").onclick = submitForm();
        document.getElementById("btn").onclick = document.location('www.google.com');
      function submitForm(){
        var text = getElementById("story");
        console.log(text);
        var topic = getElementById("topic").value;
        if (text != null && topic != null) {
          jQuery.post("/" + topic, text);
        }
      }