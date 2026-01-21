import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, ListGroup, Form, Button, Row, Col } from 'react-bootstrap';
import { PersonFill, EnvelopeFill, Calendar2DateFill, Trash3Fill} from 'react-bootstrap-icons';

export default function App() {
  
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
    Axios.get('http://localhost:3001/users')
      .then((res) => setUsers(res.data));
  }, []);


  const createUser = () => {
    if (name && age && email) {
    Axios.post('http://localhost:3001/createUser', { name, age, email })
      .then(res => {
        setUsers([...users, res.data]); 
        setName('');
        setAge('');
        setEmail('');
        toast.success("user created.", {
            position: "top-right",
            autoClose: 1500, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
      })
      .catch(err => console.error("Create error:", err));
    }
  };


  const deleteUser = (id) => {
    Axios.delete(`http://localhost:3001/deleteUser/${id}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== id));
        toast.success("user deleted.", {
            position: "top-right",
            autoClose: 1500, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
      });
     
  }

  const [, setCookies] = useCookies(["access_token"]);

  const removeCookies = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("adminId");
    window.location.reload(); 
  };
  

  return (
  <>
      <ToastContainer />
      <Container className="mt-4 bg-light p-4 rounded shadow">
        <h2 className="mb-4 text-center text-primary">👥 User List</h2>

        <Row className="mb-3">
          <Col xs="auto">
            <Button
              variant="outline-danger"
              size="sm"
              className="px-2 py-1"
              onClick={removeCookies}
            >
              Logout
            </Button>
          </Col>
        </Row>


      <Row className="mb-4">
        {users.map((user) => (
            <Col md={4} key={user._id} className="mb-3">
            <Card bg="info" text="white" className="shadow">
              <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
                <span><PersonFill className="me-2" /> {user.name}</span>
                <Button variant="danger" size="sm" onClick={() => deleteUser(user._id)}>
                  <Trash3Fill />
                </Button>

              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-light text-dark">
                  <Calendar2DateFill className="me-2" /> Age: {user.age}
                </ListGroup.Item>
                <ListGroup.Item className="bg-light text-dark">
                  <EnvelopeFill className="me-2" /> {user.email}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>


      <Card className="p-4 border border-primary">
        <h4 className="text-success">➕ Add New User</h4>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label><PersonFill className="me-2" />Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="formAge">
                <Form.Label><Calendar2DateFill className="me-2" />Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label><EnvelopeFill className="me-2" />Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="success" onClick={createUser}>
            Add User
          </Button>
        </Form>
      </Card>
    </Container>
  </>
  );
}
