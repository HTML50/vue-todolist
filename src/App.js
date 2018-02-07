import React, { Component } from 'react';
import './App.css';

class Container extends Component{
  constructor(){
    super();
    this.state = {todo:[],finish:[],checked:[]}
  }

  componentDidMount(){
    if(localStorage.getItem('todo') != null){
        this.setState({
          todo:JSON.parse(localStorage.getItem('todo'))
      })
    }
    if(localStorage.getItem('finish') != null){
      this.setState({
        finish:JSON.parse(localStorage.getItem('finish'))
    })
    }

    document.getElementById('doneList').addEventListener('click',()=>{
      let words = '';
      for(let i=0,len = this.state.finish.length;i<len;i++){
        words += '\n'  +(i+1)+'.  '+ this.state.finish[i] ;
      }
      alert('You have totally finished '+ this.state.finish.length +' tasks \n'+words);
      console.log('You have totally finished '+ this.state.finish.length +' tasks \n'+words);
    })
  }


  handleTodoAdd(task){
    let tempTodo = this.state.todo;
    tempTodo.push(task);
    this.setState({
      todo:tempTodo
    })

    localStorage.todo = JSON.stringify(tempTodo);
  }

  handleDelete(index){
    let tempTodo = this.state.todo;
    tempTodo.splice(index,1);
    this.setState({
      todo: tempTodo
    })
    localStorage.todo = JSON.stringify(tempTodo);
  }

  handleFinish(index){
    let tempTodo = this.state.todo,
    rs=tempTodo.splice(index,1).toString();
    this.setState({
      todo: tempTodo,
      finish:[...this.state.finish,rs]
    })
    localStorage.todo = JSON.stringify(tempTodo);
    localStorage.finish = JSON.stringify(this.state.finish);
  }

  handleLinesFinish(){
    let tempFinish = this.state.finish,
    tempTodo = this.state.todo,
    tempChecked =this.state.checked;


    tempChecked.sort(function(a,b){return a-b;})

    for(let i=tempChecked.length-1;i>=0;i--){
      tempFinish.push(tempTodo.splice(this.state.checked[i],1).join());
      tempChecked.splice(i,1);
    }

    this.setState({
      todo: tempTodo,
      finish:tempFinish,
      checked:tempChecked
    })
    localStorage.todo = JSON.stringify(tempTodo);
    localStorage.finish = JSON.stringify(tempFinish);

  }

  handleLinesDelete(){
    let tempTodo = this.state.todo,
    tempChecked =this.state.checked;

    tempChecked.sort(function(a,b){return a-b;})

    for(let i=tempChecked.length-1;i>=0;i--){
      tempTodo.splice(this.state.checked[i],1);
      tempChecked.splice(i,1);
    }


    this.setState({
      todo: tempTodo,
      checked:tempChecked
    })
    localStorage.todo = JSON.stringify(tempTodo);
  }


  handleSelect(index){
    if(this.state.checked.indexOf(index)===-1)
    {
      this.setState({
      checked: [...this.state.checked,index]
    })
    }
  }

  handleUnSelect(index){
    let indexDel = this.state.checked.indexOf(index),tempArr;
    if(indexDel!==-1) {
      tempArr = this.state.checked;
      tempArr.splice(indexDel,1);
      this.setState({
      checked: tempArr
    })
    }
  }



  render() {
    return (
       <div className="container">
       <Input onTodoAdd = {this.handleTodoAdd.bind(this)} />
        <List onHandleDelete={this.handleDelete.bind(this)}  onHandleFinish={this.handleFinish.bind(this)} onHandleSelect={this.handleSelect.bind(this)} onHandleUnSelect={this.handleUnSelect.bind(this)} todoList={this.state} />
        <LineManage length={this.state.checked.length} onHandleLinesDelete={this.handleLinesDelete.bind(this)} onHandleLinesFinish={this.handleLinesFinish.bind(this)} />
        <Footer />
       </div> 
      )
  }
}


class List extends Component{

  render() {
    let listArr=[];

    this.props.todoList.todo.forEach((content,index)=>{
      let isSelected = this.props.todoList.checked.indexOf(index) === -1 ? false: true;
      listArr.push(<Row key={index} index={index} date={new Date().toLocaleDateString()} selected={isSelected} content={content} {...this.props}/>)
    })


    return (
       <div className="list">
       {listArr}
       </div>
      )
  }
}


class Input extends Component{

  handleKeyDown(e){
    if(e.keyCode === 13){
      if(e.target.value === '') {return false;}
      this.props.onTodoAdd(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    return (
       <div className="input-box">
       <input type="text" className="input" placeholder="What to do?" onKeyDown={this.handleKeyDown.bind(this)} />
       </div>
      )
  }
}

class Row extends Component{

handleSelect(){
  let isSelected = this.props.selected;

  if(!isSelected){
    this.props.onHandleSelect(this.props.index);
  }else{
    this.props.onHandleUnSelect(this.props.index);
  }
}

  render() {

    let classList = this.props.selected ? "row select" : "row";
    return (
       <div className={classList} onClick={this.handleSelect.bind(this)}>
       <span>
         <span className="row-order">#{this.props.index + 1}: </span>
         <span className="row-detail">{this.props.content}</span>
         {/*
         <span className="row-date">{this.props.date}</span>
         */}
         </span>
         <RowManage onSelect={this.handleSelect.bind(this)} {...this.props}/>
       </div>
      )
  }
}

class RowManage extends Component{

handleDelete(e){
  e.stopPropagation();
  this.props.onHandleDelete(this.props.index);
}

handleFinish(e){
  e.stopPropagation();
  this.props.onHandleFinish(this.props.index);
}

  render(){
    return(
    <span className="row-manage">
           <span className="task-finish p5" onClick={this.handleFinish.bind(this)}>√</span>
           <span className="task-del p5 font" onClick={this.handleDelete.bind(this)}>x</span>
         </span>
         )
  }
}




class LineManage extends Component{
  

handleLinesDelete(){
  this.props.onHandleLinesDelete();
}

handleLinesFinish(){
  this.props.onHandleLinesFinish();
}

  render(){
    if(this.props.length>0){
    return <div className="line-manage">
    <span className="task-finish p5 font btn" onClick={this.handleLinesFinish.bind(this)}>done</span>
    <span className="task-del p5 font btn" onClick={this.handleLinesDelete.bind(this)}>del</span>
         </div>;
  }
  else{
    return <div className="line-manage"></div>;
    }
  }
  }

class Footer extends Component{
  render(){
    return <div className="footer" id="doneList">todo</div>
  }
}


export default Container;