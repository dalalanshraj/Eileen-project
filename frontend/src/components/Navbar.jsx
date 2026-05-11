import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import api from "../api/axios.js";
import logoIme from "../assets/logo/LOGO5.png";
import logoScrolled from "../assets/logo/logo4.png";

const Navbar = () => {
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdowns = {
    ABOUT: [{ name: "ABOUT", link: "/about-us" }],
    COMMUNITIES: [
  {
    name: "Crystal Sands",
    link: "/community/crystal-sands",
  },
  {
    name: "Mediterranea",
    link: "/community/mediterranea",
  },
],
  };

  const menuItems = [
    { name: "HOME", link: "/" },
    { name: "ABOUT" },
    { name: "COMMUNITIES" },
    { name: "PROPERTIES", link: "/properties" },
    // { name: "SPECIALS", link: "/specials" },
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
            className="w-40 md:w-54 transition-all duration-300"
            alt="logo"
          />
        </Link>

        {/* DESKTOP CONTACT */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="text-right">
            
            <p
              className={`text-xl font-bold ${
                isScrolled ? "text-[#185089]" : "text-white"
              }`}
            >
              Call today
            </p>
            <p
              className={`text-xl font-bold ${
                isScrolled ? "text-[#185089]" : "text-white"
              }`}
            >
              404-275-6533
            </p>
          </div>
          <Phone
            className={`${
              isScrolled ? "text-[#185089]" : "text-white"
            }`}
          />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden"
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex justify-center bg-[#467FF7] text-white text-xl font-bold">
        {menuItems.map((item) => {
          const hasDropdown = dropdowns[item.name];

          return (
            <div
              key={item.name}
              className="relative px-10 py-6"
              onMouseEnter={() =>
                hasDropdown && setOpenDropdown(item.name)
              }
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
                          mobileDropdown === item.name
                            ? null
                            : item.name
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