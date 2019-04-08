var endpoint = "http://192.168.0.112/api/streetviewNew/folder";
var directories;

var iptEls = document.querySelectorAll("input");
[].forEach.call(iptEls, function(iptEl) {
  iptEl.onchange = function(e) {
    console.log(this.files);
    const data = new FormData();
    // this.files.forEach(file => {
    data.append("imgFolder", this.files);
    console.log(typeof this.files);
    // });

    axios
      .post(endpoint, data)
      .then(res => {
        console.log(res.statusText);
      })
      .catch(err => {
        console.log(err);
      });
  };
});
