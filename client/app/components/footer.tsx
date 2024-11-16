import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-300 py-12 border-t">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Left Section: Company Logo */}
          <div className="mb-8 md:mb-0">
            <Image
              src="/company-logo.png" // Replace with your actual logo image path
              alt="Company Logo"
              width={150}
              height={40}
              className="w-40 h-auto"
            />
          </div>

          {/* Right Section: Links */}
          <div className="flex flex-wrap justify-between w-full md:w-auto gap-x-24 ">
            {/* Column 1: Company */}
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className=" space-y-6 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-6 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-6 text-gray-400">
                <li>
                  <a href="mailto:support@microfinanceapp.com" className="hover:text-[#60a5fa] transition">
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#60a5fa] transition">
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-12 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Microfinance App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
