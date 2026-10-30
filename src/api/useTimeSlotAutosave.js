import { useCallback, useEffect, useRef, useState } from "react";
import { saveTimeSlots } from "./timeSlots.js";

export function useTimeSlotAutosave(token, dayKey) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const queue = useRef(Promise.resolve());
    const revision = useRef(0);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const save = useCallback((intervals) => {
        const currentRevision = ++revision.current;
        setError("");
        setNotice("");

        if (mounted.current) setSaving(true);
        const schedule = dayKey ? { dayKey, intervals } : { intervals };
        const operation = queue.current
            .catch(() => undefined)
            .then(() => saveTimeSlots(token, schedule));
        queue.current = operation;

        operation
            .then(() => {
                if (mounted.current && revision.current === currentRevision) {
                    setNotice("Ändringen har sparats automatiskt.");
                }
            })
            .catch((saveError) => {
                if (mounted.current && revision.current === currentRevision) {
                    setError(saveError.message);
                }
            })
            .finally(() => {
                if (mounted.current && revision.current === currentRevision) {
                    setSaving(false);
                }
            });
    }, [dayKey, token]);

    return { save, saving, error, notice, reportError: setError };
}
