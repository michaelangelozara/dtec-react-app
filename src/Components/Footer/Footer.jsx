import React from 'react';
import footerBg from '../../assets/images/footer-bg.jpg'; // Importing the footer background image
import locationBLK from '../../assets/icons/locationBLK.svg'; // Importing the location black icon
import locationGreen from '../../assets/icons/locationGreen.svg'; // Importing the location green icon
import phoneBLK from '../../assets/icons/phoneBLK.svg'; // Importing the phone black icon
import phoneGreen from '../../assets/icons/phoneGreen.svg'; // Importing the phone green icon
import MailBLK from '../../assets/icons/MailBLK.svg'; // Importing the mail black icon
import MailGreen from '../../assets/icons/MailGreen.svg'; // Importing the mail green icon
import submitIcon from '../../assets/icons/submitIcon.svg'; // Importing the submit icon

const Footer = () => {
  return (
    <footer 
      className="bg-gray-100 pt-16 w-full  pl-60 pr-56" // Changed to w-full for full-width
      style={{ 
        backgroundImage: `url(${footerBg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-black">
        {/* Get In Touch Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
          <p className="mb-4">
            Have questions or feedback? Reach out to us! We're here to assist you with our Cloud-Based Document Tracking and E-Clearance system.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <img 
                src={locationBLK} 
                alt="Location Icon" 
                className="mr-3"
                onMouseOver={e => e.currentTarget.src = locationGreen}
                onMouseOut={e => e.currentTarget.src = locationBLK}
              />
              <span>Tacurong City, Sultan Kudarat</span>
            </li>
            <li className="flex items-center">
              <img 
                src={phoneBLK} 
                alt="Phone Icon" 
                className="mr-3"
                onMouseOver={e => e.currentTarget.src = phoneGreen}
                onMouseOut={e => e.currentTarget.src = phoneBLK}
              />
              <span>+639959651913</span>
            </li>
            <li className="flex items-center">
              <img 
                src={MailBLK} 
                alt="Mail Icon" 
                className="mr-3"
                onMouseOver={e => e.currentTarget.src = MailGreen}
                onMouseOut={e => e.currentTarget.src = MailBLK}
              />
              <span>x.tiaantorres@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className='ml-20'> 
          <h3 className="text-2xl font-semibold mb-6 ">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Our Team</a></li>
            <li><a href="#" className="hover:underline">Android</a></li>
            <li><a href="#" className="hover:underline">Development</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className='ml-20'>
          <h3 className="text-2xl font-semibold mb-6">Follow Us</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Subscribe</h3>
          <p className="mb-4">
            Stay updated with our latest news and updates. Subscribe to our newsletter for insights on our Cloud-Based Document Tracking and E-Clearance system.
          </p>
          <div className="flex items-center">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-r-lg" 
              style={{ width: '60px', height: '40px' }}
            >
              <img 
                src={submitIcon} 
                alt="Submit Icon"
                className="w-4 h-4"
              />
            </button>
          </div>
          <div className="mt-4 flex space-x-3">
            <a href="#" className="hover:text-green-600">📘</a>
            <a href="#" className="hover:text-green-600">🐦</a>
            <a href="#" className="hover:text-green-600">📸</a>
            <a href="#" className="hover:text-green-600">💼</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-black">
        <p>Copyright © 2024 All Right Reserved</p>
        <div className="mt-4 flex justify-center space-x-8">
          <a href="#" className="hover:text-green-600">Home</a>
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#" className="hover:text-green-600">Team</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
