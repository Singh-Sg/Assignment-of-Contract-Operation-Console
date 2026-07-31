import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificationContext = createContext(undefined);

let idCounter = 0;

export function NotificationProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [open, setOpen] = useState(false);

  const processQueue = useCallback((nextQueue) => {
    if (nextQueue.length > 0) {
      setCurrent(nextQueue[0]);
      setQueue(nextQueue.slice(1));
      setOpen(true);
    }
  }, []);

  const notify = useCallback(
    (message, severity = 'info') => {
      const item = { key: idCounter++, message, severity };
      setQueue((prev) => {
        const nextQueue = [...prev, item];
        return nextQueue;
      });
    },
    []
  );

  useEffect(() => {
    if (!open && queue.length > 0) {
      processQueue(queue);
    }
  }, [open, queue, processQueue]);

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const handleExited = useCallback(() => {
    setCurrent(null);
    setQueue((prev) => {
      if (prev.length > 0) {
        setCurrent(prev[0]);
        setOpen(true);
        return prev.slice(1);
      }
      return prev;
    });
  }, []);

  const value = useMemo(
    () => ({
      notify,
      notifySuccess: (message) => notify(message, 'success'),
      notifyError: (message) => notify(message, 'error'),
      notifyInfo: (message) => notify(message, 'info'),
      notifyWarning: (message) => notify(message, 'warning'),
    }),
    [notify]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {current ? (
          <Alert
            onClose={handleClose}
            severity={current.severity}
            variant="filled"
            sx={{ width: '100%', boxShadow: 3 }}
          >
            {current.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
