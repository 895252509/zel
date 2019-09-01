class Eventable{
  constructor(){
    this[Eventable.PROPERTY.EVENT_HANDLERS] = {};

    this._bindEvent();
  }

  on(type, handler){
    if( !this[Eventable.PROPERTY.EVENT_HANDLERS][type] ){
      this[Eventable.PROPERTY.EVENT_HANDLERS][type] = [];
    }
    this[Eventable.PROPERTY.EVENT_HANDLERS][type].push(handler);
    return this;
  }

  trigger(type, e){
    if( this[Eventable.PROPERTY.EVENT_HANDLERS][type] &&
    this[Eventable.PROPERTY.EVENT_HANDLERS][type].length !== 0 ){
      for( let handler of this[Eventable.PROPERTY.EVENT_HANDLERS][type] ){
        handler.call(this, e);
      }
    }

    if( this[Eventable.PROPERTY.EVENT_HANDLERS][`${type}$asyn`] &&
    this[Eventable.PROPERTY.EVENT_HANDLERS][`${type}$asyn`].length !== 0 ){
      for( let handler of this[Eventable.PROPERTY.EVENT_HANDLERS][`${type}$asyn`] ){
        window.setTimeout(()=>{
          handler.call(this, e);
        })
      }
    }
  }

  _bindEvent(){
    let proto = this.__proto__;
    while( proto !== Object.prototype){
      for( let type of Object.getOwnPropertyNames(proto) ){
        if( type.startsWith('on') && type !== 'on'){
          new Eventable() .on.call(this, type.substr(2), this[type].bind(this) );
        }
      }
      proto = proto.__proto__;
    }
  }
}
Eventable.PROPERTY = {
  EVENT_HANDLERS: '[Zel.Eventable:EventHandlers]'
}

class Part extends Eventable{
  constructor(){
    super();

    this._dom = null;
    this._parent = null;
    this._style = null;
    this._children = [];

    this._bindEventToDom();
  }

  appendChild(part){
    if( part instanceof Part ){
      this._children.push(part);
      part._parent = this;
      if( this._dom !== null && part._dom !== null ){
        this._dom.appendChild(part._dom);
      }
    }
  }

  on(type, handler){
    super.on(type, handler);
    this.touch(type);
  }

  trigger(etype, e){
    super.trigger(etype, e);

  }

  touch(type){
    this._bindEventToDom(type);
  }

  _bindEventToDom(type){
    if(this._dom ===null) return ;
    for( let en in document ){
      if( !en.startsWith("on") ) continue;
      let localen = en.substr(2);
      if( !!type && localen !== type ) continue;

      if(  this[Eventable.PROPERTY.EVENT_HANDLERS][localen] && this[Eventable.PROPERTY.EVENT_HANDLERS][localen].length > 0){
        for( let handler of this[Eventable.PROPERTY.EVENT_HANDLERS][localen]){
          if( !handler[Part.PROPERTY.ISTOUCHTODOM] ){
            this._dom.addEventListener( localen, handler.bind(this) );
            handler[Part.PROPERTY.ISTOUCHTODOM] = true;
          }
        }
      }
    }
  }

