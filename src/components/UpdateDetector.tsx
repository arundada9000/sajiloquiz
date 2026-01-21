import { useState, useEffect } from 'react';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useData } from '../context/DataContext';
import { Download, RefreshCw, X } from 'lucide-react';

export default function UpdateDetector() {
    const { exportData } = useData();
    const [show, setShow] = useState(false);

    const {
        offlineReady: [, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error: any) {
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
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-elevated border border-accent/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <RefreshCw className="w-5 h-5 text-primary animate-spin-slow" />
                    </div>
                    <button
                        onClick={close}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-secondary" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2">Update Available!</h3>
                <p className="text-secondary text-sm mb-6 leading-relaxed">
                    A new version of Sajilo Quiz is ready. We recommend downloading your current data before updating.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleBackupAndUpdate}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl transition-all font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Backup & Update Now
                    </button>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-primary py-3 px-4 rounded-xl transition-all font-medium text-sm border border-white/10"
                    >
                        Just Update
                    </button>
                </div>
            </div>
        </div>
    );
}
