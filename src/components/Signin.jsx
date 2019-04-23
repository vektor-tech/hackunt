import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Card,
  Button,
  Carousel,
  Jumbotron
} from "react-bootstrap";

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
              <img className="logo" src="../../public/build/logo.png" />
              DHCS
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav justify className="mx-auto navheader">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#developer">Developer</Nav.Link>
              </Nav>
              <Button className="ml-auto" onClick={handleSignIn.bind(this)}>
                Sign Up/In
              </Button>
            </Navbar.Collapse>
          </Navbar>
          <div className="container" id="home">
            <div className="row justify-content-center">
              <Jumbotron className="col-5 tr  text-left align-self-center">
                <h1>A platform for sharing health records.</h1>
                <p>
                  You have every rights to your health records. You decide where
                  it stays, to whom you want to share. Start today, be
                  responsible for your health records.
                </p>
                <p>
                  <Button variant="primary" onClick={handleSignIn.bind(this)}>
                    Get Started
                  </Button>
                </p>
              </Jumbotron>

              <Jumbotron className="col-5 tr align-self-center">
                <img src="../../public/build/test.jpg" width="100%" />
              </Jumbotron>
            </div>
          </div>
          <div className="container" id="features">
            <h3 className="mb-4">Features</h3>
            <Carousel className="carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="../../public/build/test.jpg"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <p>Store all your health records securely.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="../../public/build/test.jpg"
                  alt="Third slide"
                />

                <Carousel.Caption>
                  <p>Share it with only health personnel you trust.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="../../public/build/test.jpg"
                  alt="Third slide"
                />

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
                  <Card.Img
                    variant="top"
                    className="circle"
                    src="../../public/build/test.jpg"
                  />
                  <Card.Body>
                    <Card.Title>Roshan Shrestha</Card.Title>
                    <Card.Text>
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </Card.Text>
                    <div className="icon">
                      <a
                        className="btn"
                        href="https://www.linkedin.com/in/xroshan/"
                      >
                        <img
                          className="icn"
                          src="../../public/build/link.png"
                        />
                      </a>
                      <a
                        className="btn fab fa-github fa-3x"
                        href="https://github.com/xroshan"
                      >
                        <img className="icn" src="../../public/build/git.png" />
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Jumbotron>

              <Jumbotron className="col-4 tr align-self-center">
                <Card className="border-0 tr">
                  <Card.Img
                    variant="top"
                    className="circle"
                    src="../../public/build/test.jpg"
                  />
                  <Card.Body>
                    <Card.Title>Safal Lamsal</Card.Title>
                    <Card.Text>
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </Card.Text>
                    <div className="icon">
                      <a
                        className="btn"
                        href="https://www.linkedin.com/in/safal-lamsal/"
                      >
                        <img
                          className="icn"
                          src="../../public/build/link.png"
                        />
                      </a>
                      <a className="btn" href="https://github.com/muedie">
                        {" "}
                        <img className="icn" src="../../public/build/git.png" />
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
