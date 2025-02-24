import React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown, Menu, X, CheckCircle, Users, Zap, Shield, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";



const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-main1-50 to-white text-gray-800">
      {/* Header */}
      <header className="bg-main1  shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-white">UniSprint</a>
            </div>
            <nav className="hidden md:flex space-x-8">
            <Link to="/" ><a href="#" className="text-white hover:text-blue-600">Home</a></Link>
            <a href="#" className="text-white hover:text-blue-600">About</a>
            <Link to="/signup" ><a href="#" className="text-white hover:text-blue-600">SignUp</a></Link>
            <Link to="/login" ><a href="#" className="text-white hover:text-blue-600">Login</a></Link>
            <a href="#" className="text-white hover:text-blue-600">Contact</a>
        
            </nav>
            <Button className="hidden md:block bg-white text-black">Get Started</Button>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">How It Works</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Sign Up</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Login</a>
              <Button className="w-full mt-4">Get Started</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="flex flex-auto mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-x-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Empowering Students to Help Each Other
              </h1>
              <p className="text-xl mb-8">
                Connect, collaborate, and complete tasks within your school community.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-blue-50">
                Sign Up Now
              </Button>
            </div>
            <div className="md:w-3/5">
              <video
              className='rounded-3xl'
                src="https://cdn.pixabay.com/video/2023/04/15/159027-818026298_large.mp4" // Replace with the actual path to your video
                autoPlay
                loop
                muted
              ></video>
            </div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox=" 0 1440 320">
            <path fill="main1-darkblue" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div> */}
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <CheckCircle className="h-12 w-12 text-black" />, title: 'Post a Job', description: 'Easily post tasks you need help with.' },
              { icon: <Users className="h-12 w-12 text-black" />, title: 'Find a Job', description: 'Browse and apply for tasks that match your skills.' },
              { icon: <Zap className="h-12 w-12 text-black" />, title: 'Fast Connections', description: 'Quickly connect with other students.' },
              { icon: <Shield className="h-12 w-12 text-black" />, title: 'Secure Payments', description: 'Safe and easy payment processing.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your account in minutes.' },
              { step: '2', title: 'Post or Accept Tasks', description: 'Share your needs or offer your skills.' },
              { step: '3', title: 'Get It Done', description: 'Complete tasks and build your reputation.' },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Alex Johnson', role: 'Computer Science Major', quote: 'TaskConnect has been a game-changer for me. I have been able to find help for my projects and earn money helping others.' },
              { name: 'Samantha Lee', role: 'Business Major', quote: 'The platform is so easy to use. I have connected with amazing people and improved my time management skills.' },
              { name: 'Michael Brown', role: 'Engineering Major', quote: 'I love how TaskConnect allows me to apply my skills to real-world problems while helping fellow students.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={`../../src/assets/download.jpg?height=50&width=50&text=${testimonial.name[0]}`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {[
              { question: 'How do I sign up?', answer: 'Signing up is easy! Just click the "Sign Up" button, fill in your details, and verify your student email.' },
              { question: 'Is UniSprint free to use?', answer: 'Yes, UniSprint is free to join and use. We only charge a small fee on completed transactions.' },
              { question: 'How does payment work?', answer: 'We use a secure escrow system. Funds are only released to the task completer once the job is marked as done.' },
            //   { question: 'Can I use TaskConnect if I'm not a student?', answer: 'Currently, TaskConnect is only available for verified college students to ensure a safe and trusted community.' },
            ].map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-main1-600 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">UniSprint</h3>
              <p className="mb-4 mr-9">Empowering students to help each other and build a stronger community.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2c19.023 0 22 3.977 22 8.885 0 4.908-3.977 8.885-8.885 8.885-4.908 0-8.885-3.977-8.885-8.885 0-4.908 3.977-8.885 8.885-8.885zm0 1.333c-4.179 0-7.552 3.373-7.552 7.552s3.373 7.552 7.552 7.552 7.552-3.373 7.552-7.552-3.373-7.552-7.552-7.552zm0 2.667c-2.147 0-3.885 1.738-3.885 3.885s1.738 3.885 3.885 3.885 3.885-1.738 3.885-3.885-1.738-3.885-3.885-3.885zm0 1.333c1.418 0 2.552 1.134 2.552 2.552s-1.134 2.552-2.552 2.552-2.552-1.134-2.552-2.552 1.134-2.552 2.552-2.552z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-200">About Us</a></li>
                <li><a href="#" className="hover:text-blue-200">How It Works</a></li>
                <li><a href="#" className="hover:text-blue-200">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-200">Contact Us</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
              <p className="mb-4">Subscribe to our newsletter for updates and tips.</p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="submit" className="rounded-l-none bg-white text-black hover:bg-blue-50">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 UniSprint. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="hover:text-blue-200 mr-4">Privacy Policy</a>
              <a href="#" className="hover:text-blue-200">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
        )
}

export default LandingPage