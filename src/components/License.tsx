import { Shield, ExternalLink } from 'lucide-react';

export default function License() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                    <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">License & Attribution</h3>
            </div>

            <div className="space-y-6">
                <section>
                    <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">MIT License</h4>
                    <div className="bg-black/20 rounded-xl p-4 text-xs font-mono text-secondary/80 leading-relaxed border border-white/5 max-h-48 overflow-y-auto">
                        <p className="mb-4">Copyright (c) {currentYear} Sajilo Digital Team</p>
                        <p className="mb-4">
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the "Software"), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:
                        </p>
                        <p className="mb-4">
                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.
                        </p>
                        <p>
                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.
                        </p>
                    </div>
                </section>

                <section>
                    <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Created By</h4>
                    <a
                        href="https://sajilodigital.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between bg-primary/10 hover:bg-primary/20 border border-primary/20 p-4 rounded-xl transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <img src="/company.png" alt="Sajilo Digital" className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1" />
                            <div>
                                <p className="font-bold text-primary">Sajilo Digital</p>
                                <p className="text-xs text-secondary">Your Vision, Our Innovation</p>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </section>

                <p className="text-[10px] text-center text-secondary/40">
                    Designed and Developed with ❤️ in Butwal, Nepal.
                </p>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
