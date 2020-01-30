import React, { Component } from "react";
import "./App.css";
const axios = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "React CRUD POC",
      act: 0,
      index: "",
      data: null
    };
  }

  componentDidMount() {
    this.refs.name.focus();
    this.getdata();
  }

  //Read
  getdata = e => {
    axios
      .get("http://localhost:5000/all")
      .then(result => {
        this.setState({ data: result.data });
      })
      .catch(err => {
        console.log(err);
      });
  };
  //Create And Update
  fSubmit = e => {
    e.preventDefault();

    let name = this.refs.name.value;
    let address = this.refs.address.value;

    if (this.state.act === 0) {
      //Create
      let person = {
        name,
        address
      };

      axios
        .post("http://localhost:5000/create", person)
        .then(result => {
          this.getdata();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      //Update
      let person = {
        name,
        address
      };
      axios
        .put(`http://localhost:5000/${this.state.index}/update`, person)
        .then(result => {
          this.getdata();

          this.setState({ act: 0 });
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.refs.myForm.reset();
    this.refs.name.focus();
  };

  //Delete
  fRemove = i => {
    axios
      .delete(`http://localhost:5000/${i}/delete`)
      .then(result => {
        this.getdata();
      })
      .catch(err => {
        console.log(err);
      });

    this.refs.myForm.reset();
    this.refs.name.focus();
  };
  //Precedure for Update
  fEdit = i => {
    this.refs.name.value = this.state.data[i].name;
    this.refs.address.value = this.state.data[i].address;

    this.setState({
      act: 1,
      index: i
    });

    this.refs.name.focus();
  };

  render() {
    return (
      <div className="App">
        <h2>{this.state.title}</h2>
        <form ref="myForm" className="myForm">
          <input
            type="text"
            ref="name"
            placeholder="Name"
            className="formField"
          />
          <input
            type="text"
            ref="address"
            placeholder="Address"
            className="formField"
          />
          <button onClick={e => this.fSubmit(e)} className="myButton">
            Submit
          </button>
        </form>
        <pre>
          {this.state.data ? (
            <React.Fragment>
              {Object.keys(this.state.data).map((item, i) => (
                <li key={i} className="myList">
                  {i + 1}.{this.state.data[item].name},
                  {this.state.data[item].address}
                  <button
                    onClick={() => this.fRemove(item)}
                    className="myListButton"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => this.fEdit(item)}
                    className="myListButton"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </React.Fragment>
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </pre>
      </div>
    );
  }
}

export default App;