  get dom(){
    return this._dom;
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
Part.PROPERTY={
  ISTOUCHTODOM:'[Zel.Part:isTouchToDom]'
}
Part.EventTypes = Object.getOwnPropertyNames(HTMLElement.prototype).filter(en => en.startsWith('on'));

class Zel extends Part{
  constructor(){
    super();

    this._lineNum = null;
    this._editArea = null;
    this._input = null;
    this._data = null;
    this._fontSize = 12;
    this._doc = [];

    this._fontStyle = {
      fontSize : `${this._fontSize}px`,
      fontFamily : 'Consolas, "Courier New",monospace,Hiragino Sans GB,STHeiti,Microsoft Yahei,sans-serif',
      fontColor : 'white',
      fontWeight: '500',
      lineHeight: `${this._fontSize + 4}px`
    };

    this.touch();
  }

  init( dom , file = null){
    if( dom instanceof HTMLElement ){
      this._dom = dom;
    }else if( typeof dom === 'string' ){
      this._dom = document.getElementById(dom);
    }

    let is = this._dom.style;
    is.position = 'relative';
    is.fontFamily = this._fontStyle.fontFamily || 'Microsoft Yahei';
    is.color = this._fontStyle.fontColor || 'black';
    is.fontSize = this._fontStyle.fontSize || '10px';
    is.fontWeight = '500';

    if( is.backgroundColor === "" )
      is.backgroundColor = '#9e9e9e';

    this._initLineNumber();
    this._initEditarea();

    if( file === null){

    }
    this.touch();
    return this;
  }

  onkeydown(e){
    console.log(e);
    switch (e.code) {
      case 'Enter':
        this._doc.push('\r\n');
        break;
      default:
        break;
    }
    
  }

  oninput(e){
    console.log(e);
    if( e.inputtype === 'insertCompositionText' && e.data && !e.data.match(/[\u4e00-\u9fa5]+|[\u0370-\u03ff]+/)) {
      return ;
    }

    


  }

  _initLineNumber(){
    this._lineNum = new ZLineNumBar();
    this.appendChild(this._lineNum);
    this._lineNum.trigger('load');
  }

  _initEditarea(){
    this._editArea = new ZEditArea();
    this.appendChild(this._editArea);

    this._editArea.width = this._dom.clientWidth - this._lineNum._dom.offsetWidth;
    this._editArea.on('click', function (e){
      this._parent.trigger('editAreaClick', e);
    });
  }

  oneditAreaClick(e){
    const tmpzel = this;
    if( tmpzel._input === null){
      tmpzel._input = new ZInputContext();
      tmpzel._input.inputStyle = tmpzel._fontStyle;
      // tmpzel._input.width = `${tmpzel._editArea._dom.clientWidth}px`;
      tmpzel._input.width = '100%';
      tmpzel._input.left = `${tmpzel._lineNum._dom.clientWidth + 1}px`;
      tmpzel._dom.appendChild(tmpzel._input._dom);
      tmpzel._input.focus();

    }else{
      tmpzel._input.focus();
    }
  }

}

class ZInputContext extends Part{
  constructor( ){
    super();

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

    this.touch();

  }

  focus(){
    this._dom.focus();
  }

  set inputStyle({ fontSize, fontColor, fontFamily, fontWeight }){
    if( this._dom === null ) return ;
    const ls = this._dom.style;
    ls.color = fontColor;
    ls.fontSize = fontSize;
    ls.fontFamily = fontFamily;
    ls.fontWeight = fontWeight;
  }

  set width(w){
    if( this._dom === null ) return ;
    this._dom.style.width = w;
  }

  set left(l){
    if( this._dom === null ) return ;
    this._dom.style.left = l;
  }
}

class ZLineNumBar extends Part{
  constructor(){
    super();

    this._lineCount = 2;

    this._dom = support.getEmptyDiv();
    const ls = this._dom.style;
    ls.height = '100%';
    ls.width = '40px';
    //ls.borderRight = '1px solid #c1c1c1c2';
    ls.display = 'inline-block';
    ls.backgroundColor = 'rgba(0, 0, 0, 0.13)';

    this.touch();
  }

  onload(){
    for( let i = 0; i< this._lineCount ; i++ ){
      this.addline(i);
    }
  }

  addline(num){
    const linedom = support.getEmptyDiv();
    linedom.innerHTML = `<span>${num}</span>`;
    const ls = linedom.style;
    //ls.display = 'inline-block';
    ls.width = '100%';
    ls.cssFloat = 'left';
    ls.textAlign = 'center';
    ls.height = this._parent._fontStyle.lineHeight || '16px';
    this.dom.appendChild(linedom);
  }

  get lineCount(){
    return this._lineCount;
  }
}

class ZEditArea extends Part{
  constructor(){
    super();
    
    this._dom = support.getEmptyDiv();
    this._input = null;

    const ls = this._dom.style;
    ls.width = '100%';
    ls.height = '100%';
    
    ls.display = 'inline-block';
    ls.position = 'relative';

    this.touch();
  }

  set width(w){
    this._dom.style.width = w;
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