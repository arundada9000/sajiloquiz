import { Shield, ExternalLink, Copyright } from 'lucide-react';

export default function License() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="glass-panel p-6 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-[rgb(var(--color-primary))]/15 p-2.5 rounded-[14px] text-[rgb(var(--color-primary))]">
                    <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[rgb(var(--text-primary))]">License &amp; Attribution</h3>
            </div>

            <div className="space-y-6">
                <section>
                    <h4 className="text-sm font-semibold text-[rgb(var(--color-primary))] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Copyright size={14} /> Proprietary License
                    </h4>
                    <div className="bg-[var(--fill)] rounded-xl p-4 text-xs font-mono text-[rgb(var(--text-secondary))] leading-relaxed border border-[var(--separator)] max-h-48 overflow-y-auto custom-scrollbar">
                        <p className="mb-4">Copyright (c) {currentYear} Sajilo Digital Pvt. Ltd. All rights reserved.</p>
                        <p className="mb-4">
                            This software and its source code are the exclusive property of
                            Sajilo Digital Pvt. Ltd. It is NOT free for use. The Sajilo Quiz
                            application is provided for the express purpose of conducting live
                            quiz events, and no rights are granted to copy, modify, distribute,
                            sublicense, or sell the software, in whole or in part, without prior
                            written permission from Sajilo Digital Pvt. Ltd.
                        </p>
                        <p className="mb-4">
                            Any reproduction or redistribution of the software, in any form, or
                            the use of any portion of its source code in other projects, is
                            expressly prohibited without the written permission of the copyright
                            holder.
                        </p>
                        <p>
                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
                            IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
                            CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
                            TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                            SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                        </p>
                    </div>
                </section>

                <section>
                    <h4 className="text-sm font-semibold text-[rgb(var(--color-primary))] uppercase tracking-wider mb-3">Created By</h4>
                    <a
                        href="https://sajilodigital.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between bg-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/20 border border-[rgb(var(--color-primary))]/20 p-4 rounded-2xl transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <img src="/company.png" alt="Sajilo Digital" className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1" />
                            <div>
                                <p className="font-bold text-[rgb(var(--text-primary))]">Sajilo Digital</p>
                                <p className="text-xs text-[rgb(var(--text-secondary))]">Your Vision, Our Innovation</p>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[rgb(var(--color-primary))] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </section>

                <p className="text-[10px] text-center text-[rgb(var(--text-secondary))]">
                    Designed and Developed with ❣️ in Butwal, Nepal.
                </p>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[rgb(var(--color-primary))]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
