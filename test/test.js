window.addEventListener("load",function (){
  const zel = new Zel() .init("div1");

  console.log(zel);

  let file = null;
  let fr = new FileReader();
  document.getElementById("ifile").addEventListener("change", function(e){
    file = document.getElementById("ifile").files[0];
    let read = new ZFileInputStream(file);
    read.onloadend = function (e){
      if( read.ready ){
        var str = {};
        read.readLine( str , 10 );
      }

      console.log(str);
    }

  });
  
  
});
