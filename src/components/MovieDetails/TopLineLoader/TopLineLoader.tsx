import React from 'react';
import './TopLineLoader.scss';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';

const TopLineLoader: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="top-line-loader"></div>
            <div className="loader-page"></div>
            <Footer />
        </>
    );
};

export default TopLineLoader;