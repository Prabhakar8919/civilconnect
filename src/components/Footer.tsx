import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center p-1 rounded-md bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <img src="/logo.png" alt="CivilConnect" className="h-8 w-8 object-contain" />
              </div>
              <h3 className="text-lg font-bold">CivilConnect</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting construction professionals, land owners, and material suppliers to build India's future together.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Browse Services</Link></li>
              <li><Link to="/ai-insights" className="text-muted-foreground hover:text-primary transition-colors">AI Insights</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/engineers" className="text-muted-foreground hover:text-primary transition-colors">Engineers</Link></li>
              <li><Link to="/architects" className="text-muted-foreground hover:text-primary transition-colors">Architects</Link></li>
              <li><Link to="/civil-workers" className="text-muted-foreground hover:text-primary transition-colors">Civil Workers</Link></li>
              <li><Link to="/contractors-builders" className="text-muted-foreground hover:text-primary transition-colors">Contractors & Builders</Link></li>
              <li><Link to="/land-records" className="text-muted-foreground hover:text-primary transition-colors">Land Records</Link></li>
              <li><Link to="/material-sellers" className="text-muted-foreground hover:text-primary transition-colors">Material Sellers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>itzprabhakar8919@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91 89191 817XX</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Neredmet, Malkajgiri, Medchal, Hyderabad, Telangana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            © {new Date().getFullYear()} CivilConnect. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
