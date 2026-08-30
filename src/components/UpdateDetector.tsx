import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useData } from '../context/DataContext';
import { Download, RefreshCw, X, Sparkles } from 'lucide-react';

export default function UpdateDetector() {
    const { exportData } = useData();
    const [show, setShow] = useState(false);

    const {
        offlineReady: [, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            // eslint-disable-next-line no-console
            console.log('SW Registered: ' + (r ? 'ready' : 'pending'));
        },
        onRegisterError(error: unknown) {
            // eslint-disable-next-line no-console
            console.log('SW registration error', error);
        },
    });

    useEffect(() => {
        if (needRefresh) {
            setShow(true);
        }
    }, [needRefresh]);

    const close = () => {
        setShow(false);
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    const handleBackupAndUpdate = () => {
        exportData();
        setTimeout(() => {
            updateServiceWorker(true);
        }, 1000);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="glass-panel p-6 shadow-2xl max-w-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[rgb(var(--color-primary))]/15 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                    </div>
                    <button
                        onClick={close}
                        className="p-1 hover:bg-[var(--fill)] rounded-full transition-colors"
                        aria-label="Dismiss update notice"
                    >
                        <X className="w-4 h-4 text-[rgb(var(--text-secondary))]" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-2">Update available</h3>
                <p className="text-[rgb(var(--text-secondary))] text-sm mb-6 leading-relaxed">
                    A new version of Sajilo Quiz is ready. We recommend downloading your current data before updating.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleBackupAndUpdate}
                        className="btn-primary flex items-center justify-center gap-2 text-sm py-3"
                    >
                        <Download className="w-4 h-4" />
                        Backup &amp; Update Now
                    </button>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="btn-secondary flex items-center justify-center gap-2 text-sm py-3"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Just Update
                    </button>
                </div>
            </div>
        </div>
    );
}
