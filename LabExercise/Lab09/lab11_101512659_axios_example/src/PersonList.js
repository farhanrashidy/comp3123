import React, {Component} from 'react';
import axios from 'axios';
import './PersonList.css';

class PersonList extends Component {

    state ={
        persons:[]
    };

    componentDidMount(){
        axios.get('https://randomuser.me/api/?results=10')
            .then(res =>{
                console.log(res.data);
                const persons = res.data.results;
                this.setState({persons});
            })
            .catch(error => {
                console.log('Error fetching data: ', error);
            })
    }

    render() {
        return (
            <div className="container mt-4">

                <h2 className="text-center user-heading">
                    User List
                </h2>

                {this.state.persons.map((person, index) => (

                    <div className="card user-card mb-3" key={index}>

                        <div className="card-body">

                            <div className="row align-items-center">

                                <div className="col-md-3 text-center">

                                    <img
                                        src={person.picture.large}
                                        alt={person.name.first}
                                        className="user-image"
                                    />

                                    <p className="mt-2">
                                        <button className="btn btn-primary btn-sm">
                                            Details
                                        </button>
                                    </p>

                                </div>

                                <div className="col-md-9">

                                    <p>
                                        <strong>User Name:</strong>{' '}
                                        {person.name.first} {person.name.last}
                                    </p>

                                    <p>
                                        <strong>Gender:</strong>{' '}
                                        {person.gender}
                                    </p>

                                    <p>
                                        <strong>Location:</strong>{' '}
                                        {person.location.city}, {person.location.state},
                                        {' '}{person.location.country}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{' '}
                                        {person.email}
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>{' '}
                                        {person.phone}
                                    </p>

                                    <p>
                                        <strong>Age:</strong>{' '}
                                        {person.dob.age}
                                    </p>

                                    <p>
                                        <strong>Cell:</strong>{' '}
                                        {person.cell}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>
        );
    }
}

export default PersonList;