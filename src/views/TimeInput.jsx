const hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, "0"));

export default function TimeInput({
    id,
    label,
    value,
    disabled,
    onChange,
    allowMidnight = false,
}) {
    const [hour = "00", minute = "00"] = value.split(":");
    const selectableHours = allowMidnight
        ? [...hours, "24"]
        : hours;

    function updateTime(nextHour, nextMinute) {
        onChange(`${nextHour}:${nextHour === "24" ? "00" : nextMinute}`);
    }

    return (
        <span className="time-input-group">
            <select
                id={id}
                className="time-input"
                aria-label={`${label}, timme`}
                value={hour}
                disabled={disabled}
                onChange={(event) => updateTime(event.target.value, minute)}
            >
                {selectableHours.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <span aria-hidden="true">:</span>
            <select
                className="time-input"
                aria-label={`${label}, minut`}
                value={minute}
                disabled={disabled || hour === "24"}
                onChange={(event) => updateTime(hour, event.target.value)}
            >
                {minutes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </span>
    );
}
