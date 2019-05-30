import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Card,
  Carousel,
  Jumbotron,
  Image,
  Container
} from "react-bootstrap";
import { Button } from "@material-ui/core";

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="background1">
        <div className="background1">
          <Navbar bg="light" expand="lg" sticky="top">
            <Navbar.Brand href="#home" className="brand">
              <img className="logo" src="./logo.png" />
              DHCS
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav justify className="mx-auto navheader">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#developer">Developers</Nav.Link>
              </Nav>
              <Button
                variant="contained"
                color="primary"
                className="ml-auto"
                onClick={handleSignIn.bind(this)}
              >
                Sign Up/In
              </Button>
            </Navbar.Collapse>
          </Navbar>
          <div className="container" id="home">
            <div className="row justify-content-center">
              <Jumbotron className="col-6 tr  text-left ">
                <h1>A platform for sharing health records.</h1>
                <p>
                  You have every rights to your health records. You decide where
                  it stays, to whom you want to share. Start today, be
                  responsible for your health records.
                </p>
                <p>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSignIn.bind(this)}
                  >
                    Get Started
                  </Button>
                </p>
              </Jumbotron>
              <Image
                src="./home.png"
                className="col-6 tr align-self-center"
                fluid
              />
            </div>
          </div>
          <div className="container" id="features">
            <h3 className="mb-4">Features</h3>
            <Carousel className="carousel">
              <Carousel.Item>
                <Container>
                  <Image src="./carousel1.png" />
                </Container>
                <Carousel.Caption>
                  <p>Store all your health records securely.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Container>
                  <Image src="./carousel2.png" />
                </Container>
                <Carousel.Caption>
                  <p>Share it with only health personnel you trust.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Container>
                  <Image src="./carousel3.png" />
                </Container>
                <Carousel.Caption>
                  <p>Manage your shared documents.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="container" id="developer">
            <h3>Developers</h3>
            <div className="row justify-content-center">
              <Jumbotron className="col-4 tr align-self-center">
                <Card className="border-0 tr">
                  <Card.Img variant="top" className="circle" src="./rs.jpg" />
                  <Card.Body>
                    <Card.Title>Roshan Shrestha</Card.Title>
                    <Card.Text>
                      DHCS is our first decentralized app. I hope this inspires
                      the developer community to focus more on user's privacy
                      and build decentralized server application.
                    </Card.Text>
                    <div className="icon">
                      <a
                        className="btn"
                        href="https://www.linkedin.com/in/xroshan/"
                        target="_blank"
                      >
                        <img className="icn" src="./link.png" />
                      </a>
                      <a
                        className="btn"
                        href="https://github.com/xroshan"
                        target="_blank"
                      >
                        <img className="icn" src="./git.png" />
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Jumbotron>
              <Jumbotron className="col-4 tr align-self-center">
                <Card className="border-0 tr">
                  <Card.Img variant="top" className="circle" src="./sl.jpg" />
                  <Card.Body>
                    <Card.Title>Safal Lamsal</Card.Title>
                    <Card.Text>
                      This application gives users right to their data. At the
                      same time, it is their reponsibility to keep it safe and
                      secure by learning the decentralization technology.
                    </Card.Text>
                    <div className="icon">
                      <a
                        className="btn"
                        href="https://www.linkedin.com/in/safal-lamsal/"
                        target="_blank"
                      >
                        <img className="icn" src="./link.png" />
                      </a>
                      <a
                        className="btn"
                        href="https://github.com/muedie"
                        target="_blank"
                      >
                        <img className="icn" src="./git.png" />
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Jumbotron>
            </div>
          </div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Text className="cpy">
              Copyright &copy; 2019 DHCS (Decentralized Health Care System)
            </Navbar.Text>
          </Navbar>
        </div>
      </div>
    );
  }
}
