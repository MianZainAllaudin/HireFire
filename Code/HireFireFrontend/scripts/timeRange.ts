interface TimeRange {
    hours: number,
    minutes: number
}

export const TimeRange = {
    toString(timeRangeStart: TimeRange, timeRangeEnd: TimeRange) {
        return `${timeRangeStart.hours}:${timeRangeStart.minutes}-${timeRangeEnd.hours}:${timeRangeEnd.minutes}`
    },

    fromString(timeRangeString: string) : [TimeRange, TimeRange] {
        const timeRangeStartString = timeRangeString.split("-")[0];
        const timeRangeEndString = timeRangeString.split("-")[1];

        const timeRangeStart: TimeRange = {
            hours: parseInt(timeRangeStartString.split(":")[0]),
            minutes: parseInt(timeRangeStartString.split(":")[1])
        }
        const timeRangeEnd: TimeRange = {
            hours: parseInt(timeRangeEndString.split(":")[0]),
            minutes: parseInt(timeRangeEndString.split(":")[1])
        }
        
        return [timeRangeStart, timeRangeEnd];
    }
}