import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import api from "../api/axios.js";
import logoIme from "../assets/logo/LOGO5.png";
import logoScrolled from "../assets/logo/logo4.png";

const Navbar = () => {
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [communities, setCommunities] = useState([]);

  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get("/listings/published");
        setCommunities(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCommunities();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdowns = {
    // ABOUT: [{ name: "ABOUT", }],
    COMMUNITIES: [
      {
        name: "",
        link: "/community/crystal-sands",
      },
      {
        name: "",
        link: "/community/mediterranea",
      },
    ],
  };

  const menuItems = [
    { name: "HOME", link: "/" },
    { name: "ABOUT", link: "/about-us" },
    // { name: "COMMUNITIES" },
    { name: "PROPERTIES", link: "/properties" },
    { name: "GALLERY", link: "/gallery" },
    { name: "REVIEWS", link: "/reviews" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 md:px-10 py-3">
        {/* LOGO */}
        <Link to="/">
          <img
            src={isScrolled ? logoScrolled : logoIme}
            className="w-40 md:w-34 transition-all duration-300"
            alt="logo"
          />
        </Link>

        {/* DESKTOP CONTACT */}
        <div className="hidden md:flex items-center gap-4 bg-gradient-to-r from-[#0B63F6] to-[#467FF7] px-3 py-2 rounded-2xl shadow-lg">
          {/* Animated Phone Icon */}
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            <Phone className="text-white w-5 h-5 animate-bounce" />
          </div>

          {/* Divider */}
          <div className="w-[1px] h-12 bg-white/50"></div>

          {/* Text */}
          <div>
            <p className="text-sm text-white/80 leading-none mb-1">
              Call Today
            </p>

            <a
              href="tel:4042756533"
              className="text-1xl font-bold text-white hover:text-gray-200 transition"
            >
              +1 (631) 946-1189
            </a>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`md:hidden transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex justify-center bg-[#467FF7] text-white text-xl font-bold cursor-pointer">
        {menuItems.map((item) => {
          const hasDropdown = dropdowns[item.name];

          return (
            <div
              key={item.name}
              className="relative px-10 py-6 cursor-pointer"
              onMouseEnter={() => hasDropdown && setOpenDropdown(item.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.link ? (
                <Link to={item.link}>{item.name}</Link>
              ) : (
                <span>{item.name}</span>
              )}

              {/* DROPDOWN */}
              {openDropdown === item.name && hasDropdown && (
                <ul className="absolute top-full left-0 bg-blue-500 min-w-[180px] shadow-lg">
                  {dropdowns[item.name].map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.link}
                        className="block px-4 py-2 hover:bg-blue-600"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* MOBILE NAV */}
      {mobileMenu && (
        <div className="md:hidden bg-[#467FF7] text-white px-4 py-4 space-y-3">
          {menuItems.map((item) => {
            const hasDropdown = dropdowns[item.name];

            return (
              <div key={item.name}>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    hasDropdown
                      ? setMobileDropdown(
                          mobileDropdown === item.name ? null : item.name,
                        )
                      : setMobileMenu(false)
                  }
                >
                  {item.link ? (
                    <Link to={item.link}>{item.name}</Link>
                  ) : (
                    <span>{item.name}</span>
                  )}

                  {hasDropdown && <ChevronDown size={18} />}
                </div>

                {/* MOBILE DROPDOWN */}
                {mobileDropdown === item.name && hasDropdown && (
                  <div className="pl-4 mt-2 space-y-2">
                    {dropdowns[item.name].map((sub, i) => (
                      <Link
                        key={i}
                        to={sub.link}
                        onClick={() => setMobileMenu(false)}
                        className="block text-sm"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* MOBILE CONTACT */}
          <div className="pt-4 border-t border-white/30">
            <p className="text-sm">Call today</p>
            <p className="text-lg font-bold">404-275-6533</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
