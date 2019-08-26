class Zel{
  constructor(){
    this._dom = null;
    this._input = null;
    this._lineNum = null;

  }

  init( dom){
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
  }

  onclick(e){
    if( this._input === null){
      this._input = new ZInputContext(this);
    }
  }

  _bindevent(){
    for( let en in document ){
      if( en.startsWith("on") && this[en]){
        this._dom.addEventListener( en.substr(2), this[en].bind(this) );
      }
    }
  }

  _initLineNumber(){
    const lndom = support.getEmptyDiv();
    this._lineNumdom = lndom;
    const ls = lndom.style;
    ls.width = '10px';
    ls.height = '100%';

    lndom.style.borderRight = '1px solid red';

    this._dom.appendChild(lndom);
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

  constructor( parent ){
    this._dom = document.createElement("input");
    let istyle = this._dom.style;
    //istyle.display = 'none';
    istyle.position  = 'absolute';
    istyle.top = '0px';
    istyle.left = '0px';
    istyle.outlineStyle = 'none';
    istyle.border = 'none';

    parent._dom.appendChild( this._dom );
  }

}

class ZLineNumeeBar{
  constructor(){
    
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