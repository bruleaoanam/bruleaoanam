import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');
// import TextField from 'material-ui/TextField';
// import FlatButton from 'material-ui/FlatButton';



class App extends Component {
  constructor(props)
  {
    super(props);
    
  }
  
  render() {
    
    return (
    <div className="App" class="w3-container" >
    
      <Login >
      
      </Login>
    </div>
     
    );
  }
}

class Login extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      open:props.open,
      username: null,
      password: null,
    };
    this.setUserName = this.setUserName.bind(this);
    this.setpassword = this.setpassword.bind(this);
    this.login = this.login.bind(this);
    this.cancel = this.cancel.bind(this);
    
  }
  
  setUserName(e){
    this.setState({username : e.target.value});
  };
  
  setpassword(e){
    this.setState({password : e.target.value});
    
  };
  
  login(e)
  {
    if (this.state.username == null || this.state.password == null)
    {
      alert("Completati utilizatorul si parola!");
      return;
    }

    
    axios.post('//contacts-bruleaoana.c9users.io:8082/api/login', "param="+JSON.stringify({username: this.state.username, password: this.state.password}), { withCredentials: false },
    {
      headers:{
        "Contet-type": "application/json",
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((results) =>{
      if (results.data.Access) 
      {
        ReactDOM.render(<Main />, document.getElementById("root"));
      }
    }).catch((error) => {
         console.log(error);
     });
  
  };
  
  cancel(){
    this.setState({username : ''});
    this.setState({password : ''});
  };
  
  
  render(){
   
      return (
      
        <div className="Login"  id="login" class="w3-display-middle" style={{ width: '50%' }}>
            <input type="text" class="w3-input" ref = "username"  onChange={this.setUserName} placeholder = "username" />
            <br/> 
            <input type="password" class="w3-input" ref = "password"  onChange={this.setpassword} placeholder = "password" />
            <br/><br/>
            <a class="w3-btn w3-green w3-bar" onClick={this.login}  >Autentificare</a>
            <br/>
            <a class="w3-btn w3-red w3-bar" onClick={this.cancel} >Renuntare</a>
        </div>
        
        );
    
  }
  
  
  
}


class Main extends Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      open: props.open,
        id: null,
        table : null
      
    };
    
    this.getAllContacts = this.getAllContacts.bind(this);
    this.getContactsById = this.getContactsById.bind(this);
    this.getId = this.getId.bind(this);
    this.showModal1 = this.showModal1.bind(this);
    this.hideModal1 = this.hideModal1.bind(this);
    this.getAllContacts();
  }
  
  getAllContacts()
  {
    axios.post('//contacts-bruleaoana.c9users.io:8082/api/get', "param="+JSON.stringify({table: "contacts"}), { withCredentials: false },
    {
      headers:{
        "Contet-type": "application/json",
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((results) =>{
        ReactDOM.render(<Contacts data={results.data} param={this.getId} />, document.getElementById("divTable"));
    }).catch((error) => {
         console.log(error);
     });
  };
  
  getContactsById()
  {
    if (this.state.id == null ) return;
    axios.post('//contacts-bruleaoana.c9users.io:8082/api/get', "param="+JSON.stringify({table: "contacts", params:parseInt(this.state.id) }), { withCredentials: false },
    {
      headers:{
        "Contet-type": "application/json",
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((results) =>{
        if (typeof results.data == "object" )
        {
          results.data = [results.data];
        }
        
        ReactDOM.render(<FormContacts data={results.data} />, document.getElementById("modalcontent"));
        this.showModal1();
    }).catch((error) => {
         console.log(error);
     });
  };
  getContactDetails()
  {
    axios.post('//contacts-bruleaoana.c9users.io:8082/api/get', "param="+JSON.stringify({table: "contacts_ext", params:parseInt(this.state.id), column: "contactID" }), { withCredentials: false },
    {
      headers:{
        "Contet-type": "application/json",
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((results) =>{
        if (typeof results.data == "object" )
        {
          results.data = [results.data];
        }
        
        ReactDOM.render(<FormContacts data={results.data} />, document.getElementById("modalcontent"));
        this.showModal1();
    }).catch((error) => {
         console.log(error);
     });
  };
  getId(e){
    
    var rows = e.target.parentNode.parentNode.children;
    for(var i = 0; i< rows.length; i++)
    {
      if (rows[i].classList.contains("w3-blue")) rows[i].classList.remove("w3-blue");
    }
    
    this.setState({id: e.target.parentNode.id});
    e.target.parentNode.classList.add("w3-blue");
  };
  
  showModal1(e)
  {
    document.getElementById('id01').style.display = "block";
  }
    hideModal1(e)
  {
    document.getElementById('id01').style.display = "none";
  }
  
  render()
  {
    return (
      
      <div className="Main" class="w3-white" >
      <div class="w3-sidebar w3-light-grey w3-bar-block" style={{width:"25%"}}>
        <a href="javascript:void(0)" onClick={this.getAllContacts}  class="w3-bar-item w3-button">Contacte</a>
        <a href="javascript:void(0)" onClick={this.getContactsById}  class="w3-bar-item w3-button">Afiseaza mai mult</a>
        <a href="javascript:void(0)" onClick={this.getContactsById}  class="w3-bar-item w3-button">Detalii contact</a>
      </div>
      
      
      <div style={{marginLeft:"25%"}} id="divTable"></div>
       <div id="id01" class="w3-modal">
        <div class="w3-modal-content w3-card-4">
          <header class="w3-container w3-blue"> 
            <span onClick={this.hideModal1} class="w3-button w3-display-topright">&times;</span>
            <h2>Contacte</h2>
          </header>
          <div class="w3-container">
            <div class="w3-container" id="modalcontent"></div>
          </div>
          <footer class="w3-container w3-blue">
            <span onClick={this.hideModal1} class="w3-button w3-red w3-right">Inchide</span>
          </footer>
        </div>
      </div>
      
      </div>
      
      
      
      );
    
  }
}

class ContactsRow extends React.Component {
  
  constructor(props)
  {
    super(props);
  }
  
  render() {
    // const {
    //   data
    // } = this.props;
    
    
    const row = this.props.data.map((data) =>
      <tr key={data.id} id={data.id} onClick={this.props.onClick}>
        <td key={data.name}>{data.name}</td>
        <td key={data.phone_number}>{data.phone_number}</td>
        <td key={data.e_mail}>{data.e_mail}</td>
        <td key={data.note}>{data.note}</td>
      </tr>
    );
    return (
      <tbody>{row}</tbody>
    );
  }
}

class Contacts extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    
    
    return (
      <table class="w3-table-all">
        <thead class="w3-black">
          <th>Nume</th>
          <th>Telefon</th>
          <th>E-mail</th>
          <th>Notes</th>
        </thead>
        <ContactsRow data={this.props.data} onClick= {this.props.param} />
      </table>
    );
  }
}

class FormContacts extends  React.Component
{
  constructor(props)
  {
    super(props);
  }
  
  render()  {

  const data = this.props.data.map((data) =>
      <div>
        <label>Nume prenume</label>
        <input class="w3-input" type="text" key={data.name} value={data.name}/>
        <label>Companie</label>
        <input class="w3-input" type="text" key={data.company} value={data.company}/>
        <label>Titlul postului</label>
        <input class="w3-input" type="text" key={data.job_title} value={data.job_title}/>
        <label>E-main</label>
        <input class="w3-input" type="text" key={data.e_mail} value={data.e_mail}/>
        <label>Numar telefon</label>
        <input class="w3-input" type="text" key={data.phone_number} value={data.phone_number}/>
        <label>Nota</label>
        <input class="w3-input" type="text" key={data.note} value={data.note}/>
        <label>Adresa</label>
        <input class="w3-input" type="text" key={data.adress} value={data.adress}/>
      </div>
    );
    return (
      <div class="w3-containe" id="contactsForm">{data}</div>
    );
  }
  
}

export default App;
