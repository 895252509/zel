window.addEventListener("load", function() {
  const zel = new Zel().init("div1");
  const area = new ZEditArea();
  this.document.body.appendChild(area.dom);
  document.body.addEventListener('click', function(e) {
    console.log(`body click=x:${e.clientX},y:${e.clientY}`);
  })
  area.on('click', function(e) {
    console.log(`area click=x:${e.clientX},y:${e.clientY}`);
  })

  console.log(zel);

  let file = null;
  let fr = new FileReader();
  document.getElementById("ifile").addEventListener("change", function(e) {
    file = document.getElementById("ifile").files[0];
    let read = new ZFileInputStream(file);
    read.onloadend = function(e) {
      if (read.ready) {
        var str = {};
        read.readLine(str, 10);
      }

      console.log(str);
    }

  });

});