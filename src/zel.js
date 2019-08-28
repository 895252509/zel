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
  EVENT_HANDLERS: '[EventHandlers]'
}

class Part extends Eventable{
  constructor(){
    super();

    this._dom = null;
    this._parent = null;

    this._bindEventToDom();
  }

  on(type, handler){
    super.on(type, handler);
    this.touch(type);
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
          if( !handler['[ZEL.Part:isTouchToDom]'] ){
            this._dom.addEventListener( localen, handler.bind(this) );
            handler['[ZEL.Part:isTouchToDom]'] = true;
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

class Zel extends Part{
  constructor(){
    super();

    this._lineNum = null;
    this._editArea = null;
    this._input = null;

    this._fontStyle = {
      fontSize : '12px',
      fontFamily : 'consoles,monospace,Hiragino Sans GB,STHeiti,Microsoft Yahei,sans-serif',
      fontColor : 'white'
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


    if( is.backgroundColor === "" )
      is.backgroundColor = '#9e9e9e';

    this._initLineNumber();
    this._initEditarea();

    if( file === null){

    }
    this.touch();
    return this;
  }

  _initLineNumber(){
    this._lineNum = new ZLineNumBar();
    this._dom.appendChild(this._lineNum.dom);
  }

  _initEditarea(){
    this._editArea = new ZEditArea();
    this._editArea.width = this._dom.clientWidth - this._lineNum._dom.offsetWidth;

    this._dom.appendChild(this._editArea.dom);

    this._editArea.on('click', function (e){
      if( this._input === null){
        this._input = new ZInputContext();
        this._dom.appendChild(this._input._dom);
        this._input.focus();
      }else{
        this._input.focus();
      }
    });
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

}

class ZLineNumBar extends Part{
  constructor(){
    super();

    this._dom = support.getEmptyDiv();
    const ls = this._dom.style;
    ls.height = '100%';
    ls.width = '20px';

    ls.borderRight = '1px solid #c1c1c1c2';
    ls.display = 'inline-block';

    this.touch();
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
  
  onclick(e){
    // if( this._input === null){
    //   this._input = new ZInputContext();
    //   this._dom.appendChild(this._input._dom);
    //   this._input.focus();
    // }else{
    //   this._input.focus();
    // }
    console.log('123');
    console.log(this);
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