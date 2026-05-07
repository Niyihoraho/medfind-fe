import { Activity, MapPin, Phone, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--med-deep)] text-white/70">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--med-primary)] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                MED<span className="text-[var(--med-accent)]">FIND</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              A digital platform for navigating healthcare services in Rwanda. Helping citizens and visitors find the right care, right where they are.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">Find a Facility</a></li>
              <li><a href="#how-it-works" className="hover:text-[var(--med-accent)] transition-colors">How It Works</a></li>
              <li><a href="#partners" className="hover:text-[var(--med-accent)] transition-colors">Our Partners</a></li>
              <li><Link href="/register" className="hover:text-[var(--med-accent)] transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="hover:text-[var(--med-accent)] transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Find By Service</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">Emergency Care</a></li>
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">Maternity & Obstetrics</a></li>
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">Laboratory Services</a></li>
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">Pharmacy</a></li>
              <li><a href="#search" className="hover:text-[var(--med-accent)] transition-colors">General Consultation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--med-accent)] flex-shrink-0" />
                <span>Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--med-accent)] flex-shrink-0" />
                <span>info@medfind.rw</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--med-accent)] flex-shrink-0" />
                <span>+250 788 000 000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} MedFind. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400" /> for Rwanda 🇷🇼
          </p>
        </div>
      </div>
    </footer>
  );
}
