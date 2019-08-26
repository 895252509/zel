class Zel{
  constructor(){
    this._dom = null;

    this._lineNum = null;
    this._editArea = null;
  }

  init( dom , file = null){
    if( dom instanceof HTMLElement ){
      this._dom = dom;
    }else if( typeof dom === 'string' ){
      this._dom = document.getElementById(dom);
    }

    let isty = this._dom.style;
    isty.position = 'relative';

    if( isty.backgroundColor === "" )
      isty.backgroundColor = '#9e9e9e';
    
    this._bindevent();
    this._initLineNumber();
    this._initEditarea();

    if( file === null){

    }

    return this;
  }

  _bindevent(){
    for( let en in document ){
      if( en.startsWith("on") && this[en]){
        this._dom.addEventListener( en.substr(2), this[en].bind(this) );
      }
    }
  }

  _initLineNumber(){
    this._lineNum = new ZLineNumBar();
    this._dom.appendChild(this._lineNum.dom);
  }

  _initEditarea(){
    this._editArea = new ZEditArea();
    this._editArea.width = this._dom.clientWidth - this._lineNum._dom.offsetWidth;

    this._dom.appendChild(this._editArea.dom);
  }

  get _clientWidth(){
    if( this._dom != null){
      this._dom.clientWidth;
    }
  }
  get _clientHeight(){
    if( this._dom != null){
      this._dom.clientHeight;
    }
  }
}

class ZInputContext{

  constructor( ){
    this._dom = document.createElement("input");
    let istyle = this._dom.style;
    //istyle.display = 'none';
    istyle.position  = 'absolute';
    istyle.top = '0px';
    istyle.left = '0px';
    istyle.outlineStyle = 'none';
    istyle.border = 'none';
    istyle.backgroundColor = 'rgba(0,0,0,0)';
    istyle.width = '100%';
  }

  focus(){
    this._dom.focus();
  }

  _bindevent(){
    for( let en in document ){
      if( en.startsWith("on") && this[en]){
        this._dom.addEventListener( en.substr(2), this[en].bind(this) );
      }
    }
  }

  get dom(){
    return this._dom;
  }
}

class ZLineNumBar{
  constructor(){
    this._dom = support.getEmptyDiv();
    
    const ls = this._dom.style;
    ls.height = '100%';
    ls.width = '20px';

    ls.borderRight = '1px solid red';
    ls.display = 'inline-block';
  }

  _bindevent(){
    for( let en in document ){
      if( en.startsWith("on") && this[en]){
        this._dom.addEventListener( en.substr(2), this[en].bind(this) );
      }
    }
  }

  get dom(){
    return this._dom;
  }
}

class ZEditArea{
  constructor(){
    this._dom = support.getEmptyDiv();
    this._input = null;

    const ls = this._dom.style;
    ls.width = '100%';
    ls.height = '100%';
    
    ls.display = 'inline-block';

    this._bindevent();
  }
  
  onclick(e){
    if( this._input === null){
      this._input = new ZInputContext();
      this._dom.appendChild(this._input._dom);
      this._input.focus();
    }else{
      this._input.focus();
    }
  }
  
  _bindevent(){
    for( let en in document ){
      if( en.startsWith("on") && this[en]){
        this._dom.addEventListener( en.substr(2), this[en].bind(this) );
      }
    }
  }

  set width(w){
    this._dom.style.width = w;
  }

  get dom(){
    return this._dom;
  }
}

class support{
  static getEmptyDiv(){
    let dom = document.createElement("div");
    dom.style.border = 'none';
    dom.style.margin = '0px';
    dom.style.padding = '0px';
    dom.style.backgroundColor = 'rgba(0,0,0,0)';

    return dom;
  }


}