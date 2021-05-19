const hourFormatter = date => {
    let hour = date.getHours();
    let amOrPm = "AM";
    if (hour > 12) {
        hour -= 12;
        amOrPm = "PM";
    }
    if (date.getMinutes() < 10)
        return `${hour}:0${date.getMinutes()} ${amOrPm}`;
    else
        return `${hour}:${date.getMinutes()} ${amOrPm}`;
}

module.exports = hourFormatter;