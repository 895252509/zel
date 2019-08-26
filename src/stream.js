
class ZInputStream{

  constructor(){ }
  
  close(){ }
  
  read(){ }
  
  skip(){ }

  ready(){ }

  get LINEBREAK_CODE_RN(){
    return '\r\n';
  }

  get LINEBREAK_CODE_N(){
    return '\n';
  }
}

class ZFileInputStream extends ZInputStream{

  constructor( file = null ){
    super();

    this._file = file || null;

    this._ready = false;

    this._buffer = new String();

    this._pt = 0;

    this._read();
  }

  read( str , len = 0){
    if( str == null  ) return;
    if( typeof str.value === "undefined" ) str.value = "";
    while( this._pt < ( (len != 0 && len <this.length)? len : this.length) ){
      str.value = str.value.concat(this._buffer.substr(this._pt,1));
      this._pt++;
    }
  }

  readLine( str ){
    if( str == null  ) return;
    if( typeof str.value === "undefined" ) str.value = "";
    while( this._pt < this.length ){
      let chr = this._buffer.substr(this._pt,1);
      str.value = str.value.concat(chr);
      this._pt++;

      if( chr === this.LINEBREAK_CODE_RN || chr === this.LINEBREAK_CODE_N )
        break;
    }
  }

  close(){
    this._ready = false;
    this._file = null;
  }

  _read(){
    if( this._file == null ) {
      this._read = false;
      return ;
    }
    let reader = new FileReader();
    reader.readAsText(this._file);
    reader.onloadend = (function (e){
      this._buffer = new String(reader.result);
      this._ready = true;

      if( this["onloadend"] )
        this["onloadend"].call(this);
    }).bind(this);
  }

  get length(){
    return this._file && this._file.size;
  }

  get name(){
    return this._file && this._file.name;
  }

  get type(){
    return this._file && this._file.type;
  }
}

class ZReader{
  constructor(){ }

  close(){ }

  mark(){ }

  read(){ }

  close(){ }

  reset(){ }

  skip(){ }

}

