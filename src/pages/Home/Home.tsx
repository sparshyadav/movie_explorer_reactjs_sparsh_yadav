import { Component } from 'react'
import './Home.scss';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MainCarousal from '../../components/MainCarousal/MainCarousal';
import WhatToWatch from '../../components/WhatToWatch/WhatToWatch';

export class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainCarousal />
        <WhatToWatch />
        <Footer />
      </div>
    )
  }
}

export default Home


