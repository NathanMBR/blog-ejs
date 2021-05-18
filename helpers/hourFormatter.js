const hourFormatter = date => {
    let hour = date.getHours()
    let amOrPm = "AM";
    if (hour > 12) {
        hour -= 12;
        amOrPm = "PM";
    }

    return `${hour}:${date.getMinutes()} ${amOrPm}`;
}

module.exports = hourFormatter;