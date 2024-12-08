import React, { useRef, useEffect } from "react";
import ScrollAnimation from "../../Components/Animation/ScrollAnimation";
import topBanner from "../../assets/images/banner1.png";
import banner from "../../assets/images/banner-img.png";
import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";
import developer1 from "../../assets/images/developer1.png";
import developer2 from "../../assets/images/developer2.png";
import icon1 from "../../assets/icons/computerGreen.svg";
import icon2 from "../../assets/icons/clearanceGreen.svg";
import icon3 from "../../assets/icons/notifGreen.svg";
import icon1a from "../../assets/icons/computerWhite.svg";
import icon2a from "../../assets/icons/clearanceWhite.svg";
import icon3a from "../../assets/icons/notifWhite.svg";
import NavBar1 from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const LandingPage = () => {
  const features = [
    {
      id: 1,
      title: "Comprehensive Document Tracking",
      description: `Our system revolutionizes document management by offering real-time tracking of document status from submission to approval. Users can upload, store, and monitor documents seamlessly within a secure cloud environment. This feature reduces the risk of document misplacement, ensures timely processing, and enhances transparency across administrative workflows.`,
      icon: icon1,
      hoverIcon: icon1a,
    },
    {
      id: 2,
      title: "E-Clearance System",
      description: `The integrated e-clearance feature simplifies the clearance process for students and personnel. Users can request and receive clearance online, eliminating the need for physical presence and long queues. This component improves efficiency, convenience, and accuracy in handling clearance requirements. Enhanced with electronic signature validation, the system ensures the integrity and security of clearance documents.`,
      icon: icon2,
      hoverIcon: icon2a,
    },
    {
      id: 3,
      title: "Real-Time Notifications With Signature Validation",
      description: `Our real-time notification system sends instant updates via SMS and email, keeping users informed about document status and clearance notifications. It includes electronic signature validation to ensure document integrity and authenticity, enhancing communication and reducing delays while maintaining high security standards.`,
      icon: icon3,
      hoverIcon: icon3a,
    },
  ];
        const homeRef = useRef(null);
        const featuresRef = useRef(null);
        const developersRef = useRef(null);

        const scrollToSection = (ref) => {
          if (ref.current) {
            window.scrollTo({
              top: ref.current.offsetTop - 80, 
              behavior: 'smooth',
            });
          }
        };

        

  return (
    <>
      <div className="font-sans scroll-smooth">
        <NavBar1
          scrollToSection={scrollToSection}
          homeRef={homeRef}
          featuresRef={featuresRef}
          developersRef={developersRef}
        />
        {/* Hero Section */}
          
        <div
          ref={homeRef}
          className="relative text-white py-16 [data-fade='true']"
          style={{
            backgroundImage: `url(${topBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        > <ScrollAnimation>  
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center mt-5 [data-fade='true']">
            {/* Left side: Text content */}
           
            <div className="md:w-1/2 text-center md:text-left ">
              <h1 className="text-60 font-bold mb-4 -mt-28 leading-normal [data-fade='true']">
                Streamline Workflow with Seamless Efficiency
              </h1>
              <p className="text-base mb-8 max-w-prose mx-auto md:mx-0 mt-10 leading-relaxed [data-fade='true']">
                Experience unparalleled productivity with our innovative system,
                designed to simplify and optimize your workflow. Enjoy seamless
                efficiency, ensuring your tasks are managed with precision and
                ease. Elevate your operations and achieve more with less effort.
              </p>
            </div>

            {/* Right side: Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end [data-fade='true']">
              <img
                src={banner}
                alt="Workflow illustration"
                className="w-full md:w-auto"
                style={{ maxWidth: "580px", maxHeight: "620px" }}
              />
            </div>
          </div>
          </ScrollAnimation>
        </div>
       

        <ScrollAnimation>  
        {/* Features Section */}
        <div ref={featuresRef} className="bg-white py-16 [data-fade='true']">
          
          <div className="container mx-auto px-6">
            <h2 className="text-6xl font-bold text-center mb-12">
              App Features
            </h2>
            <h3 className="text-center mb-12 max-w-prose mx-auto">
              Explore the robust capabilities of our Cloud-Based Document
              Tracking and E-Clearance system. Learn how our features optimize
              document management, streamline clearance processes, and ensure
              secure communications for enhanced administrative efficiency.
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`relative group text-left p-8 bg-white rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 fade-in fade-in-${index + 1}`}
                    style={{
                      backgroundImage: "var(--gradient)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      lineHeight: "1.5",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                  <div className="absolute inset-0 bg-transparent group-hover:bg-green-700 group-hover:opacity-75 transition-opacity duration-300 ease-in-out"></div>
                  <div className="relative flex items-center justify-between mb-4">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-16 h-16 group-hover:hidden"
                    />
                    <img
                      src={feature.hoverIcon}
                      alt={feature.title}
                      className="w-16 h-16 hidden group-hover:block"
                    />
                    <div className="text-5xl font-bold text-gray-300">{`0${feature.id}`}</div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-black group-hover:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-base text-black group-hover:text-white">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
         
        </div>
        </ScrollAnimation>
        
        <ScrollAnimation>
        {/* Document Tracking System Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src={img1}
                alt="Document Tracking System"
                className="w-full h-auto"
                style={{ maxWidth: "442px", maxHeight: "575px" }}
              />
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 md:pl-12">
              <h2 className="text-4xl font-bold mb-4">
                Document Tracking System
              </h2>
              <p className="text-lg mb-6">
                Document tracking refers to the process of monitoring the status
                and location of documents throughout their lifecycle within an
                organization. It involves ensuring documents move efficiently
                through various stages from creation to final approval or
                storage.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-600 text-xl font-bold mr-3">
                    ✔
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Real-Time Status Updates
                    </h3>
                    <p className="text-gray-700">
                      Users can track the exact status of their documents in
                      real-time, knowing precisely where each document is in the
                      workflow.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 text-xl font-bold mr-3">
                    ✔
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">Version Control</h3>
                    <p className="text-gray-700">
                      The system maintains version history, allowing users to
                      access and compare previous versions of documents,
                      ensuring transparency and accuracy in document management.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </ScrollAnimation>

        <ScrollAnimation>
        {/* E-Clearance System Section */}
        <div className="bg-white py-16 [data-fade='true']">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            {/* Left side: Text content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-5xl font-bold mb-4">E-Clearance System</h2>
              <p className="text-lg mb-8 max-w-prose mx-auto md:mx-0">
                E-clearance refers to the electronic processing and approval of
                clearances required by students, personnel, or stakeholders
                within an organization. It replaces traditional paper-based
                clearance processes with digital workflows.
              </p>
              {/* Features */}
              <ul className="space-y-6">
                <li className="flex items-start">
  
                  <span className="text-green-600 mr-3 text-xl">✔</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Online Clearance Processing
                    </h3>
                    <p className="text-lg mb-8 max-w-prose mx-auto md:mx-0">
                      Users can process their clearance requests online and
                      track their progress digitally, eliminating the need for
                      physical presence and reducing processing times.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
 
                  <span className="text-green-600 mr-3 text-xl">✔</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Electronic Signature Integration
                    </h3>
                    <p className="text-lg mb-8 max-w-prose mx-auto md:mx-0">
                      The system integrates electronic signature capabilities to
                      authenticate and validate clearance approvals, ensuring
                      security and compliance with institutional policies.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            {/* Right side: Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src={img2}
                alt="E-Clearance System"
                className="w-full md:w-auto"
                style={{ width: "442px", height: "575px" }}
              />
            </div>
          </div>
        </div>
        </ScrollAnimation>

        <ScrollAnimation>
        {/* Developers Section */}
        <div ref={developersRef} className="bg-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl font-bold mb-4">Developers</h2>
            <p className="text-lg mb-8 max-w-prose mx-auto">
              Get to know the talented team behind our innovative Cloud-Based
              Document Tracking and E-Clearance system. Learn about their
              expertise and dedication to transforming administrative efficiency
              and user experience at Notre Dame of Tacurong College.
            </p>
            <div className="flex flex-wrap justify-center">
              {/* Developer 1 */}
              <div className="max-w-md mx-4 mb-8">
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ width: "350px", height: "500px" }}
                >
                  <div
                    className="flex justify-center items-center h-3/5"
                    style={{ height: "300px" }}
                  >
                    <img
                      src={developer1}
                      alt="Christian James V. Torrres"
                      className="object-contain"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">
                      Christian James V. Torrres
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      Frontend Developer
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-facebook"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-linkedin"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer 2 */}
              <div className="max-w-md mx-4 mb-8">
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ width: "350px", height: "500px" }}
                >
                  <div
                    className="flex justify-center items-center h-3/5"
                    style={{ height: "300px" }}
                  >
                    <img
                      src={developer2}
                      alt="Michael Angelo B. Zara"
                      className="object-contain"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">
                      Michael Angelo B. Zara
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      Backend Developer
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-facebook"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-800">
                        <i className="fab fa-linkedin"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          <Footer />
        </div>
        </ScrollAnimation>
      </div>
    </>
  );
};

export default LandingPage;
